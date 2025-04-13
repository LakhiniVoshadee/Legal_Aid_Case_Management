// Initialize AOS (Animate on Scroll) library
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease',
    once: true,
    offset: 100
  });

  // Loader functionality
  setTimeout(function() {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';

    // Remove loader from DOM after fade out
    setTimeout(function() {
      loader.style.display = 'none';
    }, 500);
  }, 1500); // Show loader for 1.5 seconds

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      // Toggle the mobile menu
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';

        // Add slide down animation
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.overflow = 'hidden';
        mobileMenu.style.transition = 'max-height 0.5s ease';

        // Force reflow
        mobileMenu.offsetHeight;

        // Set actual height
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
      } else {
        // Slide up animation
        mobileMenu.style.maxHeight = '0';

        setTimeout(() => {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }, 500);
      }
    });
  }

  // Navigation active state
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function setActiveLink() {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Desktop navigation
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });

    // Mobile navigation
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  // Call setActiveLink on scroll
  window.addEventListener('scroll', setActiveLink);

  // Close mobile menu when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    });
  });

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form fields
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return false;
      }

      // Show success message (in a real app, you'd send data to a server)
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Reveal animations on scroll
  function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal');

    elements.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - 150) {
        element.classList.add('revealed');
      }
    });
  }

  // Call revealOnScroll on initial load and scroll
  window.addEventListener('load', revealOnScroll);
  window.addEventListener('scroll', revealOnScroll);

  // Modal toggle for login with loader
  const modalToggles = document.querySelectorAll('[data-modal-toggle="loginModal"]');
  const modal = document.getElementById('loginModal');
  const signinLoader = document.getElementById('signinLoader');

  modalToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      // Show wave loader
      signinLoader.classList.remove('hidden');

      // Simulate loading for 0.5s, then show modal
      setTimeout(() => {
        signinLoader.classList.add('hidden');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }, 500);
    });
  });

  // Close modal
  modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
});
