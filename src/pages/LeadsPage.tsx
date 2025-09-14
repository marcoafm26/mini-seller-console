import { useState } from 'react';
import { LeadDetailPanel } from '../components/leads/LeadDetailPanel';
import { LeadsTable } from '../components/leads/LeadsTable';
import { useLeadsData } from '../hooks/useLeadsData';
import type { Lead } from '../interfaces/lead';

export const LeadsPage = () => {
  const {
    leads,
    loading,
    error,
    filters,
    debouncedFilters,
    updateFilters,
    clearFilters,
    pagination,
    changePage,
    nextPage,
    prevPage,
    updateLead,
    isEmpty,
  } = useLeadsData();

  // Panel state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleViewLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setIsPanelOpen(true);
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedLead(null);
  };

  const handleUpdateLead = async (
    leadId: string,
    updates: Partial<Pick<Lead, 'status' | 'email'>>
  ) => {
    const success = await updateLead(leadId, updates);

    // Update selected lead if it was updated successfully
    if (success && selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, ...updates } : null));
    }

    return success;
  };

  // Calculate stats from all leads (not just current page)
  const statsData = {
    total: pagination.total,
    new: leads.filter((l) => l.status === 'New').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
  };

  if (loading && isEmpty) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Mini Seller Console
          </h1>
          <p className="text-neutral-600">
            Manage your leads and convert them to opportunities
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-neutral-900">
              {statsData.total}
            </div>
            <div className="text-neutral-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-primary-600">
              {statsData.new}
            </div>
            <div className="text-neutral-600">New Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-success-600">
              {statsData.qualified}
            </div>
            <div className="text-neutral-600">Qualified</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-success-700">
              {statsData.converted}
            </div>
            <div className="text-neutral-600">Converted</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-soft">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-neutral-900">Leads</h2>
          </div>
          <LeadsTable
            leads={leads}
            loading={loading}
            error={error}
            filters={filters}
            debouncedFilters={debouncedFilters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            pagination={pagination}
            changePage={changePage}
            nextPage={nextPage}
            prevPage={prevPage}
            isEmpty={isEmpty}
            onViewLead={handleViewLead}
          />
        </div>
      </div>

      {/* Lead Detail Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdateLead={handleUpdateLead}
        loading={loading}
      />
    </div>
  );
};
