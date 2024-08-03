"use client";

import FormInput from "../components/FormInput";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";

export default function BookingFormDetailsPage() {
  return (
    <Grid container>
      <Grid width={330} />
      <Grid xs={7} paddingRight={2}>
        <FormInput />
      </Grid>
    </Grid>
  );
}
