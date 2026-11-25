import { useEffect, useState } from 'react';

export default function Preloader3D({ ready }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const t1 = setTimeout(() => setFading(true), 150);
    const t2 = setTimeout(() => setVisible(false), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  if (!visible) return null;

  return (
    <div className={`preloader-3d${fading ? ' is-fading' : ''}`} aria-hidden="true">
      <div className="preloader-3d__scene">
        <div className="preloader-3d__ring preloader-3d__ring--outer" />
        <div className="preloader-3d__ring preloader-3d__ring--inner" />
        <div className="preloader-3d__cube">
          <div className="preloader-3d__face preloader-3d__face--front">P</div>
          <div className="preloader-3d__face preloader-3d__face--back">P</div>
          <div className="preloader-3d__face preloader-3d__face--right" />
          <div className="preloader-3d__face preloader-3d__face--left" />
          <div className="preloader-3d__face preloader-3d__face--top" />
          <div className="preloader-3d__face preloader-3d__face--bottom" />
        </div>
      </div>
      <div className="preloader-3d__label">PRASANNA P · INITIALIZING 3D EXPERIENCE</div>
    </div>
  );
}
