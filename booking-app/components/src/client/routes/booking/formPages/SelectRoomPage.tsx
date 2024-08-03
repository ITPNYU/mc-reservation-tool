"use client";

import { Box, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";

import { BookingContext } from "../bookingProvider";
import { CalendarDatePicker } from "../components/CalendarDatePicker";
import CalendarVerticalResource from "../components/CalendarVerticalResource";
import { DatabaseContext } from "../../components/Provider";
import Grid from "@mui/material/Unstable_Grid2";
import { SelectRooms } from "../components/SelectRooms";

export default function SelectRoomPage() {
  const { roomSettings } = useContext(DatabaseContext);
  const { selectedRooms, setSelectedRooms } = useContext(BookingContext);
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid width={330}>
          <Stack spacing={2}>
            <CalendarDatePicker handleChange={setDate} />
            <Box paddingLeft="24px">
              <Typography fontWeight={500}>Spaces</Typography>
              <SelectRooms
                allRooms={roomSettings}
                selected={selectedRooms}
                setSelected={setSelectedRooms}
              />
            </Box>
          </Stack>
        </Grid>
        <Grid paddingRight={2} flex={1}>
          <CalendarVerticalResource rooms={selectedRooms} dateView={date} />
        </Grid>
      </Grid>
    </Box>
  );
}
