import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer.js'
import Basemap from '@arcgis/core/Basemap.js'
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer.js";
import { SyncViews } from './components/SyncViews.js'
import { createTemporalCharts } from "./components/TemporalChart.js";
import Extent from "@arcgis/core/geometry/Extent.js";

import ActionBar from './components/ActionBar.js'
//import MapTheme from './components/MapTheme.js'
import { authenticate } from './utils/OAuth2.js'

const appId = 'w8MteBiiYAwXiNdn' // AppId for Demo_oAuth2_Viewer
const portal = await authenticate(appId) //Authenticate with named user using OAuth2

//const webmap = document.getElementById("view12025Div")
//const actionBar = new ActionBar(webmap.view, 'layers')
//const theme = new MapTheme(webmap.view) // Contains light and dark basemap

const navigationLogo = document.querySelector("calcite-navigation-logo")
navigationLogo.heading = "Snøsmelting i Lofoten"

const years = [2017, 2021, 2023, 2025]
const places = [1, 2, 3, 4]

const lofotenExtents = [
  new Extent({
    xmin: 399195.34771053074, 
    ymin: 7525461.624942553, 
    xmax: 424764.732182633, 
    ymax: 7541717.657454618,
    spatialReference: { wkid: 25833 }
  }),
  new Extent({
    xmin: 418573.5212617439, 
    ymin: 7545037.6588869775, 
    xmax: 444142.9057338462, 
    ymax: 7561293.6913990425,
    spatialReference: { wkid: 25833 }
  }),
  new Extent({
    xmin: 425252.7648257597, 
    ymin: 7551569.300018864, 
    xmax: 476391.53376996424, 
    ymax: 7584081.365042994,
    spatialReference: { wkid: 25833 }
  }),
  new Extent({
    xmin: 458727.10849681834, 
    ymin: 7561896.775355195, 
    xmax: 509865.8774410229, 
    ymax: 7594408.840379325,
    spatialReference: { wkid: 25833 }
  })
]

const baseMap = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: 'https://services.geodataonline.no/arcgis/rest/services/GeocacheVector/GeocacheKanvasMork/VectorTileServer/resources/styles/root.json'
        })
      ],
      title: 'Bakgrunnskart (Mørk)'
    })

const setupView = (place, year) => {
  const imgLayer = new ImageryTileLayer({
    url: `https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/NDSI_mai${year}_mask_v4/ImageServer`,
    renderer: {
      type: "class-breaks",
      field: "Value",
      classBreakInfos: [
        {
          minValue: 0, // just above 0
          maxValue: 10000,   // adjust as needed for your data
          label: "Snødekke",
          symbol: {
            type: "simple-fill", // not used, but required
            color: [255, 255, 255, 0.6], // white, 0.4 opacity
            outline: null
          }
        }
      ],
      backgroundFillSymbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0] // transparent background
      }
    }
  });

  const mapView = document.getElementById(`view${place}${year}Div`);
  mapView.view.map.basemap = baseMap;
  mapView.view.map.layers.add(imgLayer);
  mapView.view.extent = lofotenExtents[place - 1] 
}

years.forEach((year) => {
  places.forEach((place) => {
    setupView(place, year)
  })
})

SyncViews()
createTemporalCharts(places, years)
//document.querySelector("calcite-loader").hidden = true
