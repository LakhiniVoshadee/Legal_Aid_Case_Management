$(document).ready(function () {
  $("#signInForm").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (!email || !password) {
      showAlert("Please fill in all fields", "danger");
      return;
    }

    $.ajax({
      url: "http://localhost:8080/api/v1/auth/authenticate",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function (response) {
        if (response.code === 201) {
          localStorage.setItem("token", response.data.token);

          // Fetch user role
          $.ajax({
            url: "http://localhost:8080/api/v1/auth/authenticate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function (response) {
              if (response.code === 201) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.email); // Store email

                // Fetch user role
                $.ajax({
                  url: "http://localhost:8080/api/v1/auth/userRole",
                  type: "GET",
                  headers: {
                    Authorization: "Bearer " + response.data.token,
                  },
                  success: function (roleResponse) {
                    const userRole = roleResponse.role;

                    if (userRole === "ADMIN") {
                      window.location.href = "adminDashboard.html";
                    } else if (userRole === "LAWYER") {
                      window.location.href = "lawyerDashboard.html";
                    } else if (userRole === "CLIENT") {
                      window.location.href = "clientDashboard.html";
                    } else {
                      showAlert("Unauthorized access!", "danger");
                    }
                  },
                  error: function () {
                    showAlert("Error fetching user role", "danger");
                  },
                });
              } else {
                showAlert(response.message, "danger");
              }
            },
            error: function () {
              showAlert("Invalid credentials or server error", "danger");
            },
          });
        } else {
          showAlert(response.message, "danger");
        }
      },
      error: function () {
        showAlert("Invalid credentials or server error", "danger");
      },
    });
  });
});

// Function to show alert messages
function showAlert(message, type) {
  let alertContainer = $(".alert-container");
  if (!alertContainer.length) {
    alertContainer = $('<div class="alert-container"></div>');
    $("#signInForm").before(alertContainer);
  }
  alertContainer.html(`<div class="alert alert-${type} mt-3">${message}</div>`);
  setTimeout(() => $(".alert").fadeOut(), 3000);
}
