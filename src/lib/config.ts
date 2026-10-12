/**
 * Application Configuration
 */

export const DEFAULT_NEON_DATABASE_URL =
  'postgresql://neondb_owner:npg_yXc2iSbMx1IK@ep-super-cake-az82uvk1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export const APP_CONFIG = {
  name: 'AF English',
  description: 'Smart English vocabulary & subtitle cards from YouTube',
  databaseUrl: process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL,
  defaultLimit: 500,
} as const;
