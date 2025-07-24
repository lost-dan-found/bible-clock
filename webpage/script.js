function updateTime() {
  const timeEl = document.getElementById('time');

  // Fade out
  timeEl.style.opacity = 0;

  setTimeout(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeEl.textContent = timeString;

    // Fade in
    timeEl.style.opacity = 1;
  }, 1000); // Matches the CSS transition duration
}

// Initial update
updateTime();

// Sync to next full minute
const now = new Date();
const delay = (60 - now.getSeconds()) * 1000;

setTimeout(() => {
  updateTime();
  setInterval(updateTime, 60000);
}, delay);
