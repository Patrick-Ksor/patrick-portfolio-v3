import gsap from "gsap";

/**
 * NavController
 * Handles: scroll-based nav styling, mobile drawer toggle,
 * active link highlighting via IntersectionObserver.
 */
export class NavController {
  readonly #nav: HTMLElement;
  readonly #menuBtn: HTMLButtonElement;
  readonly #drawer: HTMLElement;
  readonly #navLinks: NodeListOf<HTMLAnchorElement>;
  readonly #drawerLinks: NodeListOf<HTMLAnchorElement>;
  #isOpen = false;

  constructor() {
    this.#nav = document.getElementById("nav") as HTMLElement;
    this.#menuBtn = document.getElementById("menuBtn") as HTMLButtonElement;
    this.#drawer = document.getElementById("navDrawer") as HTMLElement;
    this.#navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav__link");
    this.#drawerLinks =
      document.querySelectorAll<HTMLAnchorElement>(".nav__drawer-link");
  }

  // ── Public ───────────────────────────────────────────────────────────────

  init = (): void => {
    this.#bindScrollClass();
    this.#bindMobileMenu();
    this.#bindActiveLinks();
  };

  /** Returns nav bar height in px — consumed by SmoothScroll for offset. */
  getHeight = (): number => this.#nav.offsetHeight;

  // ── Private ──────────────────────────────────────────────────────────────

  /** Add .scrolled class after 80 px of scroll for backdrop-blur effect. */
  #bindScrollClass = (): void => {
    const update = () =>
      this.#nav.classList.toggle("scrolled", window.scrollY > 80);
    window.addEventListener("scroll", update, { passive: true });
    update(); // run once on init
  };

  #bindMobileMenu = (): void => {
    this.#menuBtn.addEventListener("click", this.#toggleDrawer);

    this.#drawerLinks.forEach((link) =>
      link.addEventListener("click", () => this.#closeDrawer()),
    );

    document.addEventListener("click", (e: MouseEvent) => {
      if (
        this.#isOpen &&
        !this.#drawer.contains(e.target as Node) &&
        !this.#menuBtn.contains(e.target as Node)
      ) {
        this.#closeDrawer();
      }
    });
  };

  #toggleDrawer = (): void => {
    this.#isOpen ? this.#closeDrawer() : this.#openDrawer();
  };

  #openDrawer = (): void => {
    this.#isOpen = true;
    this.#menuBtn.setAttribute("aria-expanded", "true");
    this.#menuBtn.classList.add("is-open");
    this.#drawer.setAttribute("aria-hidden", "false");
    this.#drawer.classList.add("is-open");

    gsap.fromTo(
      this.#drawer,
      { y: -12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
    );
  };

  #closeDrawer = (): void => {
    this.#isOpen = false;
    this.#menuBtn.setAttribute("aria-expanded", "false");
    this.#menuBtn.classList.remove("is-open");

    gsap.to(this.#drawer, {
      y: -12,
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        this.#drawer.classList.remove("is-open");
        this.#drawer.setAttribute("aria-hidden", "true");
      },
    });
  };

  /** Highlight nav link whose section is currently in the viewport. */
  #bindActiveLinks = (): void => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          this.#navLinks.forEach((link) => {
            link.classList.toggle(
              "nav__link--active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((section) => observer.observe(section));
  };
}
