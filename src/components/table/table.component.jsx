import React from "react";

import numeral from "numeral";

import "./table.style.css";

const Table = ({ countries }) => {
  return (
    <div className="table">
      {countries.map(({ country, cases, countryInfo }, idx) => (
        <tr key={countryInfo.iso3 + idx}>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
