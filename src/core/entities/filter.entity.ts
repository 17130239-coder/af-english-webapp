/**
 * Domain Filter & Sorting Entities
 */

export type FilterStatus = 'all' | 'favorites' | 'translated' | 'pending';

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';

export interface CardFilterState {
  readonly searchQuery: string;
  readonly status: FilterStatus;
  readonly selectedVideo: string;
  readonly sortBy: SortOrder;
}

export const DEFAULT_FILTER_STATE: CardFilterState = {
  searchQuery: '',
  status: 'all',
  selectedVideo: 'all',
  sortBy: 'newest',
};
