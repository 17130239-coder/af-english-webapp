export type FilterStatus = 'all' | 'favorites' | 'translated' | 'pending';

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';

export interface CardFilterState {
  searchQuery: string;
  status: FilterStatus;
  selectedVideo: string;
  sortBy: SortOrder;
}
