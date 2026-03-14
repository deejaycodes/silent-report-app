// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Service
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(extra: HeadersInit = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extra as Record<string, string>,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(options.headers as Record<string, string>),
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  }

  // Report endpoints
  async createReport(data: {
    incident_type: string;
    description: string;
    location?: string;
    address?: string;
    contact_info?: string;
    files?: File[];
  }) {
    const formData = new FormData();
    formData.append('incident_type', data.incident_type);
    formData.append('description', data.description);
    if (data.location) formData.append('location', data.location);
    if (data.address) formData.append('address', data.address);
    if (data.contact_info) formData.append('contact_info', data.contact_info);
    if (data.files) data.files.forEach(file => formData.append('files', file));

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/reports`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || 'Failed to create report');
    }

    return await response.json();
  }

  async getReportStatus(reportId: string) {
    return this.request(`/reports/${reportId}`, { method: 'GET' });
  }

  async trackReport(reportId: string) {
    return this.request<{
      id: string; status: string; incident_type: string;
      created_at: string; updated_at: string;
      messages: Array<{ id: string; content: string; type: string; createdAt: string }>;
    }>(`/track/${reportId}`, { method: 'GET' });
  }

  async sendTrackingMessage(reportId: string, content: string) {
    return this.request(`/track/${reportId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getAllReports() {
    return this.request('/reports', { method: 'GET' });
  }

  // AI Chatbot endpoints
  async askChatbot(message: string): Promise<{ response: string }> {
    return this.request('/questions/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // NGO endpoints
  async getNearbyNGOs(params: { lat: number; lng: number; radius?: number }) {
    const queryParams = new URLSearchParams({
      query: `${params.lat},${params.lng}`,
    });
    return this.request(`/ngo/search?${queryParams}`, { method: 'GET' });
  }

  // SOS Alert
  async triggerSOSAlert(data: {
    latitude: number;
    longitude: number;
    message?: string;
  }) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify({
        incident_type: 'SOS Emergency',
        description: data.message || `SOS Alert at ${data.latitude},${data.longitude}`,
        location: `${data.latitude},${data.longitude}`,
      }),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
