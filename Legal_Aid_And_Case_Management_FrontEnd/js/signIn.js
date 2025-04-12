$(document).ready(function () {
  // Password toggle visibility
  $(".toggle-password").click(function() {
    const passwordInput = $(this).siblings("input");
    const icon = $(this).find("i");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
      icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      passwordInput.attr("type", "password");
      icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });

  // Form submission
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    // Enhanced validation
    if (!email) {
      showAlert("Please enter your email address", "danger");
      $("#email").focus();
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address", "danger");
      $("#email").focus();
      return;
    }

    if (!password) {
      showAlert("Please enter your password", "danger");
      $("#password").focus();
      return;
    }

    // Show loading state
    $(".loader-container").removeClass("hidden");
    const submitBtn = $(this).find("button[type='submit']");
    const originalText = submitBtn.html();
    submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Signing in...');
    submitBtn.prop('disabled', true);

    // Ajax request
    $.ajax({
      url: "http://localhost:8080/api/v1/auth/authenticate",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function (response) {
        if (response.code === 201) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", response.data.email); // Store email

          // Add success feedback
          showAlert("Login successful! Redirecting...", "success");

          // Fetch user role
          $.ajax({
            url: "http://localhost:8080/api/v1/auth/userRole",
            type: "GET",
            headers: {
              Authorization: "Bearer " + response.data.token,
            },
            success: function (roleResponse) {
              const userRole = roleResponse.role;

              // Redirect with animation
              setTimeout(function() {
                if (userRole === "ADMIN") {
                  window.location.href = "adminDashboard.html";
                } else if (userRole === "LAWYER") {
                  window.location.href = "lawyerDashboard.html";
                } else if (userRole === "CLIENT") {
                  window.location.href = "clientDashboard.html";
                } else {
                  showAlert("Unauthorized access!", "danger");
                  submitBtn.html(originalText);
                  submitBtn.prop('disabled', false);
                  $(".loader-container").addClass("hidden");
                }
              }, 1500);
            },
            error: function (xhr, status, error) {
              console.error("Role error:", error);
              showAlert("Error fetching user role: " + getErrorMessage(xhr), "danger");
              submitBtn.html(originalText);
              submitBtn.prop('disabled', false);
              $(".loader-container").addClass("hidden");
            },
          });
        } else {
          showAlert(response.message || "Authentication failed", "danger");
          submitBtn.html(originalText);
          submitBtn.prop('disabled', false);
          $(".loader-container").addClass("hidden");
        }
      },
      error: function (xhr, status, error) {
        console.error("Login error:", error);
        showAlert(getErrorMessage(xhr), "danger");
        submitBtn.html(originalText);
        submitBtn.prop('disabled', false);
        $(".loader-container").addClass("hidden");
      },
    });
  });

  // Remember me functionality
  if (localStorage.getItem("rememberMeEmail")) {
    $("#email").val(localStorage.getItem("rememberMeEmail"));
  }

  // Email validation on input
  $("#email").on("input", function() {
    const email = $(this).val().trim();
    if (email && !validateEmail(email)) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });
});

// Function to show alert messages
function showAlert(message, type) {
  let alertContainer = $(".alert-container");
  if (!alertContainer.length) {
    alertContainer = $('<div class="alert-container"></div>');
    $("#loginForm").prepend(alertContainer);
  }

  // Remove any existing alerts
  alertContainer.empty();

  // Create alert with styling
  let alertClass = "alert alert-" + type;
  let icon = type === "danger" ? "fa-circle-exclamation" : "fa-circle-check";

  let alertHtml = `
    <div class="${alertClass}">
      <i class="fas ${icon}"></i>
      <span>${message}</span>
    </div>
  `;

  alertContainer.html(alertHtml);

  // Fade out the alert after a delay
  setTimeout(() => {
    $(".alert").fadeOut(500, function() {
      $(this).remove();
    });
  }, 4000);
}

// Helper function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to parse error messages
function getErrorMessage(xhr) {
  if (!xhr) return "Unknown error occurred";

  try {
    const response = JSON.parse(xhr.responseText);
    return response.message || "Invalid credentials or server error";
  } catch (e) {
    if (xhr.status === 0) {
      return "Server is unavailable. Please check your connection.";
    } else if (xhr.status === 401) {
      return "Invalid email or password";
    } else {
      return "Error: " + xhr.status + " - " + xhr.statusText;
    }
  }
}
