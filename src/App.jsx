import { use } from "react";

import Map from "./Map";

const url =
  "https://www.irserver2.eku.edu/reports/serviceregion/data/enrollment.json";

const promise = fetch(url).then((response) => response.json());

const columns = { groupBy: "county", sum: "Current" };

export default function App() {
  const data = use(promise);

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

  console.log(densities);

  return <Map densities={densities}></Map>;
}
