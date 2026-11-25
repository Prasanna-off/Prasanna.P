import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  SiExpress,
  SiFramer,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRender,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVite
} from 'react-icons/si';
import { FaCss3Alt, FaJava, FaLinkedin } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import {
  Award,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  RotateCw,
  Send,
  Sparkles,
  Terminal
} from 'lucide-react';

import AnimatedContent from './components/reactbits/AnimatedContent';
import DepthCarousel from './components/reactbits/DepthCarousel';
import FlipCard from './components/reactbits/FlipCard';
import GooeyNav from './components/reactbits/GooeyNav';
import SpecularButton from './components/reactbits/SpecularButton';
import LogoLoop from './components/reactbits/LogoLoop';
import TargetCursor from './components/reactbits/TargetCursor';

import ScrollBackground from './components/ScrollBackground';
import Preloader3D from './components/Preloader3D';

import {
  ACHIEVEMENTS,
  CERTIFICATES,
  EDUCATION,
  LANGUAGES,
  PERSONAL_INFO,
  PROJECTS,
  SKILL_CATEGORIES
} from './data/resumeData';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];

export default function App() {
  const [bgReady, setBgReady] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  const heroCardRef = useRef(null);

  const handleBgReady = useCallback(() => {
    setBgReady(true);
  }, []);

  // Sync GooeyNav active pill with scroll position
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id);
            if (idx !== -1) setActiveNav(idx);
          }
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleNavChange = useCallback(
    (index, item) => {
      setActiveNav(index);
      const targetId = item?.href?.replace('#', '');
      if (targetId) scrollToSection(targetId);
    },
    [scrollToSection]
  );

  // Interactive 3D Hero Mouse Tilt
  const handleHeroMove = useCallback((e) => {
    const el = heroCardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({ rx: -py * 10, ry: px * 12 });
  }, []);

  const handleHeroLeave = useCallback(() => {
    setHeroTilt({ rx: 0, ry: 0 });
  }, []);

  // Technology logos from resume for LogoLoop
  const techLogos = useMemo(
    () => [
      { node: <FaJava />, title: 'Java', hoverColor: '#f89820' },
      { node: <SiPython />, title: 'Python', hoverColor: '#3776ab' },
      { node: <SiJavascript />, title: 'JavaScript', hoverColor: '#f7df1e' },
      { node: <SiTypescript />, title: 'TypeScript', hoverColor: '#3178c6' },
      { node: <SiHtml5 />, title: 'HTML5', hoverColor: '#e34f26' },
      { node: <FaCss3Alt />, title: 'CSS3', hoverColor: '#1572b6' },
      { node: <SiReact />, title: 'React.js', hoverColor: '#61dafb' },
      { node: <SiNodedotjs />, title: 'Node.js', hoverColor: '#339933' },
      { node: <SiExpress />, title: 'Express.js', hoverColor: '#ffffff' },
      { node: <SiSupabase />, title: 'Supabase', hoverColor: '#3ecf8e' },
      { node: <SiPostgresql />, title: 'PostgreSQL', hoverColor: '#4169e1' },
      { node: <SiThreedotjs />, title: 'Three.js', hoverColor: '#ffffff' },
      { node: <SiTailwindcss />, title: 'Tailwind CSS', hoverColor: '#38bdf8' },
      { node: <SiVite />, title: 'Vite', hoverColor: '#646cff' },
      { node: <SiFramer />, title: 'Framer Motion', hoverColor: '#e633ff' },
      { node: <SiGit />, title: 'Git', hoverColor: '#f05032' },
      { node: <SiGithub />, title: 'GitHub', hoverColor: '#ffffff' },
      { node: <VscVscode />, title: 'VS Code', hoverColor: '#007acc' },
      { node: <SiVercel />, title: 'Vercel', hoverColor: '#ffffff' },
      { node: <SiRender />, title: 'Render', hoverColor: '#46e3b7' }
    ],
    []
  );

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || sending) return;

    setSending(true);
    setFormError('');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name.trim(),
          name: formData.name.trim(),
          from_email: formData.email.trim(),
          email: formData.email.trim(),
          reply_to: formData.email.trim(),
          message: formData.message.trim()
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        }
      );

      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setFormError('Failed to send message. Please try again or email directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="portfolio-root">
      {/* 3D Startup Preloader */}
      <Preloader3D ready={bgReady} />

      {/* Custom Targeted Cursor */}
      <TargetCursor
        targetSelector=".cursor-target"
        cursorColor="#f3d27a"
        cursorColorOnTarget="#ffffff"
        spinDuration={2.6}
        hoverDuration={0.18}
        parallaxOn
        hideDefaultCursor
        blendMode="normal"
        size={34}
        cornerSize={11}
        thickness={2.5}
      />

      {/* Preserved 239-Frame Scroll-Animated Background */}
      <ScrollBackground onReady={handleBgReady} />

      {/* Fixed Header with GooeyNav & SpecularButton */}
      <header className="site-header">
        <a
          href="#home"
          className="brand-mark cursor-target"
          data-cursor-label="Home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          <span className="brand-mark__monogram">P</span>
          <span className="brand-mark__name">PRASANNA P</span>
        </a>

        <div className="site-header__nav">
          <GooeyNav
            items={NAV_ITEMS}
            activeIndex={activeNav}
            onChange={handleNavChange}
            theme="dark"
            color="#d4af37"
            activeTextColor="#09090b"
            colors={['#f3d27a', '#d4af37', '#b8860b']}
            size="sm"
            frame
            particleCount={14}
            spread={52}
            animationTime={550}
            gooeyness={0.55}
            wobble={0.45}
            hoverEffect
          />
        </div>

        <div className="site-header__cta">
          <SpecularButton
            size="sm"
            radius={999}
            tint="#d4af37"
            tintOpacity={0.14}
            blur={10}
            textColor="#f5f5f5"
            lineColor="#f3d27a"
            baseColor="#6b4f12"
            intensity={1.1}
            idleIntensity={0.45}
            autoAnimate
            speed={0.4}
            className="cursor-target"
            data-cursor-label="Reach Out"
            onClick={() => scrollToSection('contact')}
          >
            Contact Me
          </SpecularButton>
        </div>
      </header>

      {/* Main Content Above Scroll Background */}
      <main className="portfolio-main">
        {/* HERO SECTION */}
        <section id="home" className="section hero-section">
          {/* Floating 3D Obsidian-Gold Elements */}
          <div className="floating-3d-orb floating-3d-orb--1" aria-hidden="true" />
          <div className="floating-3d-orb floating-3d-orb--2" aria-hidden="true" />
          <div className="floating-3d-ring" aria-hidden="true" />

          <div
            ref={heroCardRef}
            className="hero-stage"
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
            style={{
              transform: `perspective(1200px) rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`
            }}
          >
            <AnimatedContent trigger="mount" distance={50} duration={0.9} ease="power3.out" blur={6}>
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>{PERSONAL_INFO.location} · Open to Full Stack Developer Internship</span>
              </div>

              <h1 className="hero-title">
                <span className="hero-title__greeting">Hello, I&apos;m</span>
                <span className="hero-title__name">{PERSONAL_INFO.name}</span>
              </h1>

              <p className="hero-role">{PERSONAL_INFO.title}</p>

              <p className="hero-subtitle">
                B.Sc. Computer Science with Artificial Intelligence student crafting interactive full-stack web
                applications and 3D browser experiences with React, Node.js, Express, Supabase, PostgreSQL, and
                Three.js.
              </p>

              <div className="hero-actions">
                <SpecularButton
                  size="lg"
                  radius={16}
                  tint="#d4af37"
                  tintOpacity={0.18}
                  blur={12}
                  textColor="#ffffff"
                  lineColor="#f3d27a"
                  baseColor="#7a5b18"
                  intensity={1.15}
                  idleIntensity={0.45}
                  autoAnimate
                  speed={0.35}
                  className="cursor-target"
                  data-cursor-label="View Work"
                  onClick={() => scrollToSection('projects')}
                >
                  Explore Projects
                </SpecularButton>

                <SpecularButton
                  size="lg"
                  radius={16}
                  tint="#ffffff"
                  tintOpacity={0.05}
                  blur={10}
                  textColor="#f5f5f5"
                  lineColor="#f3d27a"
                  baseColor="#3f3f46"
                  intensity={0.95}
                  idleIntensity={0.3}
                  className="cursor-target"
                  data-cursor-label="Get In Touch"
                  onClick={() => scrollToSection('contact')}
                >
                  Contact Me
                </SpecularButton>
              </div>

              <div className="hero-socials">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill cursor-target"
                  data-cursor-label="GitHub"
                >
                  <SiGithub size={16} />
                  <span>GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill cursor-target"
                  data-cursor-label="LinkedIn"
                >
                  <FaLinkedin size={16} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="social-pill cursor-target"
                  data-cursor-label="Email"
                >
                  <Mail size={16} />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </div>
            </AnimatedContent>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue__line" />
            <span className="scroll-cue__text">SCROLL TO EXPLORE</span>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">01 · ABOUT ME</span>
                <h2 className="section-title">Crafting Full-Stack &amp; 3D Web Experiences</h2>
              </div>
            </AnimatedContent>

            <div className="about-grid">
              <AnimatedContent distance={50} duration={0.85} delay={0.05} className="glass-card about-card tilt-card">
                <div className="card-icon-badge">
                  <Terminal size={20} />
                </div>
                <h3 className="card-heading">Professional Summary</h3>
                <p className="card-body">{PERSONAL_INFO.summary}</p>
              </AnimatedContent>

              <div className="about-side">
                <AnimatedContent distance={50} duration={0.85} delay={0.12} className="glass-card tilt-card">
                  <div className="card-icon-badge">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="card-heading">Education</h3>
                  <p className="edu-degree">{EDUCATION.degree}</p>
                  <p className="edu-school">{EDUCATION.institution}</p>
                  <span className="gold-pill">Batch: {EDUCATION.batch}</span>
                </AnimatedContent>

                <AnimatedContent distance={50} duration={0.85} delay={0.18} className="glass-card tilt-card">
                  <div className="card-icon-badge">
                    <Globe size={20} />
                  </div>
                  <h3 className="card-heading">Languages</h3>
                  <ul className="lang-list">
                    {LANGUAGES.map((lang) => (
                      <li key={lang.name} className="lang-item">
                        <span className="lang-item__name">{lang.name}</span>
                        <span className="lang-item__level">{lang.level}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">02 · TECHNICAL ARSENAL</span>
                <h2 className="section-title">Skills &amp; Technologies</h2>
                <p className="section-desc">
                  Core languages, frontend frameworks, backend APIs, databases, and deployment platforms from my
                  resume.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={40} duration={0.85} delay={0.08}>
              <div className="logo-loop-shell glass-card">
                <LogoLoop
                  logos={techLogos}
                  speed={85}
                  direction="left"
                  logoHeight={42}
                  gap={48}
                  hoverSpeed={0}
                  scaleOnHover
                  magnify={0.35}
                  labels="below"
                  fadeOut
                  fadeOutWidth={0.12}
                  ariaLabel="Technical skills and technologies"
                />
              </div>
            </AnimatedContent>

            <AnimatedContent distance={45} stagger={0.08} duration={0.75} className="skills-grid">
              {SKILL_CATEGORIES.map((group) => (
                <div key={group.category} className="glass-card skill-card tilt-card">
                  <div className="skill-card__header">
                    <Code2 size={18} className="gold-icon" />
                    <h3>{group.category}</h3>
                  </div>
                  <div className="tag-wrap">
                    {group.items.map((skill) => (
                      <span key={skill} className="tech-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatedContent>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">03 · FEATURED WORK</span>
                <h2 className="section-title">Projects</h2>
                <p className="section-desc">
                  Click or drag any project card to flip in 3D and inspect full architectural highlights, or launch
                  the live deployment.
                </p>
              </div>
            </AnimatedContent>

            <div className="projects-grid">
              {PROJECTS.map((project, idx) => (
                <AnimatedContent
                  key={project.id}
                  distance={60}
                  duration={0.85}
                  delay={idx * 0.12}
                  className="project-column"
                >
                  <div className="project-flip-wrap cursor-target" data-cursor-label="Click / Drag to Flip">
                    <FlipCard
                      width={480}
                      height={420}
                      radius={22}
                      background="#0c0c10"
                      color="#f5f5f5"
                      tilt
                      tiltMax={10}
                      glare
                      glareOpacity={0.2}
                      hoverScale={1.02}
                      shadowColor="#000000"
                      shadowOpacity={0.6}
                      ariaLabel={`${project.title} project card`}
                      front={
                        <div className="flip-face-inner flip-face-inner--front">
                          <div className="project-card__top">
                            <span className="gold-pill">
                              <Layers size={13} />
                              <span>Project 0{idx + 1}</span>
                            </span>
                            <span className="flip-hint">
                              <RotateCw size={13} />
                              <span>Flip for details</span>
                            </span>
                          </div>

                          <div className="project-card__body">
                            <h3 className="project-card__title">{project.title}</h3>
                            <p className="project-card__subtitle">{project.subtitle}</p>
                            <p className="project-card__tagline">{project.tagline}</p>
                          </div>

                          <div className="tag-wrap">
                            {project.technologies.map((tech) => (
                              <span key={tech} className="tech-tag tech-tag--compact">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      }
                      back={
                        <div className="flip-face-inner flip-face-inner--back">
                          <div className="project-card__top">
                            <span className="gold-pill">Highlights</span>
                            <span className="flip-hint">
                              <RotateCw size={13} />
                              <span>Flip back</span>
                            </span>
                          </div>
                          <h4 className="project-back-title">{project.title}</h4>
                          <ul className="project-highlights">
                            {project.highlights.map((bullet, bIdx) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      }
                    />
                  </div>

                  {project.liveDemo && (
                    <div className="project-actions">
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link-anchor cursor-target"
                        data-cursor-label="Open Live Site"
                      >
                        <SpecularButton
                          size="md"
                          radius={14}
                          tint="#d4af37"
                          tintOpacity={0.14}
                          blur={10}
                          textColor="#ffffff"
                          lineColor="#f3d27a"
                          baseColor="#6b4f12"
                          intensity={1.1}
                          idleIntensity={0.4}
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={16} />
                        </SpecularButton>
                      </a>
                      <span className="project-url-text">{project.liveDemo.replace('https://', '')}</span>
                    </div>
                  )}
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS & ACTIVITIES SECTION */}
        <section id="achievements" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">04 · RECOGNITION &amp; EVENTS</span>
                <h2 className="section-title">Activities &amp; Achievements</h2>
                <p className="section-desc">Interactive cards — click or drag to flip for event details.</p>
              </div>
            </AnimatedContent>

            <div className="achievements-grid">
              {ACHIEVEMENTS.map((item, idx) => (
                <AnimatedContent
                  key={item.title}
                  distance={50}
                  duration={0.8}
                  delay={idx * 0.1}
                  className="achievement-flip-wrap cursor-target"
                  data-cursor-label="Flip Card"
                >
                  <FlipCard
                    width={480}
                    height={230}
                    radius={20}
                    background="#0c0c10"
                    color="#f5f5f5"
                    tilt
                    tiltMax={9}
                    glare
                    glareOpacity={0.18}
                    hoverScale={1.02}
                    ariaLabel={item.title}
                    front={
                      <div className="flip-face-inner flip-face-inner--achievement">
                        <div className="project-card__top">
                          <span className="gold-pill">
                            <Award size={13} />
                            <span>{item.tag}</span>
                          </span>
                          <span className="flip-hint">
                            <RotateCw size={13} />
                            <span>Flip</span>
                          </span>
                        </div>
                        <div>
                          <h3 className="achievement-title">{item.title}</h3>
                          <p className="achievement-org">
                            {item.organization}
                            {item.date ? ` · ${item.date}` : ''}
                          </p>
                        </div>
                      </div>
                    }
                    back={
                      <div className="flip-face-inner flip-face-inner--achievement-back">
                        <span className="gold-pill">Details</span>
                        <p className="card-body">{item.description}</p>
                      </div>
                    }
                  />
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION (DepthCarousel) */}
        <section id="certifications" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">05 · CREDENTIALS</span>
                <h2 className="section-title">Certifications</h2>
                <p className="section-desc">
                  Drag, scroll, or use the controls to browse through all {CERTIFICATES.length} certificates in 3D
                  depth.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={50} duration={0.9} delay={0.1}>
              <div className="carousel-stage glass-card">
                <div className="carousel-frame cursor-target" data-cursor-label="Drag / Click">
                  <DepthCarousel
                    items={CERTIFICATES}
                    cardWidth={380}
                    cardHeight={280}
                    radius={18}
                    tint="#07070a"
                    depth={220}
                    spread={90}
                    tilt={20}
                    tiltDirection="right"
                    perspective={1400}
                    visibleCards={4}
                    falloff={0.2}
                    blur={5}
                    autoplay
                    autoplayDelay={3200}
                    loop
                    onChange={(idx) => setCertIndex(idx)}
                  />
                </div>
                <div className="carousel-counter">
                  Certificate {certIndex + 1} of {CERTIFICATES.length}
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="section">
          <div className="container">
            <AnimatedContent distance={60} tilt={6} duration={0.8} threshold={0.15}>
              <div className="section-header">
                <span className="section-eyebrow">06 · GET IN TOUCH</span>
                <h2 className="section-title">Contact</h2>
                <p className="section-desc">
                  Interested in collaborating or hiring for a Full Stack Developer Internship? Send a quick message.
                </p>
              </div>
            </AnimatedContent>

            <div className="contact-grid">
              <AnimatedContent distance={50} duration={0.85} delay={0.05} className="glass-card contact-info-card">
                <h3 className="card-heading">Direct Channels</h3>
                <div className="contact-links">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="contact-item cursor-target"
                    data-cursor-label="Send Email"
                  >
                    <span className="contact-item__icon">
                      <Mail size={18} />
                    </span>
                    <div>
                      <span className="contact-item__label">Email</span>
                      <span className="contact-item__value">{PERSONAL_INFO.email}</span>
                    </div>
                  </a>

                  <div className="contact-item">
                    <span className="contact-item__icon">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <span className="contact-item__label">Location</span>
                      <span className="contact-item__value">{PERSONAL_INFO.location}</span>
                    </div>
                  </div>

                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item cursor-target"
                    data-cursor-label="LinkedIn"
                  >
                    <span className="contact-item__icon">
                      <FaLinkedin size={18} />
                    </span>
                    <div>
                      <span className="contact-item__label">LinkedIn</span>
                      <span className="contact-item__value">linkedin.com/in/prasanna-p-off</span>
                    </div>
                  </a>

                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item cursor-target"
                    data-cursor-label="GitHub"
                  >
                    <span className="contact-item__icon">
                      <SiGithub size={18} />
                    </span>
                    <div>
                      <span className="contact-item__label">GitHub</span>
                      <span className="contact-item__value">github.com/Prasanna-off</span>
                    </div>
                  </a>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={50} duration={0.85} delay={0.12} className="glass-card contact-form-card">
                <h3 className="card-heading">Send a Message</h3>
                {formSubmitted ? (
                  <div className="form-success">
                    <CheckCircle2 size={36} className="gold-icon" />
                    <h4>Message Sent!</h4>
                    <p>
                      Thank you for reaching out. Your message has been delivered directly to my inbox.
                    </p>
                    <SpecularButton
                      size="sm"
                      radius={12}
                      tint="#d4af37"
                      tintOpacity={0.14}
                      textColor="#f5f5f5"
                      lineColor="#f3d27a"
                      baseColor="#6b4f12"
                      className="cursor-target"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send Another
                    </SpecularButton>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleContactSubmit}>
                    <div className="form-field">
                      <label htmlFor="contact-name">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="cursor-target"
                        data-cursor-label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="cursor-target"
                        data-cursor-label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        placeholder="Write your message..."
                        className="cursor-target"
                        data-cursor-label="Message"
                        value={formData.message}
                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    {formError && <p className="form-error">{formError}</p>}

                    <div className="form-submit-wrap">
                      <SpecularButton
                        type="submit"
                        disabled={sending}
                        size="md"
                        radius={14}
                        tint="#d4af37"
                        tintOpacity={0.18}
                        blur={10}
                        textColor="#ffffff"
                        lineColor="#f3d27a"
                        baseColor="#7a5b18"
                        intensity={1.15}
                        idleIntensity={0.45}
                        autoAnimate
                        className="cursor-target form-submit-btn"
                        data-cursor-label="Submit"
                      >
                        <span>{sending ? 'Sending...' : 'Send Message'}</span>
                        <Send size={16} />
                      </SpecularButton>
                    </div>
                  </form>
                )}
              </AnimatedContent>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} {PERSONAL_INFO.name} · {PERSONAL_INFO.title}</p>
        </footer>
      </main>
    </div>
  );
}
