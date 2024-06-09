import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { BookingStatusLabel } from '../../../../types';
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

  useEffect(() => {
    reloadBookingStatuses();
    reloadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const paViewStatuses = [
      BookingStatusLabel.APPROVED,
      BookingStatusLabel.CHECKED_IN,
      BookingStatusLabel.NO_SHOW,
    ];
    if (isUserView)
      return bookings.filter((booking) => booking.email === userEmail);
    if (isPaView)
      return bookings.filter((booking) =>
        paViewStatuses.includes(getBookingStatus(booking, bookingStatuses))
      );
    return bookings;
  }, [isUserView, bookings]);

  return (
    <>
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
    </>
  );
};
