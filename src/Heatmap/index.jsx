import { useMemo } from "react";
import { csv } from "d3";

import { useWindowSize } from "./hooks/useWindowSize";
import { usePromise } from "./hooks/usePromise";
import Map from "./components/Map";
import "./index.css";

const fileListUrl =
  "https://irserver2.eku.edu/Reports/PC/Program%20Enrollment/Data/_fileList.csv";

const fileListPromise = csv(fileListUrl);

const columns = { groupBy: "county", sum: "Current" };

const countyUrlPrefix =
  "https://irserver2.eku.edu/Reports/PC/Program%20Enrollment/";

export default function Heatmap() {
  const fileListFulfilled = usePromise(fileListPromise);

  const fileList = fileListFulfilled ? fileListFulfilled : [];

  const defaultPage = fileList.find(({ default_page }) => default_page === "Y");

  const file = defaultPage ? defaultPage : { filename: "" };

  const dataUrl =
    countyUrlPrefix + file.filename.substring(2).replaceAll("\\", "/");

  const dataPromise = useMemo(() => csv(dataUrl), [dataUrl]);

  const dataFulfilled = usePromise(dataPromise);

  const data = dataFulfilled
    ? dataFulfilled.filter(({ program_no }) => `${program_no}` === "1")
    : [];

  useWindowSize();

  const calculateDensities = () => {
    const lookup = {};

    data.forEach((row) => {
      const key = row[columns.groupBy];

      const value = Number(row[columns.sum]);

      if (!(key in lookup)) lookup[key] = 0;

      lookup[key] += value;
    });

    return lookup;
  };

  const densities = calculateDensities();

  // put in new template

  return <Map densities={densities} key={Math.random()} file={file}></Map>;
}
