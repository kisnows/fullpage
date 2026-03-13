# Fullpage Refactoring Plan

> Refactoring guide that preserves the existing public API while modernizing internals.

## Current Architecture

```
src/
├── index.js    — Entry point, exposes global `fullpage` object
├── init.js     — Initialization logic, exports mutable shared state
├── page.js     — Scroll/slide logic, imports shared state from init.js
├── events.js   — Touch, mouse wheel, keyboard event bindings
├── utils.js    — DOM helpers and CSS utilities
└── fullpage.css
```

### Key Problems

1. **Global mutable state** — `init.js` exports variables (`stepHeight`, `sectionContent`, `sections`, `options`) that `page.js` imports directly. This creates tight coupling and circular dependency risk.
2. **Single instance only** — The architecture cannot support multiple fullpage instances on one page.
3. **No cleanup/destroy** — Event listeners in `events.js` are bound once and can never be removed, causing memory leaks in SPA contexts.
4. **Outdated build toolchain** — Webpack 4, `babel-preset-es2015`, manual UglifyJS.
5. **No type definitions** — No TypeScript support for consumers.

---

## Phase 1: Class-based Refactoring (Priority: P0)

Encapsulate all state into a `Fullpage` class. The public-facing API (`fullpage.init()`, `fullpage.moveTo()`, etc.) remains unchanged — it delegates to an internal class instance.

### New Structure

```
src/
├── index.js        — Public API facade (unchanged interface)
├── Fullpage.js     — Core class (all state + logic)
├── EventManager.js — Event binding with cleanup support
├── utils.js        — Pure DOM helpers (unchanged)
└── fullpage.css
```

### Fullpage Class

```javascript
class Fullpage {
  constructor(el, options) {
    this.sectionContent = document.querySelector(el);
    this.sections = this.sectionContent.querySelectorAll(".fp-section");
    this.options = Object.assign({}, Fullpage.defaults, options);
    this.stepHeight = this.sectionContent.offsetHeight;
    this.stepWidth = this.sectionContent.offsetWidth;
    this.nowPage = 0;
    this.isScrolling = false;
    this.translate3dY = 0;
    this._cleanups = [];

    this._initElements();
    this._bindEvents();
  }

  static defaults = {
    threshold: 50,
    pageSpeed: 500,
    autoScroll: 0,
    loopSection: true,
    hasSectionPagination: true,
    loopSlide: true,
    hasSlidePagination: true,
    afterLoad: null,
    beforeLeave: null,
    afterSlideLoad: null,
    beforeSlideLeave: null,
  };

  // --- Public methods (same signatures as current API) ---
  scrollPage(pageIndex) {
    /* move current logic here, use this.* */
  }
  scrollSlide(slideIndex) {
    /* ... */
  }
  moveTo(pageIndex, slideIndex) {
    /* ... */
  }
  moveToNext(callback, ...args) {
    /* ... */
  }
  moveToPre(callback, ...args) {
    /* ... */
  }
  slideToNext() {
    /* ... */
  }
  slideToPre() {
    /* ... */
  }

  // --- Lifecycle ---
  destroy() {
    this._cleanups.forEach((fn) => fn());
    this._cleanups = [];
    this._controllerEl?.remove();
    clearInterval(this._autoScrollTimer);
  }

  // --- Private methods ---
  _initElements() {
    /* from current initEle() */
  }
  _bindEvents() {
    /* from current bindEvent(), push cleanup fns */
  }
  _initSection() {
    /* ... */
  }
  _initSlide() {
    /* ... */
  }
  _createPagination() {
    /* ... */
  }
}
```

### Public API Facade

```javascript
// src/index.js — external API is 100% backward compatible
import Fullpage from "./Fullpage";

let instance = null;

const fullpage = {
  init(el, options) {
    if (instance) instance.destroy();
    instance = new Fullpage(el, options);
  },
  scrollPage: (...args) => instance?.scrollPage(...args),
  scrollSlide: (...args) => instance?.scrollSlide(...args),
  moveTo: (...args) => instance?.moveTo(...args),
  moveToNext: (...args) => instance?.moveToNext(...args),
  moveToPre: (...args) => instance?.moveToPre(...args),
  slideToNext: () => instance?.slideToNext(),
  slideToPre: () => instance?.slideToPre(),
};

window.fullpage = fullpage;
export default fullpage;
```

