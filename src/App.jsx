import { useState } from "react";

import Heatmap from "./Heatmap";
import Remote from "./Remote";

export default function App() {
  const [key, setKey] = useState(0);

  const iterateKey = () => setKey((x) => x + 1);

  return (
    <Remote
      toolbar={
        <button className="btn btn-primary" onClick={iterateKey} type="button">
          Reset map
        </button>
      }
      heading="Current Enrollment Heatmap"
    >
      <Heatmap key={key}></Heatmap>
    </Remote>
  );
}
