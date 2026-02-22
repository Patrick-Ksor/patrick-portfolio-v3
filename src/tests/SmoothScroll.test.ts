import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));

import { SmoothScroll } from "../controllers/SmoothScroll";
import type { NavController } from "../controllers/NavController";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Minimal NavController stub that returns a fixed height. */
const makeNavStub = (height = 68): NavController =>
  ({ getHeight: () => height }) as unknown as NavController;

const buildDOM = () => {
  document.body.innerHTML = `
    <a id="toAbout"   href="#about">About</a>
    <a id="toHash"    href="#">Home</a>
    <a id="toMissing" href="#nonexistent">Missing</a>
    <section id="about">About section</section>
  `;
};

// Fake getBoundingClientRect on the about section
const mockSectionTop = (top: number) => {
  const section = document.getElementById("about")!;
  vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  });
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe("SmoothScroll", () => {
  beforeEach(() => {
    buildDOM();
    vi.stubGlobal("scrollY", 0);
    vi.mocked(window.scrollTo).mockClear();
  });

  it("scrolls to the correct position when a valid anchor is clicked", () => {
    const NAV_HEIGHT = 68;
    const SECTION_TOP = 600;

    mockSectionTop(SECTION_TOP);
    vi.stubGlobal("scrollY", 0);

    const scroll = new SmoothScroll(makeNavStub(NAV_HEIGHT));
    scroll.init();

    document.getElementById("toAbout")!.click();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: SECTION_TOP + 0 - NAV_HEIGHT, // getBCR.top + scrollY - navHeight
      behavior: "smooth",
    });
  });

  it("accounts for current window.scrollY in the target calculation", () => {
    const NAV_HEIGHT = 68;
    const SECTION_TOP = 200;
    const SCROLL_Y = 400;

    mockSectionTop(SECTION_TOP);
    vi.stubGlobal("scrollY", SCROLL_Y);

    const scroll = new SmoothScroll(makeNavStub(NAV_HEIGHT));
    scroll.init();

    document.getElementById("toAbout")!.click();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: SECTION_TOP + SCROLL_Y - NAV_HEIGHT,
      behavior: "smooth",
    });
  });

  it('does NOT call window.scrollTo when anchor href is bare "#"', () => {
    const scroll = new SmoothScroll(makeNavStub());
    scroll.init();

    document.getElementById("toHash")!.click();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("does NOT call window.scrollTo when the target section does not exist", () => {
    const scroll = new SmoothScroll(makeNavStub());
    scroll.init();

    document.getElementById("toMissing")!.click();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("calls preventDefault on the click event for a valid anchor", () => {
    mockSectionTop(500);
    const scroll = new SmoothScroll(makeNavStub());
    scroll.init();

    const anchor = document.getElementById("toAbout")!;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const spy = vi.spyOn(event, "preventDefault");

    anchor.dispatchEvent(event);

    expect(spy).toHaveBeenCalledOnce();
  });

  it('does NOT call preventDefault when anchor targets bare "#"', () => {
    const scroll = new SmoothScroll(makeNavStub());
    scroll.init();

    const anchor = document.getElementById("toHash")!;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const spy = vi.spyOn(event, "preventDefault");

    anchor.dispatchEvent(event);

    expect(spy).not.toHaveBeenCalled();
  });
});
