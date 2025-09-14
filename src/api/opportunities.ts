import type { ApiResponse } from '../interfaces/api/response';
import type {
  CreateOpportunityRequest,
  Opportunity,
  OpportunityStage,
} from '../interfaces/opportunity';
import { shouldSimulateError } from '../utils/errorSimulation';

// Simple ID generator
const generateId = () =>
  'opp_' + Date.now().toString(36) + Math.random().toString(36).substring(2);

// Simulate delay for API calls
const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory opportunity storage (simulating database)
let opportunitiesCache: Opportunity[] = [];

export const getOpportunities = async (): Promise<
  ApiResponse<Opportunity[]>
> => {
  await simulateDelay();

  try {
    // Simulate occasional API failure
    if (shouldSimulateError()) {
      throw new Error('Network error');
    }

    return {
      success: true,
      data: [...opportunitiesCache].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  } catch {
    return {
      success: false,
      error: {
        message: 'Failed to fetch opportunities',
        code: 'FETCH_OPPORTUNITIES_FAILED',
      },
    };
  }
};

export const createOpportunity = async (
  request: CreateOpportunityRequest
): Promise<ApiResponse<Opportunity>> => {
  await simulateDelay(500);

  try {
    // Simulate occasional API failure
    if (shouldSimulateError()) {
      throw new Error('Creation failed');
    }

    const now = new Date().toISOString();
    const opportunity: Opportunity = {
      id: generateId(),
      name: request.name,
      stage: request.stage || 'Prospecting',
      amount: request.amount,
      accountName: request.accountName,
      leadId: request.leadId,
      createdAt: now,
      updatedAt: now,
    };

    opportunitiesCache.push(opportunity);

    return {
      success: true,
      data: opportunity,
    };
  } catch {
    return {
      success: false,
      error: {
        message: 'Failed to create opportunity',
        code: 'CREATE_OPPORTUNITY_FAILED',
      },
    };
  }
};

export const updateOpportunity = async (
  id: string,
  updates: Partial<
    Pick<Opportunity, 'name' | 'stage' | 'amount' | 'accountName'>
  >
): Promise<ApiResponse<Opportunity>> => {
  await simulateDelay(400);

  try {
    // Simulate occasional API failure
    if (shouldSimulateError()) {
      throw new Error('Update failed');
    }

    const opportunityIndex = opportunitiesCache.findIndex(
      (opp) => opp.id === id
    );

    if (opportunityIndex === -1) {
      return {
        success: false,
        error: {
          message: 'Opportunity not found',
          code: 'OPPORTUNITY_NOT_FOUND',
        },
      };
    }

    const updatedOpportunity = {
      ...opportunitiesCache[opportunityIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    opportunitiesCache[opportunityIndex] = updatedOpportunity;

    return {
      success: true,
      data: updatedOpportunity,
    };
  } catch {
    return {
      success: false,
      error: {
        message: 'Failed to update opportunity',
        code: 'UPDATE_OPPORTUNITY_FAILED',
      },
    };
  }
};

export const deleteOpportunity = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(300);

  try {
    // Simulate occasional API failure
    if (shouldSimulateError()) {
      throw new Error('Delete failed');
    }

    const initialLength = opportunitiesCache.length;
    opportunitiesCache = opportunitiesCache.filter((opp) => opp.id !== id);

    if (opportunitiesCache.length === initialLength) {
      return {
        success: false,
        error: {
          message: 'Opportunity not found',
          code: 'OPPORTUNITY_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      data: true,
    };
  } catch {
    return {
      success: false,
      error: {
        message: 'Failed to delete opportunity',
        code: 'DELETE_OPPORTUNITY_FAILED',
      },
    };
  }
};

// Helper functions for cache management
export const clearOpportunitiesCache = () => {
  opportunitiesCache = [];
};

export const getOpportunitiesCache = () => [...opportunitiesCache];

export const getOpportunityCacheStats = () => ({
  count: opportunitiesCache.length,
  stages: opportunitiesCache.reduce(
    (acc, opp) => {
      acc[opp.stage] = (acc[opp.stage] || 0) + 1;
      return acc;
    },
    {} as Record<OpportunityStage, number>
  ),
});
