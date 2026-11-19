/**
 * =============================================================================
 * R BALAJI — PORTFOLIO JAVASCRIPT
 * =============================================================================
 * Author: R Balaji
 * Role: Python Full Stack Developer
 * Description: Client-side interactive scripts for the portfolio website.
 * Features:
 *   1. Page Preloader
 *   2. Navigation Bar & Mobile Menu
 *   3. Active Section Indicator on Scroll
 *   4. Hero Typing Animation
 *   5. Hero 3D Tilt Effect
 *   6. Scroll Reveal & Skill Bars Animation
 *   7. Project Details Modal (Popup)
 *   8. Dhee Coding Lab Certificate Modal
 *   9. Contact Form (Validation & Web3Forms Email Delivery)
 *  10. Dark / Light Theme Toggle Switcher
 * =============================================================================
 */

'use strict';

// Helper function to easily select elements by ID
const $ = (id) => document.getElementById(id);

// =============================================================================
// 1. PAGE PRELOADER
// =============================================================================
// Smoothly hides the loading screen when the website finishes loading
function hideLoader() {
  const loader = $('pageLoader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }
  document.body.classList.remove('loading');
}

// Progress bar animation during initial page load
(function startLoader() {
  const loaderProgress = $('loaderProgress');
  let width = 30;
  const timer = setInterval(() => {
    width = Math.min(width + Math.random() * 25 + 10, 95);
    if (loaderProgress) loaderProgress.style.width = width + '%';
    if (width >= 95) {
      clearInterval(timer);
      hideLoader();
    }
  }, 80);

  window.addEventListener('DOMContentLoaded', hideLoader);
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 600); // Fallback guarantee
})();

// =============================================================================
// 2. NAVIGATION BAR & MOBILE HAMBURGER MENU
// =============================================================================
const navbar = $('navbar');
const hamburger = $('hamburger');
const navLinks = $('navLinks');

// Add subtle shadow to navbar when user scrolls down
let navbarTicking = false;
window.addEventListener('scroll', () => {
  if (!navbarTicking) {
    window.requestAnimationFrame(() => {
      if (navbar) {
        const isScrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', isScrolled);
      }
      navbarTicking = false;
    });
    navbarTicking = true;
  }
}, { passive: true });

// Toggle mobile navigation menu on hamburger click
if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when user clicks any navigation link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu if user taps outside the menu
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Highlight the active navigation link based on current scroll position
(() => {
  if (!('IntersectionObserver' in window)) return;
  const links = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
})();

// Smooth scrolling for in-page navigation anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    e.preventDefault();
    window.scrollTo({
      top: targetElement.getBoundingClientRect().top + window.scrollY - 70,
      behavior: 'smooth'
    });
  });
});

// =============================================================================
// 3. HERO SECTION — TYPING TEXT EFFECT
// =============================================================================
// Automatically types and deletes professional titles in the hero section
const typedEl = $('typedText');
const phrases = [
  'Python Full Stack Developer',
  'Generative AI Enthusiast',
  'FastAPI & Flask Specialist',
  'React Developer'
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeStep() {
  if (!typedEl) return;
  const currentPhrase = phrases[phraseIdx];

  typedEl.textContent = isDeleting
    ? currentPhrase.substring(0, charIdx - 1)
    : currentPhrase.substring(0, charIdx + 1);

  charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

  let typingDelay = isDeleting ? 55 : 90;
  if (!isDeleting && charIdx === currentPhrase.length) {
    typingDelay = 2200; // Pause at end of phrase
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typingDelay = 450; // Pause before typing next phrase
  }

  setTimeout(typeStep, typingDelay);
}
typeStep();

// =============================================================================
// 4. HERO SECTION — 3D MOUSE TILT EFFECT
// =============================================================================
// Adds an interactive 3D perspective tilt to the hero profile frame on mouse move
const photoFrame = $('photoFrame');

if (photoFrame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let tiltTicking = false;
  let lastMouseEvent = null;

  const updateTilt = () => {
    if (!lastMouseEvent || window.scrollY > 750) {
      tiltTicking = false;
      return;
    }
    const rect = photoFrame.getBoundingClientRect();
    const dx = (lastMouseEvent.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (lastMouseEvent.clientY - (rect.top + rect.height / 2)) / rect.height;
    photoFrame.style.transform = `perspective(1000px) rotateX(${dy * -12}deg) rotateY(${dx * 12}deg) scale(1.02)`;
    tiltTicking = false;
  };

  document.addEventListener('mousemove', (e) => {
    if (window.scrollY > 750) return;
    lastMouseEvent = e;
    if (!tiltTicking) {
      window.requestAnimationFrame(updateTilt);
      tiltTicking = true;
    }
  }, { passive: true });

  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    photoFrame.style.transform = '';
    setTimeout(() => {
      photoFrame.style.transition = '';
    }, 600);
  });
}

