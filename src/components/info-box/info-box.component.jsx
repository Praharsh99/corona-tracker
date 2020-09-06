import React from "react";

import { Card, CardContent, Typography } from "@material-ui/core";

import { prettyPrintStat } from "../../utils/utils";

import "./info-box.style.css";

const InfoBox = ({ title, cases, total, active, ...otherProps }) => {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} `}
      onClick={otherProps.onClick}
    >
      <CardContent>
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>

        <h2 className="infoBox__cases">{prettyPrintStat(cases)}</h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
