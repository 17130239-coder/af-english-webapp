import { neon } from '@neondatabase/serverless';
import { APP_CONFIG } from '@/lib/config';

// Initialize singleton Neon SQL client
export const sql = neon(APP_CONFIG.databaseUrl);
