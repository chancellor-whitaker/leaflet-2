import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

import { kyCounties } from "./ky-counties";

export class MapWidget {
  constructor(domNode, densities) {
    var legend = L.control({ position: "bottomright" });

    // lebanon junction coordinates
    const geographicCenter = [37.834, -85.7293];

    var map = L.map(domNode).setView(geographicCenter, 8);

    var info = L.control();

    var geojson;

    function getColor(d) {
      return d > 1000
        ? "#800026"
        : d > 500
        ? "#BD0026"
        : d > 200
        ? "#E31A1C"
        : d > 100
        ? "#FC4E2A"
        : d > 50
        ? "#FD8D3C"
        : d > 20
        ? "#FEB24C"
        : d > 10
        ? "#FED976"
        : "#FFEDA0";
    }

    function getDensity(props) {
      return densities[props.name];
    }

    function style(feature) {
      return {
        fillColor: getColor(getDensity(feature.properties)),
        fillOpacity: 0.7,
        color: "white",
        dashArray: "3",
        opacity: 1,
        weight: 2,
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        fillOpacity: 0.7,
        color: "#666",
        dashArray: "",
        weight: 5,
      });

      layer.bringToFront();

      info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target);

      info.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    }

    geojson = L.geoJson(kyCounties, { onEachFeature, style }).addTo(map);

    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML =
        "<h4>EKU Enrollment Density</h4>" +
        (props
          ? "<b>" +
            props.name +
            "</b><br />" +
            getDensity(props) +
            " people / mi<sup>2</sup>"
          : "Hover over a county");
    };

    legend.onAdd = function () {
      var grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        div = L.DomUtil.create("div", "info legend");

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    legend.addTo(map);

    info.addTo(map);

    this.map = map;
  }
}
