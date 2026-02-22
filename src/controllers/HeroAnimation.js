var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HeroAnimation_eyebrow, _HeroAnimation_subline, _HeroAnimation_cta, _HeroAnimation_scroll, _HeroAnimation_buildTimeline, _HeroAnimation_bindScrollIndicatorFade;
import gsap from "gsap";
/**
 * HeroAnimation
 * Handles: char-split headline, staggered GSAP entrance timeline,
 * scroll indicator fade-out on scroll.
 */
export class HeroAnimation {
    constructor() {
        _HeroAnimation_eyebrow.set(this, void 0);
        _HeroAnimation_subline.set(this, void 0);
        _HeroAnimation_cta.set(this, void 0);
        _HeroAnimation_scroll.set(this, void 0);
        // ── Public ───────────────────────────────────────────────────────────────
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _HeroAnimation_buildTimeline, "f").call(this);
                __classPrivateFieldGet(this, _HeroAnimation_bindScrollIndicatorFade, "f").call(this);
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        /** Main entrance timeline — fires once on page load. */
        _HeroAnimation_buildTimeline.set(this, () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            // Headline is animated via CSS (@keyframes heroHeadlineIn) — not GSAP.
            // All other elements are hidden then revealed by this timeline.
            gsap.set([__classPrivateFieldGet(this, _HeroAnimation_eyebrow, "f"), __classPrivateFieldGet(this, _HeroAnimation_subline, "f"), __classPrivateFieldGet(this, _HeroAnimation_cta, "f"), __classPrivateFieldGet(this, _HeroAnimation_scroll, "f")], {
                opacity: 0,
                y: 30,
            });
            tl
                // 1 — eyebrow
                .to(__classPrivateFieldGet(this, _HeroAnimation_eyebrow, "f"), { opacity: 1, y: 0, duration: 0.6 }, 0.15)
                // 2 — subline
                .to(__classPrivateFieldGet(this, _HeroAnimation_subline, "f"), { opacity: 1, y: 0, duration: 0.65 }, 0.9)
                // 3 — CTA buttons stagger
                .fromTo("#heroCta .btn", { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 }, "-=0.35")
                // 4 — scroll indicator
                .to(__classPrivateFieldGet(this, _HeroAnimation_scroll, "f"), { opacity: 1, y: 0, duration: 0.5 }, "-=0.15");
        });
        /** Fade scroll indicator out as user scrolls away from hero. */
        _HeroAnimation_bindScrollIndicatorFade.set(this, () => {
            window.addEventListener("scroll", () => {
                const progress = Math.min(window.scrollY / 160, 1);
                gsap.set(__classPrivateFieldGet(this, _HeroAnimation_scroll, "f"), { opacity: 1 - progress });
            }, { passive: true });
        });
        __classPrivateFieldSet(this, _HeroAnimation_eyebrow, document.getElementById("heroEyebrow"), "f");
        __classPrivateFieldSet(this, _HeroAnimation_subline, document.getElementById("heroSubline"), "f");
        __classPrivateFieldSet(this, _HeroAnimation_cta, document.getElementById("heroCta"), "f");
        __classPrivateFieldSet(this, _HeroAnimation_scroll, document.getElementById("heroScroll"), "f");
    }
}
_HeroAnimation_eyebrow = new WeakMap(), _HeroAnimation_subline = new WeakMap(), _HeroAnimation_cta = new WeakMap(), _HeroAnimation_scroll = new WeakMap(), _HeroAnimation_buildTimeline = new WeakMap(), _HeroAnimation_bindScrollIndicatorFade = new WeakMap();
