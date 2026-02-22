import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGsapTo } = vi.hoisted(() => ({ mockGsapTo: vi.fn() }));

vi.mock("gsap", () => ({
  default: {
    to: mockGsapTo,
    fromTo: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));

import { BlobAnimation } from "../controllers/BlobAnimation";

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildDOM = () => {
  document.body.innerHTML = `
    <div class="hero__blob hero__blob--1"></div>
    <div class="hero__blob hero__blob--2"></div>
    <div class="hero__blob hero__blob--3"></div>
  `;
};

const allVars = (): Array<Record<string, unknown>> =>
  mockGsapTo.mock.calls.map((c) => c[1] as Record<string, unknown>);

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("BlobAnimation", () => {
  beforeEach(() => {
    buildDOM();
    mockGsapTo.mockClear();
  });

  it("calls gsap.to twice per blob (float + rotation) — 6 calls total for 3 blobs", () => {
    const ba = new BlobAnimation();
    ba.init();

    expect(mockGsapTo).toHaveBeenCalledTimes(6);
  });

  it("passes a blob element as first argument for every call", () => {
    const ba = new BlobAnimation();
    ba.init();

    const blobEls = Array.from(document.querySelectorAll(".hero__blob"));

    mockGsapTo.mock.calls.forEach(([target]) => {
      expect(blobEls).toContain(target);
    });
  });

  it("all blob tweens loop infinitely (repeat: -1)", () => {
    const ba = new BlobAnimation();
    ba.init();

    allVars().forEach((vars) => {
      expect(vars["repeat"]).toBe(-1);
    });
  });

  it("all blob tweens use yoyo: true", () => {
    const ba = new BlobAnimation();
    ba.init();

    allVars().forEach((vars) => {
      expect(vars["yoyo"]).toBe(true);
    });
  });

  it("float tweens contain positional or scale properties", () => {
    const ba = new BlobAnimation();
    ba.init();

    const vars = allVars();
    const hasPositionalOrScale = vars.some(
      (v) => "x" in v || "y" in v || "scale" in v,
    );
    expect(hasPositionalOrScale).toBe(true);
  });

  it("rotation tweens contain a rotation property", () => {
    const ba = new BlobAnimation();
    ba.init();

    const vars = allVars();
    const hasRotation = vars.some((v) => "rotation" in v);
    expect(hasRotation).toBe(true);
  });

  it("does nothing when no blob elements exist in the DOM", () => {
    document.body.innerHTML = "";
    const ba = new BlobAnimation();
    ba.init();

    expect(mockGsapTo).not.toHaveBeenCalled();
  });

  it("staggers each blob with an increasing delay", () => {
    const ba = new BlobAnimation();
    ba.init();

    const calls = mockGsapTo.mock.calls;
    // Group calls by blob index (calls 0-1 → blob 0, calls 2-3 → blob 1, calls 4-5 → blob 2)
    const delayBlob0 =
      ((calls[0][1] as Record<string, unknown>)["delay"] as number) ?? 0;
    const delayBlob1 =
      ((calls[2][1] as Record<string, unknown>)["delay"] as number) ?? 0;
    const delayBlob2 =
      ((calls[4][1] as Record<string, unknown>)["delay"] as number) ?? 0;

    expect(delayBlob1).toBeGreaterThanOrEqual(delayBlob0);
    expect(delayBlob2).toBeGreaterThanOrEqual(delayBlob1);
  });
});
