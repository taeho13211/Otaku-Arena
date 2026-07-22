window.OtakuArena = {
  escapeText(value) {
    const span = document.createElement("span");
    span.textContent = value;
    return span.innerHTML;
  },
};
