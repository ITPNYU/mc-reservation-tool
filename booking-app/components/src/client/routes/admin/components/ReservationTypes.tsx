import React, { useContext, useMemo } from "react";

import AddRow from "../../components/AddRow";
import { DatabaseContext } from "../../components/Provider";
import ListTable from "../../components/ListTable";
import { TableNames } from "../../../../policy";
import { formatDate } from "../../../utils/date";

export default function ReservationTypes() {
  const { settings, reloadReservationTypes } = useContext(DatabaseContext);

  const addResType = useMemo(
    () => (
      <AddRow
        columnNameUniqueValue="reservationType"
        tableName={TableNames.RESERVATION_TYPES}
        rows={
          settings.reservationTypes as unknown as { [key: string]: string }[]
        }
        rowsRefresh={reloadReservationTypes}
        inputPlaceholder="Add reservation type"
        title="Booking Form Reservation Types"
      />
    ),
    [settings.reservationTypes, reloadReservationTypes]
  );

  const rows = useMemo(() => {
    const sorted = settings.reservationTypes.sort((a, b) =>
      a.reservationType.localeCompare(b.reservationType)
    );
    return sorted as unknown as { [key: string]: string }[];
  }, [settings.reservationTypes]);

  return (
    <ListTable
      columnNameToRemoveBy="reservationType"
      tableName={TableNames.RESERVATION_TYPES}
      rows={rows}
      rowsRefresh={reloadReservationTypes}
      columnFormatters={{ createdAt: formatDate }}
      topRow={addResType}
    />
  );
}
