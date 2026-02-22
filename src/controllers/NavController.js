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
var _NavController_nav, _NavController_menuBtn, _NavController_drawer, _NavController_navLinks, _NavController_drawerLinks, _NavController_isOpen, _NavController_bindScrollClass, _NavController_bindMobileMenu, _NavController_toggleDrawer, _NavController_openDrawer, _NavController_closeDrawer, _NavController_bindActiveLinks;
import gsap from "gsap";
/**
 * NavController
 * Handles: scroll-based nav styling, mobile drawer toggle,
 * active link highlighting via IntersectionObserver.
 */
export class NavController {
    constructor() {
        _NavController_nav.set(this, void 0);
        _NavController_menuBtn.set(this, void 0);
        _NavController_drawer.set(this, void 0);
        _NavController_navLinks.set(this, void 0);
        _NavController_drawerLinks.set(this, void 0);
        _NavController_isOpen.set(this, false);
        // ── Public ───────────────────────────────────────────────────────────────
        Object.defineProperty(this, "init", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                __classPrivateFieldGet(this, _NavController_bindScrollClass, "f").call(this);
                __classPrivateFieldGet(this, _NavController_bindMobileMenu, "f").call(this);
                __classPrivateFieldGet(this, _NavController_bindActiveLinks, "f").call(this);
            }
        });
        /** Returns nav bar height in px — consumed by SmoothScroll for offset. */
        Object.defineProperty(this, "getHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => __classPrivateFieldGet(this, _NavController_nav, "f").offsetHeight
        });
        // ── Private ──────────────────────────────────────────────────────────────
        /** Add .scrolled class after 80 px of scroll for backdrop-blur effect. */
        _NavController_bindScrollClass.set(this, () => {
            const update = () => __classPrivateFieldGet(this, _NavController_nav, "f").classList.toggle("scrolled", window.scrollY > 80);
            window.addEventListener("scroll", update, { passive: true });
            update(); // run once on init
        });
        _NavController_bindMobileMenu.set(this, () => {
            __classPrivateFieldGet(this, _NavController_menuBtn, "f").addEventListener("click", __classPrivateFieldGet(this, _NavController_toggleDrawer, "f"));
            __classPrivateFieldGet(this, _NavController_drawerLinks, "f").forEach((link) => link.addEventListener("click", () => __classPrivateFieldGet(this, _NavController_closeDrawer, "f").call(this)));
            document.addEventListener("click", (e) => {
                if (__classPrivateFieldGet(this, _NavController_isOpen, "f") &&
                    !__classPrivateFieldGet(this, _NavController_drawer, "f").contains(e.target) &&
                    !__classPrivateFieldGet(this, _NavController_menuBtn, "f").contains(e.target)) {
                    __classPrivateFieldGet(this, _NavController_closeDrawer, "f").call(this);
                }
            });
        });
        _NavController_toggleDrawer.set(this, () => {
            __classPrivateFieldGet(this, _NavController_isOpen, "f") ? __classPrivateFieldGet(this, _NavController_closeDrawer, "f").call(this) : __classPrivateFieldGet(this, _NavController_openDrawer, "f").call(this);
        });
        _NavController_openDrawer.set(this, () => {
            __classPrivateFieldSet(this, _NavController_isOpen, true, "f");
            __classPrivateFieldGet(this, _NavController_menuBtn, "f").setAttribute("aria-expanded", "true");
            __classPrivateFieldGet(this, _NavController_menuBtn, "f").classList.add("is-open");
            __classPrivateFieldGet(this, _NavController_drawer, "f").setAttribute("aria-hidden", "false");
            __classPrivateFieldGet(this, _NavController_drawer, "f").classList.add("is-open");
            gsap.fromTo(__classPrivateFieldGet(this, _NavController_drawer, "f"), { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        });
        _NavController_closeDrawer.set(this, () => {
            __classPrivateFieldSet(this, _NavController_isOpen, false, "f");
            __classPrivateFieldGet(this, _NavController_menuBtn, "f").setAttribute("aria-expanded", "false");
            __classPrivateFieldGet(this, _NavController_menuBtn, "f").classList.remove("is-open");
            gsap.to(__classPrivateFieldGet(this, _NavController_drawer, "f"), {
                y: -12,
                opacity: 0,
                duration: 0.22,
                ease: "power2.in",
                onComplete: () => {
                    __classPrivateFieldGet(this, _NavController_drawer, "f").classList.remove("is-open");
                    __classPrivateFieldGet(this, _NavController_drawer, "f").setAttribute("aria-hidden", "true");
                },
            });
        });
        /** Highlight nav link whose section is currently in the viewport. */
        _NavController_bindActiveLinks.set(this, () => {
            const sections = document.querySelectorAll("section[id]");
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting)
                        return;
                    const id = entry.target.getAttribute("id");
                    __classPrivateFieldGet(this, _NavController_navLinks, "f").forEach((link) => {
                        link.classList.toggle("nav__link--active", link.getAttribute("href") === `#${id}`);
                    });
                });
            }, { threshold: 0.4 });
            sections.forEach((section) => observer.observe(section));
        });
        __classPrivateFieldSet(this, _NavController_nav, document.getElementById("nav"), "f");
        __classPrivateFieldSet(this, _NavController_menuBtn, document.getElementById("menuBtn"), "f");
        __classPrivateFieldSet(this, _NavController_drawer, document.getElementById("navDrawer"), "f");
        __classPrivateFieldSet(this, _NavController_navLinks, document.querySelectorAll(".nav__link"), "f");
        __classPrivateFieldSet(this, _NavController_drawerLinks, document.querySelectorAll(".nav__drawer-link"), "f");
    }
}
_NavController_nav = new WeakMap(), _NavController_menuBtn = new WeakMap(), _NavController_drawer = new WeakMap(), _NavController_navLinks = new WeakMap(), _NavController_drawerLinks = new WeakMap(), _NavController_isOpen = new WeakMap(), _NavController_bindScrollClass = new WeakMap(), _NavController_bindMobileMenu = new WeakMap(), _NavController_toggleDrawer = new WeakMap(), _NavController_openDrawer = new WeakMap(), _NavController_closeDrawer = new WeakMap(), _NavController_bindActiveLinks = new WeakMap();
