import Http from '../../../helpers/classes/Http.ts'
import ChecklistValidationSchema from '../../../helpers/functions/payload-validation/checklist.ts'

import type { FreshContext } from '$fresh/server.ts'

import { load } from '$std/dotenv/mod.ts'
import { Payload, verify } from 'djwt'

const env: Record<string, string> = await load({ envPath: '.env', export: true })
const SUPPORTED_CT: readonly string[] = ['application/x-www-form-urlencoded', 'application/json']

type SupportedContentType = typeof SUPPORTED_CT[number]

export async function handler(request: Request, ctx: FreshContext): Promise<Response> {
	const contentType: SupportedContentType | null = request.headers.get('Content-Type') as SupportedContentType | null
	const access_token: string = request.headers.get('Authorization') as string
	const secretKey: CryptoKey = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(env['JWT_SECRET']),
		{ name: 'HMAC', hash: 'SHA-256' },
		true,
		['verify'],
	)

	switch (request.method) {
		case 'OPTIONS': {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Allow-Methods': 'HEAD, OPTIONS, GET, POST, DELETE',
				},
			})
		}
		case 'GET': {
			try {
				if (access_token) {
					await verify(access_token.replace('Bearer ', ''), secretKey) as Payload
				} else {
					return new Response(null, { status: 401 })
				}
			} catch (_error) {
				return new Response(null, { status: 401 })
			}
			return await ctx.next()
		}
		case 'POST': {
			if (!contentType || !SUPPORTED_CT.includes(contentType)) return new Response('-ERR unsupported or missing content-type', { status: 400 })

			try {
				if (access_token) {
					await verify(access_token.replace('Bearer ', ''), secretKey) as Payload
				} else {
					return new Response(null, { status: 401 })
				}

				const payload: HttpPayload = await Http.payloadExtractor(request, ctx, SUPPORTED_CT)

				if (typeof payload !== 'object' || Object.keys(payload).length <= 0) return new Response('-ERR no data provided', { status: 400 })

				const validation: ReturnType<typeof Http.data> = Http.validator(ChecklistValidationSchema, payload)

				if (validation.success && validation.data?.name) {
					if (validation.success) {
						ctx.state.remoteIp = validation.data.remoteIp
						ctx.state.name = validation.data.name

						Object.assign(validation, await (await ctx.next()).json())
					}
				}

				return Http.responder(contentType, validation)
			} catch (error) {
				return new Response(`-ERR processing request: ${error instanceof Error ? error.message : 'unknown error'}`, { status: 500 })
			}
		}
		case 'DELETE': {
			try {
				if (access_token) {
					await verify(access_token.replace('Bearer ', ''), secretKey) as Payload
				} else {
					return new Response(null, { status: 401 })
				}
			} catch (_error) {
				return new Response(null, { status: 401 })
			}
			return await ctx.next()
		}
		default: {
			return new Response('-ERR 405 method not allowed', { status: 405 })
		}
	}
}
