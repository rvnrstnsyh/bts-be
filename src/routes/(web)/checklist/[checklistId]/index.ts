import Http from '../../../../helpers/classes/Http.ts'
import connect from '../../../../helpers/functions/mysql.ts'

import { FreshContext, Handlers } from '$fresh/server.ts'
import { load } from '$std/dotenv/mod.ts'
import { Payload, verify } from 'djwt'

import type { Client } from 'mysql'

const env: Record<string, string> = await load({ envPath: '.env', export: true })

export const handler: Handlers = {
	async DELETE(request: Request, _ctx: FreshContext): Promise<Response> {
		// Verifikasi token JWT
		const access_token: string = request.headers.get('Authorization') as string
		const secretKey: CryptoKey = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(env['JWT_SECRET']),
			{ name: 'HMAC', hash: 'SHA-256' },
			true,
			['verify'],
		)

		try {
			if (!access_token) return new Response(null, { status: 401 })
			await verify(access_token.replace('Bearer ', ''), secretKey) as Payload
		} catch (_error) {
			return new Response(null, { status: 401 })
		}

		const sql: Client = await connect()

		try {
			const url = new URL(request.url)
			const checklistId = url.pathname.split('/').pop()

			if (!checklistId) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'checklist',
					message: '-ERR checklist ID is required',
				}))
			}

			const [checklistExists] = await sql.query('SELECT 1 FROM checklists WHERE id = ? LIMIT 1', [checklistId])

			if (!checklistExists) {
				return Http.json(Http.data({
					success: false,
					code: 404,
					type: 'checklist',
					message: '-ERR checklist not found',
					data: { checklistId },
				}))
			}

			await sql.query('DELETE FROM checklists WHERE id = ?', [checklistId])

			return Http.json(Http.data({
				success: true,
				code: 200,
				type: 'checklist',
				message: '+OK checklist deleted successfully',
				data: { checklistId },
			}))
		} catch (error) {
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'checklist',
				message: `-ERR ${error instanceof Error ? error.message : 'unknown error'}`,
			}))
		}
	},
}
