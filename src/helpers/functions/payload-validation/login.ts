import { z } from 'zod'

export const schema = z.object({
	remoteIp: z.string().ip(),
	username: z.string().max(255),
	password: z.string().min(8),
})

export type LoginValidationSchema = z.infer<typeof schema>

export default schema
