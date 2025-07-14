const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const pwToggleBtn = document.querySelector(".pw-toggle");
const authErrorDiv = document.getElementById("auth-error");

pwToggleBtn.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    pwToggleBtn.textContent = isVisible ? "Show" : "Hide";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  authErrorDiv.textContent = "";
  document.getElementById('username-error').textContent = "";
  document.getElementById('password-error').textContent = "";

  if (!username || !password) {
    if (!username) document.getElementById('username-error').textContent = "Username is required.";
    if (!password) document.getElementById('password-error').textContent = "Password is required.";
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
    window.location.href = "/index.html";
  } catch (error) {
    authErrorDiv.textContent = 'An error occurred. Please try again.';
    console.error('Error fetching/storing JWT:', error);
  }
});
