import React, { useRef, useEffect, useState } from 'react';

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          // Determine if element left from the top or bottom
          if (entry.boundingClientRect.top < 0) {
            setIsAbove(true);
          } else {
            setIsAbove(false);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransformClass = () => {
    if (isVisible) return 'translate-y-0';
    return isAbove ? '-translate-y-[25px]' : 'translate-y-[25px]';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[600ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        isVisible ? 'opacity-100' : 'opacity-20'
      } ${getTransformClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
