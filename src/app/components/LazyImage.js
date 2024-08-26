"use client";
import { useState, useEffect, useRef } from "react";

const LazyImage = ({ src, placeholder, alt, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div
      {...props}
      ref={imgRef}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {isLoading && !isVisible && (
        <img
          src={placeholder}
          alt={alt}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <img
        src={isVisible ? src : undefined}
        alt={alt}
        style={{
          display: isVisible ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default LazyImage;
