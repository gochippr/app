/**
 * Mock Data Configuration
 * 
 * Set USE_MOCK_DATA to true to use mock data instead of real API calls.
 * This is useful for development and testing without a backend.
 * 
 * Can be configured via environment variable or directly here.
 */

export const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true" || true;

// Simulated network delay (ms) - makes the mock feel more realistic
export const MOCK_DELAY = 500;

export const simulateDelay = () => 
  new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

