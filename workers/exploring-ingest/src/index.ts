interface Env {
  ENABLE_TWILIO?: string;
  ENABLE_SLACK?: string;
  TWILIO_AUTH_TOKEN?: string;
  SLACK_SIGNING_SECRET?: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_EXPLORING_TABLE?: string;
  TWILIO_SUCCESS_MESSAGE?: string;
  SLACK_SUCCESS_MESSAGE?: string;
  BUILD_WEBHOOK_URL?: string;
  FEED_LIMIT?: string;
}

type Channel = 'twilio' | 'slack';

type ExploringType = 'tool' | 'article' | 'research' | 'api';

type ExploringRecord = {
  title: string;
  url: string;
  type: ExploringType;
  description?: string;
  source_channel: Channel;
  source_context?: Record<string, unknown>;
  discovered_at: string;
};

const DEFAULT_TABLE = 'exploring_next';
const URL_REGEX = /(https?:\/\/[^\s)]+[^\s.,:;"')\]])/i;
const DEFAULT_FEED_LIMIT = 10;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/ingest/twilio') {
        assertMethod(request, 'POST');
        if (env.ENABLE_TWILIO !== 'true') {
          return new Response('Twilio channel disabled', { status: 403 });
        }
        return await handleTwilio(request, env, ctx);
      }

      if (url.pathname === '/ingest/slack') {
        assertMethod(request, 'POST');
        if (env.ENABLE_SLACK !== 'true') {
          return new Response('Slack channel disabled', { status: 403 });
        }
        return await handleSlack(request, env, ctx);
      }

      if (url.pathname === '/feed') {
        assertMethod(request, 'GET');
        return await handleFeed(env, url.searchParams);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in ${url.pathname}:`, message, error);
      if (url.pathname === '/ingest/twilio') {
        return twilioResponse(`Error: ${message}`);
      }
      const status = error instanceof HttpError ? error.status : 500;
      return new Response(message, { status });
    }
  }
};

async function handleTwilio(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const token = env.TWILIO_AUTH_TOKEN;
  if (!token) {
    throw new HttpError('Twilio auth token missing', 500);
  }

  const rawBody = await request.text();
  await verifyTwilioSignature(request, rawBody, token);

  const params = new URLSearchParams(rawBody);
  const body = params.get('Body')?.trim();
  if (!body) {
    return twilioResponse('Please include a URL in the message.');
  }

  const record = await buildRecord(body, 'twilio', {
    from: params.get('From'),
    to: params.get('To')
  });

  await persistRecord(record, env);
  triggerBuild(env, ctx);

  const reply = env.TWILIO_SUCCESS_MESSAGE ?? 'Thanks! Added to Exploring Next.';
  return twilioResponse(reply);
}

async function handleSlack(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const signingSecret = env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    throw new HttpError('Slack signing secret missing', 500);
  }

  const timestamp = request.headers.get('x-slack-request-timestamp');
  const signature = request.headers.get('x-slack-signature');
  if (!timestamp || !signature) {
    throw new HttpError('Missing Slack headers', 401);
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 60 * 5) {
    throw new HttpError('Stale Slack request', 401);
  }

  const rawBody = await request.text();
  await verifySlackSignature(rawBody, timestamp, signature, signingSecret);

  const params = new URLSearchParams(rawBody);
  const text = params.get('text')?.trim();
  if (!text) {
    return slackResponse('Please provide a URL or context after the command.');
  }

  const record = await buildRecord(text, 'slack', {
    user_id: params.get('user_id'),
    user_name: params.get('user_name'),
    channel_id: params.get('channel_id')
  });

  await persistRecord(record, env);
  triggerBuild(env, ctx);

  const reply = env.SLACK_SUCCESS_MESSAGE ?? 'Added to Exploring Next ✅';
  return slackResponse(reply);
}

async function handleFeed(env: Env, searchParams: URLSearchParams): Promise<Response> {
  const limit = Number(searchParams.get('limit') ?? env.FEED_LIMIT ?? DEFAULT_FEED_LIMIT);
  const table = env.SUPABASE_EXPLORING_TABLE ?? DEFAULT_TABLE;

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?select=title,url,type,description,source_channel,discovered_at&order=discovered_at.desc&limit=${limit}`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(`Supabase query failed: ${text}`, response.status);
  }

  const items = (await response.json()) as ExploringRecord[];
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60'
    }
  });
}

