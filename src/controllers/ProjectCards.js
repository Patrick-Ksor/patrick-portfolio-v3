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
var _ProjectCards_cards, _ProjectCards_animateEntrance, _ProjectCards_bindHoverTilt, _ProjectCards_onEnter, _ProjectCards_onMove, _ProjectCards_onLeave;
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
/**
 * ProjectCards
 * Staggered entrance via ScrollTrigger.batch, plus a perspective
 * tilt micro-interaction on mousemove per card.
 */
export class ProjectCards {
    constructor() {
        _ProjectCards_cards.set(this, void 0);
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _ProjectCards_animateEntrance, "f").call(this);
                __classPrivateFieldGet(this, _ProjectCards_bindHoverTilt, "f").call(this);
            }
        });
        // ── Private ──────────────────────────────────────────────────────────────
        _ProjectCards_animateEntrance.set(this, () => {
            gsap.set(__classPrivateFieldGet(this, _ProjectCards_cards, "f"), { opacity: 0, y: 60 });
            ScrollTrigger.batch(__classPrivateFieldGet(this, _ProjectCards_cards, "f"), {
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
        });
        _ProjectCards_bindHoverTilt.set(this, () => {
            __classPrivateFieldGet(this, _ProjectCards_cards, "f").forEach((card) => {
                card.addEventListener("mouseenter", __classPrivateFieldGet(this, _ProjectCards_onEnter, "f"));
                card.addEventListener("mousemove", __classPrivateFieldGet(this, _ProjectCards_onMove, "f"));
                card.addEventListener("mouseleave", __classPrivateFieldGet(this, _ProjectCards_onLeave, "f"));
            });
        });
        _ProjectCards_onEnter.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
            });
        });
        _ProjectCards_onMove.set(this, (e) => {
            const card = e.currentTarget;
            const mouse = e;
            const rect = card.getBoundingClientRect();
            const dx = (mouse.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const dy = (mouse.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            gsap.to(card, {
                rotateY: dx * 6,
                rotateX: -dy * 4,
                transformPerspective: 800,
                duration: 0.35,
                ease: "power2.out",
            });
        });
        _ProjectCards_onLeave.set(this, (e) => {
            gsap.to(e.currentTarget, {
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                duration: 0.55,
                ease: "elastic.out(1, 0.6)",
            });
        });
        __classPrivateFieldSet(this, _ProjectCards_cards, document.querySelectorAll(".project-card"), "f");
    }
}
_ProjectCards_cards = new WeakMap(), _ProjectCards_animateEntrance = new WeakMap(), _ProjectCards_bindHoverTilt = new WeakMap(), _ProjectCards_onEnter = new WeakMap(), _ProjectCards_onMove = new WeakMap(), _ProjectCards_onLeave = new WeakMap();
