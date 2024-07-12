import React, { useContext, useMemo, useState } from 'react';

import { AdminUsers } from './AdminUsers';
import { BannedUsers } from './Ban';
import { Bookings } from '../../components/bookingTable/Bookings';
import { Box } from '@mui/material';
import { DatabaseContext } from '../../components/Provider';
import { Liaisons } from './Liaisons';
import Loading from '../../../utils/Loading';
import { PAUsers } from './PAUsers';
import { PagePermission } from '../../../../types';
import SafetyTrainedUsers from './SafetyTraining';
import Settings from './Settings';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// This is a wrapper for google.script.run that lets us use promises.

export default function Admin() {
  const [tab, setTab] = useState('bookings');
  const { adminUsers, pagePermission, userEmail } = useContext(DatabaseContext);

  const adminEmails = useMemo<string[]>(
    () => adminUsers.map((user) => user.email),
    [adminUsers]
  );
  const userHasPermission = pagePermission === PagePermission.ADMIN;

  if (adminEmails.length === 0 || userEmail == null) {
    return <Loading />;
  }

  return (
    <Box margin={3}>
      {!userHasPermission ? (
        <div>You do not have permission to view this page.</div>
      ) : (
        <div>
          <Tabs
            value={tab}
            onChange={(_, newVal) => setTab(newVal)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="bookings" label="Bookings" />
            <Tab value="settings" label="Settings" />
          </Tabs>
          {tab === 'bookings' && <Bookings isAdminView={true} />}
          {tab === 'settings' && <Settings />}
        </div>
      )}
    </Box>
  );
}
