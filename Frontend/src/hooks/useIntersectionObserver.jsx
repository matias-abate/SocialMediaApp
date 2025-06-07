import { useEffect, useRef } from "react";

export function useIntersectionObserver({ onIntersect, enabled }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled, onIntersect]);

  return { ref };
}
