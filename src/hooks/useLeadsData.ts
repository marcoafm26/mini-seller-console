import { useCallback, useEffect, useRef, useState } from 'react';
import { getLeads, updateLeadsCache, type GetLeadsParams } from '../api/leads';
import type { ApiError } from '../interfaces/api/error';
import type { Lead, LeadStatus } from '../interfaces/lead';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

// User controllable filters (persisted in localStorage)
interface UserFilters {
  search: string;
  status: LeadStatus | 'All';
  dateRange: '1d' | '7d' | '30d' | '1y' | 'All';
  sortBy: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

// Pagination metadata (from server responses)
interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Default user filters
const DEFAULT_USER_FILTERS: UserFilters = {
  search: '',
  status: 'All',
  dateRange: 'All',
  sortBy: 'score',
  sortOrder: 'desc',
};

// Default pagination state
const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  totalPages: 1,
  total: 0,
  limit: 20,
  hasNext: false,
  hasPrev: false,
};

export const useLeadsData = () => {
  const [userFilters, setUserFilters] = useLocalStorage<UserFilters>(
    'leadFilters',
    DEFAULT_USER_FILTERS
  );

  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const isFilterChangeRef = useRef(false);

  const debouncedUserFilters = useDebounce(userFilters, 300);

  useEffect(() => {
    const fetchWithFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        isFilterChangeRef.current = true;

        // Reset pagination to page 1
        setPagination((prev) => ({ ...prev, currentPage: 1 }));

        const params: GetLeadsParams = {
          search: debouncedUserFilters.search,
          status: debouncedUserFilters.status,
          dateRange: debouncedUserFilters.dateRange,
          sortBy: debouncedUserFilters.sortBy,
          sortOrder: debouncedUserFilters.sortOrder,
          page: 1,
          limit: 20,
        };

        const result = await getLeads(params);

        if (result?.success && result.data) {
          setLeads(result.data.leads);
          setPagination({
            currentPage: result.data.pagination.currentPage,
            totalPages: result.data.pagination.totalPages,
            total: result.data.pagination.total,
            limit: result.data.pagination.limit || 20,
            hasNext: result.data.pagination.hasNext,
            hasPrev: result.data.pagination.hasPrev,
          });
        } else {
          setError(result?.error || { message: 'Failed to fetch leads' });
          setLeads([]);
          setPagination(DEFAULT_PAGINATION);
        }
      } catch {
        setError({
          message: 'Network error occurred',
          code: 'NETWORK_ERROR',
        });
        setLeads([]);
        setPagination(DEFAULT_PAGINATION);
      } finally {
        setLoading(false);
        isFilterChangeRef.current = false;
      }
    };

    fetchWithFilters();
  }, [
    debouncedUserFilters.search,
    debouncedUserFilters.status,
    debouncedUserFilters.dateRange,
    debouncedUserFilters.sortBy,
    debouncedUserFilters.sortOrder,
  ]);

  useEffect(() => {
    // Skip ONLY if this is a filter change (not based on page number)
    if (isFilterChangeRef.current) {
      return;
    }

    const fetchWithPagination = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: GetLeadsParams = {
          search: debouncedUserFilters.search,
          status: debouncedUserFilters.status,
          dateRange: debouncedUserFilters.dateRange,
          sortBy: debouncedUserFilters.sortBy,
          sortOrder: debouncedUserFilters.sortOrder,
          page: pagination.currentPage,
          limit: pagination.limit,
        };

        const result = await getLeads(params);

        if (result?.success && result.data) {
          setLeads(result.data.leads);
          setPagination((prev) => ({
            ...prev,
            totalPages: result.data.pagination.totalPages,
            total: result.data.pagination.total,
            hasNext: result.data.pagination.hasNext,
            hasPrev: result.data.pagination.hasPrev,
          }));
        } else {
          setError(result?.error || { message: 'Failed to fetch leads' });
        }
      } catch {
        setError({
          message: 'Network error occurred',
          code: 'NETWORK_ERROR',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWithPagination();
  }, [
    pagination.currentPage,
    debouncedUserFilters.search,
    debouncedUserFilters.status,
    debouncedUserFilters.dateRange,
    debouncedUserFilters.sortBy,
    debouncedUserFilters.sortOrder,
    pagination.limit,
  ]);

  const fetchLeads = useCallback(
    async (page: number = pagination.currentPage) => {
      try {
        setLoading(true);
        setError(null);

        const params: GetLeadsParams = {
          search: debouncedUserFilters.search,
          status: debouncedUserFilters.status,
          dateRange: debouncedUserFilters.dateRange,
          sortBy: debouncedUserFilters.sortBy,
          sortOrder: debouncedUserFilters.sortOrder,
          page,
          limit: pagination.limit,
        };

        const result = await getLeads(params);

        if (result?.success && result.data) {
          setLeads(result.data.leads);
          setPagination({
            currentPage: result.data.pagination.currentPage,
            totalPages: result.data.pagination.totalPages,
            total: result.data.pagination.total,
            limit: result.data.pagination.limit || pagination.limit,
            hasNext: result.data.pagination.hasNext,
            hasPrev: result.data.pagination.hasPrev,
          });
        } else {
          setError(result?.error || { message: 'Failed to fetch leads' });
          setLeads([]);
          setPagination(DEFAULT_PAGINATION);
        }
      } catch {
        setError({
          message: 'Network error occurred',
          code: 'NETWORK_ERROR',
        });
        setLeads([]);
        setPagination(DEFAULT_PAGINATION);
      } finally {
        setLoading(false);
      }
    },
    [debouncedUserFilters, pagination.currentPage, pagination.limit]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
      setUserFilters({ ...userFilters, ...newFilters });
    },
    [userFilters, setUserFilters]
  );

  const clearFilters = useCallback(() => {
    setUserFilters(DEFAULT_USER_FILTERS);
  }, [setUserFilters]);

  const changePage = useCallback(
    (page: number) => {
      if (
        page >= 1 &&
        page <= pagination.totalPages &&
        page !== pagination.currentPage
      ) {
        console.log('changePage', page);
        setPagination((prev) => ({ ...prev, currentPage: page }));
      }
    },
    [pagination.totalPages, pagination.currentPage]
  );

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      changePage(pagination.currentPage + 1);
    }
  }, [pagination.hasNext, pagination.currentPage, changePage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      changePage(pagination.currentPage - 1);
    }
  }, [pagination.hasPrev, pagination.currentPage, changePage]);

  const updateLead = useCallback(
    async (
      leadId: string,
      updates: Partial<
        Pick<Lead, 'status' | 'email' | 'name' | 'company' | 'score'>
      >
    ): Promise<boolean> => {
      const originalLeads = [...leads];

      try {
        const optimisticLeads = leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
            : lead
        );
        setLeads(optimisticLeads);
        setError(null);
        updateLeadsCache(optimisticLeads.filter((lead) => lead.id === leadId));

        if (Math.random() < 0.2) {
          throw new Error('Update failed');
        }

        console.log(`Lead ${leadId} updated successfully`);
        return true;
      } catch (error) {
        setLeads(originalLeads);
        setError({
          message: 'Failed to update lead. Please try again.',
          code: 'UPDATE_FAILED',
        });
        console.error('Lead update failed:', error);
        return false;
      }
    },
    [leads]
  );

  const refetch = useCallback(() => {
    fetchLeads(pagination.currentPage);
  }, [fetchLeads, pagination.currentPage]);

  return {
    // Current page data
    leads,
    loading,
    error,

    // User filters (persisted in localStorage)
    filters: userFilters,
    debouncedFilters: debouncedUserFilters,
    updateFilters,
    clearFilters,

    // Pagination state (separate from user filters)
    pagination,
    changePage,
    nextPage,
    prevPage,

    // Actions
    updateLead,
    refetch,

    // Utilities
    isEmpty: !loading && leads.length === 0,
    hasData: leads.length > 0,
  };
};
