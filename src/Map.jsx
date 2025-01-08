import { useEffect, useRef } from "react";

import { MapWidget } from "./map-widget.js";

export default function Map({ densities, file }) {
  const containerRef = useRef(null);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current, densities, file);
    }
  }, [densities, file]);

  return <div style={{ height: "100vh" }} ref={containerRef} />;
}
