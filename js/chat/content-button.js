  function editFunction() {
    alert("Edit button clicked!");
  }

  function toggleOptionsMenu() {
    const menu = document.getElementById("options-menu");
    menu.classList.toggle("hidden");
  }

  function toggleCodeRender() {
    const outputDisplay = document.getElementById("output-display");
    const toggleBtn = document.getElementById("toggle-code-btn");

    if (outputDisplay.classList.contains("render-mode")) {
      outputDisplay.innerHTML = `<pre><code>// Your code will appear here</code></pre>`;
      outputDisplay.classList.remove("render-mode");
      toggleBtn.innerHTML = `<i class="fas fa-code text-xl text-[var(--text-color)]"></i>`;
    } else {
      outputDisplay.innerHTML = `<div>Your rendered content will appear here</div>`;
      outputDisplay.classList.add("render-mode");
      toggleBtn.innerHTML = `<i class="fas fa-eye text-xl text-[var(--text-color)]"></i>`;
    }
  }

  // Close the menu when clicking outside
  document.addEventListener("click", function (event) {
    const menu = document.getElementById("options-menu");
    const optionsButton = document.querySelector("[aria-label='More Options']");
    if (!menu.contains(event.target) && !optionsButton.contains(event.target)) {
      menu.classList.add("hidden");
    }
  });