const speedIndicatorH1 = document.querySelector('.speed-indication');
const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
let interval;

function getAndUpdateSpeed() {
  console.log('New location');
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        // Do something with the position object
        const currLocationData = position.coords;
        const currLocationSpeed = currLocationData.speed === null ? '0' : currLocationData.speed;
        // calculate time to go 1000m
        const timeToGo1000m = convertSpeedToMinPerKM(currLocationSpeed, 'second');
        speedIndicatorH1.textContent = timeToGo1000m;
        console.log(currLocationSpeed);
        console.log(position.coords);
      },
      error => console.log(error), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      
  } else {
    // Geolocation is not supported by the browser
    speedIndicatorH1.textContent = 'Geolocation is not supported by the browser';
  }
}

function convertSpeedToMinPerKM(speed, unitTime) {
  if (isNaN(speed) || !isFinite(speed) || typeof speed !== 'number') return 'Not moving';

  switch (unitTime) {
    case 'hour' : 
      const unitMinutes = 60;
      const distInAnHour = speed;

      const kmTime = unitMinutes / distInAnHour
      const kmMinutes = Math.floor(kmTime);
      const kmSeconds = Math.floor((kmTime - kmMinutes) * 60) === 0 ? '00' : Math.floor((kmTime - kmMinutes) * 60);
      return `Pace: ${kmMinutes}:${kmSeconds} min/km`;

    case 'second' : 
      const kmTimeMS = (1000 / speed) / 60;
      const kmMinutesMS = Math.floor(kmTimeMS);
      const kmSecondsMS = Math.floor((kmTimeMS - kmMinutesMS) * 60) === 0 ? '00' : Math.floor((kmTimeMS - kmMinutesMS) * 60);

      return `Pace: ${kmMinutesMS}:${kmSecondsMS} min/km`;
  }

}

function toggleBtnVis(startVis) {
  if (startVis) {
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
  } else {
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
  }
}

function startUpdateSpeedAndRead() {
  console.log('Start measuring');
  getAndUpdateSpeed();
  interval = setInterval(getAndUpdateSpeed, 3000);
  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
}

function stopUpdateAndRead() {
  console.log('Stop measuring');
  clearInterval(interval);
  startBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
}

startBtn.addEventListener('click', startUpdateSpeedAndRead);
stopBtn.addEventListener('click', stopUpdateAndRead);