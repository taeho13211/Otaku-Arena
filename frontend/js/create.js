const createForm = document.querySelector("#create-form");
const formError = document.querySelector("#form-error");

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  const submitButton = createForm.querySelector('[type="submit"]');
  submitButton.disabled = true;

  try {
    const room = await window.OtakuArenaApi.createRoom({
      topic: document.querySelector("#topic-input").value.trim(),
      candidateA: document.querySelector("#candidate-a-input").value.trim(),
      candidateB: document.querySelector("#candidate-b-input").value.trim(),
      description: document.querySelector("#description-input").value.trim(),
    });
    window.location.href = `./debate.html?roomId=${encodeURIComponent(room.id)}`;
  } catch (error) {
    formError.textContent = error.message;
    submitButton.disabled = false;
  }
});
