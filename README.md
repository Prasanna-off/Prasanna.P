# PRASANNA P — 3D Animated Full Stack Developer Portfolio

A single-page, responsive 3D animated portfolio built with **React**, **Vite**, **GSAP**, **Motion**, **EmailJS**, and **React Bits** components, layered over a 239-frame scroll-animated canvas background.

## Features

- **Scroll-Animated Background (`ScrollBackground`)**: Fixed full-viewport HTML5 Canvas rendering 239 JPEG frames (`/jpg/ezgif-frame-001.jpg` – `239`) with smooth linear interpolation (`lerp`) tied to scroll progress.
- **3D Startup Preloader (`Preloader3D`)**: Rotating obsidian-gold 3D `"P"` monogram cube and orbital rings while the initial background frame loads.
- **React Bits Components** (`src/components/reactbits/`):
  - `GooeyNav`: WebGL/gooey pill navigation synced with scroll position (`Home`, `About`, `Skills`, `Projects`, `Contact`).
  - `SpecularButton`: WebGL edge-lit interactive buttons for navbar, hero CTAs, project live demos, and contact form submission.
  - `LogoLoop`: Continuous horizontal technology marquee in the Skills section.
  - `FlipCard`: Interactive 3D draggable/clickable flip cards for Projects and Achievements & Activities.
  - `DepthCarousel`: 3D depth-stacked certificate viewer displaying all 15 certificate images from `Certificates/`.
  - `AnimatedContent`: GSAP ScrollTrigger entrance animations for headings, descriptions, and cards.
  - `TargetCursor`: Custom bracket reticle cursor tracking `.cursor-target` elements on pointer-fine devices.
- **Contact Form (EmailJS)**: Collects `Name`, `Email`, and `Message` and sends emails directly via `@emailjs/browser`.
- **Custom Favicon**: Minimal obsidian-gold `"P"` SVG favicon (`public/favicon.svg`).

## Tech Stack

- **Frontend**: React 19, Vite 8, GSAP, Motion (`motion/react`), Lucide React, React Icons
- **Email**: `@emailjs/browser`
- **Styling**: Custom CSS (`src/styles.css`) + React Bits component CSS


