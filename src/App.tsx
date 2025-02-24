import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FullScatter from "./pages/FullScatter";
import SentenceScatter from "./pages/SentenceScatter";
import "./App.css";

export default function App() {
  // return <FullScatter />;
  const style = {};
  return (
    <div
      style={{
        background:
          "radial-gradient(50% 123.47% at 50% 50%, #00FF94 0%, #FF00C7 100%),  linear-gradient(121.28deg, #213100 0%, #FF0000 100%), linear-gradient(360deg, #0029FF 0%, #8FFF00 100%), linear-gradient(114.9deg, #00C6A2 0%, #6A45A8 100%), radial-gradient(100% 148.07% at 0% 0%, #FFFFFF 0%, #1DCD00 100%)",
        backgroundBlendMode: "screen, color-dodge, overlay, difference, normal",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SentenceScatter />
    </div>
  );
}
