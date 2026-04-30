"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  wrap,
  MotionValue,
} from "framer-motion";

export default function TickerScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const col4Ref = useRef<HTMLDivElement>(null);

  const targetY = useRef(0);
  const currentY = useRef(0);
  const singleSetHeight = useRef(0);

  const y1 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const y3 = useMotionValue(0);
  const y4 = useMotionValue(0);

  useEffect(() => {
    const column = col1Ref.current;
    if (!column || column.children.length < 5) return;

    const firstCard = column.children[0] as HTMLElement;
    const fifthCard = column.children[4] as HTMLElement;
    singleSetHeight.current = fifthCard.offsetTop - firstCard.offsetTop;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 1.2;
    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetY.current -= e.deltaY * scrollSpeed;
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY - touchY;
      lastTouchY = touchY;
      targetY.current -= deltaY * scrollSpeed;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useAnimationFrame(() => {
    const h = singleSetHeight.current;
    if (h === 0) return;

    const lerpFactor = 0.08;
    currentY.current += (targetY.current - currentY.current) * lerpFactor;

    const normalY = wrap(-h, 0, currentY.current - h);
    const reverseY = wrap(-h, 0, -currentY.current - h);

    y1.set(normalY);
    y3.set(normalY);
    y2.set(reverseY);
    y4.set(reverseY);
  });

  const cardImages = [
    "https://images.unsplash.com/photo-1642341185205-8e538ad2994c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1523980145253-50327d891e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGFuZG1hcmtzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1589191702216-923536264808?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFuZG1hcmtzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const Column = ({
    refContainer,
    y,
  }: {
    refContainer: React.RefObject<HTMLDivElement | null>;
    y: MotionValue<number>;
  }) => (
    <motion.div
      ref={refContainer}
      style={{ y }}
      className="flex flex-col gap-18 w-[240px] will-change-transform"
    >
      {[...cardImages, ...cardImages, ...cardImages].map((src, i) => (
        <div
          key={i}
          className="relative w-full h-[50vh] shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 transform-gpu transition-all duration-200 ease-out hover:scale-[0.85]"
        >
          <img
            src={src}
            alt={`Card ${i}`}
            className="w-full h-full object-cover opacity-90 transition-all duration-300 ease-out hover:opacity-100 hover:scale-105"
          />
        </div>
      ))}
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex justify-center p-4 md:p-8 touch-none"
    >
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] text-white/90 tracking-tighter whitespace-nowrap pointer-events-none select-none z-0">
        ticker scroller
      </h1>

      <div className="z-10 flex w-full max-w-[1400px] justify-center gap-12 min-h-[300vh]">
        <Column refContainer={col1Ref} y={y1} />
        <Column refContainer={col2Ref} y={y2} />
        <Column refContainer={col3Ref} y={y3} />
        <Column refContainer={col4Ref} y={y4} />
      </div>
    </div>
  );
}

// "use client";

// import { useRef } from "react";
// import gsap from "gsap";
// import { Observer } from "gsap/Observer";
// import { useGSAP } from "@gsap/react";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(Observer, useGSAP);
// }

// export default function TickerScroll() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const col1Ref = useRef<HTMLDivElement>(null);
//   const col2Ref = useRef<HTMLDivElement>(null);
//   const col3Ref = useRef<HTMLDivElement>(null);
//   const col4Ref = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       let targetY = 0;
//       let currentY = 0;
//       const lerpFactor = 0.08;
//       const scrollSpeed = 1.2;

//       const column = col1Ref.current;
//       if (!column || column.children.length < 5) return;

//       const firstCard = column.children[0] as HTMLElement;
//       const fifthCard = column.children[4] as HTMLElement;
//       const singleSetHeight = fifthCard.offsetTop - firstCard.offsetTop;

//       const wrap = gsap.utils.wrap(-singleSetHeight, 0);

//       const setY1 = gsap.quickSetter(col1Ref.current, "y", "px");
//       const setY2 = gsap.quickSetter(col2Ref.current, "y", "px");
//       const setY3 = gsap.quickSetter(col3Ref.current, "y", "px");
//       const setY4 = gsap.quickSetter(col4Ref.current, "y", "px");

//       gsap.set(
//         [col1Ref.current, col2Ref.current, col3Ref.current, col4Ref.current],
//         {
//           force3D: true,
//         },
//       );

//       const observer = Observer.create({
//         target: containerRef.current,
//         type: "wheel,touch,pointer",
//         preventDefault: true,
//         onChangeY: (self) => {
//           targetY -= self.deltaY * scrollSpeed;
//         },
//       });

//       const ticker = () => {
//         currentY += (targetY - currentY) * lerpFactor;

//         const normalY = wrap(currentY - singleSetHeight);
//         const reverseY = wrap(-currentY - singleSetHeight);

//         setY1(normalY);
//         setY3(normalY);
//         setY2(reverseY);
//         setY4(reverseY);
//       };

//       gsap.ticker.add(ticker);

//       return () => {
//         observer.kill();
//         gsap.ticker.remove(ticker);
//       };
//     },
//     { scope: containerRef },
//   );

//   const cardImages = [
//     "https://images.unsplash.com/photo-1642341185205-8e538ad2994c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1523980145253-50327d891e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGFuZG1hcmtzfGVufDB8fDB8fHww",
//     "https://images.unsplash.com/photo-1589191702216-923536264808?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFuZG1hcmtzfGVufDB8fDB8fHww",
//     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   ];

//   const Column = ({ refContainer }: { refContainer: any }) => (
//     <div
//       ref={refContainer}
//       className="flex flex-col gap-18 w-[240px] will-change-transform"
//     >
//       {[...cardImages, ...cardImages, ...cardImages].map((src, i) => (
//         <div
//           key={i}
//           className="relative w-full h-[50vh] shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 transform-gpu transition-all duration-200 ease-out hover:scale-[0.85]"
//         >
//           <img
//             src={src}
//             alt={`Card ${i}`}
//             className="w-full h-full object-cover opacity-90 transition-all duration-300 ease-out hover:opacity-100 hover:scale-105"
//           />
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div
//       ref={containerRef}
//       className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex justify-center p-4 md:p-8 touch-none"
//     >
//       <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] text-white/90 tracking-tighter whitespace-nowrap pointer-events-none select-none z-0">
//         ticker scroller
//       </h1>

//       {/* HORIZONTAL GAP: Set to gap-12 to match vertical exactly */}
//       <div className="z-10 flex w-full max-w-[1400px] justify-center gap-12 min-h-[300vh]">
//         <Column refContainer={col1Ref} />
//         <Column refContainer={col2Ref} />
//         <Column refContainer={col3Ref} />
//         <Column refContainer={col4Ref} />
//       </div>
//     </div>
//   );
// }
