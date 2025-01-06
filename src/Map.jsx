import { useEffect, useRef } from "react";

import { MapWidget } from "./map-widget.js";

export default function Map({ densities }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current, densities);
    }

    // const map = mapRef.current;
    // map.setZoom(zoomLevel);
  }, [densities]);

  return <div style={{ height: "100vh" }} ref={containerRef} />;
}
