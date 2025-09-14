import { useEffect, useState } from 'react';
import type { ApiError } from '../../interfaces/api/error';
import type {
  Opportunity,
  OpportunityStage,
} from '../../interfaces/opportunity';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../utils/formatting';

interface OpportunityDetailPanelProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOpportunity: (
    opportunityId: string,
    updates: Partial<
      Pick<Opportunity, 'name' | 'stage' | 'amount' | 'accountName'>
    >
  ) => Promise<boolean>;
  loading?: boolean;
}

const stageOptions: OpportunityStage[] = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

// Stage badge component
const StageBadge: React.FC<{ stage: OpportunityStage }> = ({ stage }) => {
  const stageClasses = {
    Prospecting: 'bg-blue-100 text-blue-700',
    Qualification: 'bg-yellow-100 text-yellow-700',
    Proposal: 'bg-orange-100 text-orange-700',
    Negotiation: 'bg-purple-100 text-purple-700',
    'Closed Won': 'bg-green-100 text-green-700',
    'Closed Lost': 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageClasses[stage]}`}
    >
      {stage}
    </span>
  );
};

export const OpportunityDetailPanel: React.FC<OpportunityDetailPanelProps> = ({
  opportunity,
  isOpen,
  onClose,
  onUpdateOpportunity,
  loading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedStage, setEditedStage] =
    useState<OpportunityStage>('Prospecting');
  const [editedAmount, setEditedAmount] = useState('');
  const [editedAccountName, setEditedAccountName] = useState('');
  const [nameError, setNameError] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Reset form when opportunity changes or panel opens
  useEffect(() => {
    if (opportunity && isOpen) {
      setEditedName(opportunity.name);
      setEditedStage(opportunity.stage);
      setEditedAmount(opportunity.amount ? opportunity.amount.toString() : '');
      setEditedAccountName(opportunity.accountName);
      setNameError('');
      setAccountNameError('');
      setAmountError('');
      setError(null);
      setIsEditing(false);
    }
  }, [opportunity, isOpen]);

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateAccountName = (accountName: string): boolean => {
    if (!accountName.trim()) {
      setAccountNameError('Account name is required');
      return false;
    }
    if (accountName.trim().length < 2) {
      setAccountNameError('Account name must be at least 2 characters');
      return false;
    }
    setAccountNameError('');
    return true;
  };

  const validateAmount = (amount: string): boolean => {
    if (amount && amount.trim()) {
      const numAmount = parseFloat(amount.trim());
      if (isNaN(numAmount) || numAmount < 0) {
        setAmountError('Amount must be a valid positive number');
        return false;
      }
    }
    setAmountError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedName(value);
    if (nameError) {
      validateName(value);
    }
    if (error) {
      setError(null);
    }
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedAccountName(value);
    if (accountNameError) {
      validateAccountName(value);
    }
    if (error) {
      setError(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedAmount(value);
    if (amountError) {
      validateAmount(value);
    }
    if (error) {
      setError(null);
    }
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedStage(e.target.value as OpportunityStage);
    if (error) {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!opportunity) return;

    // Validate all fields
    const isNameValid = validateName(editedName);
    const isAccountNameValid = validateAccountName(editedAccountName);
    const isAmountValid = validateAmount(editedAmount);

    if (!isNameValid || !isAccountNameValid || !isAmountValid) {
      return;
    }

    // Check if anything changed
    const amountValue = editedAmount.trim()
      ? parseFloat(editedAmount.trim())
      : undefined;
    const originalAmount = opportunity.amount;

    if (
      editedName === opportunity.name &&
      editedStage === opportunity.stage &&
      editedAccountName === opportunity.accountName &&
      ((amountValue === undefined && originalAmount === undefined) ||
        amountValue === originalAmount)
    ) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates: Partial<
        Pick<Opportunity, 'name' | 'stage' | 'amount' | 'accountName'>
      > = {};

      if (editedName !== opportunity.name) {
        updates.name = editedName;
      }

      if (editedStage !== opportunity.stage) {
        updates.stage = editedStage;
      }

      if (editedAccountName !== opportunity.accountName) {
        updates.accountName = editedAccountName;
      }

      if (amountValue !== originalAmount) {
        updates.amount = amountValue;
      }

      const success = await onUpdateOpportunity(opportunity.id, updates);

      if (success) {
        setIsEditing(false);
        setError(null);
      } else {
        setError({
          message: 'Failed to update opportunity. Please try again.',
          code: 'UPDATE_FAILED',
        });
      }
    } catch (updateError) {
      console.error('Failed to update opportunity:', updateError);
      setError({
        message: 'An unexpected error occurred. Please try again.',
        code: 'UNEXPECTED_ERROR',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (opportunity) {
      setEditedName(opportunity.name);
      setEditedStage(opportunity.stage);
      setEditedAmount(opportunity.amount ? opportunity.amount.toString() : '');
      setEditedAccountName(opportunity.accountName);
      setNameError('');
      setAccountNameError('');
      setAmountError('');
    }
    setError(null);
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setError(null);
  };

  if (!opportunity) return null;

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
                    Opportunity Details
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                    View and edit opportunity information
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

                {/* Opportunity Info */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">
                    {opportunity.name}
                  </h3>

                  <div className="space-y-4">
                    {/* Name (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={editedName}
                            onChange={handleNameChange}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              nameError
                                ? 'border-red-300 bg-red-50'
                                : 'border-neutral-300'
                            }`}
                            placeholder="Enter opportunity name"
                          />
                          {nameError && (
                            <p className="mt-1 text-sm text-red-600">
                              {nameError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-900">
                          {opportunity.name}
                        </p>
                      )}
                    </div>

                    {/* Stage (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Stage
                      </label>
                      {isEditing ? (
                        <select
                          value={editedStage}
                          onChange={handleStageChange}
                          className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {stageOptions.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <StageBadge stage={opportunity.stage} />
                      )}
                    </div>

                    {/* Amount (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Amount
                      </label>
                      {isEditing ? (
                        <div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editedAmount}
                              onChange={handleAmountChange}
                              className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                amountError
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-neutral-300'
                              }`}
                              placeholder="0.00"
                            />
                          </div>
                          {amountError && (
                            <p className="mt-1 text-sm text-red-600">
                              {amountError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-lg font-medium text-neutral-900">
                          {opportunity.amount
                            ? formatCurrency(opportunity.amount)
                            : '—'}
                        </p>
                      )}
                    </div>

                    {/* Account Name (Editable) */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Account
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={editedAccountName}
                            onChange={handleAccountNameChange}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              accountNameError
                                ? 'border-red-300 bg-red-50'
                                : 'border-neutral-300'
                            }`}
                            placeholder="Enter account name"
                          />
                          {accountNameError && (
                            <p className="mt-1 text-sm text-red-600">
                              {accountNameError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-900">
                          {opportunity.accountName}
                        </p>
                      )}
                    </div>

                    {/* Dates (Read-only) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Created
                        </label>
                        <p className="text-sm text-neutral-900">
                          {formatDate(opportunity.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Updated
                        </label>
                        <p className="text-sm text-neutral-900">
                          {formatDate(opportunity.updatedAt)}
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
                  <div className="flex space-x-3">
                    <Button variant="ghost" onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleStartEditing}
                      disabled={loading}
                    >
                      Edit Opportunity
                    </Button>
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
