import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ProjectCards
 * Staggered entrance via ScrollTrigger.batch, plus a perspective
 * tilt micro-interaction on mousemove per card.
 */
export class ProjectCards {
  readonly #cards: NodeListOf<HTMLElement>;

  constructor() {
    this.#cards = document.querySelectorAll<HTMLElement>(".project-card");
  }

  init = (): void => {
    this.#animateEntrance();
    this.#bindHoverTilt();
  };

  // ── Private ──────────────────────────────────────────────────────────────

  #animateEntrance = (): void => {
    gsap.set(this.#cards, { opacity: 0, y: 60 });

    ScrollTrigger.batch(this.#cards, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: "power3.out",
        });
      },
    });
  };

  #bindHoverTilt = (): void => {
    this.#cards.forEach((card) => {
      card.addEventListener("mouseenter", this.#onEnter);
      card.addEventListener("mousemove", this.#onMove);
      card.addEventListener("mouseleave", this.#onLeave);
    });
  };

  #onEnter = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  #onMove = (e: Event): void => {
    const card = e.currentTarget as HTMLElement;
    const mouse = e as MouseEvent;
    const rect = card.getBoundingClientRect();
    const dx =
      (mouse.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy =
      (mouse.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    gsap.to(card, {
      rotateY: dx * 6,
      rotateX: -dy * 4,
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  #onLeave = (e: Event): void => {
    gsap.to(e.currentTarget as HTMLElement, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.6)",
    });
  };
}
