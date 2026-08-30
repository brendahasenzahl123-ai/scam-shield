import { useState, useEffect, useRef } from "react";

export default function usePullToRefresh(onRefresh, { threshold = 70 } = {}) {
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current || window;

    const onTouchStart = (e) => {
      const scrollTop = containerRef.current
        ? containerRef.current.scrollTop
        : window.scrollY;
      if (scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0) {
        setPulling(true);
        setPullY(Math.min(delta * 0.5, threshold * 1.2));
        if (delta > 10) e.preventDefault();
      }
    };

    const onTouchEnd = async () => {
      if (pullY >= threshold && !refreshing) {
        setRefreshing(true);
        setPullY(threshold * 0.6);
        await onRefresh();
        setRefreshing(false);
      }
      setPulling(false);
      setPullY(0);
      startY.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, pullY, refreshing, threshold]);

  return { containerRef, pullY, pulling, refreshing };
}