"use client";
import * as React from "react";
import { OptimizedImage } from './OptimizedImage';

export default function HeroSection() {
  const [marginTop, setMarginTop] = React.useState("0.8rem");
  React.useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const value = width <= 600 ? "2.4rem" : "0.8rem";
      setMarginTop(value);
      console.log("Hero marginTop:", value, "| window.innerWidth:", width);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="hero-section"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.2rem",
        marginBottom: "0.8rem",
        background: "var(--card-bg)",
        padding: "1.2rem 0.8rem",
        borderRadius: "1.2rem",
        boxShadow: "0 2px 8px #0001",
        marginTop,
        width: "100%",
        maxWidth: "none",
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <OptimizedImage
        src="/logo.png"
        alt="Recipe Book Logo"
        width={56}
        height={56}
        style={{
          borderRadius: "0.75rem",
          background: "#fff",
          minWidth: 56,
          minHeight: 56,
          width: 56,
          height: 56,
          objectFit: "contain",
        }}
      />
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "1.7rem",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--heading)",
          }}
        >
          Recipe Book
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
            color: "var(--text)",
            lineHeight: 1.4,
          }}
        >
          Discover, cook, and enjoy curated recipes with rich details and beautiful images.
        </p>
      </div>
    </div>
  );
}