async function buildRecord(raw: string, channel: Channel, context?: Record<string, unknown>) {
  const match = raw.match(URL_REGEX);
  if (!match) {
    throw new HttpError('No URL found in message.', 400);
  }
  const url = normalizeUrl(match[0]);
  const trailing = raw.replace(match[0], '').trim();

  const metadata = await resolveMetadata(url);
  const description = metadata.description ?? (trailing || undefined);
  const title = metadata.title ?? deriveTitle(url);
  const type = classifyType(raw, metadata);

  return {
    title,
    url,
    type,
    description,
    source_channel: channel,
    source_context: context,
    discovered_at: new Date().toISOString()
  } satisfies ExploringRecord;
}

async function persistRecord(record: ExploringRecord, env: Env) {
  const table = env.SUPABASE_EXPLORING_TABLE ?? DEFAULT_TABLE;

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(record)
  });

  if (response.status === 409) {
    throw new HttpError('That link is already in your queue.', 200);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(`Supabase insert failed (${response.status}): ${text}`, 500);
  }
}

async function resolveMetadata(url: string): Promise<{ title?: string; description?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 4000);
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'SandRise-ExploringNextBot/1.0'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {};
    }

    const html = await response.text();
    const titleMatch = html.match(/<meta property=['"]og:title['"] content=['"]([^'"]+)['"]/i) ??
      html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta property=['"]og:description['"] content=['"]([^'"]+)['"]/i) ??
      html.match(/<meta name=['"]description['"] content=['"]([^'"]+)['"]/i);

    return {
      title: titleMatch?.[1]?.trim(),
      description: descMatch?.[1]?.trim()
    };
  } catch {
    return {};
  }
}

function classifyType(raw: string, metadata: { title?: string; description?: string }): ExploringType {
  const corpus = `${raw} ${(metadata.title ?? '')} ${(metadata.description ?? '')}`.toLowerCase();

  if (/api|sdk|endpoint|graphql|rest|integration/.test(corpus)) {
    return 'api';
  }
  if (/paper|arxiv|doi|research|whitepaper|study/.test(corpus)) {
    return 'research';
  }
  if (/tool|app|framework|library|platform|service/.test(corpus)) {
    return 'tool';
  }
  if (/blog|article|guide|post|writeup|newsletter|report/.test(corpus)) {
    return 'article';
  }

  return 'article';
}

function deriveTitle(url: string) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split(/[?#]/)[0]
    .replace(/\/$/, '');
}

function normalizeUrl(url: string) {
  return url.replace(/[)\],.]+$/, '');
}

function twilioResponse(message: string) {
  const xml = `<Response><Message>${escapeXml(message)}</Message></Response>`;
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' }
  });
}

function slackResponse(message: string) {
  return new Response(
    JSON.stringify({ response_type: 'ephemeral', text: message }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

function escapeXml(input: string) {
  return input.replace(/[<>&'\"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}

async function verifyTwilioSignature(request: Request, rawBody: string, token: string) {
  const signature = request.headers.get('x-twilio-signature');
  if (!signature) {
    throw new HttpError('Missing Twilio signature.', 401);
  }

  const url = new URL(request.url);
  const params = new URLSearchParams(rawBody);
  
  // Twilio signature format: URL + sorted key-value pairs (key1value1key2value2...)
  const entries: [string, string][] = [];
  params.forEach((value, key) => {
    entries.push([key, value]);
  });
  const sortedPairs = entries.sort((a, b) => a[0].localeCompare(b[0]));
  const paramsString = sortedPairs.map(([key, value]) => `${key}${value}`).join('');
  const data = `${url.origin}${url.pathname}${paramsString}`;

  console.log('Twilio signature validation:', {
    url: `${url.origin}${url.pathname}`,
    paramsCount: sortedPairs.length,
    dataLength: data.length
  });

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(token),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const expected = arrayBufferToBase64(signatureBuffer);

  if (!timingSafeEqual(expected, signature)) {
    console.error('Signature mismatch:', { expected: expected.substring(0, 20), received: signature.substring(0, 20) });
    throw new HttpError('Invalid Twilio signature.', 401);
  }
}

async function verifySlackSignature(body: string, timestamp: string, signature: string, secret: string) {
  const base = `v0:${timestamp}:${body}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(base));
  const expected = `v0=${bufferToHex(digest)}`;

  if (!timingSafeEqual(expected, signature)) {
    throw new HttpError('Invalid Slack signature.', 401);
  }
}

function triggerBuild(env: Env, ctx: ExecutionContext) {
  if (!env.BUILD_WEBHOOK_URL) return;
  ctx.waitUntil(
    fetch(env.BUILD_WEBHOOK_URL, { method: 'POST' }).catch(() => undefined)
  );
}

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function assertMethod(request: Request, verb: string) {
  if (request.method !== verb) {
    throw new HttpError('Method Not Allowed', 405);
  }
}

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
