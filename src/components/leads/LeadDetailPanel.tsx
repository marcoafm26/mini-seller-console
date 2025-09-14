import React, { useEffect, useState } from 'react';
import type { ApiError } from '../../interfaces/api/error';
import type { Lead, LeadStatus } from '../../interfaces/lead';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate, getScoreColor } from '../utils/formatting';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (
    leadId: string,
    updates: Partial<Pick<Lead, 'status' | 'email'>>
  ) => Promise<boolean>;
  onConvertLead?: (leadId: string) => Promise<boolean>;
  loading?: boolean;
}

const statusOptions: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
  'Converted',
];

export const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
  onConvertLead,
  loading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedStatus, setEditedStatus] = useState<LeadStatus>('New');
  const [emailError, setEmailError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Reset form when lead changes or panel opens
  useEffect(() => {
    if (lead && isOpen) {
      setEditedEmail(lead.email);
      setEditedStatus(lead.status);
      setEmailError('');
      setError(null);
      setIsEditing(false);
    }
  }, [lead, isOpen]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedEmail(value);
    if (emailError) {
      validateEmail(value);
    }
    // Clear error when user starts making changes
    if (error) {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    // Validate email
    if (!validateEmail(editedEmail)) {
      return;
    }

    // Check if anything changed
    if (editedEmail === lead.email && editedStatus === lead.status) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates: Partial<Pick<Lead, 'status' | 'email'>> = {};

      if (editedEmail !== lead.email) {
        updates.email = editedEmail;
      }

      if (editedStatus !== lead.status) {
        updates.status = editedStatus;
      }

      const success = await onUpdateLead(lead.id, updates);

      if (success) {
        setIsEditing(false);
        setError(null);
      } else {
        setError({
          message: 'Failed to update lead. Please try again.',
          code: 'UPDATE_FAILED',
        });
      }
    } catch (updateError) {
      console.error('Failed to update lead:', updateError);
      setError({
        message: 'An unexpected error occurred. Please try again.',
        code: 'UNEXPECTED_ERROR',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (lead) {
      setEditedEmail(lead.email);
      setEditedStatus(lead.status);
      setEmailError('');
    }
    setError(null);
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    // Clear error when starting to edit
    setError(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedStatus(e.target.value as LeadStatus);
    // Clear error when user makes changes
    if (error) {
      setError(null);
    }
  };

  const handleConvertLead = async () => {
    if (!lead || !onConvertLead) return;

    setIsConverting(true);
    setError(null);

    try {
      const success = await onConvertLead(lead.id);

      if (success) {
        // Close panel after successful conversion
        onClose();
      } else {
        setError({
          message: 'Failed to convert lead to opportunity. Please try again.',
          code: 'CONVERT_FAILED',
        });
      }
    } catch (convertError) {
      console.error('Failed to convert lead:', convertError);
      setError({
        message:
          'An unexpected error occurred during conversion. Please try again.',
        code: 'CONVERT_UNEXPECTED_ERROR',
      });
    } finally {
      setIsConverting(false);
    }
  };

  if (!lead) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-neutral-500/30 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 pl-4 sm:pl-10 max-w-full flex z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-sm sm:max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="px-4 py-4 sm:py-6 bg-neutral-50 sm:px-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-neutral-900">
                    Lead Details
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                    View and edit lead information
                  </p>
                </div>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    className="bg-neutral-50 rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-4 sm:py-6 sm:px-6">
              <div className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
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
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lead Info */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">
                    {lead.name}
                  </h3>

                  <div className="space-y-4">
                    {/* Email (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="email"
                            value={editedEmail}
                            onChange={handleEmailChange}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              emailError
                                ? 'border-red-300 bg-red-50'
                                : 'border-neutral-300'
                            }`}
                            placeholder="Enter email address"
                          />
                          {emailError && (
                            <p className="mt-1 text-sm text-red-600">
                              {emailError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-900">{lead.email}</p>
                      )}
                    </div>

                    {/* Status (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={editedStatus}
                          onChange={handleStatusChange}
                          className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge status={lead.status} />
                      )}
                    </div>

                    {/* Company (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Company
                      </label>
                      <p className="text-sm text-neutral-900">{lead.company}</p>
                    </div>

                    {/* Source (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Source
                      </label>
                      <p className="text-sm text-neutral-900">{lead.source}</p>
                    </div>

                    {/* Score (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Score
                      </label>
                      <p
                        className={`text-2xl font-mono ${getScoreColor(lead.score)}`}
                      >
                        {lead.score}
                      </p>
                    </div>

                    {/* Dates (Read-only) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Created
                        </label>
                        <p className="text-sm text-neutral-900">
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Updated
                        </label>
                        <p className="text-sm text-neutral-900">
                          {formatDate(lead.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 sm:py-4 bg-neutral-50 sm:px-6">
              <div className="flex justify-between">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      loading={isSaving}
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between w-full">
                    <div className="flex space-x-3">
                      <Button variant="ghost" onClick={onClose}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleStartEditing}
                        disabled={loading}
                      >
                        Edit Lead
                      </Button>
                    </div>

                    {/* Convert Lead Button */}
                    {lead.status !== 'Converted' && onConvertLead && (
                      <div>
                        <Button
                          variant="success"
                          onClick={handleConvertLead}
                          loading={isConverting}
                          disabled={loading || isSaving}
                        >
                          Convert to Opportunity
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
