// LawNet Header JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Function to handle header scroll effect
  function handleHeaderScroll() {
    const header = document.querySelector('.lawnet-header');

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleHeaderScroll);

  // Initialize header state on page load
  handleHeaderScroll();

  // Active link highlighting
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Remove active class from all links
      navLinks.forEach(item => {
        item.classList.remove('active');
      });

      // Add active class to clicked link
      this.classList.add('active');
    });
  });
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Simple image loading animation
  const heroImage = document.querySelector('.hero-image img');
  if (heroImage) {
    heroImage.style.opacity = '0';

    heroImage.onload = function() {
      setTimeout(function() {
        heroImage.style.transition = 'opacity 1s ease';
        heroImage.style.opacity = '1';
      }, 300);
    };

    // If image is already loaded
    if (heroImage.complete) {
      heroImage.onload();
    }
  }
  // LawNet Footer JavaScript

  document.addEventListener('DOMContentLoaded', function() {
    // Smooth hover effect for footer links
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-bottom-links a');

    footerLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });

    // Initialize current year for copyright
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement && yearElement.textContent.includes('2025')) {
      const currentYear = new Date().getFullYear();
      yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }

    // Fade in footer elements on scroll
    const footerElements = document.querySelectorAll('.footer-about, .footer-links, .footer-contact');

    function checkFooterVisibility() {
      const triggerBottom = window.innerHeight * 0.8;

      footerElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < triggerBottom) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    }

    // Set initial state for footer elements
    footerElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.5s ease';
    });

    // Add scroll event listener
    window.addEventListener('scroll', checkFooterVisibility);

    // Check visibility on initial load
    checkFooterVisibility();
  });
});
