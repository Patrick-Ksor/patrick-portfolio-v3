import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("gsap", () => ({
    default: {
        to: vi.fn(),
        from: vi.fn(),
        fromTo: vi.fn(),
        set: vi.fn(),
        registerPlugin: vi.fn(),
        timeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            fromTo: vi.fn().mockReturnThis(),
        })),
    },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));
import { Footer } from "../controllers/Footer";
// ── Helpers ──────────────────────────────────────────────────────────────────
const buildDOM = () => {
    document.body.innerHTML = `<span id="footerYear"></span>`;
};
// ── Tests ────────────────────────────────────────────────────────────────────
describe("Footer", () => {
    beforeEach(buildDOM);
    it("sets #footerYear textContent to the current year", () => {
        const footer = new Footer();
        footer.init();
        const expected = new Date().getFullYear().toString();
        expect(document.getElementById("footerYear").textContent).toBe(expected);
    });
    it("returns a 4-digit year", () => {
        const footer = new Footer();
        footer.init();
        const text = document.getElementById("footerYear").textContent ?? "";
        expect(text).toMatch(/^\d{4}$/);
    });
    it("overwrites any pre-existing text in #footerYear", () => {
        document.getElementById("footerYear").textContent = "old value";
        const footer = new Footer();
        footer.init();
        expect(document.getElementById("footerYear").textContent).not.toBe("old value");
    });
});
