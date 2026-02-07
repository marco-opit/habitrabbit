import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export function ConfettiEffect() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ["#F59E0B", "#EC4899", "#8B5CF6", "#10B981", "#3B82F6", "#EF4444"];
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}
