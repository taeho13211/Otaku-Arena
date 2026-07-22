const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const formError = document.querySelector("#form-error");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitAuth(loginForm, () => window.OtakuArenaApi.login({
    email: document.querySelector("#email").value.trim(),
    password: document.querySelector("#password").value,
  }));
});

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitAuth(signupForm, () => window.OtakuArenaApi.signup({
    nickname: document.querySelector("#nickname").value.trim(),
    email: document.querySelector("#email").value.trim(),
    password: document.querySelector("#password").value,
  }));
});

async function submitAuth(form, apiCall) {
  formError.textContent = "";
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;

  try {
    await apiCall();
    window.location.href = "./index.html";
  } catch (error) {
    formError.textContent = error.message;
    submitButton.disabled = false;
  }
}
