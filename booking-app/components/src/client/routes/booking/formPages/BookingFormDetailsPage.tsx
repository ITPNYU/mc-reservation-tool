"use client";

import FormInput from "../components/FormInput";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";

interface Props {
  isWalkIn?: boolean;
}

export default function BookingFormDetailsPage({ isWalkIn = false }: Props) {
  return (
    <Grid container>
      <Grid width={330} />
      <Grid xs={7} paddingRight={2}>
        <FormInput isWalkIn={isWalkIn} />
      </Grid>
    </Grid>
  );
}
