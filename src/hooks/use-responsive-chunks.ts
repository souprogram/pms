import { useCallback, useEffect, useRef, useState } from "react";
import { chunkArrayWithMin } from "../lib/utils";

const getBreakpointChunkSize = (width?: number) => {
  const newWidth = width || window.innerWidth;
  if (newWidth >= 1536) return { min: 2, max: 4 }; // xl
  if (newWidth >= 1280) return { min: 2, max: 3 }; // lg
  if (newWidth >= 640) return { min: 1, max: 2 }; // md
  return { min: 1, max: 1 }; // sm (mobile)
};

const generateNewChunkSize = () => {
  const { min, max } = getBreakpointChunkSize();
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isBreakpointCrossed = (lastBreakpoint: number, width: number) => {
  return (
    (lastBreakpoint < 640 && width >= 640) || // sm → md
    (lastBreakpoint < 1024 && width >= 1024) || // md → lg
    (lastBreakpoint < 1280 && width >= 1280) || // lg → xl
    (lastBreakpoint < 1536 && width >= 1536) || // xl → 2xl
    (lastBreakpoint >= 1536 && width < 1536) || // 2xl → xl
    (lastBreakpoint >= 1280 && width < 1280) || // xl → lg
    (lastBreakpoint >= 1024 && width < 1024) || // lg → md
    (lastBreakpoint >= 640 && width < 640) // md → sm
  );
};

export const useResponsiveChunks = <T>(items: T[]) => {
  const [chunkedItems, setChunkedItems] = useState<T[][]>([]);

  const prevCountRef = useRef(0);

  useEffect(() => {
    const currentCount = items.length;
    const newItems = items.slice(prevCountRef.current, currentCount);

    if (newItems.length > 0) {
      const { min } = getBreakpointChunkSize();
      const newChunks = chunkArrayWithMin(newItems, generateNewChunkSize, min);

      setChunkedItems((prev) => [...prev, ...newChunks]);
      prevCountRef.current = currentCount;
    }
  }, [items]);

  const refreshChunkedItems = useCallback(() => {
    const { min } = getBreakpointChunkSize();
    setChunkedItems(chunkArrayWithMin(items, generateNewChunkSize, min));
  }, [items]);

  const lastBreakpoint = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (isBreakpointCrossed(lastBreakpoint.current, width)) {
        refreshChunkedItems();
        lastBreakpoint.current = width;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [refreshChunkedItems]);

  return chunkedItems;
};
