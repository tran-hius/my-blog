import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export const env = schema.parse(process.env);
