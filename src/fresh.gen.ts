// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_views_layout from './routes/(views)/_layout.tsx'
import * as $_views_index from './routes/(views)/index.tsx'
import * as $_web_checklist_checklistId_index from './routes/(web)/checklist/[checklistId]/index.ts'
import * as $_web_checklist_middleware from './routes/(web)/checklist/_middleware.ts'
import * as $_web_checklist_index from './routes/(web)/checklist/index.ts'
import * as $_app from './routes/_app.tsx'
import * as $_middleware from './routes/_middleware.ts'
import * as $api_auth_middleware from './routes/api/(auth)/_middleware.ts'
import * as $api_auth_login from './routes/api/(auth)/login.ts'
import * as $api_auth_register from './routes/api/(auth)/register.ts'
import * as $api_joke from './routes/api/joke.ts'
import * as $api_v0_traffic_jam_index from './routes/api/v0/traffic-jam/index.ts'
import * as $greet_name_ from './routes/greet/[name].tsx'
import * as $counter from './islands/counter.tsx'
import type { Manifest } from '$fresh/server.ts'

const manifest = {
	routes: {
		'./routes/(views)/_layout.tsx': $_views_layout,
		'./routes/(views)/index.tsx': $_views_index,
		'./routes/(web)/checklist/[checklistId]/index.ts': $_web_checklist_checklistId_index,
		'./routes/(web)/checklist/_middleware.ts': $_web_checklist_middleware,
		'./routes/(web)/checklist/index.ts': $_web_checklist_index,
		'./routes/_app.tsx': $_app,
		'./routes/_middleware.ts': $_middleware,
		'./routes/api/(auth)/_middleware.ts': $api_auth_middleware,
		'./routes/api/(auth)/login.ts': $api_auth_login,
		'./routes/api/(auth)/register.ts': $api_auth_register,
		'./routes/api/joke.ts': $api_joke,
		'./routes/api/v0/traffic-jam/index.ts': $api_v0_traffic_jam_index,
		'./routes/greet/[name].tsx': $greet_name_,
	},
	islands: {
		'./islands/counter.tsx': $counter,
	},
	baseUrl: import.meta.url,
} satisfies Manifest

export default manifest
