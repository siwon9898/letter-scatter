import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FullScatter from "./pages/FullScatter";
import SentenceScatter from "./pages/SentenceScatter";
import "./App.css";
import { styled, Typography } from "@mui/material";

const App = () => {
  const [isPlayground, setIsPlayground] = useState(false);
  // return <FullScatter />;

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
      <ModeTypo onClick={() => setIsPlayground(!isPlayground)}>
        {isPlayground ? "Scatter Sentences" : "Scatter Playground"}
      </ModeTypo>
      {isPlayground ? <FullScatter /> : <SentenceScatter />}
    </div>
  );
};

const ModeTypo = styled(Typography)({
  position: "absolute",
  top: "50px",
  right: "100px",
  cursor: "pointer",
  fontWeight: 600,
  zIndex: 10,
  mixBlendMode: "difference",
  color: "#fff",
  background: "rgba(0,0,0,0.2)",
  backdropFilter: "blur(30px)",
  padding: "10px 20px",
  borderRadius: "30px",
});

export default App;
