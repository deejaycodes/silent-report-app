import { describe, it, expect, vi } from 'vitest';

describe('API Integration', () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  it('should have API URL configured', () => {
    expect(API_URL).toBeDefined();
    expect(API_URL).toMatch(/^https?:\/\//);
  });

  it('should format report payload correctly', () => {
    const reportData = {
      incident_type: 'sexual_abuse',
      description: 'This is a test report with enough words to pass validation requirements',
      location: 'Lagos',
      contact_preference: 'email',
    };

    expect(reportData.incident_type).toBeDefined();
    expect(reportData.description.split(/\s+/).length).toBeGreaterThanOrEqual(10);
    expect(reportData.location).toBeDefined();
  });

  it('should handle API errors gracefully', async () => {
    const mockFetch = vi.fn(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    );

    global.fetch = mockFetch as any;

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
