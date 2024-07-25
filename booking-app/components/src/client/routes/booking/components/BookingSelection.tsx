import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import React, { useContext } from "react";

import { BookingContext } from "../bookingProvider";
import { Event } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import { formatTimeAmPm } from "../../../utils/date";
import { styled } from "@mui/system";

export const RoomDetails = styled(Grid)`
  display: flex;
  align-items: center;
  label {
    font-weight: 700;
    margin-right: 4px;
  }
`;

const AlertHeader = styled(Alert)(({ theme }) => ({
  //TODO: Fix later
  //background: theme.palette.secondary.light,
  marginBottom: 0,

  ".MuiAlert-icon": {
    //TODO: Fix later
    //color: theme.palette.primary.main,
  },
}));

export default function BookingSelection() {
  const { selectedRooms, bookingCalendarInfo } = useContext(BookingContext);

  return (
    <Box sx={{ paddingBottom: "24px" }} width="100%">
      <AlertHeader color="info" icon={<Event />} sx={{ marginBottom: 3 }}>
        <AlertTitle>Your Request</AlertTitle>
        <RoomDetails container>
          <label>Rooms:</label>
          <p>
            {selectedRooms
              .map((room) => `${room.roomId} ${room.name}`)
              .join(", ")}
          </p>
        </RoomDetails>
        <RoomDetails container>
          <label>Date:</label>
          <p>{new Date(bookingCalendarInfo.startStr).toLocaleDateString()}</p>
        </RoomDetails>
        <RoomDetails container>
          <label>Time:</label>
          <p>{`${formatTimeAmPm(
            bookingCalendarInfo.startStr
          )} - ${formatTimeAmPm(bookingCalendarInfo.endStr)}`}</p>
        </RoomDetails>
      </AlertHeader>
      {/* <Typography variant={'h5'}>Your Request</Typography>
      <RoomDetails container>
        <label>Rooms:</label>
        <p>
          {selectedRooms
            .map((room) => `${room.roomId} ${room.name}`)
            .join(', ')}
        </p>
      </RoomDetails>
      <RoomDetails container>
        <label>Date:</label>
        <p>{bookingCalendarInfo?.start.toDateString()}</p>
      </RoomDetails>
      <RoomDetails container>
        <label>Time:</label>
        <p>{`${formatTimeAmPm(
          bookingCalendarInfo?.startStr
        )} - ${formatTimeAmPm(bookingCalendarInfo?.endStr)}`}</p>
      </RoomDetails> */}
    </Box>
  );
}
