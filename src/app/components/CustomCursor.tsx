"use client";
import { useEffect, useState } from "react";

type CursorPosition = { x: number; y: number };

const CustomCursor = () => {
  // Keep track of tail positions for the trailing effect
  const [tailPositions, setTailPositions] = useState<CursorPosition[]>([]);
  // Track if the cursor is over a clickable element
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  // Track if mouse is currently over the navbar
  const [isOverNavbar, setIsOverNavbar] = useState(false);

  useEffect(() => {
    const updateTail = (x: number, y: number) => {
      setTailPositions((prev) => {
        const newTail = [...prev, { x, y }];
        if (newTail.length > 10) newTail.shift();
        return newTail;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const element = document.elementFromPoint(clientX, clientY);

      // Check if cursor is hovering over navbar or any header navigation element
      const overNav = !!(
        element &&
        (element.closest("nav") || element.closest("header") || element.closest(".navbar"))
      );

      setIsOverNavbar(overNav);

      if (overNav) {
        setTailPositions([]);
        return;
      }

      // Update CSS custom properties for the main cursor position
      document.documentElement.style.setProperty("--cursor-x", `${clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${clientY}px`);

      updateTail(clientX, clientY);

      // Determine if the element under the cursor is clickable
      const clickable =
        element &&
        (element.closest("a, button, input, textarea, select, [onClick]") ||
          element.getAttribute("role") === "button");
      setIsHoveringClickable(!!clickable);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // When hovering over the navbar, disable custom pointer follower completely
  if (isOverNavbar) return null;

  return (
    <>
      {/* Main custom cursor */}
      <div className={`custom-cursor ${isHoveringClickable ? "hover" : ""}`} />
      {/* Tail elements */}
      {tailPositions.map((pos, index) => (
        <div
          key={index}
          className="cursor-tail"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: (index + 1) / tailPositions.length,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
