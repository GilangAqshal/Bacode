// Sebagai Controller = Penghubung Model dan UI
document.addEventListener("DOMContentLoaded", () => {

    
  const formManager = document.getElementById("formManager");
  const userUsername = document.getElementById("username");
  const userPassword = document.getElementById("password");

  const instantFeedback = document.getElementById("instantFeedback");

  const userManager = new User();

  instantFeedback.style.display='none';

  formManager.addEventListener("submit", (event) => {
    event.preventDefault();

    const userData = {
      username: userUsername.value,
      password: userPassword.value,

    };
    

    const result = userManager.userSignIn(userData);

    if (result.success) {
      instantFeedback.style.display = "none";
      localStorage.setItem('usernameLoggedIn', userUsername.value)
      // arahkan pengguna kepada halaman lain yaitu login
      return (window.location.href = "../index.html");
    } else {
      instantFeedback.style.display = "flex";
      instantFeedback.textContent = result.error;
    }
  });
});
