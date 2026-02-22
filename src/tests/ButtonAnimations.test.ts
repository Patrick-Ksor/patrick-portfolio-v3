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

import { ButtonAnimations } from "../controllers/ButtonAnimations";

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildDOM = () => {
  document.body.innerHTML = `
    <a  class="btn btn--primary" id="btn1">Primary</a>
    <button class="btn btn--ghost" id="btn2">Ghost</button>
  `;
};

const fire = (id: string, type: string) =>
  document
    .getElementById(id)!
    .dispatchEvent(new MouseEvent(type, { bubbles: true }));

/** Return target element of the nth gsap.to call. */
const targetOf = (call: number) => mockGsapTo.mock.calls[call]?.[0];

/** Return tween vars of the nth gsap.to call. */
const varsOf = (call: number): Record<string, unknown> =>
  mockGsapTo.mock.calls[call]?.[1] as Record<string, unknown>;

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ButtonAnimations", () => {
  beforeEach(() => {
    buildDOM();
    mockGsapTo.mockClear();
  });

  it("scales UP on mouseenter", () => {
    const ba = new ButtonAnimations();
    ba.init();

    fire("btn1", "mouseenter");

    const vars = varsOf(0);
    expect(vars["scale"]).toBeGreaterThan(1);
  });

  it("restores scale to 1 on mouseleave", () => {
    const ba = new ButtonAnimations();
    ba.init();

    fire("btn1", "mouseleave");

    const vars = varsOf(0);
    expect(vars["scale"]).toBe(1);
  });

  it("scales DOWN below 1 on mousedown", () => {
    const ba = new ButtonAnimations();
    ba.init();

    fire("btn1", "mousedown");

    const vars = varsOf(0);
    expect(vars["scale"]).toBeLessThan(1);
  });

  it("scales UP again on mouseup", () => {
    const ba = new ButtonAnimations();
    ba.init();

    fire("btn1", "mouseup");

    const vars = varsOf(0);
    expect(vars["scale"]).toBeGreaterThan(1);
  });

  it("applies animations to every .btn element", () => {
    const ba = new ButtonAnimations();
    ba.init();

    // Fire mouseenter on both buttons
    fire("btn1", "mouseenter");
    fire("btn2", "mouseenter");

    // Two calls — one per button
    expect(mockGsapTo).toHaveBeenCalledTimes(2);
    expect(targetOf(0)).toBe(document.getElementById("btn1"));
    expect(targetOf(1)).toBe(document.getElementById("btn2"));
  });

  it("passes the button element as first arg to gsap.to", () => {
    const ba = new ButtonAnimations();
    ba.init();

    fire("btn1", "mouseenter");

    expect(targetOf(0)).toBe(document.getElementById("btn1"));
  });

  it("always specifies a duration in the tween vars", () => {
    const ba = new ButtonAnimations();
    ba.init();

    ["mouseenter", "mouseleave", "mousedown", "mouseup"].forEach((type) => {
      mockGsapTo.mockClear();
      fire("btn1", type);
      expect(varsOf(0)["duration"]).toBeTypeOf("number");
    });
  });
});
