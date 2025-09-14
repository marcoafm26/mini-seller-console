import { useEffect, useState } from 'react';
import { LeadsTable } from '../components/leads/LeadsTable';
import leadsData from '../data/leads.json';
import type { Lead } from '../interfaces/lead';

export const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLeads(leadsData as Lead[]);
      setLoading(false);
    }, 500);
  }, []);

  const handleViewLead = (leadId: string) => {
    console.log('View lead:', leadId);
  };

  //   const handleConvertLead = (leadId: string) => {
  //     console.log('Convert lead:', leadId);
  //   };

  if (loading) {
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-neutral-900">
              {leads.length}
            </div>
            <div className="text-neutral-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-primary-600">
              {leads.filter((l) => l.status === 'New').length}
            </div>
            <div className="text-neutral-600">New Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-success-600">
              {leads.filter((l) => l.status === 'Qualified').length}
            </div>
            <div className="text-neutral-600">Qualified</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-success-700">
              {leads.filter((l) => l.status === 'Converted').length}
            </div>
            <div className="text-neutral-600">Converted</div>
          </div>
        </div>

        {/* Simple Leads List */}
        <div className="bg-white rounded-2xl shadow-soft">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-neutral-900">Leads</h2>
          </div>
          <LeadsTable
            leads={leads}
            loading={loading}
            onViewLead={handleViewLead}
          />
        </div>
      </div>
    </div>
  );
};
