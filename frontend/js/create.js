document.querySelector("#create-form").addEventListener("submit", (event) => {
  event.preventDefault();

  window.OtakuArena.saveRoom({
    topic: document.querySelector("#topic-input").value.trim(),
    a: document.querySelector("#candidate-a-input").value.trim(),
    b: document.querySelector("#candidate-b-input").value.trim(),
    description: document.querySelector("#description-input").value.trim(),
  });

  window.location.href = "./index.html";
});