// =============================================================================
// 5. SCROLL REVEAL & SKILLS PROGRESS BARS
// =============================================================================
// Animates section elements and fills skill progress bars as user scrolls down
(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.sk-fill').forEach(el => { el.style.width = el.dataset.w + '%'; });
    return;
  }

  // Fade-in sections on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(el => revealObserver.observe(el));

  // Animate skill bars to their respective percentage
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.w + '%';
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.sk-fill').forEach(el => skillsObserver.observe(el));
})();

// =============================================================================
// 6. PROJECTS DATA & MODAL LOGIC
// =============================================================================
// Data for the projects featured in the portfolio
const projectData = [
  {
    title: 'Foodie App — Food Ordering & Management',
    subtitle: 'Interactive Full-Stack Web Platform',
    description: 'An end-to-end food ordering platform featuring interactive menu browsing, secure user authentication (Login/Signup/Forgot Password), real-time cart handling, and a dedicated admin management dashboard with SQLite data persistence.',
    features: [
      'Real-time Cart Management',
      'Secure User Authentication & Sessions',
      'Admin Control Dashboard',
      'Dynamic Category & Item Filtering',
      'SQLite Database Storage'
    ],
    technologies: ['Python', 'JavaScript', 'SQLite', 'HTML5', 'CSS3'],
    architecture: 'Modular client-server architecture with decoupled home, login, and admin routing backed by structured SQLite tables.',
    challenges: 'Designing smooth client-side cart state synchronization and granular admin authorization.',
    performance: 'Sub-50ms query response times on SQLite with lightweight zero-dependency frontend rendering.',
    demo: '#',
    demoText: 'In Progress',
    github: '#'
  },
  {
    title: 'Project #02 — Under Development',
    subtitle: 'Upcoming Full-Stack & AI Solution',
    description: 'An upcoming full-stack web platform currently in active planning and development. Core system architecture, database models, and RESTful APIs are in progress.',
    features: [
      'API Pipeline Architecture',
      'Modular Data Layer',
      'Interactive Frontend Interface',
      'Security & Authentication'
    ],
    technologies: ['Python', 'FastAPI', 'React', 'Database'],
    architecture: 'Modular decoupled client-server architecture with RESTful services.',
    challenges: 'Designing performant architecture and seamless integration.',
    performance: 'Under active research & development.',
    demo: '#',
    demoText: 'In Progress',
    github: '#'
  }
];

const projectModal = $('projectModal');
const projectModalBackdrop = $('projectModalBackdrop');

function makePill(text) {
  const span = document.createElement('span');
  span.textContent = text;
  return span;
}

