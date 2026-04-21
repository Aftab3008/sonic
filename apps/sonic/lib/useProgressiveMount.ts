import { useEffect, useState, useCallback, startTransition } from "react";

export type MountPhase = 0 | 1 | 2 | 3;

interface UseProgressiveMountOptions {
  phase1Delay?: number; // Critical content (ms)
  phase2Delay?: number; // Images + secondary (ms)
  phase3Delay?: number; // Non-critical (ms)
  deferUntilIdle?: boolean; // Wait for JS thread idle before phasing
}

/**
 * Hook that returns true only after JS thread is idle.
 * Uses requestIdleCallback (modern replacement for deprecated InteractionManager).
 * Falls back to requestAnimationFrame for environments without requestIdleCallback.
 */
export function useIdleReady(timeout: number = 500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(
        () => {
          if (!cancelled) setReady(true);
        },
        { timeout },
      );
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    } else {
      // Fallback: wait one frame then mark ready
      const raf = requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }
  }, [timeout]);

  return ready;
}

/**
 * Progressive mount hook - stages component mounting across frames
 * Phase 0: Skeleton/placeholder (immediate)
 * Phase 1: Critical content (~50ms)
 * Phase 2: Images + secondary (~150ms)
 * Phase 3: Non-critical deferred (~300ms)
 */
export function useProgressiveMount(options: UseProgressiveMountOptions = {}): {
  phase: MountPhase;
  isPhase1: boolean;
  isPhase2: boolean;
  isPhase3: boolean;
} {
  const {
    phase1Delay = 50,
    phase2Delay = 150,
    phase3Delay = 300,
    deferUntilIdle = false,
  } = options;

  const [phase, setPhase] = useState<MountPhase>(0);
  const idleReady = useIdleReady();

  const canStart = deferUntilIdle ? idleReady : true;

  useEffect(() => {
    if (!canStart) return;

    let phase1Timer: number;
    let phase2Timer: number;
    let phase3Timer: number;

    phase1Timer = requestAnimationFrame(() => {
      startTransition(() => setPhase(1));

      phase2Timer = window.setTimeout(() => {
        startTransition(() => setPhase(2));

        phase3Timer = window.setTimeout(() => {
          startTransition(() => setPhase(3));
        }, phase3Delay - phase2Delay);
      }, phase2Delay - phase1Delay);
    });

    return () => {
      cancelAnimationFrame(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
    };
  }, [canStart, phase1Delay, phase2Delay, phase3Delay]);

  return {
    phase,
    isPhase1: phase >= 1,
    isPhase2: phase >= 2,
    isPhase3: phase >= 3,
  };
}

/**
 * Deferred mount component - renders children after delay
 */
interface DeferredMountProps {
  children: React.ReactNode;
  delay?: number;
  placeholder?: React.ReactNode;
}

export function useDeferredMount(delay: number = 300): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => setShow(true), { timeout: delay })
        : setTimeout(() => setShow(true), delay);

    return () => {
      if (typeof timer === "number") {
        if (typeof cancelIdleCallback !== "undefined") {
          cancelIdleCallback(timer);
        } else {
          clearTimeout(timer);
        }
      }
    };
  }, [delay]);

  return show;
}

/**
 * Image preload hook - prefetch images before mount
 */
export function usePreloadImages(urls: (string | undefined | null)[]): {
  loaded: boolean;
  progress: number;
} {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const validUrls = urls.filter((url): url is string => Boolean(url));
    if (validUrls.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;
    const total = validUrls.length;

    const promises = validUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(loadedCount / total);
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(loadedCount / total);
          resolve();
        };
        img.src = url;
      });
    });

    Promise.all(promises).then(() => setLoaded(true));
  }, [urls]);

  return { loaded, progress };
}

/**
 * Staged mount hook for complex components
 * Mounts components in stages with frame breaks
 */
export function useStagedMount(stages: number = 3): {
  stage: number;
  nextStage: () => void;
} {
  const [stage, setStage] = useState(0);

  const nextStage = useCallback(() => {
    setStage((prev) => Math.min(prev + 1, stages));
  }, [stages]);

  useEffect(() => {
    if (stage >= stages) return;

    const timer = requestAnimationFrame(() => {
      nextStage();
    });

    return () => cancelAnimationFrame(timer);
  }, [stage, stages, nextStage]);

  return { stage, nextStage };
}
