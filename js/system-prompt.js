document.addEventListener("DOMContentLoaded", function() {
  const promptBtn = document.getElementById("system-prompt-btn");
  const promptPopup = document.getElementById("system-prompt-popup");
  const cancelBtn = document.getElementById("cancel-prompt-btn");
  const saveBtn = document.getElementById("save-prompt-btn");
  const clearBtn = document.getElementById("clear-prompt-btn");
  const promptTextarea = document.getElementById("system-prompt-textarea");

  // Show popup and load stored prompt
  promptBtn.addEventListener("click", function() {
      const storedPrompt = localStorage.getItem("systemPrompt") || "";
      promptTextarea.value = storedPrompt; // Load existing prompt
      promptPopup.classList.remove("hidden");
      setTimeout(() => {
          promptPopup.querySelector("div").classList.add("scale-100");
      }, 50);
  });

  // Hide popup with animation
  cancelBtn.addEventListener("click", function() {
      promptPopup.querySelector("div").classList.remove("scale-100");
      setTimeout(() => {
          promptPopup.classList.add("hidden");
      }, 200);
  });

  // Save system prompt
  saveBtn.addEventListener("click", function() {
      const promptText = promptTextarea.value.trim();
      localStorage.setItem("systemPrompt", promptText);
      console.log("System prompt saved:", promptText);
      cancelBtn.click();
  });

  // Clear stored prompt
  clearBtn.addEventListener("click", function() {
      localStorage.removeItem("systemPrompt");
      promptTextarea.value = ""; // Clear text area
      console.log("System prompt cleared.");
  });
});