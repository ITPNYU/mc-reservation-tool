import React, { useContext, useMemo } from 'react';

import { Bookings } from '../components/bookingTable/Bookings';
import { Box } from '@mui/material';
import { CenterLoading } from '../components/Loading';
import { DatabaseContext } from '../components/Provider';
import { PagePermission } from '../../../types';

const PAPage = () => {
  const { paUsers, pagePermission, userEmail } = useContext(DatabaseContext);

  const paEmails = useMemo<string[]>(
    () => paUsers.map((user) => user.email),
    [paUsers]
  );

  const userHasPermission =
    pagePermission === PagePermission.ADMIN ||
    pagePermission === PagePermission.PA;

  if (paEmails.length === 0 || userEmail === null) {
    return <CenterLoading />;
  }

  return (
    <Box margin={3}>
      {!userHasPermission ? (
        <div>You do not have permission to view this page.</div>
      ) : (
        <div>
          <Bookings isPaView={true} />
        </div>
      )}
    </Box>
  );
};

export default PAPage;
