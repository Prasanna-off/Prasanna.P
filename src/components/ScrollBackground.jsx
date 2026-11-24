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

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (disposed) return;
        if (i === 1 && !firstFrameDrawn) {
          firstFrameDrawn = true;
          drawFrame(1);
          onReady?.();
        }
      };
      images[i - 1] = img;
    }

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
      clearTimeout(fallbackTimer);
      window.removeEventListener('scroll', calculateTargetFrame);
      window.removeEventListener('resize', calculateTargetFrame);
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
