function updateText(option) {
  document.getElementById('selected-option').innerText = 'Content Creator (' + option + ')';
}

function dismissOptions() {
  document.getElementById("bottom-options").style.display = "none";
}

function toggleContentSection() {
  var contentSection = document.getElementById('output-section');

  if (contentSection.classList.contains('hidden')) {
    contentSection.classList.remove('hidden');
    contentSection.classList.add('flex');

  }
  else {
    contentSection.classList.remove('flex');
    contentSection.classList.add('hidden');
  }
}