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
          verseEl.textContent = `${randomVerse.text} ${randomVerse.book} ${hour}:${minute}`;
        } else {
          verseEl.textContent = ""; //empty verse for top of the hour since there are no verses at 0
        }
      })
      .catch(err => {
        verseEl.textContent = "Verse not available.";
        console.error(err);
      })
      .finally(() => {
        verseEl.style.opacity = 1;
      });
  }, 500); // Match CSS transition
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


let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock is active');

      // Re-request if it’s released (e.g., on tab switch)
      wakeLock.addEventListener('release', () => {
        console.log('Wake lock was released');
      });
    } else {
      console.warn('Wake Lock API not supported in this browser.');
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

// Re-acquire lock on visibility change
document.addEventListener('visibilitychange', () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
});

// Call on load
requestWakeLock();
