"use client";

import { useState, useRef, useEffect } from 'react';
import PropertyImage from './PropertyImage';

export default function ZoomablePropertyImage({ src, alt, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const aspectRatio = width / height;
      const newScale = aspectRatio > 1 ? 1.5 * (1 + (aspectRatio - 1) * 0.5) : 1.5;
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !isHovered) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <PropertyImage
        src={src}
        alt={alt}
        fill={true}
        quality={95}
        sizes="(max-width: 768px) 200vw, 150vw" // Load larger size for zoom
        style={{
          objectFit: 'cover',
          transition: 'all 300ms ease-out',
          objectPosition: `${position.x}% ${position.y}%`,
          transform: `scale(${isHovered ? scale : 1})`,
          transformOrigin: 'center',
          imageRendering: 'high-quality',
        }}
        priority
        className="duration-300"
      />
    </div>
  );
}
