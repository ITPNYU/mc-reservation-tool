import React, { useContext } from 'react';

import AddEmail from '../../../components/addEmail';
import { DatabaseContext } from '../../../components/provider';
import EmailListTable from '../../../components/emailListTable';
import { TableNames } from '../../../../policy';
import { formatDate } from '../../../utils/date';

export const PAUsers = () => {
  const { paUsers, reloadPaUsers } = useContext(DatabaseContext);

  return (
    <>
      <AddEmail
        tableName={TableNames.PAS}
        userList="paUsers"
        userListRefresh="reloadPaUsers"
      />
      <EmailListTable
        tableName={TableNames.PAS}
        userList={paUsers}
        userListRefresh={reloadPaUsers}
        columnFormatters={{ createdAt: formatDate }}
      />
    </>
  );
};
