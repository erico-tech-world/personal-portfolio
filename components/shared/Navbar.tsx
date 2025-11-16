'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants/index';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const pathname = usePathname();

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsSticky(true);
      setIsBackToTopVisible(true);
    } else {
      setIsSticky(false);
      setIsBackToTopVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  if (pathname.startsWith('/admin-panel')) {
    return (
      <nav className="bg-navy-dark shadow-lg z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="bg-accent-cyan text-navy-dark font-bold py-2 px-6 rounded-md hover:bg-white transition-all duration-300">
            Return to Website
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-navy-dark shadow-lg py-2' : 'bg-transparent pt-12 pb-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="relative h-16 w-48 md:ml-16">
              <Image 
                  src="/assets/textlogobluewhitemain.png" 
                  alt="brandealer.Bd Logo" 
                  layout="fill"
                  objectFit="contain"
                  className="navbar-logo"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
          </Link>
          <div className="flex-grow hidden md:flex justify-center space-x-8 md:ml-16">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-white hover:text-accent-cyan transition-colors duration-300">{link.name}</a>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-navy-medium">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="block px-6 py-3 text-white hover:bg-navy-dark">{link.name}</a>
            ))}
          </div>
        )}
      </nav>
      {isBackToTopVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
            className="bg-accent-cyan text-navy-dark p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
            aria-label="Go to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <div
            className={`absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-accent-cyan rounded-md transition-all duration-150 ${
              isTooltipVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Back to Top
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
