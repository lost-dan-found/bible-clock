function updateClockAndVerse() {
  const timeEl = document.getElementById('time');
  const verseEl = document.getElementById('verse');

  // Fade out
  timeEl.style.opacity = 0;
  verseEl.style.opacity = 0;

  setTimeout(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    timeEl.textContent = timeString;

    const filename = `../verses/chapter${hour}_verse${minute}.json`;

    fetch(filename)
      .then(res => {
        if (!res.ok) {
          throw new Error("Verse file not found");
        }
        return res.json();
      })
      .then(data => {
        if (data.length > 0) {
          const randomVerse = data[Math.floor(Math.random() * data.length)];
          verseEl.textContent = `${randomVerse.text} ${randomVerse.book} ${hour}:${minute}`;
        } else {
          verseEl.textContent = ""; //Empty for top of the hour since there is no verse starting with 0
        }
      })
      .catch(err => {
        verseEl.textContent = "Verse not available.";
        console.error(err);
      })
      .finally(() => {
        // Fade in
        timeEl.style.opacity = 1;
        verseEl.style.opacity = 1;
      });
  }, 500); // Match fade duration
}

// Initial load
updateClockAndVerse();

// Sync to next minute
const now = new Date();
const delay = (60 - now.getSeconds()) * 1000;

setTimeout(() => {
  updateClockAndVerse();
  setInterval(updateClockAndVerse, 60000);
}, delay);
