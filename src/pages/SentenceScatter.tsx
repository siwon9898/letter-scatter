import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";

const LETTER_SIZE = 30; // 글자의 크기
const SPACING = LETTER_SIZE * 2; // 글자 간 간격
const MAX_SPREAD = 100; // 마우스 반발 최대 거리
const PUSH_FORCE = 0.5; // 충돌 시 튕겨나는 힘

const getInitialPositions = (sentence: string) => {
  const totalWidth = sentence.length * SPACING;
  return sentence.split("").map((letter, index) => ({
    letter,
    x: index * SPACING - totalWidth / 2, // 중앙 정렬
    y: 0,
  }));
};

const AnimatedText = (props: { sentence: string }) => {
  const [letters, setLetters] = useState(getInitialPositions(props.sentence));
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };

    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(() => {
        setLetters((prev) =>
          prev.map(({ letter, x, y }) => {
            let dx = x - mousePos.current.x;
            let dy = y - mousePos.current.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) return { letter, x, y };

            // 🟢 마우스를 반대로 밀어내는 효과
            const spreadFactor = Math.max(
              0,
              (MAX_SPREAD - distance) / MAX_SPREAD
            );
            let offsetX = spreadFactor * dx * 0.8;
            let offsetY = spreadFactor * dy * 0.8;

            // 🔴 충돌 감지 및 반발
            prev.forEach(({ x: otherX, y: otherY }) => {
              let ddx = x + offsetX - otherX;
              let ddy = y + offsetY - otherY;
              let dist = Math.sqrt(ddx * ddx + ddy * ddy);

              if (dist < LETTER_SIZE && dist !== 0) {
                let pushFactor = (LETTER_SIZE - dist) / dist;
                offsetX += ddx * pushFactor * PUSH_FORCE;
                offsetY += ddy * pushFactor * PUSH_FORCE;
              }
            });

            return {
              letter,
              x: isFinite(x + offsetX) ? x + offsetX : x,
              y: isFinite(y + offsetY) ? y + offsetY : y,
            };
          })
        );
        animationFrameId.current = null;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      {letters.map(({ letter, x, y }, index) => (
        <motion.span
          key={index}
          style={{
            position: "absolute",
            fontSize: "60px",
            fontWeight: 800,
            color: "#3a4a89",
            transform: `translate(${x}px, ${y}px)`,
          }}
          animate={{
            transform: `translate(${x}px, ${y}px)`,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          {letter}
        </motion.span>
      ))}
    </>
  );
};

const SentenceScatter = () => {
  const [sentence, setSentence] = useState("Scatter Letters");
  return (
    <>
      <AnimatedText sentence={sentence} />
      <ScatterButton>Scatter your own message..</ScatterButton>
    </>
  );
};

const ScatterButton = styled(Typography)({
  position: "absolute",
  top: "60%",
  fontSize: "18px",
  cursor: "pointer",
  color: "#fff",
  mixBlendMode: "difference",
  fontWeight: 200,
  "&:hover": {
    textDecoration: "underline",
  },
});

export default SentenceScatter;
