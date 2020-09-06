import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import numeral from "numeral";

import "./line-graph.style.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("0a");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        tricks: {
          callback: function (value, index, values) {
            return numeral(value).format("0,0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ casesType = "cases" }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          setData(buildChartData(data, casesType));
        });
    }

    fetchData();
  });

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    Object.keys(data[casesType]).forEach((date) => {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);
      }

      lastDataPoint = data[casesType][date];
    });

    return chartData;
  };

  return (
    <div className="lineGraph">
      <h2>Worldwide new {casesType}</h2>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.4)",
                borderColor: "#CC1034",
                data,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
