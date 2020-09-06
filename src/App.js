import React, { useState, useEffect } from "react";

import InfoBox from "./components/info-box/info-box.component";
import Map from "./components/map/map.component";
import Table from "./components/table/table.component";
import LineGraph from "./components/line-graph/line-graph.component";

import { sortData } from "./utils/utils";

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 25.175287,
    lng: 1.847994,
  });
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await res.json();

      setTableData(sortData(data));
      setMapCountries(data);
      setCountries(
        data.map((item) => ({
          name: item.country,
          value: item.countryInfo.iso3,
        }))
      );
    }

    fetchCountries();
  }, [setCountries]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        } else {
          setMapCenter([25.175287, 1.847994]);
          setMapZoom(1.5);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map(({ name, value }, idx) => (
                <MenuItem key={idx} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={(e) => {
              setCasesType("cases");
            }}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            onClick={(e) => {
              setCasesType("recovered");
            }}
            active={casesType === "recovered"}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h2>Live cases by country</h2>

          <Table countries={tableData} />

          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
