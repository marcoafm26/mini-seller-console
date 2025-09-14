import leadsData from '../data/leads.json';
import type { ApiResponse } from '../interfaces/api/response';
import type { Lead, LeadFilters, LeadStatus } from '../interfaces/lead';
import { shouldSimulateError } from '../utils/errorSimulation';

// Query parameters interface
export interface GetLeadsParams {
  // Filtering
  search?: string;
  status?: LeadStatus | 'All';
  dateRange?: '1d' | '7d' | '30d' | '1y' | 'All';

  // Sorting
  sortBy?: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  page?: number;
  limit?: number;
}

// Response interface
export interface GetLeadsResponse {
  leads: Lead[];
  pagination: LeadFilters;
}

// Simulate network delay
const simulateDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Simulate random failures using configurable error rate
const simulateFailure = shouldSimulateError;

// In-memory cache for demo (includes any updates from optimistic updates)
let leadsCache: Lead[] = [...(leadsData as Lead[])];

// Main getLeads function with server-side filtering and pagination
export const getLeads = async (
  params: GetLeadsParams = {}
): Promise<ApiResponse<GetLeadsResponse> | null> => {
  // Simulate network delay
  await simulateDelay();

  // Simulate occasional failures
  if (simulateFailure()) {
    return {
      success: false,
      error: {
        message: 'Server temporarily unavailable. Please try again.',
        code: 'SERVER_ERROR',
      },
    };
  }

  try {
    // Default parameters
    const {
      search = '',
      status = 'All',
      dateRange = 'All',
      sortBy = 'score',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = params;

    // Start with all leads from cache
    let filteredLeads = [...leadsCache];

    // 1. Apply search filter (name, email, company)
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    // 2. Apply status filter
    if (status !== 'All') {
      filteredLeads = filteredLeads.filter((lead) => lead.status === status);
    }

    // 3. Apply date range filter
    if (dateRange !== 'All') {
      const now = new Date();
      const dateThresholds = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      };

      const threshold = dateThresholds[dateRange];
      if (threshold) {
        filteredLeads = filteredLeads.filter(
          (lead) => new Date(lead.createdAt) >= threshold
        );
      }
    }

    // 4. Apply sorting
    filteredLeads.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
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

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Calculate pagination metadata
    const total = filteredLeads.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));

    // 6. Apply pagination (slice the results)
    const startIndex = (validPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    // 7. Build response
    const response: GetLeadsResponse = {
      leads: paginatedLeads,
      pagination: {
        search,
        status,
        dateRange,
        sortBy,
        sortOrder,
        currentPage: validPage,
        totalPages,
        total,
        limit,
        hasNext: validPage < totalPages,
        hasPrev: validPage > 1,
      },
    };

    // Log for debugging
    console.log(`[API] getLeads called with:`, params);
    console.log(
      `[API] Returning ${paginatedLeads.length} leads out of ${total} filtered results (page ${validPage}/${totalPages})`
    );

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    console.error('[API] getLeads error:', error);
    return {
      success: false,
      error: {
        message: 'Failed to fetch leads',
        code: 'FETCH_ERROR',
      },
    };
  }
};

// Helper function to update the leads cache (for optimistic updates)
export const updateLeadsCache = (updatedLeads: Lead[]) => {
  updatedLeads.forEach((updatedLead) => {
    const index = leadsCache.findIndex((lead) => lead.id === updatedLead.id);
    if (index !== -1) {
      leadsCache[index] = updatedLead;
      console.log(`[Cache] Updated lead ${updatedLead.id} in cache`);
    }
  });
};

// Helper function to get a lead from cache
export const getLeadFromCache = (leadId: string): Lead | undefined => {
  return leadsCache.find((lead) => lead.id === leadId);
};

// Get all leads from cache (for stats or other purposes)
export const getAllLeadsFromCache = (): Lead[] => {
  return [...leadsCache];
};

// Reset cache to original data (useful for testing)
export const resetLeadsCache = () => {
  leadsCache = [...(leadsData as Lead[])];
  console.log('[Cache] Reset to original data');
};

// Get cache stats
export const getCacheStats = () => {
  const stats = {
    total: leadsCache.length,
    byStatus: {
      New: leadsCache.filter((l) => l.status === 'New').length,
      Contacted: leadsCache.filter((l) => l.status === 'Contacted').length,
      Qualified: leadsCache.filter((l) => l.status === 'Qualified').length,
      Lost: leadsCache.filter((l) => l.status === 'Lost').length,
      Converted: leadsCache.filter((l) => l.status === 'Converted').length,
    },
  };
  return stats;
};
