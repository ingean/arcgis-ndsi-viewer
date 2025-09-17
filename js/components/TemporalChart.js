import * as promiseUtils from "@arcgis/core/core/promiseUtils.js"
import { updatePlacename } from "./reverseGeocoding.js";

let years = [];
let temporalCharts = [];
let temporalData = [[0.72, 0.68, 0.65, 0.60, 0.55],[0.75, 0.70, 0.66, 0.62, 0.58],[0.80, 0.78, 0.74, 0.70, 0.65],[0.60, 0.58, 0.55, 0.50, 0.45]];


export const createTemporalCharts = (places, yrs) => {
  years = yrs;
  places.forEach((place) => {
    const temporalCanvas = document.getElementById(`temporalChart${place}`);
    temporalCharts.push(createTemporalChart(temporalCanvas, temporalData[place - 1]));
  })
}

export const createTemporalChart = (temporalCanvas, data) => {
  return new Chart(temporalCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: [
        "2017",
        "2021",
        "2023",
        "2025"
      ],
      datasets: [
        {
          data: data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        yAxis: {
          title: {
            display: true,
            text: "NDSI",
          },
          min: 0,
          max: 1,
        },
        x: {
          title: {
            display: true,
            text: "Year",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Temporal profile",
        },
      },
    },
  });
}

/* export const UpdateTemporalChart = (view, row, year) => {
  const temporalChart = temporalCharts[row - 1];
  let layer = view.map.layers.getItemAt(0);
  let point = view.center
  let extent = view.extent
  updatePlacename(point, row)

  const params = {
    geometry: extent,
    returnFirstValueOnly: false,
    interpolation: "nearest",
    // unit of the geometry's spatial reference is used
    sampleDistance: 1000,
    outFields: ["*"]
  };

  return layer
          //.fetchPixels(extent, extent.width/10, extent.height/10)
          .getSamples(params)
          .then((results) => {
            if (results.value) {
              const yearIndex = years.indexOf(year);
                let value = results.value.reduce((sum, v) => sum + v, 0) / results.value.length;
                if (value < 0) value = 0;
                if (value > 1) value = 1;
              temporalChart.data.datasets[0].data[yearIndex] = value;
              temporalChart.update(0);
            }
          })
          .catch((error) => {
            if (!promiseUtils.isAbortError(error)) {
              throw error;
            }
          });
        } */

export const UpdateTemporalChart = (view, row, year) => {
  const temporalChart = temporalCharts[row - 1];
  let layer = view.map.layers.getItemAt(0);
  let point = view.center
  updatePlacename(point, row)

  return layer
          .identify(point)
          .then((results) => {
            if (results.value) {
              const yearIndex = years.indexOf(year);
                let value = results.value[0];
                if (value < 0) value = 0;
                if (value > 1) value = 1;
              temporalChart.data.datasets[0].data[yearIndex] = value;
              temporalChart.update(0);
            }
          })
          .catch((error) => {
            if (!promiseUtils.isAbortError(error)) {
              throw error;
            }
          });
}

export const updateChartTitle = (place, title) => {
  const temporalChart = temporalCharts[place - 1];
  temporalChart.options.plugins.title.text = title;
  temporalChart.update(0);
}