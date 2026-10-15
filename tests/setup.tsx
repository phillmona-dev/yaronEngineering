import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/image → plain img in tests
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _f, priority: _p, sizes: _s, unoptimized: _u, ...rest } = props;
    void _f;
    void _p;
    void _s;
    void _u;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

// framer-motion: render plain elements so reveals are visible synchronously
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const passthrough = (tag: string) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>(function M(props, ref) {
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        transition: _t,
        variants: _v,
        whileInView: _w,
        viewport: _vp,
        style,
        ...rest
      } = props;
      void _i;
      void _a;
      void _e;
      void _t;
      void _v;
      void _w;
      void _vp;
      return React.createElement(tag, { ref, style: style as React.CSSProperties, ...rest });
    });
  const m = new Proxy({}, { get: (_t, tag: string) => passthrough(tag) });
  return {
    m,
    motion: m,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
    MotionConfig: ({ children }: { children: React.ReactNode }) => children,
    domAnimation: {},
    useReducedMotion: () => true,
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { get: () => 0 }, scrollY: { get: () => 0 } }),
    useTransform: () => 0,
    useSpring: (v: unknown) => v,
    useMotionValue: (v: unknown) => ({ get: () => v, set: () => undefined }),
  };
});

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IO });
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
});
