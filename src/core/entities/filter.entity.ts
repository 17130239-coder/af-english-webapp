/**
 * Domain Filter, Sorting & View Entities
 */

export type FilterStatus = 'all' | 'favorites' | 'translated' | 'pending';

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';

export type LayoutMode = 'grid' | 'tape' | 'compact';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface CardFilterState {
  readonly searchQuery: string;
  readonly status: FilterStatus;
  readonly selectedVideo: string;
  readonly sortBy: SortOrder;
  readonly layoutMode: LayoutMode;
}

export const DEFAULT_FILTER_STATE: CardFilterState = {
  searchQuery: '',
  status: 'all',
  selectedVideo: 'all',
  sortBy: 'newest',
  layoutMode: 'grid',
};
