// Use environment variable for API base URL, fallback to localhost for local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Debug: Log the API base URL (only in browser, not during SSR)
if (typeof window !== 'undefined') {
    console.log('API Base URL:', API_BASE_URL);
    console.log('Environment variable NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

export async function fetchProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return response.json();
}

export async function fetchProjectStats() {
    // Mocking stats for now or fetching if endpoint exists
    return {
        total: 24,
        ended: 10,
        running: 12,
        pending: 2
    };
}
