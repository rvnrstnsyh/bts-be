import Http from '../../../helpers/classes/Http.ts'
import connect from '../../../helpers/functions/mysql.ts'

import { hash } from 'bcrypt'
import { FreshContext, Handlers } from '$fresh/server.ts'

import type { Client } from 'mysql'

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { email, username, password } = ctx.state as { email: string; username: string; password: string }
		const currentTime: number = Math.trunc(Date.now() / 1000)
		const sql: Client = await connect()

		try {
			const [userExists] = await sql.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email])

			if (userExists) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'register',
					message: '-ERR user already exists',
					data: { email },
				}))
			}

			await sql.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, await hash(password)])

			return Http.json(Http.data({
				success: true,
				code: 201,
				type: 'register',
				message: '+OK user created successfully',
				data: {
					email,
					timestamp: currentTime,
				},
			}))
		} catch (error) {
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'register',
				message: `-ERR ${error instanceof Error ? error.message : 'unknown error'}`,
			}))
		}
	},
}
