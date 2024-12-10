import { z } from 'zod'

export const schema = z.object({
	remoteIp: z.string().ip(),
	name: z.string().max(255),
})

export type ChecklistValidationSchema = z.infer<typeof schema>

export default schema
