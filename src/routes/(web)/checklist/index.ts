import Http from '../../../helpers/classes/Http.ts'
import connect from '../../../helpers/functions/mysql.ts'

import { FreshContext, Handlers } from '$fresh/server.ts'

import type { Client } from 'mysql'

export const handler: Handlers = {
	async GET(_request: Request, _ctx: FreshContext): Promise<Response> {
		const sql: Client = await connect()

		try {
			const checklists = await sql.query('SELECT * FROM checklists')
			if (!checklists) {
				return Http.json(Http.data({
					success: false,
					code: 404,
					type: 'checklist',
					message: '-ERR checklists not found',
					data: { checklists },
				}))
			}

			return Http.json(Http.data({
				success: true,
				code: 200,
				type: 'checklist',
				message: '+OK checklists found',
				data: { checklists },
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

	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { name } = ctx.state as { name: string }
		const sql: Client = await connect()

		try {
			const [checklistExists] = await sql.query('SELECT 1 FROM checklists WHERE name = ? LIMIT 1', [name])

			if (checklistExists) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'checklist',
					message: '-ERR checklist already exists',
					data: { name },
				}))
			}

			await sql.query('INSERT INTO checklists (name, version) VALUES (?, ?)', [name, parseFloat(Math.random().toFixed(2))])

			return Http.json(Http.data({
				success: true,
				code: 201,
				type: 'checklist',
				message: '+OK checklist created successfully',
				data: { name },
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

	async DELETE(request: Request, _ctx: FreshContext): Promise<Response> {
		const sql: Client = await connect()

		try {
			// Extract checklistId from the URL
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

			// Check if checklist exists before deletion
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

			// Perform deletion
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
