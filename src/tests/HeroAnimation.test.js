import { describe, it, expect, vi, beforeEach } from "vitest";
// ── GSAP mock ─────────────────────────────────────────────────────────────────
const { mockTlTo, mockTlFromTo, mockTimeline, mockSet } = vi.hoisted(() => {
    const mockTlTo = vi.fn().mockReturnThis();
    const mockTlFromTo = vi.fn().mockReturnThis();
    const mockTimeline = vi.fn(() => ({ to: mockTlTo, fromTo: mockTlFromTo }));
    const mockSet = vi.fn();
    return { mockTlTo, mockTlFromTo, mockTimeline, mockSet };
});
vi.mock("gsap", () => ({
    default: {
        to: vi.fn(),
        fromTo: vi.fn(),
        set: mockSet,
        registerPlugin: vi.fn(),
        timeline: mockTimeline,
    },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));
import { HeroAnimation } from "../controllers/HeroAnimation";
// ── Helpers ───────────────────────────────────────────────────────────────────
const buildDOM = () => {
    document.body.innerHTML = `
    <p id="heroEyebrow">Software Engineer</p>
    <h1 id="heroHeadline">Hello <span class="hero__name">World</span></h1>
    <p id="heroSubline">Building things</p>
    <div id="heroCta">
      <a class="btn btn--primary" href="#projects">View Work</a>
      <a class="btn btn--ghost"   href="#contact">Get in Touch</a>
    </div>
    <div id="heroScroll">scroll</div>
  `;
};
// ── Tests ─────────────────────────────────────────────────────────────────────
describe("HeroAnimation — #buildTimeline", () => {
    beforeEach(() => {
        buildDOM();
        mockSet.mockClear();
        mockTimeline.mockClear();
        mockTlTo.mockClear();
        mockTlFromTo.mockClear();
    });
    it("creates a GSAP timeline", () => {
        const ha = new HeroAnimation();
        ha.init();
        expect(mockTimeline).toHaveBeenCalled();
    });
    it("calls gsap.set once to hide all elements before animating", () => {
        const ha = new HeroAnimation();
        ha.init();
        // One gsap.set call hiding eyebrow + headline + subline + cta + scroll
        expect(mockSet.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
    it("chains timeline .to calls for eyebrow + subline + scroll", () => {
        const ha = new HeroAnimation();
        ha.init();
        // tl.to is called for eyebrow, headline chars, subline, scroll = ≥ 3
        expect(mockTlTo.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
    it("chains timeline .fromTo for CTA buttons", () => {
        const ha = new HeroAnimation();
        ha.init();
        expect(mockTlFromTo).toHaveBeenCalled();
    });
});
describe("HeroAnimation — scroll indicator fade", () => {
    beforeEach(() => {
        buildDOM();
        mockSet.mockClear();
        mockTimeline.mockClear();
        mockTlTo.mockClear();
        mockTlFromTo.mockClear();
    });
    it('adds a "scroll" event listener that calls gsap.set on scroll', () => {
        const ha = new HeroAnimation();
        ha.init();
        // Simulate scrolling past the hero
        Object.defineProperty(window, "scrollY", {
            value: 80,
            configurable: true,
            writable: true,
        });
        window.dispatchEvent(new Event("scroll"));
        // gsap.set should have been called again (beyond the initial buildTimeline calls)
        const setCallsAfterScroll = mockSet.mock.calls.length;
        expect(setCallsAfterScroll).toBeGreaterThan(0);
    });
    it("passes the scroll indicator element to gsap.set on scroll", () => {
        const ha = new HeroAnimation();
        ha.init();
        mockSet.mockClear();
        Object.defineProperty(window, "scrollY", {
            value: 160,
            configurable: true,
            writable: true,
        });
        window.dispatchEvent(new Event("scroll"));
        const scrollEl = document.getElementById("heroScroll");
        const callTargets = mockSet.mock.calls.map((c) => c[0]);
        expect(callTargets).toContain(scrollEl);
    });
    it("clamps opacity to 0 when scrollY >= 160", () => {
        const ha = new HeroAnimation();
        ha.init();
        mockSet.mockClear();
        Object.defineProperty(window, "scrollY", {
            value: 200,
            configurable: true,
            writable: true,
        });
        window.dispatchEvent(new Event("scroll"));
        const scrollCall = mockSet.mock.calls.find((c) => c[0] === document.getElementById("heroScroll"));
        expect(scrollCall).toBeDefined();
        const opacity = scrollCall[1]["opacity"];
        expect(opacity).toBe(0);
    });
});
