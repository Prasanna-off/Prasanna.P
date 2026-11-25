import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 239;

const getFrameUrl = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/jpg/ezgif-frame-${padded}.jpg`;
};

export default function ScrollBackground({ onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const images = new Array(TOTAL_FRAMES);
    let currentFrame = 1;
    let targetFrame = 1;
    let firstFrameDrawn = false;
    let rafId = 0;
    let disposed = false;

    const drawFrame = (index) => {
      const frameIdx = Math.min(Math.max(Math.round(index), 1), TOTAL_FRAMES);
      const img = images[frameIdx - 1];
      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
    };

    const calculateTargetFrame = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
      targetFrame = 1 + progress * (TOTAL_FRAMES - 1);
    };

    const animate = () => {
      if (disposed) return;
      const ease = 0.14;
      const diff = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.005) {
        currentFrame += diff * ease;
        drawFrame(currentFrame);
      }
      rafId = requestAnimationFrame(animate);
    };

    // Load frame 1 immediately for instant initial paint & LCP
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (disposed) return;
      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        drawFrame(1);
        onReady?.();
      }
    };
    images[0] = firstImg;

    // Preload remaining frames after initial load settles (2.5s) or immediately on first user scroll/touch
    let nextFrame = 2;
    let preloadStarted = false;
    const startPreload = () => {
      if (preloadStarted || disposed) return;
      preloadStarted = true;
      const loadBatch = () => {
        if (disposed || nextFrame > TOTAL_FRAMES) return;
        const end = Math.min(nextFrame + 11, TOTAL_FRAMES);
        for (let i = nextFrame; i <= end; i++) {
          const img = new Image();
          img.decoding = 'async';
          img.src = getFrameUrl(i);
          images[i - 1] = img;
        }
        nextFrame = end + 1;
        if (nextFrame <= TOTAL_FRAMES) {
          setTimeout(loadBatch, 60);
        }
      };
      loadBatch();
    };

    const batchTimer = setTimeout(startPreload, 2500);
    window.addEventListener('scroll', startPreload, { once: true, passive: true });
    window.addEventListener('touchstart', startPreload, { once: true, passive: true });
    window.addEventListener('wheel', startPreload, { once: true, passive: true });

    calculateTargetFrame();
    window.addEventListener('scroll', calculateTargetFrame, { passive: true });
    window.addEventListener('resize', calculateTargetFrame, { passive: true });
    rafId = requestAnimationFrame(animate);

    // Fallback in case frame 1 takes longer or is cached synchronously
    const fallbackTimer = setTimeout(() => {
      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        onReady?.();
      }
    }, 900);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(batchTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('scroll', calculateTargetFrame);
      window.removeEventListener('resize', calculateTargetFrame);
      window.removeEventListener('scroll', startPreload);
      window.removeEventListener('touchstart', startPreload);
      window.removeEventListener('wheel', startPreload);
    };
  }, [onReady]);

  return (
    <>
      <div className="scroll-bg" aria-hidden="true">
        <canvas ref={canvasRef} className="scroll-bg__canvas" />
        <div className="scroll-bg__vignette" />
      </div>
    </>
  );
}
