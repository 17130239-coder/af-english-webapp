import { neon } from '@neondatabase/serverless';
import { ENV } from '../config/env.config';

/**
 * Neon Serverless Postgres Client
 */
export const sql = neon(ENV.databaseUrl);
