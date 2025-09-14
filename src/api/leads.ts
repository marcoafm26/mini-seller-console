import {
  API_DELAYS,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_YEAR,
} from '../constants/api';
import leadsData from '../data/leads.json';
import type { ApiResponse } from '../interfaces/api/response';
import type { Lead, LeadFilters, LeadStatus } from '../interfaces/lead';
import { shouldSimulateError } from '../utils/errorSimulation';

export interface GetLeadsParams {
  search?: string;
  status?: LeadStatus | 'All';
  dateRange?: '1d' | '7d' | '30d' | '1y' | 'All';
  sortBy?: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetLeadsResponse {
  leads: Lead[];
  pagination: LeadFilters;
}

const simulateDelay = (ms: number = API_DELAYS.DEFAULT) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const simulateFailure = shouldSimulateError;

let leadsCache: Lead[] = [...(leadsData as Lead[])];

export const getLeads = async (
  params: GetLeadsParams = {}
): Promise<ApiResponse<GetLeadsResponse> | null> => {
  await simulateDelay();

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
    const {
      search = '',
      status = 'All',
      dateRange = 'All',
      sortBy = 'score',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = params;

    let filteredLeads = [...leadsCache];

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    if (status !== 'All') {
      filteredLeads = filteredLeads.filter((lead) => lead.status === status);
    }
    if (dateRange !== 'All') {
      const now = new Date();
      const dateThresholds = {
        '1d': new Date(now.getTime() - MILLISECONDS_PER_DAY),
        '7d': new Date(now.getTime() - 7 * MILLISECONDS_PER_DAY),
        '30d': new Date(now.getTime() - 30 * MILLISECONDS_PER_DAY),
        '1y': new Date(now.getTime() - MILLISECONDS_PER_YEAR),
      };

      const threshold = dateThresholds[dateRange];
      if (threshold) {
        filteredLeads = filteredLeads.filter(
          (lead) => new Date(lead.createdAt) >= threshold
        );
      }
    }

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

    const total = filteredLeads.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (validPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
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

export const updateLeadsCache = (updatedLeads: Lead[]) => {
  updatedLeads.forEach((updatedLead) => {
    const index = leadsCache.findIndex((lead) => lead.id === updatedLead.id);
    if (index !== -1) {
      leadsCache[index] = updatedLead;
    }
  });
};

export const getLeadFromCache = (leadId: string): Lead | undefined => {
  return leadsCache.find((lead) => lead.id === leadId);
};

export const getAllLeadsFromCache = (): Lead[] => {
  return [...leadsCache];
};

export const resetLeadsCache = () => {
  leadsCache = [...(leadsData as Lead[])];
};

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
