import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { Bookings } from '../admin/components/Bookings';
import { DatabaseContext } from '../components/Provider';
import { styled } from '@mui/system';

const Center = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Empty = styled(Box)`
  color: rgba(0, 0, 0, 0.38);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
`;

export default function MyBookingsPage() {
  // const { bookings } = useContext(DatabaseContext);

  return (
    <Center>
      <Box width="60%" margin={6}>
        <Typography fontWeight={700} component="h1">
          Hey there
          <br></br>
          Welcome to Media Commons Production 🎥
        </Typography>
        <Bookings isUserView={true} />
      </Box>
    </Center>
  );
}
