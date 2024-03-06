import { useEffect, useRef, useState } from "react";

const useResizeObserver = (
  elementRef: React.RefObject<HTMLElement | null>,
  debounceDelay: number = 300
): DOMRectReadOnly | undefined => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | undefined>(
    undefined
  );
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const debounce = (func: () => void, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      return () => {
        clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
        timeoutId = setTimeout(func, delay);
      };
    };

    const handleResize = debounce(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setDimensions(
          new DOMRectReadOnly(rect.x, rect.y, rect.width, rect.height)
        );
      }
    }, debounceDelay);

    resizeObserverRef.current = new ResizeObserver((entries) => {
      handleResize();
    });

    resizeObserverRef.current.observe(elementRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [elementRef, debounceDelay]);

  return dimensions;
};

export default useResizeObserver;
