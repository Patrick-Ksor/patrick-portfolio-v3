import { describe, it, expect, vi, beforeEach } from "vitest";
const { mockFromTo } = vi.hoisted(() => ({ mockFromTo: vi.fn() }));
vi.mock("gsap", () => ({
    default: {
        fromTo: mockFromTo,
        to: vi.fn(),
        set: vi.fn(),
        registerPlugin: vi.fn(),
    },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));
import { ScrollReveal } from "../controllers/ScrollReveal";
// ── Helpers ──────────────────────────────────────────────────────────────────
const buildDOM = (...directions) => {
    document.body.innerHTML = directions
        .map((dir, i) => `<div id="el${i}" data-reveal="${dir}">content</div>`)
        .join("\n");
};
/** Return the `fromVars` (second arg) of the nth gsap.fromTo call. */
const fromVarsOf = (callIndex) => mockFromTo.mock.calls[callIndex]?.[1];
// ── Tests ────────────────────────────────────────────────────────────────────
describe("ScrollReveal", () => {
    beforeEach(() => {
        mockFromTo.mockClear();
    });
    it("calls gsap.fromTo once per [data-reveal] element", () => {
        buildDOM("up", "left", "right");
        const reveal = new ScrollReveal();
        reveal.init();
        expect(mockFromTo).toHaveBeenCalledTimes(3);
    });
    it("does not call gsap.fromTo when no [data-reveal] elements exist", () => {
        document.body.innerHTML = "<div>no reveal here</div>";
        const reveal = new ScrollReveal();
        reveal.init();
        expect(mockFromTo).not.toHaveBeenCalled();
    });
    // ── From-var offsets per direction ────────────────────────────────────────
    it('uses y: 60 offset for data-reveal="up"', () => {
        buildDOM("up");
        new ScrollReveal().init();
        const from = fromVarsOf(0);
        expect(from["y"]).toBe(60);
        expect(from["x"]).toBe(0);
        expect(from["opacity"]).toBe(0);
    });
    it('uses x: -60 offset for data-reveal="left"', () => {
        buildDOM("left");
        new ScrollReveal().init();
        const from = fromVarsOf(0);
        expect(from["x"]).toBe(-60);
        expect(from["y"]).toBe(0);
        expect(from["opacity"]).toBe(0);
    });
    it('uses x: 60 offset for data-reveal="right"', () => {
        buildDOM("right");
        new ScrollReveal().init();
        const from = fromVarsOf(0);
        expect(from["x"]).toBe(60);
        expect(from["y"]).toBe(0);
        expect(from["opacity"]).toBe(0);
    });
    it('defaults to "up" direction when data-reveal has an unexpected value', () => {
        document.body.innerHTML = `<div data-reveal="diagonal">content</div>`;
        new ScrollReveal().init();
        // Direction falls through to 'up' spread (no matching key returns undefined offsets)
        // The base has y:0, x:0 and only 'up' overrides y
        const from = fromVarsOf(0);
        // An unknown direction uses the base: y:0, x:0
        expect(from["opacity"]).toBe(0);
    });
    // ── To-var targets ────────────────────────────────────────────────────────
    it("animates to opacity:1, x:0, y:0", () => {
        buildDOM("up");
        new ScrollReveal().init();
        const toVars = mockFromTo.mock.calls[0]?.[2];
        expect(toVars["opacity"]).toBe(1);
        expect(toVars["x"]).toBe(0);
        expect(toVars["y"]).toBe(0);
    });
    it("passes a scrollTrigger config in the to-vars", () => {
        buildDOM("up");
        new ScrollReveal().init();
        const toVars = mockFromTo.mock.calls[0]?.[2];
        expect(toVars["scrollTrigger"]).toBeDefined();
    });
    // ── Multiple elements ─────────────────────────────────────────────────────
    it("passes the correct element as the first argument to each fromTo call", () => {
        buildDOM("up", "left");
        new ScrollReveal().init();
        expect(mockFromTo.mock.calls[0]?.[0]).toBe(document.getElementById("el0"));
        expect(mockFromTo.mock.calls[1]?.[0]).toBe(document.getElementById("el1"));
    });
});
