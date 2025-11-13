export const openGoogleMaps = (coordsArray) => {
  if (!coordsArray || coordsArray.length === 0) return;

  if (coordsArray.length === 1) {
    // Open single location directly
    const mapUrl = `https://www.google.com/maps?q=${coordsArray[0]}`;
    window.open(mapUrl, "_blank");
  } else {
    // Open path (directions)
    const waypoints = coordsArray.join("/");
    const mapUrl = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(mapUrl, "_blank");
  }
};
