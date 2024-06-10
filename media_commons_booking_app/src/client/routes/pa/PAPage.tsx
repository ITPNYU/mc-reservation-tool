import React, { useContext, useMemo, useState } from 'react';

import { Bookings } from '../admin/components/Bookings';
import { DatabaseContext } from '../components/Provider';
import Loading from '../../utils/Loading';
import { PagePermission } from '../../../types';
import SafetyTrainedUsers from '../admin/components/SafetyTraining';

const PAPage = () => {
  const [tab, setTab] = useState('bookings');
  const { paUsers, pagePermission, userEmail } = useContext(DatabaseContext);

  const paEmails = useMemo<string[]>(
    () => paUsers.map((user) => user.email),
    [paUsers]
  );

  const userHasPermission =
    pagePermission === PagePermission.ADMIN ||
    pagePermission === PagePermission.PA;

  if (paEmails.length === 0 || userEmail === null) {
    return <Loading />;
  }

  return (
    <div className="m-10">
      {!userHasPermission ? (
        <div className="m-10">
          You do not have permission to view this page.
        </div>
      ) : (
        <div>
          <Bookings isPaView={true} />
        </div>
      )}
    </div>
  );
};

export default PAPage;
