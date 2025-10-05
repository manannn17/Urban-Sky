function getCoordinates(zipCode) {
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      } else {
        console.log("No results found for the given zip code.");
      }
    })
    .catch(error => console.error("Error during geocoding:", error));
}

// Example usage:
getCoordinates("90210");