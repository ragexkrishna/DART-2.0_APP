/**
 * DART 2K26 — Reusable Motion Components (Framer Motion)
 *
 * Exports:
 *  PageTransition  – fade + slight upward motion, wraps page content
 *  FadeUp          – fade-up when element enters viewport (once)
 *  AnimatedCard    – card div with hover lift + shadow transition
 *  AnimatedButton  – button with scale on hover / tap
 *  StaggerList     – wraps children in a staggered fade-in list
 *
 * All animations respect prefers-reduced-motion.
 */

import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ─── Shared variants ─────────────────────────────────────────────────────── */

const pageVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.32, ease: "easeInOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.20, ease: "easeIn"    } },
};

const fadeUpVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: "easeOut"   } },
};

const cardVariants = {
  rest:  { y: 0,   boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" },
  hover: { y: -3,  boxShadow: "0 8px 24px rgba(30,58,138,0.10)", transition: { duration: 0.22, ease: "easeOut" } },
};

const buttonVariants = {
  rest:  { scale: 1   },
  hover: { scale: 1.03, transition: { duration: 0.15, ease: "easeOut" } },
  tap:   { scale: 0.97 },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.30, ease: "easeOut" } },
};

/* ─── Reduced-motion fallback ────────────────────────────────────────────── */

function noMotion(variants) {
  const flat = {};
  Object.keys(variants).forEach((k) => { flat[k] = {}; });
  return flat;
}

/* ─── PageTransition ─────────────────────────────────────────────────────── */

export function PageTransition({ children, locationKey }) {
  const reduced = useReducedMotion();
  const v = reduced ? noMotion(pageVariants) : pageVariants;
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={locationKey}
        variants={v}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ width: "100%" }}
      >
        {children}
      </Motion.div>
    </AnimatePresence>
  );
}

/* ─── FadeUp (viewport trigger, fires once) ─────────────────────────────── */

export function FadeUp({ children, delay = 0, className = "" }) {
  const reduced = useReducedMotion();
  const v = reduced ? noMotion(fadeUpVariants) : {
    ...fadeUpVariants,
    visible: { ...fadeUpVariants.visible, transition: { ...fadeUpVariants.visible.transition, delay } },
  };
  return (
    <Motion.div
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

/* ─── AnimatedCard ───────────────────────────────────────────────────────── */

export function AnimatedCard({ children, className = "", style = {}, ...rest }) {
  const reduced = useReducedMotion();
  const v = reduced ? noMotion(cardVariants) : cardVariants;
  return (
    <Motion.div
      variants={v}
      initial="rest"
      whileHover="hover"
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Motion.div>
  );
}

/* ─── AnimatedButton ─────────────────────────────────────────────────────── */

export function AnimatedButton({ children, className = "", onClick, type = "button", disabled, ...rest }) {
  const reduced = useReducedMotion();
  const v = reduced ? noMotion(buttonVariants) : buttonVariants;
  return (
    <Motion.button
      variants={v}
      initial="rest"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled  ? undefined : "tap"}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </Motion.button>
  );
}

/* ─── StaggerList ────────────────────────────────────────────────────────── */

export function StaggerList({ children, className = "" }) {
  const reduced = useReducedMotion();
  const container = reduced ? noMotion(staggerContainer) : staggerContainer;
  const item      = reduced ? noMotion(staggerItem)      : staggerItem;
  return (
    <Motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Motion.div key={i} variants={item}>{child}</Motion.div>
          ))
        : <Motion.div variants={item}>{children}</Motion.div>
      }
    </Motion.div>
  );
}

