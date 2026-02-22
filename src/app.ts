import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { NavController } from "./controllers/NavController";
import { HeroAnimation } from "./controllers/HeroAnimation";
import { BlobAnimation } from "./controllers/BlobAnimation";
import { ScrollReveal } from "./controllers/ScrollReveal";
import { ProjectCards } from "./controllers/ProjectCards";
import { ButtonAnimations } from "./controllers/ButtonAnimations";
import { SmoothScroll } from "./controllers/SmoothScroll";
import { ContactForm } from "./controllers/ContactForm";
import { Footer } from "./controllers/Footer";

/**
 * App
 * Root orchestrator.
 * - Owns every controller instance.
 * - Registers GSAP plugins once before any controller uses them.
 * - Calls init() on each controller in dependency order.
 *
 * SmoothScroll receives NavController as a constructor dependency
 * so it can read the live nav height without a raw DOM query.
 */
export class App {
  readonly #nav = new NavController();
  readonly #hero = new HeroAnimation();
  readonly #blobs = new BlobAnimation();
  readonly #reveal = new ScrollReveal();
  readonly #cards = new ProjectCards();
  readonly #buttons = new ButtonAnimations();
  readonly #scroll = new SmoothScroll(this.#nav);
  readonly #form = new ContactForm();
  readonly #footer = new Footer();

  init = (): void => {
    // Register GSAP plugins once — before any controller that uses ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    this.#nav.init();
    this.#hero.init();
    this.#blobs.init();
    this.#reveal.init();
    this.#cards.init();
    this.#buttons.init();
    this.#scroll.init();
    this.#form.init();
    this.#footer.init();
  };
}
