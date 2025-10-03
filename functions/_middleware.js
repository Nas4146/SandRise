// Redirect sandrise.pages.dev to sandrise.io
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // If request is to pages.dev domain, redirect to custom domain
  if (url.hostname.endsWith('.pages.dev')) {
    const newUrl = `https://sandrise.io${url.pathname}${url.search}`;
    return Response.redirect(newUrl, 301);
  }
  
  // Otherwise, continue to next handler
  return context.next();
}
