import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { batch: vi.fn() } }));

import { NavController } from "../controllers/NavController";

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildDOM = () => {
  document.body.innerHTML = `
    <nav id="nav">
      <div class="nav__inner">
        <button id="menuBtn" aria-expanded="false"></button>
        <ul>
          <li><a class="nav__link" href="#about">About</a></li>
          <li><a class="nav__link" href="#projects">Projects</a></li>
        </ul>
      </div>
    </nav>
    <div id="navDrawer" aria-hidden="true">
      <a class="nav__drawer-link" href="#about">About</a>
    </div>
    <section id="about"></section>
    <section id="projects"></section>
  `;
};

// Override offsetHeight for the nav element (jsdom always returns 0)
const mockNavHeight = (height: number) => {
  const nav = document.getElementById("nav")!;
  Object.defineProperty(nav, "offsetHeight", {
    value: height,
    configurable: true,
  });
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe("NavController", () => {
  beforeEach(() => {
    buildDOM();
    vi.stubGlobal("scrollY", 0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── getHeight() ───────────────────────────────────────────────────────────

  describe("getHeight()", () => {
    it("returns the offsetHeight of the nav element", () => {
      mockNavHeight(68);
      const nav = new NavController();
      expect(nav.getHeight()).toBe(68);
    });

    it("returns 0 when nav has no height set", () => {
      const nav = new NavController();
      expect(nav.getHeight()).toBe(0);
    });
  });

  // ── Scroll class ──────────────────────────────────────────────────────────

  describe("scroll class", () => {
    it("does NOT add .scrolled when scrollY is 0 on init", () => {
      vi.stubGlobal("scrollY", 0);
      const ctrl = new NavController();
      ctrl.init();

      expect(
        document.getElementById("nav")!.classList.contains("scrolled"),
      ).toBe(false);
    });

    it("adds .scrolled when scrollY is already > 80 on init", () => {
      vi.stubGlobal("scrollY", 100);
      const ctrl = new NavController();
      ctrl.init();

      expect(
        document.getElementById("nav")!.classList.contains("scrolled"),
      ).toBe(true);
    });

    it("adds .scrolled when user scrolls past 80 px", () => {
      vi.stubGlobal("scrollY", 0);
      const ctrl = new NavController();
      ctrl.init();

      vi.stubGlobal("scrollY", 200);
      window.dispatchEvent(new Event("scroll"));

      expect(
        document.getElementById("nav")!.classList.contains("scrolled"),
      ).toBe(true);
    });

    it("removes .scrolled when user scrolls back above 80 px", () => {
      vi.stubGlobal("scrollY", 200);
      const ctrl = new NavController();
      ctrl.init();

      vi.stubGlobal("scrollY", 10);
      window.dispatchEvent(new Event("scroll"));

      expect(
        document.getElementById("nav")!.classList.contains("scrolled"),
      ).toBe(false);
    });
  });

  // ── Mobile drawer ─────────────────────────────────────────────────────────

  describe("mobile drawer toggle", () => {
    it("opens the drawer on first menuBtn click", () => {
      const ctrl = new NavController();
      ctrl.init();

      document.getElementById("menuBtn")!.click();

      const menuBtn = document.getElementById("menuBtn")!;
      const drawer = document.getElementById("navDrawer")!;

      expect(menuBtn.getAttribute("aria-expanded")).toBe("true");
      expect(menuBtn.classList.contains("is-open")).toBe(true);
      expect(drawer.getAttribute("aria-hidden")).toBe("false");
      expect(drawer.classList.contains("is-open")).toBe(true);
    });

    it("closes the drawer on second menuBtn click", () => {
      const ctrl = new NavController();
      ctrl.init();

      const btn = document.getElementById("menuBtn")!;
      btn.click(); // open
      btn.click(); // close

      expect(btn.getAttribute("aria-expanded")).toBe("false");
      expect(btn.classList.contains("is-open")).toBe(false);
    });

    it("closes the drawer when a drawer link is clicked", () => {
      const ctrl = new NavController();
      ctrl.init();

      document.getElementById("menuBtn")!.click(); // open

      document.querySelector<HTMLElement>(".nav__drawer-link")!.click();

      const btn = document.getElementById("menuBtn")!;
      expect(btn.getAttribute("aria-expanded")).toBe("false");
      expect(btn.classList.contains("is-open")).toBe(false);
    });

    it("closes the drawer on an outside document click", () => {
      const ctrl = new NavController();
      ctrl.init();

      document.getElementById("menuBtn")!.click(); // open

      // Click outside both the drawer and the button
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      const btn = document.getElementById("menuBtn")!;
      expect(btn.getAttribute("aria-expanded")).toBe("false");
    });
  });
});
