import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

// Automatic Bearer token injection
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('nexora_token') || localStorage.getItem('nexora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiClient = {
  /**
   * Check if FastAPI backend is healthy and reachable
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health', { timeout: 3000 });
      return response.status === 200 && response.data?.status === 'healthy';
    } catch (error) {
      return false;
    }
  },

  // --- AUTHENTICATION API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * User login with email & password
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data?.data?.access_token) {
      sessionStorage.setItem('nexora_token', response.data.data.access_token);
      sessionStorage.setItem('nexora_auth', 'true');
    }
    return response.data;
  },

  /**
   * User registration with name, email, password
   */
  signup: async (name, email, password, company = "NEXORA Industrial Corp") => {
    const response = await api.post('/api/auth/signup', { name, email, password, company });
    if (response.data?.data?.access_token) {
      sessionStorage.setItem('nexora_token', response.data.data.access_token);
      sessionStorage.setItem('nexora_auth', 'true');
    }
    return response.data;
  },


  /**
   * Fetch authenticated user profile
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data?.data;
  },

  /**
   * User logout & invalidate token
   */
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    sessionStorage.removeItem('nexora_token');
    sessionStorage.removeItem('nexora_auth');
    localStorage.removeItem('nexora_token');
    return true;
  },

  // --- PRODUCTS API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch all products with optional filters (category, status, search)
   */
  getProducts: async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data?.data || [];
  },

  /**
   * Fetch single product by ID or SKU
   */
  getProductById: async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data?.data;
  },

  /**
   * Create a new product in Supabase PostgreSQL
   */
  createProduct: async (productData) => {
    const payload = {
      name: productData.name,
      sku: productData.sku,
      category: productData.category || "General",
      brand: productData.brand || "NEXORA",
      description: productData.description || "",
      price: productData.price || "$0.00",
      stock: productData.stock !== undefined ? parseInt(productData.stock) : 100,
      quality: productData.quality !== undefined ? parseInt(productData.quality) : 75,
      status: productData.status || "Active",
      attributes: productData.attributes || {}
    };
    const response = await api.post('/api/products', payload);
    return response.data?.data;
  },

  /**
   * Update an existing product
   */
  updateProduct: async (productId, updateData) => {
    const response = await api.put(`/api/products/${productId}`, updateData);
    return response.data?.data;
  },

  /**
   * Delete a product by ID or SKU
   */
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data?.data;
  },

  // --- DATA QUALITY API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch all catalog data quality issues
   */
  getQualityIssues: async (params = {}) => {
    const response = await api.get('/api/quality', { params });
    return response.data?.data || [];
  },

  /**
   * Fetch single quality issue by ID
   */
  getQualityIssueById: async (issueId) => {
    const response = await api.get(`/api/quality/${issueId}`);
    return response.data?.data;
  },

  /**
   * Resolve a quality issue with a manual standard value
   */
  fixQualityIssueManual: async (issueId, payload) => {
    const response = await api.post(`/api/quality/${issueId}/fix`, {
      attribute: payload.attribute || "specification",
      value: payload.value || "",
      apply_to_all_similar: payload.apply_to_all_similar || false
    });
    return response.data?.data;
  },

  /**
   * Auto-resolve quality issue using AI normalization
   */
  fixQualityIssueAI: async (issueId = "all") => {
    const response = await api.post(`/api/quality/${issueId}/fix-ai`);
    return response.data?.data;
  },

  // --- AI ENRICHMENT API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch products candidate list for enrichment
   */
  getEnrichmentCandidates: async () => {
    const response = await api.get('/api/enrichment');
    return response.data?.data || [];
  },

  /**
   * Generate tailored marketing copy, bullets, and SEO metadata
   */
  generateEnrichment: async (payload) => {
    const response = await api.post('/api/enrichment/generate', {
      productId: payload.productId,
      tone: payload.tone || "Professional",
      language: payload.language || "English",
      channel: payload.channel || "Shopify"
    });
    return response.data?.data;
  },

  /**
   * Accept and commit AI enrichment to product catalog in Supabase
   */
  approveEnrichment: async (enrichmentIdOrProductId) => {
    const response = await api.post(`/api/enrichment/${enrichmentIdOrProductId}/approve`);
    return response.data?.data;
  },

  /**
   * Reject AI enrichment draft
   */
  rejectEnrichment: async (enrichmentIdOrProductId) => {
    const response = await api.post(`/api/enrichment/${enrichmentIdOrProductId}/reject`);
    return response.data?.data;
  },

  // --- INTEGRATIONS API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch all configured sales channels
   */
  getIntegrations: async () => {
    const response = await api.get('/api/integrations');
    return response.data?.data || [];
  },

  /**
   * Connect a sales channel integration
   */
  connectIntegration: async (channel) => {
    const response = await api.post(`/api/integrations/${channel}/connect`);
    return response.data?.data;
  },

  /**
   * Disconnect a sales channel integration
   */
  disconnectIntegration: async (channel) => {
    const response = await api.post(`/api/integrations/${channel}/disconnect`);
    return response.data?.data;
  },

  /**
   * Trigger catalog synchronization for a sales channel
   */
  syncIntegration: async (channel, fail = false) => {
    const response = await api.post(`/api/integrations/${channel}/sync`, null, {
      params: { fail }
    });
    return response.data?.data;
  },

  // --- REPORTS API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch all reports and chart statistics from Supabase
   */
  getReports: async () => {
    const response = await api.get('/api/reports');
    return response.data?.data || { reports: [], chartData: [] };
  },

  /**
   * Fetch live statistics and report breakdown by ID
   */
  getReportById: async (reportId) => {
    const response = await api.get(`/api/reports/${reportId}`);
    return response.data?.data;
  },

  /**
   * Download live database-backed CSV export
   */
  exportReportCsv: async (reportType = "catalog", dateRange = "30d") => {
    const response = await api.post('/api/reports/export', {
      reportType,
      dateRange,
      format: "csv"
    }, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `nexora_${reportType.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { success: true, filename };
  },

  // --- DASHBOARD API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch live catalog KPIs from Supabase
   */
  getDashboardMetrics: async () => {
    const response = await api.get('/api/dashboard');
    return response.data?.data;
  },

  /**
   * Fetch 7-day rolling data health chart points
   */
  getDashboardChartData: async () => {
    const response = await api.get('/api/dashboard/chart');
    return response.data?.data || [];
  },

  /**
   * Fetch lowest quality items needing review
   */
  getProductsNeedingAttention: async () => {
    const response = await api.get('/api/dashboard/attention');
    return response.data?.data || [];
  },

  // --- ACTIVITY API (FastAPI -> Supabase PostgreSQL) ---

  /**
   * Fetch live audit trail activity logs
   */
  getActivityLogs: async (params = {}) => {
    const response = await api.get('/api/activity', { params });
    return response.data?.data || [];
  },

  /**
   * Record a new audit activity event in Supabase
   */
  createActivityLog: async (payload) => {
    const response = await api.post('/api/activity', payload);
    return response.data?.data;
  },

  // --- CATALOG AI PROCESSING (FastAPI Pipeline) ---

  /**
   * Upload document file directly to FastAPI for AI extraction
   */
  processDocumentFile: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.mfg_part_num) formData.append('mfg_part_num', metadata.mfg_part_num);
    if (metadata.part_desc) formData.append('part_desc', metadata.part_desc);
    if (metadata.part_manuf) formData.append('part_manuf', metadata.part_manuf);

    const response = await api.post('/api/process-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Process product specs directly via JSON
   */
  processProductData: async (payload) => {
    const response = await api.post('/api/process', payload);
    return response.data;
  }
};

export default apiClient;
