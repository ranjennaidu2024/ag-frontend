const API_BASE_URL = 'http://localhost:8080/api';

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
