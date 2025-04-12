$(document).ready(function() {
  // Set current year in the footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Navbar scroll effect
  $(window).scroll(function() {
    if ($(window).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  // Card hover effects with enhanced animation
  $('.card').hover(
    function() {
      $(this).find('.icon-circle').css('background-color', 'rgba(139, 92, 246, 0.2)');
    },
    function() {
      $(this).find('.icon-circle').css('background-color', 'rgba(139, 92, 246, 0.1)');
    }
  );

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(e) {
    if (this.hash !== '') {
      e.preventDefault();
      const hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top - 70
      }, 800);
    }
  });

  // Button hover animation
  $('.btn').hover(
    function() {
      $(this).css('transform', 'translateY(-2px)');
    },
    function() {
      $(this).css('transform', 'translateY(0)');
    }
  );

  // Mobile menu enhancements
  $('.navbar-toggler').on('click', function() {
    $(this).toggleClass('active');
  });

  // Any additional script functionality can be added here
});

// Show loader function (can be used when navigating to sign up pages)
function showLoader() {
  $('.loader-container').removeClass('hidden');
}

// Hide loader function
function hideLoader() {
  $('.loader-container').addClass('hidden');
}

// These functions can be called when needed
// Example: For sign up button clicks
document.querySelectorAll('.btn-card').forEach(button => {
  button.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      showLoader();
      setTimeout(() => {
        window.location.href = href;
      }, 800); // Short delay to show loader
    }
  });
});
