import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/layout/Navbar';
import Footer from '@/layout/Footer';
import CartDrawer from '@/layout/CartDrawer';

export default function PublicLayout() {
  return (
    <div className="public-shell era-body-transition min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <filter id="era-pencil">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="min-h-screen bg-[var(--bg-primary)]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <div aria-hidden className="era-grain" />
    </div>
  );
}
