import { Booking, BookingStatusLabel } from '../../../../types';
import { IconButton, TableCell, TableRow } from '@mui/material';
import React, { useContext, useState } from 'react';
import { formatDateTable, formatTimeTable } from '../../../utils/date';

import BookingActions from './BookingActions';
import { DatabaseContext } from '../../components/Provider';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import StackedTableCell from './StackedTableCell';
import StatusChip from './StatusChip';
import getBookingStatus from '../hooks/getBookingStatus';

interface Props {
  booking: Booking;
  isAdminView: boolean;
  isUserView: boolean;
  setModalData: (x: Booking) => void;
}

export default function BookingTableRow({
  booking,
  isAdminView,
  isUserView,
  setModalData,
}: Props) {
  const { bookingStatuses } = useContext(DatabaseContext);
  const status = getBookingStatus(booking, bookingStatuses);

  const [optimisticStatus, setOptimisticStatus] =
    useState<BookingStatusLabel>();

  return (
    <TableRow>
      <TableCell>
        <StatusChip status={optimisticStatus ?? status} />
      </TableCell>
      <TableCell>{booking.roomId}</TableCell>
      <StackedTableCell
        topText={booking.department}
        bottomText={booking.role}
      />
      <StackedTableCell
        topText={`${booking.firstName} ${booking.lastName}`}
        bottomText={booking.netId}
      />
      <StackedTableCell
        topText={booking.email}
        bottomText={booking.phoneNumber}
      />
      <StackedTableCell
        topText={formatDateTable(booking.startDate)}
        bottomText={`${formatTimeTable(booking.startDate)} - ${formatTimeTable(
          booking.endDate
        )}`}
      />
      <TableCell
        sx={{
          maxWidth: '200px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {booking.title}
      </TableCell>
      <TableCell>
        <IconButton onClick={() => setModalData(booking)}>
          <MoreHoriz />
        </IconButton>
      </TableCell>
      <TableCell>
        <BookingActions
          status={optimisticStatus ?? status}
          calendarEventId={booking.calendarEventId}
          {...{ setOptimisticStatus, isAdminView, isUserView }}
        />
      </TableCell>
    </TableRow>
  );
}
