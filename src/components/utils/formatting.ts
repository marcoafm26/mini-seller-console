export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) return 'Today';
  if (diffInHours < 48) return 'Yesterday';
  return formatDate(dateString);
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success-600 font-semibold';
  if (score >= 60) return 'text-warning-600 font-medium';
  return 'text-neutral-500';
};