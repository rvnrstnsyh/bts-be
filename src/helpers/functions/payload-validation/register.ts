import { z } from 'zod'

export const schema = z.object({
	remoteIp: z.string().ip(),
	email: z.string().email(),
	username: z.string().max(255),
	password: z.string().min(8),
	password_confirmation: z.string().optional(),
}).refine((data) => !data.password_confirmation || data.password === data.password_confirmation, {
	message: "Passwords don't match",
	path: ['password_confirmation'],
})

export type RegisterValidationSchema = z.infer<typeof schema>

export default schema
