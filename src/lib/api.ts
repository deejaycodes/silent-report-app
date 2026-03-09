// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Service
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Report endpoints
  async createReport(data: {
    incident_type: string;
    description: string;
    location?: string;
    files?: File[];
  }) {
    const formData = new FormData();
    formData.append('incident_type', data.incident_type);
    formData.append('description', data.description);
    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${this.baseUrl}/reports/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create report');
    }

    return await response.json();
  }

  async getReportStatus(reportId: string) {
    return this.request(`/reports/${reportId}`, {
      method: 'GET',
    });
  }

  async getAllReports() {
    return this.request('/reports', {
      method: 'GET',
    });
  }

  // AI Chatbot endpoints
  async askChatbot(message: string): Promise<{ response: string }> {
    return this.request('/questions/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // NGO endpoints
  async getNearbyNGOs(params: {
    lat: number;
    lng: number;
    radius?: number;
  }) {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
      radius: (params.radius || 10).toString(),
    });

    return this.request(`/ngo/nearby?${queryParams}`, {
      method: 'GET',
    });
  }

  // SOS Alert
  async triggerSOSAlert(data: {
    latitude: number;
    longitude: number;
    message?: string;
  }) {
    return this.request('/sos/alert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
