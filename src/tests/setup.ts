import { vi } from "vitest";

// ── IntersectionObserver ─────────────────────────────────────────────────────
global.IntersectionObserver = vi.fn().mockImplementation(function (
  callback: IntersectionObserverCallback,
) {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    _callback: callback, // expose for tests that need to trigger entries
  };
});

// ── ResizeObserver ───────────────────────────────────────────────────────────
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── window.scrollTo ──────────────────────────────────────────────────────────
vi.stubGlobal("scrollTo", vi.fn());

// ── matchMedia ───────────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

// ── Silence GSAP registration warnings in test output ────────────────────────
vi.spyOn(console, "warn").mockImplementation(() => undefined);
