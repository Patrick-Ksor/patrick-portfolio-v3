var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_nav, _App_hero, _App_blobs, _App_reveal, _App_cards, _App_buttons, _App_scroll, _App_form, _App_footer;
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
    constructor() {
        _App_nav.set(this, new NavController());
        _App_hero.set(this, new HeroAnimation());
        _App_blobs.set(this, new BlobAnimation());
        _App_reveal.set(this, new ScrollReveal());
        _App_cards.set(this, new ProjectCards());
        _App_buttons.set(this, new ButtonAnimations());
        _App_scroll.set(this, new SmoothScroll(__classPrivateFieldGet(this, _App_nav, "f")));
        _App_form.set(this, new ContactForm());
        _App_footer.set(this, new Footer());
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                // Register GSAP plugins once — before any controller that uses ScrollTrigger
                gsap.registerPlugin(ScrollTrigger);
                __classPrivateFieldGet(this, _App_nav, "f").init();
                __classPrivateFieldGet(this, _App_hero, "f").init();
                __classPrivateFieldGet(this, _App_blobs, "f").init();
                __classPrivateFieldGet(this, _App_reveal, "f").init();
                __classPrivateFieldGet(this, _App_cards, "f").init();
                __classPrivateFieldGet(this, _App_buttons, "f").init();
                __classPrivateFieldGet(this, _App_scroll, "f").init();
                __classPrivateFieldGet(this, _App_form, "f").init();
                __classPrivateFieldGet(this, _App_footer, "f").init();
            }
        });
    }
}
_App_nav = new WeakMap(), _App_hero = new WeakMap(), _App_blobs = new WeakMap(), _App_reveal = new WeakMap(), _App_cards = new WeakMap(), _App_buttons = new WeakMap(), _App_scroll = new WeakMap(), _App_form = new WeakMap(), _App_footer = new WeakMap();
