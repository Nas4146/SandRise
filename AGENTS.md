{
	"aiAgentRules": {
		"version": "1.0",
		"description": "Top-level principles that guide AI coding work",
		"rules": [
			{
				"id": 1,
				"title": "Work Doggedly",
				"priority": "critical",
				"principles": [
					"Be autonomous as long as possible",
					"If you know the user's overall goal and can make progress, continue working",
					"Only stop when no further progress can be made",
					"Be prepared to justify why you stopped working"
				],
				"implementation": {
					"approach": "iterative",
					"stopCondition": "Cannot make further progress toward goal",
					"requiresJustification": true
				}
			},
			{
				"id": 2,
				"title": "Work Smart",
				"priority": "critical",
				"principles": [
					"When debugging, step back and think deeply about what might be wrong",
					"When something is not working as intended, add logging to check assumptions"
				],
				"implementation": {
					"debugging": {
						"strategy": "analytical",
						"steps": [
							"Pause and analyze the problem",
							"Consider root causes",
							"Add logging to verify assumptions",
							"Test hypotheses systematically"
						]
					}
				}
			},
			{
				"id": 3,
				"title": "Check Your Work",
				"priority": "critical",
				"principles": [
					"After writing a chunk of code, find a way to run it",
					"Verify code does what you expect",
					"For long-running processes, wait 30 seconds then check logs",
					"Ensure processes are running as expected"
				],
				"implementation": {
					"verification": {
						"immediate": "Run and test code chunks",
						"delayed": "Wait 30 seconds for long processes, then check logs",
						"continuous": "Monitor that processes run as expected"
					},
					"testingRequired": true
				}
			},
			{
				"id": 4,
				"title": "Be Cautious with Terminal Commands",
				"priority": "critical",
				"principles": [
					"Before every terminal command, consider if it will exit on its own or run indefinitely",
					"For indefinite processes (e.g. web servers), always launch in a new process (e.g. nohup)",
					"If you have a script to run, ensure it has protections against running indefinitely before executing"
				],
				"implementation": {
					"commandExecution": {
						"preExecutionCheck": [
							"Determine if command exits automatically",
							"Identify if command runs indefinitely"
						],
						"indefiniteProcessHandling": {
							"method": "Launch in new process",
							"examples": [
								"nohup",
								"screen",
								"tmux",
								"background jobs"
							]
						},
						"scriptExecution": {
							"requirement": "Verify indefinite-run protections exist",
							"beforeRun": true
						}
					},
					"safetyFirst": true
				}
			},
			{
				"id": 5,
				"title": "Honor the SandRise Design System",
				"priority": "critical",
				"principles": [
					"Consult the design system documentation in `docs/sandrise-design-system.md` before making visual or structural changes",
					"Use the design tokens defined in `src/styles/tokens.css` and the global foundations in `src/styles/global.css`",
					"Align new or updated components with existing `.astro` patterns, responsive behavior, and animation conventions",
					"Respect accessibility, motion preference, and asset optimization guidelines outlined in the design system"
				],
				"implementation": {
					"referenceFiles": {
						"designSystemDoc": "docs/sandrise-design-system.md",
						"designTokens": "src/styles/tokens.css",
						"globalStyles": "src/styles/global.css",
						"componentLibrary": "src/components/"
					},
					"workflow": [
						"Review relevant sections of the design system before starting UI work",
						"Reuse existing tokens, mixins, and animation timings—add new tokens only when necessary and document them",
						"Verify responsive states and `prefers-reduced-motion` behavior by comparing with current components",
						"Run asset optimization scripts (e.g., `npm run optimize:projects`) when introducing new project imagery"
					],
					"designReviewChecklist": [
						"Typography and spacing use the prescribed tokens",
						"Color and gradients stay within the documented palette",
						"Components remain accessible with proper semantics and focus styles",
						"Images use WebP or SVG variants and include alt text"
					]
				}
			}
		],
		"enforcementLevel": "strict",
		"applicableContexts": [
			"all_coding_tasks",
			"debugging",
			"development",
			"deployment"
		]
	}
}