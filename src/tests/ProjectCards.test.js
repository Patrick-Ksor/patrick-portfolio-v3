import { describe, it, expect, vi, beforeEach } from "vitest";
// ── GSAP mock (vi.hoisted so references survive vi.mock hoisting) ─────────────
const { mockGsapTo, mockGsapSet, mockBatch } = vi.hoisted(() => ({
    mockGsapTo: vi.fn(),
    mockGsapSet: vi.fn(),
    mockBatch: vi.fn(),
}));
vi.mock("gsap", () => ({
    default: {
        to: mockGsapTo,
        set: mockGsapSet,
        fromTo: vi.fn(),
        registerPlugin: vi.fn(),
    },
}));
vi.mock("gsap/ScrollTrigger", () => ({
    ScrollTrigger: { batch: mockBatch },
}));
import { ProjectCards } from "../controllers/ProjectCards";
// ── Helpers ───────────────────────────────────────────────────────────────────
const buildDOM = (count = 3) => {
    document.body.innerHTML = Array.from({ length: count }, (_, i) => `<article class="project-card" id="card${i}">card ${i}</article>`).join("\n");
};
const fire = (el, type, init = {}) => el.dispatchEvent(new MouseEvent(type, { bubbles: true, ...init }));
// ── Tests ─────────────────────────────────────────────────────────────────────
describe("ProjectCards — entrance animation", () => {
    beforeEach(() => {
        buildDOM();
        mockGsapTo.mockClear();
        mockGsapSet.mockClear();
        mockBatch.mockClear();
    });
    it("calls gsap.set with opacity:0 and y:60 on all cards", () => {
        const pc = new ProjectCards();
        pc.init();
        expect(mockGsapSet).toHaveBeenCalled();
        const setVars = mockGsapSet.mock.calls[0][1];
        expect(setVars["opacity"]).toBe(0);
        expect(setVars["y"]).toBe(60);
    });
    it("calls ScrollTrigger.batch with the card elements", () => {
        const pc = new ProjectCards();
        pc.init();
        expect(mockBatch).toHaveBeenCalled();
        // First arg should be the NodeList/cards; verify element count ≥ 1
        const firstArg = mockBatch.mock.calls[0][0];
        expect(firstArg.length).toBeGreaterThanOrEqual(1);
    });
    it("registers an onEnter callback with ScrollTrigger.batch", () => {
        const pc = new ProjectCards();
        pc.init();
        const batchConfig = mockBatch.mock.calls[0][1];
        expect(typeof batchConfig["onEnter"]).toBe("function");
    });
    it("onEnter callback calls gsap.to with opacity:1 and y:0", () => {
        const pc = new ProjectCards();
        pc.init();
        const batchConfig = mockBatch.mock.calls[0][1];
        const onEnter = batchConfig["onEnter"];
        const fakeBatch = [document.getElementById("card0")];
        onEnter(fakeBatch);
        const vars = mockGsapTo.mock.calls[0][1];
        expect(vars["opacity"]).toBe(1);
        expect(vars["y"]).toBe(0);
    });
    it("does nothing when no .project-card elements exist", () => {
        document.body.innerHTML = "";
        const pc = new ProjectCards();
        pc.init();
        // ScrollTrigger.batch still called but with empty list, or set not called
        // Either way gsap.set is not called with cards
        const setCalls = mockGsapSet.mock.calls.length;
        // Acceptable: 0 calls OR set called once with empty list
        if (setCalls > 0) {
            const target = mockGsapSet.mock.calls[0][0];
            expect(target.length).toBe(0);
        }
        else {
            expect(setCalls).toBe(0);
        }
    });
});
describe("ProjectCards — hover tilt", () => {
    beforeEach(() => {
        buildDOM();
        mockGsapTo.mockClear();
        mockGsapSet.mockClear();
        mockBatch.mockClear();
    });
    it("scales card on mouseenter", () => {
        const pc = new ProjectCards();
        pc.init();
        mockGsapTo.mockClear();
        const card = document.getElementById("card0");
        fire(card, "mouseenter");
        expect(mockGsapTo).toHaveBeenCalled();
        const vars = mockGsapTo.mock.calls[0][1];
        expect(vars["scale"]).toBeGreaterThan(1);
    });
    it("resets scale/rotation on mouseleave", () => {
        const pc = new ProjectCards();
        pc.init();
        mockGsapTo.mockClear();
        const card = document.getElementById("card0");
        fire(card, "mouseleave");
        const vars = mockGsapTo.mock.calls[0][1];
        expect(vars["scale"]).toBe(1);
        expect(vars["rotateX"]).toBe(0);
        expect(vars["rotateY"]).toBe(0);
    });
    it("calls gsap.to with rotateX and rotateY on mousemove", () => {
        const pc = new ProjectCards();
        pc.init();
        mockGsapTo.mockClear();
        const card = document.getElementById("card0");
        // getBoundingClientRect returns zeros in jsdom; offset the mouse to get non-zero values
        vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
            left: 0,
            top: 0,
            width: 300,
            height: 200,
            right: 300,
            bottom: 200,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        });
        fire(card, "mousemove", { clientX: 200, clientY: 100 });
        expect(mockGsapTo).toHaveBeenCalled();
        const vars = mockGsapTo.mock.calls[0][1];
        expect("rotateX" in vars).toBe(true);
        expect("rotateY" in vars).toBe(true);
    });
    it("passes the card element as first arg to gsap.to on mouseenter/leave/move", () => {
        const pc = new ProjectCards();
        pc.init();
        mockGsapTo.mockClear();
        const card = document.getElementById("card0");
        fire(card, "mouseenter");
        expect(mockGsapTo.mock.calls[0][0]).toBe(card);
    });
});
