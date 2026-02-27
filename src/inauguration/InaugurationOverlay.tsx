"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CURTAIN_DELAY_MS = 3000;
const CURTAIN_OPEN_DURATION_S = 2.8;
const CONFETTI_AFTER_OPEN_MS = 600;
const TEXT_VISIBLE_MS = 2500;
const UNMOUNT_AFTER_OPEN_MS = 3800;

export default function InaugurationOverlay() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);

  const openCurtain = useCallback(() => {
    setCurtainOpen(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(openCurtain, CURTAIN_DELAY_MS);
    return () => clearTimeout(t);
  }, [openCurtain]);

  useEffect(() => {
    if (!curtainOpen) return;
    const fireConfetti = async () => {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    };
    const t = setTimeout(fireConfetti, CONFETTI_AFTER_OPEN_MS);
    return () => clearTimeout(t);
  }, [curtainOpen]);

  useEffect(() => {
    if (!curtainOpen) return;
    const t = setTimeout(() => setHideOverlay(true), UNMOUNT_AFTER_OPEN_MS);
    return () => clearTimeout(t);
  }, [curtainOpen]);

  if (hideOverlay) return null;

  const basePanel = {
    width: "50vw",
    minHeight: "100vh",
    backgroundColor: "#2d1b4e",
  } as React.CSSProperties;

  const leftPanelStyle: React.CSSProperties = {
    ...basePanel,
    background: [
      "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.04) 100%)",
      "repeating-linear-gradient(90deg, transparent 0, transparent 22px, rgba(255,255,255,0.04) 22px, rgba(255,255,255,0.04) 24px)",
      "linear-gradient(180deg, #1a0d2e 0%, #2d1b4e 15%, #3d2a6e 50%, #2d1b4e 85%, #1a0d2e 100%)",
    ].join(", "),
    boxShadow: "inset 2px 0 24px rgba(0,0,0,0.35), 6px 0 28px rgba(0,0,0,0.25)",
  };

  const rightPanelStyle: React.CSSProperties = {
    ...basePanel,
    background: [
      "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.2) 100%)",
      "repeating-linear-gradient(90deg, transparent 0, transparent 22px, rgba(255,255,255,0.04) 22px, rgba(255,255,255,0.04) 24px)",
      "linear-gradient(180deg, #1a0d2e 0%, #2d1b4e 15%, #3d2a6e 50%, #2d1b4e 85%, #1a0d2e 100%)",
    ].join(", "),
    boxShadow: "inset -2px 0 24px rgba(0,0,0,0.35), -6px 0 28px rgba(0,0,0,0.25)",
  };

  const curtainTransition = {
    duration: CURTAIN_OPEN_DURATION_S,
    ease: [0.22, 0.61, 0.36, 1] as const,
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        pointerEvents: curtainOpen ? "none" : "auto",
        zIndex: 10000,
      }}
      aria-hidden={curtainOpen}
    >
      {/* Curtain rod – metal look at top */}
      <div
        className="absolute top-0 left-0 right-0 z-[2]"
        style={{
          height: 14,
          background: "linear-gradient(180deg, #5a4a6c 0%, #3d3248 30%, #2a2235 70%, #1e1628 100%)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      />
      {/* Curtain panels – fabric with folds, open slowly like a real curtain */}
      <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 1 }}>
        <motion.div
          className="absolute top-0 bottom-0 left-0"
          style={leftPanelStyle}
          initial={false}
          animate={{ x: curtainOpen ? "-100%" : 0 }}
          transition={curtainTransition}
        />
        <motion.div
          className="absolute top-0 bottom-0 right-0"
          style={rightPanelStyle}
          initial={false}
          animate={{ x: curtainOpen ? "100%" : 0 }}
          transition={curtainTransition}
        />
      </div>

      {/* Click-to-open: only when curtain closed, so user can click to open curtain */}
      {!curtainOpen && (
        <div
          className="absolute inset-0 cursor-pointer"
          style={{ zIndex: 10 }}
          onClick={openCurtain}
          aria-label="Open curtain to view website"
        />
      )}

      {/* Brief "Inauguration" text in center – fades out so website is clearly visible */}
      <AnimatePresence>
        {curtainOpen && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            <motion.h1
              className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4"
              animate={{ opacity: 0 }}
              transition={{ delay: TEXT_VISIBLE_MS / 1000, duration: 0.5 }}
            >
              Inauguration
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
