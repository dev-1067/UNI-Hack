import { apiClient } from '../apiClient';

// Clear any previous mock store from localStorage immediately
const STORE_KEY = 'nexora_mock_store';
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORE_KEY);
  }
} catch (e) {
  // Ignore localStorage errors
}

// Subscribers for reactive store updates
const storeListeners = new Set();

let store = {
  products: [],
  activities: [],
  reports: [],
  chartData: [],
  integrations: [],
  qualityIssues: [],
  user: { name: 'User', email: 'user@nexora.ai' }
};

const notifySubscribers = () => {
  storeListeners.forEach(listener => {
    try {
      listener(store);
    } catch (err) {
      console.error("Error in store subscriber", err);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexora_store_updated', { detail: store }));
  }
};

export const mockApi = {
  // STORE SUBSCRIPTION FOR REACTIVITY
  subscribe: (listener) => {
    storeListeners.add(listener);
    return () => storeListeners.delete(listener);
  },
  getStore: () => ({ ...store }),

  // PRODUCTS (FastAPI -> Supabase PostgreSQL)
  getProducts: async (params = {}) => {
    const remoteProds = await apiClient.getProducts(params);
    store.products = remoteProds || [];
    return store.products;
  },
  
  getProductById: async (id) => {
    const remoteProd = await apiClient.getProductById(id);
    return remoteProd;
  },
  
  createProduct: async (data) => {
    const created = await apiClient.createProduct(data);
    notifySubscribers();
    return { success: true, product: created };
  },
  
  updateProduct: async (id, data) => {
    const updated = await apiClient.updateProduct(id, data);
    notifySubscribers();
    return { success: true, product: updated };
  },
  
  deleteProduct: async (id) => {
    const res = await apiClient.deleteProduct(id);
    notifySubscribers();
    return { success: true, ...res };
  },

  // ACTIVITIES (FastAPI -> Supabase PostgreSQL)
  getActivities: async (params = { limit: 50 }) => {
    const remoteLogs = await apiClient.getActivityLogs(params);
    store.activities = remoteLogs || [];
    return store.activities;
  },

  createActivity: async (action, details) => {
    try {
      await apiClient.createActivityLog({
        action,
        target: details,
        metadata: { target: details }
      });
      notifySubscribers();
    } catch (e) {
      // Non-blocking
    }
  },

  // REPORTS (FastAPI -> Supabase PostgreSQL)
  getReports: async () => {
    const remoteData = await apiClient.getReports();
    store.reports = remoteData?.reports || [];
    store.chartData = remoteData?.chartData || [];
    return { reports: store.reports, chartData: store.chartData };
  },

  addReportEntry: async (entry) => {
    notifySubscribers();
    return entry;
  },

  exportReportCsv: (reportType = "catalog", dateRange = "30d") => {
    return apiClient.exportReportCsv(reportType, dateRange);
  },

  // INTEGRATIONS (FastAPI -> Supabase PostgreSQL)
  getIntegrations: async () => {
    const remoteList = await apiClient.getIntegrations();
    store.integrations = remoteList || [];
    return store.integrations;
  },

  connectIntegration: async (id) => {
    const res = await apiClient.connectIntegration(id);
    notifySubscribers();
    return res;
  },

  disconnectIntegration: async (id) => {
    const res = await apiClient.disconnectIntegration(id);
    notifySubscribers();
    return res;
  },

  syncIntegration: async (id, fail = false) => {
    const res = await apiClient.syncIntegration(id, fail);
    notifySubscribers();
    return res;
  },

  // DATA QUALITY (FastAPI -> Supabase PostgreSQL)
  getQualityIssues: async (params = {}) => {
    const remoteIssues = await apiClient.getQualityIssues(params);
    store.qualityIssues = remoteIssues || [];
    return store.qualityIssues;
  },

  fixQualityIssue: async (id, resolvedData = {}) => {
    let result;
    if (id === 'all') {
      result = await apiClient.fixQualityIssueAI('all');
    } else {
      result = await apiClient.fixQualityIssueManual(id, resolvedData);
    }
    notifySubscribers();
    return result;
  },

  // USER PROFILE
  getUser: async () => {
    try {
      const user = await apiClient.getCurrentUser();
      if (user) {
        store.user = user;
        return user;
      }
    } catch (e) {
      // Fallback
    }
    return store.user;
  },
  
  updateUser: async (data) => {
    store.user = { ...store.user, ...data };
    notifySubscribers();
    return { success: true };
  },
  
  // AI ENRICHMENT (FastAPI -> Supabase PostgreSQL)
  getEnrichmentCandidates: async () => {
    return await apiClient.getEnrichmentCandidates();
  },

  runEnrichment: async (productId, options = {}) => {
    const tone = options.tone || 'Professional';
    const language = options.language || 'English';
    const channel = options.channel || 'Shopify';

    const remoteResult = await apiClient.generateEnrichment({
      productId,
      tone,
      language,
      channel
    });

    return {
      description: remoteResult.description,
      seoTitle: remoteResult.title || `${productId} - ${tone} ${channel} Listing`,
      seoDescription: (remoteResult.description || '').slice(0, 160) + "...",
      bullets: remoteResult.bullets || [],
      attributes: remoteResult.attributes || {},
      features: "High-durability structural body, ergonomic profile, multi-channel optimized",
      tags: remoteResult.seoTags ? remoteResult.seoTags.join(", ") : `${tone.toLowerCase()}, ${language.toLowerCase()}`,
      tone,
      language,
      qualityScore: remoteResult.qualityScore || 96
    };
  },

  saveEnrichment: async (productIds, options = {}) => {
    if (Array.isArray(productIds)) {
      for (const id of productIds) {
        await apiClient.approveEnrichment(id);
      }
    } else if (productIds) {
      await apiClient.approveEnrichment(productIds);
    }
    notifySubscribers();
    return { success: true };
  },

  // DASHBOARD & DYNAMIC METRICS (FastAPI -> Supabase PostgreSQL)
  getDashboardMetrics: async () => {
    const remoteMetrics = await apiClient.getDashboardMetrics();
    return remoteMetrics || {
      totalProducts: 0,
      activeProducts: 0,
      reviewProducts: 0,
      draftProducts: 0,
      avgQuality: 0,
      enrichedCount: 0,
      pendingEnrichment: 0,
      issuesCount: 0,
      highSeverityIssues: 0,
      connectedIntegrations: 0,
      channelsCount: 0
    };
  },

  getDashboardChartData: async () => {
    const remoteChart = await apiClient.getDashboardChartData();
    return remoteChart || [];
  },

  getProductsNeedingAttention: async () => {
    const remoteAttention = await apiClient.getProductsNeedingAttention();
    return remoteAttention || [];
  },

  // CATALOG EXTRACTION PIPELINE
  processCatalog: async (fileOrData) => {
    if (fileOrData instanceof File) {
      return await apiClient.processDocumentFile(fileOrData);
    }
    return await apiClient.processProductData(fileOrData);
  }
};

export default mockApi;
