import { Booking, BookingStatusLabel, Inputs } from '../../../../types';
import { Box, TableCell } from '@mui/material';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Table, { TableEmpty } from '../Table';

import BookMoreButton from './BookMoreButton';
import BookingTableFilters from './BookingTableFilters';
import BookingTableRow from './BookingTableRow';
import { DatabaseContext } from '../Provider';
import Loading from '../Loading';
import MoreInfoModal from './MoreInfoModal';
import SortableTableCell from './SortableTableCell';
import getBookingStatus from '../../hooks/getBookingStatus';

interface BookingsProps {
  isAdminView?: boolean;
  isPaView?: boolean;
  isUserView?: boolean;
}

const COMPARATORS: {
  [property: string]: (a: Booking, b: Booking) => number;
} = {
  startDate: (a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  department: (a, b) => a.department.localeCompare(b.department),
  netId: (a, b) => a.netId.localeCompare(b.netId),
};

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
  const [orderBy, setOrderBy] = useState<keyof Booking>('startDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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
    // filter based on user view
    if (isUserView)
      filtered = bookings.filter((booking) => booking.email === userEmail);
    else if (isPaView)
      filtered = bookings.filter((booking) =>
        allowedStatuses.includes(getBookingStatus(booking, bookingStatuses))
      );
    else filtered = bookings;

    // column sorting
    const comparator = COMPARATORS[orderBy];
    const coeff = order === 'asc' ? 1 : -1;
    comparator != null && filtered.sort((a, b) => coeff * comparator(a, b));

    // status chip filters
    if (statusFilters.length === 0) {
      return filtered;
    }
    return filtered.filter((booking) =>
      statusFilters.includes(getBookingStatus(booking, bookingStatuses))
    );
  }, [
    isUserView,
    isPaView,
    bookings,
    allowedStatuses,
    statusFilters,
    order,
    orderBy,
  ]);

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
    if (filteredBookings.length === 0) {
      return (
        <TableEmpty>
          {isUserView
            ? "You don't have any reservations"
            : 'No active reservations found'}
        </TableEmpty>
      );
    }
  }, [isUserView, bookingsLoading, bookings, filteredBookings]);

  const createSortHandler = useCallback(
    (property: keyof Booking) => (_: React.MouseEvent<unknown>) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const columns = useMemo(
    () => [
      <TableCell key="status">Status</TableCell>,
      <SortableTableCell
        label="Date / Time"
        property="startDate"
        key="startDate"
        {...{ createSortHandler, order, orderBy }}
      />,
      <TableCell key="room">Room(s)</TableCell>,
      !isUserView && (
        <SortableTableCell
          label="Department / Role"
          property="department"
          key="department"
          {...{ createSortHandler, order, orderBy }}
        />
      ),
      !isUserView && (
        <SortableTableCell
          key="netId"
          label="Requestor"
          property="netId"
          {...{ createSortHandler, order, orderBy }}
        />
      ),
      !isUserView && <TableCell key="contacts">Contact Info</TableCell>,
      <TableCell key="title">Title</TableCell>,
      !isUserView && <TableCell key="other">Details</TableCell>,
      <TableCell key="action">Action</TableCell>,
    ],
    [isUserView, order, orderBy]
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
