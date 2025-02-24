import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUM_LETTERS = 50;
const LETTER_SIZE = 50; // 글자의 크기 (충돌 감지용)
const MAX_SPREAD = 100; // 마우스 반발 최대 거리
const PUSH_FORCE = 0.8; // 충돌 시 튕겨나는 힘 (기존 1.2 → 0.8로 감소)

const getRandomPosition = () => ({
  x: Math.random() * window.innerWidth - window.innerWidth / 2,
  y: Math.random() * window.innerHeight - window.innerHeight / 2,
});

const ScatterLetters = () => {
  const [positions, setPositions] = useState(
    Array.from({ length: NUM_LETTERS }, () => ({
      letter: ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)],
      pos: getRandomPosition(),
    }))
  );

  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };

    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(() => {
        setPositions((prev) =>
          prev.map(({ letter, pos }) => {
            let dx = pos.x - mousePos.current.x;
            let dy = pos.y - mousePos.current.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // 🛑 NaN 방지: 마우스와 정확히 겹치는 경우 (0,0)인 경우 그대로 유지
            if (distance === 0) return { letter, pos };

            // 🟢 마우스 반대 방향으로 퍼지게 spreadFactor 적용
            const spreadFactor = Math.max(
              0,
              (MAX_SPREAD - distance) / MAX_SPREAD
            );
            let offsetX = spreadFactor * dx * 1.5;
            let offsetY = spreadFactor * dy * 1.5;

            // 🔴 충돌 감지 및 반발 로직
            prev.forEach(({ pos: otherPos }) => {
              let ddx = pos.x + offsetX - otherPos.x;
              let ddy = pos.y + offsetY - otherPos.y;
              let dist = Math.sqrt(ddx * ddx + ddy * ddy);

              if (dist < LETTER_SIZE && dist !== 0) {
                let pushFactor = (LETTER_SIZE - dist) / dist;
                offsetX += ddx * pushFactor * PUSH_FORCE;
                offsetY += ddy * pushFactor * PUSH_FORCE;
              }
            });

            // 🛑 NaN 방지: 유효한 숫자인지 확인하고 적용
            return {
              letter,
              pos: {
                x: isFinite(pos.x + offsetX) ? pos.x + offsetX : pos.x,
                y: isFinite(pos.y + offsetY) ? pos.y + offsetY : pos.y,
              },
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {positions.map(({ letter, pos }, index) => (
        <motion.span
          key={index}
          style={{
            position: "absolute",
            fontSize: "30px",
            fontWeight: "bold",
            color: "white",
            left: "50%",
            top: "50%",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
          animate={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

export default function App() {
  return <ScatterLetters />;
}
