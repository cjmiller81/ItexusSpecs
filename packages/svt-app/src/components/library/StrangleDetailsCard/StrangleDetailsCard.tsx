import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

import TitleValueDisplay from "../Displays/TitleValueDisplay/TitleValueDisplay";
import ThreeColHeaderValueCardDisplay from "../Displays/ThreeColHeaderValueCardDisplay/ThreeColHeaderValueCardDisplay";
import OptionPillDisplay from "../Displays/OptionPillDisplay/OptionPillDisplay";

import "./StrangleDetailsCard.scss";

interface StrangleDetailsCardProps {
  extAnnualized?: number;
  maxProfit?: number;
  callCredit?: number;
  putCredit?: number;
  strangleCredit?: number;
  size?: number;
  dte?: number;
  expirationDate?: Date;
}

const StrangleDetailsCard = ({
  extAnnualized = 0,
  maxProfit = 0,
  callCredit = 0,
  putCredit = 0,
  strangleCredit = 0,
  size = 0,
  dte = 0,
  expirationDate = new Date(),
  ...props
}: StrangleDetailsCardProps) => {
  return (
    <div className={"strangle-details-card"}>
      <div className={"responsive-padding-custom"}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TitleValueDisplay
              title="EXT. ANNUALIZED"
              value={`${extAnnualized}%`}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TitleValueDisplay
              title="MAX PROFIT"
              value={maxProfit.toString()}
              valueFormat="currency"
            />
          </Grid>
          <Grid xs={12}>
            <ThreeColHeaderValueCardDisplay
              strangleCredit={strangleCredit}
              size={size}
            />
          </Grid>
          <Grid xs={12}>
            <OptionPillDisplay
              callPut="PUT"
              credit={putCredit}
              size={size}
              dte={dte}
              expirationDate={expirationDate}
            />
          </Grid>
          <Grid xs={12}>
            <OptionPillDisplay
              callPut="CALL"
              credit={callCredit}
              size={size}
              dte={dte}
              expirationDate={expirationDate}
            />
          </Grid>
        </Grid>

        {/*
              <BoxItem
                ratio={2}
                baseSize={100}
                shrink={1}
              >
                <Button
                  className="center-content"
                  text="Add Trade to Trade Manager"
                  type="default"
                  width={280}
                />
              </BoxItem>
              */}
      </div>
    </div>
  );
};

export default StrangleDetailsCard;
