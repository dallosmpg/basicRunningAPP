const geoLoc = (function() {
    const getLocationData = () => {
        navigator.geolocation.getCurrentPosition(success => console.log(success.coords.speed));
    }

    return {
        getLocationData,
    }
})() 
console.log(geoLoc.getLocationData());