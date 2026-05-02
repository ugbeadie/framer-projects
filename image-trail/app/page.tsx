// "use client";

// import { useRef, useState, useEffect } from "react";
// import { motion } from "framer-motion";

// type TrailImage = {
//   id: number;
//   x: number;
//   y: number;
//   src: string;
// };

// const images = [
//   "https://images.unsplash.com/photo-1642341185205-8e538ad2994c?q=80&w=600&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1523980145253-50327d891e0e?w=600&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1589191702216-923536264808?w=600&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
// ];

// // How far the cursor has to move before a new image drops
// const THRESHOLD = 50;
// // image size
// const SIZE = 180;
// // Total animation duration in seconds
// const TOTAL_DURATION = 0.8;

// export default function ImageTrail() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [trail, setTrail] = useState<TrailImage[]>([]);

//   const lastDropPos = useRef({ x: 0, y: 0 });
//   const imageIndex = useRef(0);
//   const idCounter = useRef(0);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = container.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       const dx = x - lastDropPos.current.x;
//       const dy = y - lastDropPos.current.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       if (distance < THRESHOLD) return;

//       lastDropPos.current = { x, y };

//       const newImage: TrailImage = {
//         id: idCounter.current++,
//         x,
//         y,
//         src: images[imageIndex.current % images.length],
//       };

//       imageIndex.current++;
//       setTrail((prev) => [...prev, newImage]);
//     };

//     container.addEventListener("mousemove", handleMouseMove);
//     return () => container.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden"
//     >
//       <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5vw] text-white/90 tracking-tighter pointer-events-none select-none">
//         move your cursor
//       </h1>

//       {trail.map((img) => (
//         <motion.img
//           key={img.id}
//           src={img.src}
//           alt=""
//           initial={{ opacity: 0, scale: 0.4 }}
//           animate={{
//             opacity: [0, 1, 1, 0],
//             scale: [0.4, 1, 1, 0.85],
//           }}
//           transition={{
//             duration: TOTAL_DURATION,
//             times: [0, 0.25, 0.5, 1],
//             ease: "easeOut",
//           }}
//           onAnimationComplete={() => {
//             setTrail((prev) => prev.filter((t) => t.id !== img.id));
//           }}
//           className="absolute pointer-events-none object-cover"
//           style={{
//             left: img.x,
//             top: img.y,
//             width: SIZE,
//             height: SIZE,
//             x: "-50%",
//             y: "-50%",
//           }}
//         />
//       ))}
//     </div>
//   );
// }

"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

type TrailImage = {
  id: number;
  x: number;
  y: number;
  src: string;
};

const images = [
  "https://images.unsplash.com/photo-1642341185205-8e538ad2994c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523980145253-50327d891e0e?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1589191702216-923536264808?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
];

const THRESHOLD = 50;

const SIZE = 150;

export default function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailImage[]>([]);

  const lastDropPos = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const idCounter = useRef(0);
  // Track which images have already been animated so callback refs don't re-fire
  const animatedIds = useRef(new Set<number>());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - lastDropPos.current.x;
      const dy = y - lastDropPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < THRESHOLD) return;

      lastDropPos.current = { x, y };

      const newImage: TrailImage = {
        id: idCounter.current++,
        x,
        y,
        src: images[imageIndex.current % images.length],
      };

      imageIndex.current++;
      setTrail((prev) => [...prev, newImage]);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden"
    >
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5vw] text-white/90 tracking-tighter pointer-events-none select-none">
        move your cursor
      </h1>

      {trail.map((img) => (
        <img
          key={img.id}
          ref={(el) => {
            if (!el || animatedIds.current.has(img.id)) return;
            animatedIds.current.add(img.id);

            gsap
              .timeline({
                onComplete: () => {
                  setTrail((prev) => prev.filter((t) => t.id !== img.id));
                  animatedIds.current.delete(img.id);
                },
              })
              .fromTo(
                el,
                { opacity: 0, scale: 0.4, xPercent: -50, yPercent: -50 },
                {
                  opacity: 1,
                  scale: 1,
                  xPercent: -50,
                  yPercent: -50,
                  duration: 0.2,
                  ease: "power2.out",
                  force3D: true,
                },
              )
              .to(el, { duration: 0.2 })
              .to(el, {
                opacity: 0,
                scale: 0.85,
                duration: 0.4,
                ease: "power2.in",
              });
          }}
          src={img.src}
          alt=""
          className="absolute pointer-events-none object-cover"
          style={{
            left: img.x,
            top: img.y,
            width: SIZE,
            height: SIZE,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
