const formatDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const mockReports = [
  { id: 'rep_1', name: 'Catalog Health Analysis', date: formatDate(2), type: 'Health', status: 'Ready' },
  { id: 'rep_2', name: 'Channel Readiness - Shopify', date: formatDate(5), type: 'Channel', status: 'Ready' },
  { id: 'rep_3', name: 'AI Enrichment Summary', date: formatDate(10), type: 'AI', status: 'Ready' },
  { id: 'rep_4', name: 'Quality Issues Audit', date: formatDate(14), type: 'Audit', status: 'Ready' },
];

export const mockChartData = [
  { name: 'Mon', score: 82 },
  { name: 'Tue', score: 84 },
  { name: 'Wed', score: 83 },
  { name: 'Thu', score: 88 },
  { name: 'Fri', score: 91 },
  { name: 'Sat', score: 91 },
  { name: 'Sun', score: 94 },
];

