import * as locator from "@arcgis/core/rest/locator.js"
import { updateChartTitle } from "./TemporalChart.js";


export const updatePlacename = (point, place) => {
  const serviceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";
  
  const params = {        
    location: point,
    distance: 1000,  // Search within 100 meters
    outFields: ["*"],
    forStorage: false
  };

  locator.locationToAddress(serviceUrl, params)
  .then(
    (response) => {
    // Show the address found
    const address = response.address;
    updateChartTitle(place, address);
    }
  )
}

