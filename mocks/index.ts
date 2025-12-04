/**
 * Mock System Entry Point
 * 
 * Re-exports everything from the mock system for easy imports.
 */

export { USE_MOCK_DATA, MOCK_DELAY, simulateDelay } from "./config";
export { MockAuthProvider, useMockAuth } from "./mockAuth";
export * from "./data";
export * from "./mockState";

