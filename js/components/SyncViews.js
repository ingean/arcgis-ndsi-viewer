import MapView from "@arcgis/core/views/MapView.js"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js"
import { UpdateTemporalChart } from "./TemporalChart.js"

let active = null
const views = []

// Helper: Get row index from view id (e.g. view12016Div -> 1)
function getRowFromId(id) {
  // Assumes id format: view{row}{year}Div
  const match = id.match(/^view(\d)/);
  return match ? parseInt(match[1], 10) : null;
}

function getYearFromId(id) {
  // Assumes id format: view{row}{year}Div
  const match = id.match(/^view\d(\d{4})Div$/);
  return match ? parseInt(match[1], 10) : null;
}

const getViews = () => {
  const mapViews = document.getElementById("mapViews")
  const mapViewDivs = mapViews.querySelectorAll("[id^=view]")
  mapViewDivs.forEach((div) => {
    if (div.view) {
      views.push({ view: div.view, row: getRowFromId(div.id), year: getYearFromId(div.id) });
    }
  })
}

const sync = (source) => {
  if (!active || !active.viewpoint || active !== source) {
    return;
  }

  // Only sync views in the same row as the active view
  const activeRow = active._syncRow;
  for (const { view, row } of views) {
    if (view !== active && row === activeRow) {
      const activeViewpoint = active.viewpoint.clone();
      view.viewpoint = activeViewpoint;
    }
  }
};

export function SyncViews() {
  getViews();

  for (const { view, row, year } of views) {
    // Attach row info to view for later reference
    view._syncRow = row;
    reactiveUtils.watch(
      () => [view.interacting, view.viewpoint],
      ([interacting, viewpoint]) => {
        if (interacting) {
          active = view;
          sync(active);
        }
        if (viewpoint) {
          sync(view);
        }
        UpdateTemporalChart(view, row, year);
        //console.log(`View ${row}, xmin: ${view.extent.xmin}, ymin: ${view.extent.ymin}, xmax: ${view.extent.xmax}, ymax: ${view.extent.ymax}`); // Debug log
      },
    );
  }
}