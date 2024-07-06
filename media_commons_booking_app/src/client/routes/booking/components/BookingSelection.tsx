import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { BookingContext } from '../bookingProvider';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/system';

const RoomDetails = styled(Grid)`
  label {
    font-weight: 700;
    margin-right: 4px;
  }
`;

export default function BookingSelection() {
  const { selectedRooms, bookingCalendarInfo } = useContext(BookingContext);

  return (
    <Box sx={{ paddingBottom: '48px' }}>
      <Typography variant={'h5'}>Your Request</Typography>
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
        <p>{`${bookingCalendarInfo?.start.toLocaleTimeString()} - ${bookingCalendarInfo?.end.toLocaleTimeString()}`}</p>
      </RoomDetails>
    </Box>
  );
}
