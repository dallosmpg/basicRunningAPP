const speedIndicatorH1 = document.querySelector('.speed-indication');
function getAndUpdateSpeed() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        // Do something with the position object
        const currLocationData = position.coords;
        const currLocationSpeed = currLocationData.speed === null ? '0' : currLocationData.speed;
        // calculate time to go 1000m
        const timeToGo1000m = 1000 / currLocationSpeed * 3.6;
        speedIndicatorH1.textContent = timeToGo1000m;
        console.log(currLocationSpeed);
        console.log(position.coords);
      },error => console.log(error), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      
  } else {
    // Geolocation is not supported by the browser
    console.log('Geolocation is not supported by the browser');
  }
}

function updateSpeedAndRead() {
  setInterval(getAndUpdateSpeed, 5000);

}
updateSpeedAndRead();