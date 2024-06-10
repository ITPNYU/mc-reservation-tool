import { Booking, BookingStatusLabel } from '../../../../types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import BookingTableFilters from './BookingTableFilters';
import BookingTableRow from './BookingTableRow';
import { DatabaseContext } from '../../components/Provider';
import MoreInfoModal from './MoreInfoModal';
import getBookingStatus from '../hooks/getBookingStatus';
import { styled } from '@mui/system';

interface BookingsProps {
  isAdminView?: boolean;
  isPaView?: boolean;
  isUserView?: boolean;
}

const TableCustom = styled(Table)(({ theme }) => ({
  border: `1px solid ${theme.palette.custom.border}`,
}));

const ShadedHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.custom.gray,
}));

export const Bookings: React.FC<BookingsProps> = ({
  isAdminView = false,
  isPaView = false,
  isUserView = false,
}) => {
  const {
    bookings,
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

  return (
    <Box sx={{ marginTop: 4 }}>
      <BookingTableFilters
        allowedStatuses={allowedStatuses}
        selected={statusFilters}
        setSelected={setStatusFilters}
      />
      <TableCustom size="small">
        <ShadedHeader>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Department/Role</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Contacts</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Other Info</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </ShadedHeader>
        <TableBody>
          {filteredBookings.map((booking, index) => (
            <BookingTableRow
              key={index}
              {...{
                booking,
                isAdminView,
                isUserView,
                setModalData,
              }}
            />
          ))}
        </TableBody>
      </TableCustom>
      {modalData != null && (
        <MoreInfoModal
          booking={modalData}
          closeModal={() => setModalData(null)}
        />
      )}
    </Box>
  );
};
