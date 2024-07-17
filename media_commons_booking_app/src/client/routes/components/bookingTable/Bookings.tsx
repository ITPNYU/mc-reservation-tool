import { Booking, BookingStatusLabel } from '../../../../types';
import { Box, TableCell } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Table, { TableEmpty } from '../Table';

import BookMoreButton from './BookMoreButton';
import BookingTableFilters from './BookingTableFilters';
import BookingTableRow from './BookingTableRow';
import { DatabaseContext } from '../Provider';
import Loading from '../Loading';
import MoreInfoModal from './MoreInfoModal';
import getBookingStatus from '../../hooks/getBookingStatus';

interface BookingsProps {
  isAdminView?: boolean;
  isPaView?: boolean;
  isUserView?: boolean;
}

export const Bookings: React.FC<BookingsProps> = ({
  isAdminView = false,
  isPaView = false,
  isUserView = false,
}) => {
  const {
    bookings,
    bookingsLoading,
    bookingStatuses,
    userEmail,
    reloadBookings,
    reloadBookingStatuses,
  } = useContext(DatabaseContext);

  const [modalData, setModalData] = useState(null);
  const [statusFilters, setStatusFilters] = useState([]);

  useEffect(() => {
    reloadBookingStatuses();
    reloadBookings();
  }, []);

  const allowedStatuses: BookingStatusLabel[] = useMemo(() => {
    const paViewStatuses = [
      BookingStatusLabel.APPROVED,
      BookingStatusLabel.CHECKED_IN,
      BookingStatusLabel.NO_SHOW,
    ];
    if (isPaView) {
      return paViewStatuses;
    } else {
      return Object.values(BookingStatusLabel);
    }
  }, [isUserView, isPaView]);

  const filteredBookings = useMemo(() => {
    let filtered: Booking[];
    if (isUserView)
      filtered = bookings.filter((booking) => booking.email === userEmail);
    else if (isPaView)
      filtered = bookings.filter((booking) =>
        allowedStatuses.includes(getBookingStatus(booking, bookingStatuses))
      );
    else filtered = bookings;

    // if no status filters are selected, view all
    if (statusFilters.length === 0) {
      return filtered;
    }
    return filtered.filter((booking) =>
      statusFilters.includes(getBookingStatus(booking, bookingStatuses))
    );
  }, [isUserView, isPaView, bookings, allowedStatuses, statusFilters]);

  const topRow = useMemo(() => {
    if (isUserView) {
      return (
        <Box
          sx={{
            color: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'flex-start',
            paddingLeft: '16px',
          }}
        >
          Your Bookings
        </Box>
      );
    }
    return (
      <BookingTableFilters
        allowedStatuses={allowedStatuses}
        selected={statusFilters}
        setSelected={setStatusFilters}
      />
    );
  }, [isUserView, statusFilters, allowedStatuses]);

  const bottomSection = useMemo(() => {
    if (bookingsLoading && bookings.length === 0) {
      return (
        <TableEmpty>
          <Loading />
        </TableEmpty>
      );
    }
    if (bookings.length === 0) {
      return (
        <TableEmpty>
          {isUserView
            ? "You don't have any reservations"
            : 'No active reservations found'}
        </TableEmpty>
      );
    }
  }, [isUserView, bookingsLoading, bookings]);

  const columns = useMemo(
    () => [
      <TableCell key="status">Status</TableCell>,
      <TableCell key="dates">Dates</TableCell>,
      <TableCell key="room">Room</TableCell>,
      !isUserView && <TableCell key="department">Department/Role</TableCell>,
      !isUserView && <TableCell key="id">ID</TableCell>,
      !isUserView && <TableCell key="contacts">Contacts</TableCell>,
      <TableCell key="title">Title</TableCell>,
      !isUserView && <TableCell key="other">Other Info</TableCell>,
      <TableCell key="action">Action</TableCell>,
    ],
    [isUserView]
  );

  return (
    <Box sx={{ marginTop: 4 }}>
      <Table
        {...{ columns, topRow }}
        sx={{
          borderRadius: isUserView ? '0px' : '',
        }}
      >
        {filteredBookings.map((booking) => (
          <BookingTableRow
            key={booking.calendarEventId}
            {...{
              booking,
              isAdminView,
              isUserView,
              setModalData,
            }}
          />
        ))}
      </Table>
      {isUserView && <BookMoreButton />}
      {bottomSection}
      {modalData != null && (
        <MoreInfoModal
          booking={modalData}
          closeModal={() => setModalData(null)}
        />
      )}
    </Box>
  );
};
