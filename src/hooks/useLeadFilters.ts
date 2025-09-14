import { useCallback, useMemo } from 'react';
import type { Lead, LeadStatus } from '../interfaces/lead';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'All';
  dateRange: '1d' | '7d' | '30d' | '1y' | 'All';
  sortBy: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: LeadFilters = {
  search: '',
  status: 'All',
  dateRange: 'All',
  sortBy: 'score',
  sortOrder: 'desc',
};

export const useLeadFilters = (leads: Lead[]) => {
  const [filters, setFilters] = useLocalStorage<LeadFilters>(
    'leadFilters',
    DEFAULT_FILTERS
  );

  const debouncedFilters = useDebounce(filters, 300);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (debouncedFilters.search) {
      const searchLower = debouncedFilters.search.toLowerCase().trim();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    if (debouncedFilters.status !== 'All') {
      result = result.filter((lead) => lead.status === debouncedFilters.status);
    }

    if (debouncedFilters.dateRange !== 'All') {
      const now = new Date();
      const dateThresholds = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      };

      const threshold = dateThresholds[debouncedFilters.dateRange];
      result = result.filter((lead) => new Date(lead.createdAt) >= threshold);
    }

    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (debouncedFilters.sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return debouncedFilters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return debouncedFilters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, debouncedFilters]);

  return {
    filters, // Current filter state (immediate UI updates)
    debouncedFilters, // Debounced filter state (for debugging)
    filteredLeads, // Filtered results (based on debounced filters)
    clearFilters, // Reset all filters,
    setFilters,
  };
};
