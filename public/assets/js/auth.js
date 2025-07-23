const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const pwToggleBtn = document.querySelector(".pw-toggle");
const authErrorDiv = document.getElementById("auth-error");
const usernameErrorDiv = document.getElementById('username-error');
const passwordErrorDiv = document.getElementById('password-error');

if (pwToggleBtn && passwordInput) {
    pwToggleBtn.addEventListener("click", () => {
        const isVisible = passwordInput.type === "text";
        passwordInput.type = isVisible ? "password" : "text";
        pwToggleBtn.textContent = isVisible ? "Show" : "Hide";
    });
}

if (loginForm && usernameInput && passwordInput && authErrorDiv && usernameErrorDiv && passwordErrorDiv) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

  authErrorDiv.textContent = "";
  usernameErrorDiv.textContent = "";
  passwordErrorDiv.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    if (!username) usernameErrorDiv.textContent = "Username is required.";
    if (!password) passwordErrorDiv.textContent = "Password is required.";
    return;
  }

  try {
    const credentials = btoa(`${username}:${password}`);
    const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        authErrorDiv.textContent = errorData.message || 'Login failed';
        return;
    }

    const data = await response.text();
    console.log(data);

    const jwtToken = data;
    localStorage.setItem('jwtToken', jwtToken);
    console.log("token: " + jwtToken)
    console.log('JWT token stored successfully!');
    window.location.href = "/home/alimahdi/Downloads/GRAPH-QL/public/index.html";
  } catch (error) {
    authErrorDiv.textContent = 'An error occurred. Please try again.';
    console.error('Error fetching/storing JWT:', error);
  }
  });
}
