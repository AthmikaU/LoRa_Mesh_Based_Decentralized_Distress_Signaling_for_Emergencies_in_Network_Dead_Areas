export const openGoogleMaps = (coordsArray) => {
  // Example: ["13.084185,74.840268", "13.082500,74.842900"]
  const waypoints = coordsArray.join("/");
  const mapUrl = `https://www.google.com/maps/dir/${waypoints}`;
  window.open(mapUrl, "_blank");
};
