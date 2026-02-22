import type { NavController } from "./NavController";

/**
 * SmoothScroll
 * Intercepts all [href^="#"] anchor clicks and scrolls to the
 * target with a nav-height offset. Receives NavController as a
 * dependency to read the live nav height without a raw DOM query.
 */
export class SmoothScroll {
  readonly #nav: NavController;
  readonly #anchors: NodeListOf<HTMLAnchorElement>;

  constructor(nav: NavController) {
    this.#nav = nav;
    this.#anchors =
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  }

  init = (): void => {
    this.#anchors.forEach((anchor) =>
      anchor.addEventListener("click", this.#handleClick),
    );
  };

  // ── Private ──────────────────────────────────────────────────────────────

  #handleClick = (e: MouseEvent): void => {
    const anchor = e.currentTarget as HTMLAnchorElement;
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    e.preventDefault();

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      this.#nav.getHeight();
    window.scrollTo({ top, behavior: "smooth" });
  };
}
