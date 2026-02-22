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
var _HeroAnimation_eyebrow, _HeroAnimation_headline, _HeroAnimation_subline, _HeroAnimation_cta, _HeroAnimation_scroll, _HeroAnimation_splitHeadlineChars, _HeroAnimation_buildTimeline, _HeroAnimation_bindScrollIndicatorFade;
import gsap from 'gsap';
/**
 * HeroAnimation
 * Handles: char-split headline, staggered GSAP entrance timeline,
 * scroll indicator fade-out on scroll.
 */
export class HeroAnimation {
    constructor() {
        _HeroAnimation_eyebrow.set(this, void 0);
        _HeroAnimation_headline.set(this, void 0);
        _HeroAnimation_subline.set(this, void 0);
        _HeroAnimation_cta.set(this, void 0);
        _HeroAnimation_scroll.set(this, void 0);
        // ── Public ───────────────────────────────────────────────────────────────
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _HeroAnimation_splitHeadlineChars, "f").call(this);
                __classPrivateFieldGet(this, _HeroAnimation_buildTimeline, "f").call(this);
                __classPrivateFieldGet(this, _HeroAnimation_bindScrollIndicatorFade, "f").call(this);
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        /**
         * Wraps every character in the hero headline inside a
         * <span class="char"> for per-character GSAP animation.
         * Preserves <br> and .hero__name child elements intact.
         */
        _HeroAnimation_splitHeadlineChars.set(this, () => {
            __classPrivateFieldGet(this, _HeroAnimation_headline, "f").childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent ?? '';
                    const frag = document.createDocumentFragment();
                    for (const ch of text) {
                        const span = document.createElement('span');
                        span.className = 'char';
                        span.textContent = ch === ' ' ? '\u00A0' : ch;
                        frag.appendChild(span);
                    }
                    node.replaceWith(frag);
                }
                else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Keep <br> and .hero__name intact but tag them as a char target
                    node.classList.add('char');
                }
            });
        });
        /** Main entrance timeline — fires once on page load. */
        _HeroAnimation_buildTimeline.set(this, () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            // Hide everything before animating
            gsap.set([__classPrivateFieldGet(this, _HeroAnimation_eyebrow, "f"), __classPrivateFieldGet(this, _HeroAnimation_headline, "f"), __classPrivateFieldGet(this, _HeroAnimation_subline, "f"), __classPrivateFieldGet(this, _HeroAnimation_cta, "f"), __classPrivateFieldGet(this, _HeroAnimation_scroll, "f")], {
                opacity: 0,
            });
            gsap.set('#heroHeadline .char', { y: 80, opacity: 0 });
            tl
                // 1 — eyebrow
                .to(__classPrivateFieldGet(this, _HeroAnimation_eyebrow, "f"), { opacity: 1, y: 0, duration: 0.6 }, 0.15)
                // 2 — headline chars stagger
                .to('#heroHeadline .char', { y: 0, opacity: 1, duration: 0.75, stagger: 0.025, ease: 'back.out(1.4)' }, 0.4)
                // 3 — subline
                .to(__classPrivateFieldGet(this, _HeroAnimation_subline, "f"), { opacity: 1, y: 0, duration: 0.65 }, '-=0.35')
                // 4 — CTA buttons stagger
                .fromTo('#heroCta .btn', { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 }, '-=0.4')
                // 5 — scroll indicator
                .to(__classPrivateFieldGet(this, _HeroAnimation_scroll, "f"), { opacity: 1, y: 0, duration: 0.5 }, '-=0.15');
        });
        /** Fade scroll indicator out as user scrolls away from hero. */
        _HeroAnimation_bindScrollIndicatorFade.set(this, () => {
            window.addEventListener('scroll', () => {
                const progress = Math.min(window.scrollY / 160, 1);
                gsap.set(__classPrivateFieldGet(this, _HeroAnimation_scroll, "f"), { opacity: 1 - progress });
            }, { passive: true });
        });
        __classPrivateFieldSet(this, _HeroAnimation_eyebrow, document.getElementById('heroEyebrow'), "f");
        __classPrivateFieldSet(this, _HeroAnimation_headline, document.getElementById('heroHeadline'), "f");
        __classPrivateFieldSet(this, _HeroAnimation_subline, document.getElementById('heroSubline'), "f");
        __classPrivateFieldSet(this, _HeroAnimation_cta, document.getElementById('heroCta'), "f");
        __classPrivateFieldSet(this, _HeroAnimation_scroll, document.getElementById('heroScroll'), "f");
    }
}
_HeroAnimation_eyebrow = new WeakMap(), _HeroAnimation_headline = new WeakMap(), _HeroAnimation_subline = new WeakMap(), _HeroAnimation_cta = new WeakMap(), _HeroAnimation_scroll = new WeakMap(), _HeroAnimation_splitHeadlineChars = new WeakMap(), _HeroAnimation_buildTimeline = new WeakMap(), _HeroAnimation_bindScrollIndicatorFade = new WeakMap();
