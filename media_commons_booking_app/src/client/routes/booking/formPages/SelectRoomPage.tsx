import { Box, Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import { CalendarDatePicker } from '../components/CalendarDatePicker';
import CalendarVerticalResource from '../components/CalendarVerticalResource';
import { DatabaseContext } from '../../components/Provider';
import { DateSelectArg } from '@fullcalendar/core';
import Grid from '@mui/material/Unstable_Grid2';

import { RoomSetting } from '../../../../types';
import { SAFETY_TRAINING_REQUIRED_ROOM } from '../../../../policy';
import { SelectRooms } from '../components/SelectRooms';
import { useNavigate } from 'react-router-dom';

export default function SelectRoomPage() {
  const navigate = useNavigate();
  const { roomSettings, userEmail } = useContext(DatabaseContext);
  const {
    isBanned,
    isSafetyTrained,
    selectedRooms,
    setBookingCalendarInfo,
    setSelectedRooms,
  } = useContext(BookingContext);
  const [date, setDate] = useState<Date>(new Date());

  const handleSetDate = (info: DateSelectArg, rooms: RoomSetting[]) => {
    // console.log('handle set date', info, rooms, selectedRooms);

    setBookingCalendarInfo(info);
    // setSelectedRooms(rooms);
    const requiresSafetyTraining = rooms.some((room) =>
      SAFETY_TRAINING_REQUIRED_ROOM.includes(room.roomId)
    );
    if (needsSafetyTraining) {
      alert('You have to take safety training before booking!');
      return;
    }
    if (userEmail && isBanned) {
      alert('You are banned');
      return;
    }

    navigate('/book/form');
  };

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
          <CalendarVerticalResource
            allRooms={roomSettings}
            rooms={selectedRooms}
            dateView={date}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
