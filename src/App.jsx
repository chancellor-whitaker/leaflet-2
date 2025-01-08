import { use } from "react";

import { useWindowSize } from "./useWindowSize";
import Map from "./Map";

const url =
  "https://www.irserver2.eku.edu/reports/serviceregion/data/enrollment.json";

const promise = fetch(url).then((response) => response.json());

const columns = { groupBy: "county", sum: "Current" };

// color coordinate service region & non-service region
// how to include current term?
// need to get data from original source

export default function App() {
  const data = use(promise);

  const { height, width } = useWindowSize();

  const calculateDensities = () => {
    const lookup = {};

    data.forEach((row) => {
      const key = row[columns.groupBy];

      const value = row[columns.sum];

      if (!(key in lookup)) lookup[key] = 0;

      lookup[key] += value;
    });

    return lookup;
  };

  const densities = calculateDensities();

  return <Map densities={densities} key={width + height}></Map>;
}