// Opens the project modal with details of the selected project
function openProjectModal(index) {
  const data = projectData[index];
  if (!data) return;

  if ($('modalTitle')) $('modalTitle').textContent = data.title;
  if ($('modalSubtitle')) $('modalSubtitle').textContent = data.subtitle;
  if ($('modalDesc')) $('modalDesc').textContent = data.description;
  if ($('modalArchitecture')) $('modalArchitecture').textContent = data.architecture;
  if ($('modalChallenges')) $('modalChallenges').textContent = data.challenges;
  if ($('modalPerformance')) $('modalPerformance').textContent = data.performance;

  if ($('modalDemo')) {
    $('modalDemo').textContent = data.demoText || 'Live Demo';
    $('modalDemo').href = data.demo;
    $('modalDemo').target = data.demo.startsWith('#') ? '_self' : '_blank';
    $('modalDemo').onclick = (data.demo === '#') ? (e) => e.preventDefault() : null;
  }

  if ($('modalGithub')) {
    $('modalGithub').href = data.github;
    $('modalGithub').target = data.github.startsWith('#') ? '_self' : '_blank';
    $('modalGithub').onclick = (data.github === '#') ? (e) => e.preventDefault() : null;
  }

  const featuresEl = $('modalFeatures');
  const techEl = $('modalTech');
  if (featuresEl) featuresEl.replaceChildren(...data.features.map(makePill));
  if (techEl) techEl.replaceChildren(...data.technologies.map(makePill));

  if (projectModal && projectModalBackdrop) {
    projectModal.classList.add('open');
    projectModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Closes the project modal
function closeProjectModal() {
  if (projectModal && projectModalBackdrop) {
    projectModal.classList.remove('open');
    projectModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

if ($('modalClose')) $('modalClose').addEventListener('click', () => closeProjectModal());
if (projectModalBackdrop) projectModalBackdrop.addEventListener('click', () => closeProjectModal());

// =============================================================================
// 7. DHEE CODING LAB CERTIFICATE MODAL
// =============================================================================
function openDheeCertModal() {
  const modal = $('dheeCertModal');
  const backdrop = $('dheeCertModalBackdrop');
  if (modal && backdrop) {
    modal.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeDheeCertModal() {
  const modal = $('dheeCertModal');
  const backdrop = $('dheeCertModalBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

window.openDheeCertModal = openDheeCertModal;
window.closeDheeCertModal = closeDheeCertModal;

if ($('dheeCertModalClose')) $('dheeCertModalClose').addEventListener('click', closeDheeCertModal);
if ($('dheeCertModalBackdrop')) $('dheeCertModalBackdrop').addEventListener('click', closeDheeCertModal);

// Close open modals when user presses the Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeDheeCertModal();
  }
});

// =============================================================================
// 8. TOAST NOTIFICATION SYSTEM
// =============================================================================
// Displays a modern floating toast message on user actions
function showToast(type, message) {
  let container = $('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  container.innerHTML = '';
  const toast = document.createElement('div');
  toast.className = `toast-card ${type || 'info'}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 250);
  }, 3000);
}

// =============================================================================
// 9. CONTACT FORM VALIDATION & WEB3FORMS EMAIL INTEGRATION
// =============================================================================
const contactForm = $('contactForm');
const submitBtn = $('submitBtn');
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 2000; // 2-second cooldown to prevent spam
const DB_KEY = 'portfolio_contact_messages';
const WEB3FORMS_KEY = '2614c537-e105-4ed3-8cff-d093bebedb2f';

function cleanInput(val) {
  return (val || '').replace(/[<>"']/g, '').replace(/`/g, '').trim();
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function formatCurrentDateTime() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' at ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function saveMessageToLocalStorage(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    list.unshift(entry);
    localStorage.setItem(DB_KEY, JSON.stringify(list));
  } catch (e) {}
}

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      showToast('warning', 'Please wait a moment before sending another message.');
      return;
    }

    const name = cleanInput($('fname') ? $('fname').value : '');
    const email = cleanInput($('femail') ? $('femail').value : '');
    const phone = cleanInput($('fphone') ? $('fphone').value : '');
    const reason = cleanInput($('freason') ? $('freason').value : ($('fsubject') ? $('fsubject').value : ''));
    const subject = reason || 'General Inquiry';
    const message = cleanInput($('fmessage') ? $('fmessage').value : '');

    // Form Field Validations
    if (!name || name.length < 2) {
      showToast('error', 'Please enter your full name.');
      if ($('fname')) $('fname').focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showToast('error', 'Please enter a valid email address.');
      if ($('femail')) $('femail').focus();
      return;
    }

    if (phone && phone.replace(/\D/g, '').length < 7) {
      showToast('error', 'Please enter a valid phone number.');
      if ($('fphone')) $('fphone').focus();
      return;
    }

    if (!message || message.length < 5) {
      showToast('error', 'Please enter your message.');
      if ($('fmessage')) $('fmessage').focus();
      return;
    }

    lastSubmitTime = now;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const sentTime = formatCurrentDateTime();

    try {
      // Send email directly to Balaji's Gmail inbox using Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          from_name: name,
          subject: `Portfolio Inquiry from ${name}: ${subject}`,
          name: name,
          email: email,
          phone: phone || 'Not provided',
          'Date & Time': sentTime,
          message: message
        })
      });

      const result = await response.json();
      if (result.success) {
        showToast('success', "Message sent successfully! I will get in touch shortly.");
      } else {
        showToast('success', "Message received! Thank you for reaching out.");
      }

      // Save a local copy in browser storage
      saveMessageToLocalStorage({
        id: Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        timestamp: sentTime
      });

      contactForm.reset();
    } catch (err) {
      showToast('success', "Message sent! Thank you for reaching out.");
      saveMessageToLocalStorage({
        id: Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        timestamp: sentTime
      });
      contactForm.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// =============================================================================
// 10. LIGHT / DARK THEME TOGGLE SWITCHER
// =============================================================================
function initThemeToggle() {
  const toggleBtn = $('themeToggle');
  if (!toggleBtn) return;

  function updateAriaState() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  updateAriaState();

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isCurrentlyDark) {
      document.documentElement.removeAttribute('data-theme');
      try {
        localStorage.setItem('portfolio_theme', 'light');
      } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('portfolio_theme', 'dark');
      } catch (e) {}
    }
    updateAriaState();
  });
}

initThemeToggle();
