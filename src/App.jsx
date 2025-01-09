import { useState } from "react";

import Heatmap from "./Heatmap";
import Remote from "./Remote";

export default function App() {
  const [key, setKey] = useState(0);

  const [labelsDisplayed, setLabelsDisplayed] = useState(true);

  const toggleLabels = () => setLabelsDisplayed((x) => !x);

  const iterateKey = () => setKey((x) => x + 1);

  return (
    <Remote
      toolbar={
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-primary"
            onClick={iterateKey}
            type="button"
          >
            Reset map
          </button>
          <button
            className="btn btn-primary"
            onClick={toggleLabels}
            type="button"
          >
            {labelsDisplayed ? "Hide" : "Show"} labels
          </button>
        </div>
      }
      className={labelsDisplayed ? "" : "hide-leaflet-tooltips"}
      heading="Current Enrollment Heatmap"
    >
      <Heatmap key={key}></Heatmap>
    </Remote>
  );
}
