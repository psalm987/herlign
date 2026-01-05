"use client";
import { useEffect, useState, RefObject } from "react";

type ViewportDirection = "top" | "bottom" | "both";

interface UseViewportOptions {
  /**
   * Direction to watch for viewport entry
   * @default 'both'
   */
  direction?: ViewportDirection;
  /**
   * Percentage of element that must be visible (0-1)
   * @default 0
   */
  threshold?: number;
  /**
   * Root margin for intersection observer
   * @default '0px'
   */
  rootMargin?: string;
  /**
   * Only trigger once when element enters viewport
   * @default false
   */
  once?: boolean;
}

interface UseViewportReturn {
  isInViewport: boolean;
  hasEntered: boolean;
}

export function useViewport(
  ref: RefObject<Element>,
  options: UseViewportOptions = {}
): UseViewportReturn {
  const {
    direction = "both",
    threshold = 0,
    rootMargin = "0px",
    once = false,
  } = options;

  const [isInViewport, setIsInViewport] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting, boundingClientRect } = entry;

        // Check direction
        let shouldUpdate = false;
        if (direction === "both") {
          shouldUpdate = isIntersecting;
        } else if (direction === "top") {
          // Entering from top means element is coming from above viewport
          shouldUpdate =
            isIntersecting && boundingClientRect.top <= window.innerHeight;
        } else if (direction === "bottom") {
          // Entering from bottom means element is coming from below viewport
          shouldUpdate = isIntersecting && boundingClientRect.top >= 0;
        }

        if (shouldUpdate) {
          setIsInViewport(true);
          if (!hasEntered) {
            setHasEntered(true);
          }
          if (once) {
            observer.disconnect();
          }
        } else {
          setIsInViewport(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, direction, threshold, rootMargin, once, hasEntered]);

  return { isInViewport, hasEntered };
}
