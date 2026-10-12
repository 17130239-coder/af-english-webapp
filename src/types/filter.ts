export type FilterStatus = 'all' | 'favorites' | 'translated' | 'pending';

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';

export type LayoutMode = 'grid' | 'tape' | 'compact';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface CardFilterState {
  searchQuery: string;
  status: FilterStatus;
  selectedVideo: string;
  sortBy: SortOrder;
  layoutMode: LayoutMode;
}
