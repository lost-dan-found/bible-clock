function updateTime() {
  const now = new Date();
  const hour24 = now.getHours();
  const minute = now.getMinutes();

  const hour = hour24 % 12 || 12;
  const displayHour = String(hour).padStart(2, '0');
  const displayMinute = String(minute).padStart(2, '0');

  const timeEl = document.getElementById('time');
  timeEl.textContent = `${displayHour}:${displayMinute}`;

  return { hour, minute };
}

function updateVerse(hour, minute) {
  const verseEl = document.getElementById('verse');
  const verseTextEl = document.getElementById('verse-text');
  const verseRefEl = document.getElementById('verse-ref');

  const filename = `../verses/chapter${hour}_verse${minute}.json`;

  // Fade out verse
  verseEl.style.opacity = 0;

  setTimeout(() => {
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
          verseTextEl.textContent = `${randomVerse.text}`;
          verseRefEl.textContent = `- ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`;
        } else {
          verseTextEl.textContent = ""; //Empty verse for top of the hour since there is no verse 0
          verseRefEl.textContent = "";
        }
      })
      .catch(err => {
        verseTextEl.textContent = "Verse not available.";
        verseRefEl.textContent = "";
        console.error(err);
      })
      .finally(() => {
        verseEl.style.opacity = 1;
      });
  }, 1000);
}

// Initial run
const { hour, minute } = updateTime();
updateVerse(hour, minute);

// Sync to next full minute
const now = new Date();
const delay = (60 - now.getSeconds()) * 1000;

setTimeout(() => {
  setInterval(() => {
    const { hour, minute } = updateTime();
    updateVerse(hour, minute);
  }, 60000);

  const { hour, minute } = updateTime();
  updateVerse(hour, minute);
}, delay);