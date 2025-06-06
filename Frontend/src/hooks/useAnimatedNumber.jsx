// Frontend/src/hooks/useAnimatedNumber.jsx
import { useEffect, useRef, useState } from "react";

/**
 * @param {number} targetValue  → el valor final que queremos mostrar (por ejemplo, 10 likes)
 * @param {number} duration     → duración total de la animación en ms (por ej. 500ms)
 */
export function useAnimatedNumber(targetValue, duration = 500) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValueRef = useRef(targetValue);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    const diff = targetValue - prev;
    if (diff === 0) return;

    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        // Al finalizar, dejamos el valor exacto
        setDisplayValue(targetValue);
        prevValueRef.current = targetValue;
        cancelAnimationFrame(animationFrameRef.current);
        return;
      }
      // interpolamos linealmente:
      const progress = elapsed / duration;
      const current = Math.round(prev + diff * progress);
      setDisplayValue(current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup si el componente se desmonta
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [targetValue, duration]);

  return displayValue;
}
