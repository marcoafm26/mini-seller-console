import { useEffect, useState } from 'react';
import { getOpportunities, updateOpportunity } from '../api/opportunities';
import { OpportunitiesTable } from '../components/opportunities/OpportunitiesTable';
import { OpportunityDetailPanel } from '../components/opportunities/OpportunityDetailPanel';
import type { ApiError } from '../interfaces/api/error';
import type { Opportunity } from '../interfaces/opportunity';

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Panel state
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOpportunities();

      if (result.success) {
        setOpportunities(result.data);
      } else {
        setError(result.error);
        setOpportunities([]);
      }
    } catch {
      setError({
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
      });
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleViewOpportunity = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsPanelOpen(true);
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedOpportunity(null);
  };

  const handleUpdateOpportunity = async (
    opportunityId: string,
    updates: Partial<
      Pick<Opportunity, 'name' | 'stage' | 'amount' | 'accountName'>
    >
  ) => {
    try {
      const result = await updateOpportunity(opportunityId, updates);

      if (result.success) {
        // Update opportunities list with optimistic update
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === opportunityId
              ? { ...opp, ...updates, updatedAt: new Date().toISOString() }
              : opp
          )
        );

        // Update selected opportunity if it's the updated one
        if (selectedOpportunity && selectedOpportunity.id === opportunityId) {
          setSelectedOpportunity((prev) =>
            prev
              ? { ...prev, ...updates, updatedAt: new Date().toISOString() }
              : null
          );
        }

        return true;
      } else {
        console.error('Failed to update opportunity:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to update opportunity:', error);
      return false;
    }
  };

  const handleRefresh = () => {
    fetchOpportunities();
  };

  // Calculate stats
  const statsData = {
    total: opportunities.length,
    prospecting: opportunities.filter((o) => o.stage === 'Prospecting').length,
    qualified: opportunities.filter((o) => o.stage === 'Qualification').length,
    closedWon: opportunities.filter((o) => o.stage === 'Closed Won').length,
    totalValue: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
  };

  if (loading && opportunities.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Opportunities
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Track and manage your sales opportunities
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {statsData.total}
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">
              Total Opportunities
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {statsData.prospecting}
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">
              Prospecting
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {statsData.qualified}
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">Qualified</div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {statsData.closedWon}
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">
              Closed Won
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl font-bold text-success-700">
              ${(statsData.totalValue / 1000).toFixed(0)}k
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">
              Total Value
            </div>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft">
          <div className="px-4 sm:px-6 py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
              All Opportunities
            </h2>
          </div>
          <OpportunitiesTable
            opportunities={opportunities}
            loading={loading}
            error={error}
            onViewOpportunity={handleViewOpportunity}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Opportunity Detail Panel */}
      <OpportunityDetailPanel
        opportunity={selectedOpportunity}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdateOpportunity={handleUpdateOpportunity}
        loading={loading}
      />
    </div>
  );
};
