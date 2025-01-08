import { useEffect, useState, useMemo, use } from "react";
import { csv } from "d3";

import { useWindowSize } from "./useWindowSize";
import Map from "./Map";

// const url = "https://www.irserver2.eku.edu/reports/serviceregion/data/enrollment.json";

// const promise = fetch(url).then((response) => response.json());

const fileListUrl =
  "https://irserver2.eku.edu/Reports/PC/Program%20Enrollment/Data/_fileList.csv";

const fileListPromise = csv(fileListUrl);

const columns = { groupBy: "county", sum: "Current" };

const prefix = "https://irserver2.eku.edu/Reports/PC/Program%20Enrollment/";

// how to include current term?
// need to get data from original source

const usePromise = (promise) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (promise) {
      let ignore = false;

      promise.then((response) => !ignore && setState(response));

      return () => {
        ignore = true;
      };
    }
  }, [promise]);

  return state;
};

export default function App() {
  const fileList = use(fileListPromise);

  const defaultPage = fileList.find(({ default_page }) => default_page === "Y");

  const dataUrl =
    prefix + defaultPage.filename.substring(2).replaceAll("\\", "/");

  const dataPromise = useMemo(() => csv(dataUrl), [dataUrl]);

  const dataFulfilled = usePromise(dataPromise);

  const data = dataFulfilled ? dataFulfilled : [];

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

  return (
    <Map densities={densities} key={Math.random()} file={defaultPage}></Map>
  );
}
