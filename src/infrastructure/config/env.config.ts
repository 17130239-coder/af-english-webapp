/**
 * Infrastructure Environment Configuration
 */

export const DEFAULT_NEON_DATABASE_URL =
  'postgresql://neondb_owner:npg_yXc2iSbMx1IK@ep-super-cake-az82uvk1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export const ENV = {
  appName: 'AF English',
  databaseUrl: process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL,
  defaultFetchLimit: 500,
} as const;
