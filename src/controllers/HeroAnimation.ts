import gsap from "gsap";

/**
 * HeroAnimation
 * Handles: char-split headline, staggered GSAP entrance timeline,
 * scroll indicator fade-out on scroll.
 */
export class HeroAnimation {
  readonly #eyebrow: HTMLElement;
  readonly #subline: HTMLElement;
  readonly #cta: HTMLElement;
  readonly #scroll: HTMLElement;

  constructor() {
    this.#eyebrow = document.getElementById("heroEyebrow") as HTMLElement;
    this.#subline = document.getElementById("heroSubline") as HTMLElement;
    this.#cta = document.getElementById("heroCta") as HTMLElement;
    this.#scroll = document.getElementById("heroScroll") as HTMLElement;
  }

  // ── Public ───────────────────────────────────────────────────────────────

  init = (): void => {
    this.#buildTimeline();
    this.#bindScrollIndicatorFade();
  };

  // ── Private ──────────────────────────────────────────────────────────────

  /** Main entrance timeline — fires once on page load. */
  #buildTimeline = (): void => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Headline is animated via CSS (@keyframes heroHeadlineIn) — not GSAP.
    // All other elements are hidden then revealed by this timeline.
    gsap.set([this.#eyebrow, this.#subline, this.#cta, this.#scroll], {
      opacity: 0,
      y: 30,
    });

    tl
      // 1 — eyebrow
      .to(this.#eyebrow, { opacity: 1, y: 0, duration: 0.6 }, 0.15)

      // 2 — subline
      .to(this.#subline, { opacity: 1, y: 0, duration: 0.65 }, 0.9)

      // 3 — CTA buttons stagger
      .fromTo(
        "#heroCta .btn",
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
        "-=0.35",
      )

      // 4 — scroll indicator
      .to(this.#scroll, { opacity: 1, y: 0, duration: 0.5 }, "-=0.15");
  };

  /** Fade scroll indicator out as user scrolls away from hero. */
  #bindScrollIndicatorFade = (): void => {
    window.addEventListener(
      "scroll",
      () => {
        const progress = Math.min(window.scrollY / 160, 1);
        gsap.set(this.#scroll, { opacity: 1 - progress });
      },
      { passive: true },
    );
  };
}
