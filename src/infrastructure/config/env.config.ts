/**
 * Infrastructure Environment Configuration
 */

export const ENV = {
  appName: 'AF English',
  databaseUrl: process.env.DATABASE_URL || '',
  defaultFetchLimit: 500,
} as const;