---

## Phase 2: Event Cleanup (Priority: P0)

Extract event binding into an `EventManager` pattern so every listener can be removed:

```javascript
// Inside Fullpage class
_bindTouchEvents() {
  const handler = (e) => { /* ... */ };
  document.addEventListener('touchstart', handler, { passive: false });
  this._cleanups.push(() =>
    document.removeEventListener('touchstart', handler, { passive: false })
  );
}
```

Apply the same pattern to `touchmove`, `touchend`, `mousewheel`/`DOMMouseScroll`, and `keydown`.

---

## Phase 3: Build Toolchain Upgrade (Priority: P1)

| Current             | Target                              |
| ------------------- | ----------------------------------- |
| Webpack 4           | Rollup (or Vite library mode)       |
| babel-preset-es2015 | @babel/preset-env with browserslist |
| Manual UglifyJS     | Rollup terser plugin                |
| IIFE only output    | ESM + UMD + IIFE                    |

### Rollup Config

```javascript
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/fullpage.esm.js", format: "es" },
    {
      file: "dist/fullpage.umd.js",
      format: "umd",
      name: "fullpage",
      exports: "default",
    },
    {
      file: "dist/fullpage.min.js",
      format: "iife",
      name: "fullpage",
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({ babelHelpers: "bundled", presets: [["@babel/preset-env"]] }),
  ],
};
```

### Package.json Updates

```json
{
  "main": "dist/fullpage.umd.js",
  "module": "dist/fullpage.esm.js",
  "types": "types/fullpage.d.ts",
  "files": ["dist", "types", "src/fullpage.css"],
  "sideEffects": false
}
```

---

## Phase 4: TypeScript Declarations (Priority: P2)

Add `types/fullpage.d.ts` without migrating source code:

```typescript
interface FullpageOptions {
  threshold?: number;
  pageSpeed?: number;
  autoScroll?: number;
  loopSection?: boolean;
  loopSlide?: boolean;
  hasSectionPagination?: boolean;
  hasSlidePagination?: boolean;
  afterLoad?: (this: HTMLElement, afterIndex: number) => void;
  beforeLeave?: (
    this: HTMLElement,
    leaveIndex: number,
    nowIndex: number,
  ) => void;
  afterSlideLoad?: (
    this: HTMLElement,
    pageIndex: number,
    slideIndex: number,
  ) => void;
  beforeSlideLeave?: (
    this: HTMLElement,
    pageIndex: number,
    slideNow: number,
    slideAfter: number,
  ) => void;
}

interface Fullpage {
  init(el: string, options?: FullpageOptions): void;
  scrollPage(pageIndex: number): boolean;
  scrollSlide(slideIndex: number): boolean;
  moveTo(pageIndex: number, slideIndex?: number): boolean;
  moveToNext(callback?: Function, ...args: any[]): boolean;
  moveToPre(callback?: Function, ...args: any[]): boolean;
  slideToNext(): void;
  slideToPre(): void;
}

declare const fullpage: Fullpage;
export default fullpage;
```

---

## Migration Checklist

- [ ] Create `Fullpage` class with all state encapsulated
- [ ] Move `init.js` logic into constructor + `_initElements()`
- [ ] Move `page.js` logic into class methods
- [ ] Move `events.js` logic into `_bindEvents()` with cleanup
- [ ] Add `destroy()` method
- [ ] Update `index.js` facade to delegate to instance
- [ ] Verify all existing demos work unchanged
- [ ] Replace Webpack with Rollup
- [ ] Add TypeScript declaration file
- [ ] Update `package.json` with `module`, `types`, `files` fields
- [ ] Add CSS import support in build pipeline

## API Compatibility Guarantee

The following public interface MUST remain unchanged after refactoring:

```
fullpage.init(el, options)
fullpage.moveTo(index, slideIndex?)
fullpage.moveToNext(callback?, ...args)
fullpage.moveToPre(callback?, ...args)
fullpage.slideToNext()
fullpage.slideToPre()
fullpage.scrollPage(pageIndex)
fullpage.scrollSlide(slideIndex)
```

All callback signatures (`beforeLeave`, `afterLoad`, `beforeSlideLeave`, `afterSlideLoad`) and their `this` bindings must also be preserved.
