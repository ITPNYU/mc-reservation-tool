import React, { useContext, useMemo } from 'react';

import AddRow from '../../components/AddRow';
import { DatabaseContext } from '../../components/Provider';
import ListTable from '../../components/ListTable';
import { TableNames } from '../../../../policy';
import { formatDate } from '../../../utils/date';

export default function ReservationTypes() {
  const { settings, reloadReservationTypes } = useContext(DatabaseContext);

  const addResType = useMemo(
    () => (
      <AddRow
        columnNameToAddValue="reservationType"
        tableName={TableNames.RESERVATION_TYPES}
        rows={
          settings.reservationTypes as unknown as { [key: string]: string }[]
        }
        rowsRefresh={reloadReservationTypes}
        inputPlaceholder="Add reservation type"
      />
    ),
    [settings.reservationTypes, reloadReservationTypes]
  );

  return (
    <ListTable
      columnNameToRemoveBy="reservationType"
      tableName={TableNames.RESERVATION_TYPES}
      rows={settings.reservationTypes as unknown as { [key: string]: string }[]}
      rowsRefresh={reloadReservationTypes}
      columnFormatters={{ dateAdded: formatDate }}
      topRow={addResType}
    />
  );
}
