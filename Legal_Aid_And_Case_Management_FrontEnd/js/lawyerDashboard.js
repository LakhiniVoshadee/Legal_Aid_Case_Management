document.addEventListener("DOMContentLoaded", function () {
  const email = localStorage.getItem("email");
  if (email) {
    document.getElementById("welcomeMessage").textContent = `Welcome, ${email}!`;
  } else {
    document.getElementById("welcomeMessage").textContent = "Welcome!";
  }
});
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.href = "login.html";
});
