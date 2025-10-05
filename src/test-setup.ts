import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock fetch globally to prevent network calls
global.fetch = vi.fn();

// Cleanup after each test
afterEach(() => {
  cleanup();
});
