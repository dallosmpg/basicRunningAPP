const speedIndicatorH1 = document.querySelector('.pace-display');
const distanceDisplay = document.querySelector('.distance-display');
const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
const readOutSelect = document.querySelector('#readout-timer');

let positionUpdateSec = 0;
let notMoving = true;
let readOutText;
let wakeLock;

let lastCoords; 
let totalDistance = 0;
distanceDisplay.textContent = `${totalDistance} kilometers`;

function calcDistance(currLocation) {
  if (!lastCoords) {
    lastCoords = {latitude: currLocation.latitude, longitude: currLocation.longitude};
    return;
  }
  const currCoords = {latitude: currLocation.latitude, longitude: currLocation.longitude};

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // in km
  
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance;
  }
  
  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  totalDistance += getDistanceFromLatLonInKm(lastCoords.latitude, lastCoords.longitude, currCoords.latitude, currCoords.longitude);
  distanceDisplay.textContent = `${(totalDistance).toFixed(3) } kilometers`;
}

async function getAndUpdateSpeed() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const currLocationData = position.coords;
      const currLocationSpeed = currLocationData.speed;
      calcDistance(currLocationData);
      
      const timeToGo1000m = convertSpeedToMinPerKM(currLocationSpeed, 'second');
      speedIndicatorH1.textContent = timeToGo1000m;
      
      positionUpdateSec += 5;
      if (parseInt(readOutSelect.value) === positionUpdateSec) {
        readPace();
        positionUpdateSec = 0;
      }
      },
      error => console.log(error), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      if (!wakeLock) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
  } else {
    // Geolocation is not supported by the browser
    speedIndicatorH1.textContent = 'Geolocation is not supported by the browser';
  }
}

function convertSpeedToMinPerKM(speed, unitTime) {
  if (isNaN(speed) || !isFinite(speed) || typeof speed !== 'number') {
    notMoving = true;
    return 'Not moving';
  } 

  notMoving = false;
  switch (unitTime) {
    case 'hour' : 
      const unitMinutes = 60;
      const distInAnHour = speed;

      const kmTime = unitMinutes / distInAnHour
      const kmMinutes = Math.floor(kmTime);
      const kmSeconds = Math.floor((kmTime - kmMinutes) * 60) === 0 ? '00' : Math.floor((kmTime - kmMinutes) * 60);

      readOutText = `Pace: ${kmMinutes} minutes, ${kmSeconds} seconds`

      return `Pace: ${kmMinutes}:${kmSeconds} min/km`;

    case 'second' : 
      const kmTimeMS = (1000 / speed) / 60;
      const kmMinutesMS = Math.floor(kmTimeMS);
      const kmSecondsMS = Math.floor((kmTimeMS - kmMinutesMS) * 60) === 0 ? '00' : Math.floor((kmTimeMS - kmMinutesMS) * 60);

      readOutText = `Pace: ${kmMinutesMS} minutes, ${kmSecondsMS} seconds`

      return `Pace: ${kmMinutesMS}:${kmSecondsMS} min/km`;
  }

}

function readPace() {
  if (notMoving) return;

  const utterance = new SpeechSynthesisUtterance();
  utterance.text = readOutText;
  utterance.lang = 'en-EN';
  console.log(utterance);
  speechSynthesis.speak(utterance);
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
  interval = setInterval(getAndUpdateSpeed, 5000);
  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
}

function stopUpdateAndRead() {
  console.log('Stop measuring');
  clearInterval(interval);
  startBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
  speedIndicatorH1.textContent = 'Not started yet';
  totalDistance = 0;
}

startBtn.addEventListener('click', startUpdateSpeedAndRead);
stopBtn.addEventListener('click', stopUpdateAndRead);

