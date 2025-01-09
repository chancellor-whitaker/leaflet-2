import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

import { kyCounties } from "./ky-counties";

export class MapWidget {
  constructor(domNode, densities, file) {
    const { asOfDate_str = "", term_desc = "" } = file;

    const serviceRegion = [
      "Bell",
      "Boyle",
      "Casey",
      "Clay",
      "Estill",
      "Garrard",
      "Harlan",
      "Jackson",
      "Knox",
      "Laurel",
      "Lee",
      "Leslie",
      "Lincoln",
      "McCreary",
      "Madison",
      "Owsley",
      "Perry",
      "Powell",
      "Pulaski",
      "Rockcastle",
      "Wayne",
      "Whitley",
    ];

    const serviceRegionSet = new Set(serviceRegion);

    const missing = "-Missing-";

    var legend = L.control({ position: "bottomright" });

    var map = L.map(domNode, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      boxZoom: false,
    });

    var info = L.control();

    var geojson;

    function generateCountyUrl(props) {
      return `https://irserver2.eku.edu/reports/sas/counties/data/${props.name}%20Kentucky.html`;
    }

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

    function isServiceRegionCounty(properties) {
      return serviceRegionSet.has(properties.name);
    }

    function style(feature) {
      const serviceRegionBoolean = isServiceRegionCounty(feature.properties);

      const fillColor = getColor(getDensity(feature.properties));

      const color = serviceRegionBoolean ? "#009681" : "white";

      const weight = serviceRegionBoolean ? 3 : 2;

      const dashArray = serviceRegionBoolean ? 0 : 3;

      return {
        fillOpacity: 0.7,
        opacity: 1,
        dashArray,
        fillColor,
        weight,
        color,
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
      var layer = e.target;

      var serviceRegionBoolean = isServiceRegionCounty(
        layer.feature.properties
      );

      geojson.resetStyle(layer);

      if (!serviceRegionBoolean) layer.bringToBack();

      info.update();
    }

    // function zoomToFeature(e) {
    //   map.fitBounds(e.target.getBounds());
    // }

    function openCountyUrl(e) {
      window
        .open(generateCountyUrl(e.target.feature.properties), "_blank")
        .focus();
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: openCountyUrl,
      });
    }

    function sum(numbers) {
      return numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    }

    function sumCounties(exclusions = new Set([missing])) {
      return sum(
        Object.entries(densities)
          .filter(([county]) => !exclusions.has(county))
          .map(([, amount]) => amount)
      );
    }

    function generateRow(name, value, rowClass = "mb-2", nameClass = "") {
      function combineClasses(...classes) {
        return classes.filter((string) => string).join(" ");
      }

      const rowClasses = combineClasses("d-flex", "fs-5", rowClass);

      const nameClasses = combineClasses("me-auto", "pe-2", nameClass);

      return `<div class="${rowClasses}"><div class="${nameClasses}">${name}</div><div>${value}</div></div>`;
    }

    const nonServiceRegion = sumCounties(new Set([missing, ...serviceRegion]));

    const all = sumCounties(new Set());

    const inState = sumCounties();

    const enrollment = {
      serviceRegion: {
        rowClass: "text-bluegrass fw-bold mb-2",
        amount: inState - nonServiceRegion,
        label: "Service region",
      },
      nonServiceRegion: {
        label: "Non-service region",
        amount: nonServiceRegion,
      },
      outOfState: { amount: all - inState, label: "Out-of-state" },
      inState: { label: "In-state", amount: inState },
      all: { label: "All", amount: all },
    };

    const rowOrder = [
      "all",
      "inState",
      "outOfState",
      "serviceRegion",
      "nonServiceRegion",
    ];

    const enrollmentEntries = Object.entries(enrollment).sort(
      ([a], [b]) => rowOrder.indexOf(a) - rowOrder.indexOf(b)
    );

    const topRow = `<div class="fs-4 mb-2">EKU ${term_desc} Enrollment</div><div class="mb-2">As of: ${asOfDate_str}</div>`;

    const enrollmentRows = enrollmentEntries
      .map(([, { rowClass = "mb-2", amount, label }]) =>
        generateRow(`${label}:`, amount.toLocaleString(), rowClass)
      )
      .join("");

    function generateCountyRow(props) {
      return props
        ? generateRow(
            `${props.name}:`,
            getDensity(props).toLocaleString(),
            isServiceRegionCounty(props) ? "text-bluegrass fw-bold" : ""
          )
        : generateRow("Hover over a county:", "?", "");
    }

    function generateInnerHTML(props) {
      return topRow + enrollmentRows + generateCountyRow(props);
    }

    function quantifyBoolean(boolean) {
      return boolean ? 1 : 0;
    }

    kyCounties.features.sort(
      ({ properties: a }, { properties: b }) =>
        quantifyBoolean(isServiceRegionCounty(a)) -
        quantifyBoolean(isServiceRegionCounty(b))
    );

    geojson = L.geoJson(kyCounties, { onEachFeature, style }).addTo(map);

    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML = generateInnerHTML(props);
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

    geojson.eachLayer(function (layer) {
      layer.bindTooltip(layer.feature.properties.name, {
        direction: "center",
        permanent: true,
      });
    });

    map.fitBounds(geojson.getBounds());

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
