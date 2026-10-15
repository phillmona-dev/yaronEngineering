import type { Transition, Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const transition = {
  reveal: { duration: 0.7, ease: EASE_OUT_EXPO } satisfies Transition,
  fast: { duration: 0.35, ease: EASE_OUT_EXPO } satisfies Transition,
  slow: { duration: 1.1, ease: EASE_OUT_EXPO } satisfies Transition,
  spring: { type: "spring", stiffness: 260, damping: 26, mass: 0.8 } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.reveal },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.reveal },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.reveal },
};

export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.001 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 1.0, ease: EASE_OUT_EXPO },
  },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const viewportOnce = { once: true, amount: 0.25 as const, margin: "0px 0px -8% 0px" };
