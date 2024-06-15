import { Booking, BookingStatusLabel } from '../../../../types';
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import React, { useContext, useMemo, useRef, useState } from 'react';
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
  const titleRef = useRef();

  const [optimisticStatus, setOptimisticStatus] =
    useState<BookingStatusLabel>();

  const titleOverflows = useMemo(() => {
    console.log(titleRef.current);
    // if (titleRef.current.clientWidth)
  }, [booking.title]);

  return (
    <TableRow>
      <TableCell>
        <StatusChip status={optimisticStatus ?? status} />
      </TableCell>
      <StackedTableCell
        topText={formatDateTable(booking.startDate)}
        bottomText={`${formatTimeTable(booking.startDate)} - ${formatTimeTable(
          booking.endDate
        )}`}
      />
      <TableCell>{booking.roomId}</TableCell>
      {!isUserView && (
        <StackedTableCell
          topText={booking.department}
          bottomText={booking.role}
        />
      )}
      {!isUserView && (
        <StackedTableCell
          topText={`${booking.firstName} ${booking.lastName}`}
          bottomText={booking.netId}
        />
      )}
      {!isUserView && (
        <StackedTableCell
          topText={booking.email}
          bottomText={booking.phoneNumber}
        />
      )}
      <Tooltip
        title={booking.title}
        placement="bottom"
        slotProps={{
          popper: {
            sx: {
              [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                {
                  marginTop: '-12px',
                },
              [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                {
                  marginBottom: '-12px',
                },
            },
          },
        }}
      >
        <TableCell
          sx={{
            maxWidth: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <p ref={titleRef}>{booking.title}</p>
        </TableCell>
      </Tooltip>
      {!isUserView && (
        <TableCell>
          <IconButton onClick={() => setModalData(booking)}>
            <MoreHoriz />
          </IconButton>
        </TableCell>
      )}
      <TableCell width={100}>
        <BookingActions
          status={optimisticStatus ?? status}
          calendarEventId={booking.calendarEventId}
          {...{ setOptimisticStatus, isAdminView, isUserView }}
        />
      </TableCell>
    </TableRow>
  );
}
