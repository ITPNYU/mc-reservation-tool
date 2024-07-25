import React, { useContext } from "react";

import AddRow from "../../components/AddRow";
import { DatabaseContext } from "../../components/Provider";
import ListTable from "../../components/ListTable";
import { TableNames } from "../../../../policy";
import { formatDate } from "../../../utils/date";

export default function Settings() {
  const { settings, reloadReservationTypes } = useContext(DatabaseContext);

  return (
    <>
      <AddRow
        columnNameToAddValue="bookingType"
        label="Reservation Type"
        tableName={TableNames.BOOKING_TYPES}
        rows={settings.bookingTypes as unknown as { [key: string]: string }[]}
        rowsRefresh={reloadReservationTypes}
      />
      <ListTable
        columnNameToRemoveBy="bookingType"
        tableName={TableNames.BOOKING_TYPES}
        rows={settings.bookingTypes as unknown as { [key: string]: string }[]}
        rowsRefresh={reloadReservationTypes}
        columnFormatters={{ createdAt: formatDate }}
      />
    </>
  );
}
