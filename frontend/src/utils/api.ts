// API utility functions for Xolak backend integration

export interface Repository {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  difficulty: string;
  good_first_issues: {
    title: string;
    url: string;
  }[];
}

export interface QueryResponse {
  recommendations: Repository[];
  message: string;
  agent_id?: string;
}

// Use relative path or detect the correct API URL
const getApiBaseUrl = () => {
  // In development, try localhost:8080, in production use relative paths
  if (typeof window !== 'undefined') {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      return 'http://localhost:8080';
    }
  }
  return ''; // Use relative path for production
};

const API_BASE_URL = getApiBaseUrl();

export const queryAgent = async (query: string): Promise<QueryResponse> => {
  const apiUrl = '/api/query-agent';
  console.log('🚀 Making API request to:', apiUrl);
  console.log('📝 Query:', query);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response data:', data);
    return data;
  } catch (error) {
    console.error('💥 Error querying agent:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please make sure it is running on port 8080.');
      }
    }
    
    throw error;
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    console.log('🏥 Checking backend health at: /api/health');
    
    const response = await fetch('/api/health', {
      method: 'GET',
    });
    
    console.log('🏥 Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('💔 Backend health check failed:', error);
    return false;
  }
};