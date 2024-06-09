import { IconButton, MenuItem, Select } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { BookingStatusLabel } from '../../../../types';
import Check from '@mui/icons-material/Check';
import { DatabaseContext } from '../../components/Provider';
import Loading from '../../../utils/Loading';
import { serverFunctions } from '../../../utils/serverFunctions';

interface Props {
  calendarEventId: string;
  isAdminView: boolean;
  isUserView: boolean;
  setOptimisticStatus: (x: BookingStatusLabel) => void;
  status: BookingStatusLabel;
}

export default function BookingActions({
  status,
  calendarEventId,
  isAdminView,
  isUserView,
  setOptimisticStatus,
}: Props) {
  const [uiLoading, setUiLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const { reloadBookings, reloadBookingStatuses } = useContext(DatabaseContext);

  const reload = async () => {
    await Promise.all([reloadBookings(), reloadBookingStatuses()]);
  };

  const onError = () => alert('Failed to perform action on booking');

  const doAction = async (
    action: () => Promise<void>,
    optimisticNextStatus: BookingStatusLabel,
    confirmation?: boolean
  ) => {
    if (confirmation) {
      const result = confirm(`Are you sure? This action can't be undone.`);
      if (!result) {
        return;
      }
    }
    setUiLoading(true);
    setOptimisticStatus(optimisticNextStatus);
    try {
      action()
        .catch(() => {
          onError();
          setOptimisticStatus(undefined);
        })
        .finally(() => reload().then(() => setOptimisticStatus(undefined)));
    } catch (ex) {
      console.error(ex);
      onError();
    } finally {
      setUiLoading(false);
    }
  };

  if (uiLoading) {
    return (
      // <td className="px-2 py-4 w-28">
      <Loading />
      // </td>
    );
  }

  const userOptions = useMemo(
    () =>
      status === BookingStatusLabel.CANCELED
        ? []
        : [
            {
              label: 'Cancel',
              action: () => serverFunctions.cancel(calendarEventId),
              optimisticNextStatus: BookingStatusLabel.CANCELED,
              confirmation: true,
            },
          ],
    [status]
  );

  const paOptions = useMemo(() => {
    let options = [];
    const checkIn = {
      label: 'Check In',
      action: () => serverFunctions.checkin(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.CHECKED_IN,
    };
    const noShow = {
      label: 'No Show',
      action: () => serverFunctions.noShow(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.NO_SHOW,
    };

    if (status === BookingStatusLabel.APPROVED) {
      options.push(checkIn);
      options.push(noShow);
    } else if (status === BookingStatusLabel.CHECKED_IN) {
      options.push(noShow);
    } else if (status === BookingStatusLabel.NO_SHOW) {
      options.push(checkIn);
    }
    return options;
  }, [status]);

  const adminOptions = useMemo(() => {
    if (
      status === BookingStatusLabel.CANCELED ||
      status === BookingStatusLabel.REJECTED
    ) {
      return [];
    }

    let options = [];
    if (status === BookingStatusLabel.REQUESTED) {
      options.push({
        label: '1st Approve',
        action: () => serverFunctions.approveBooking(calendarEventId),
        optimisticNextStatus: BookingStatusLabel.PRE_APPROVED,
      });
    } else if (status === BookingStatusLabel.PRE_APPROVED) {
      options.push({
        label: '2nd Approve',
        action: () => serverFunctions.approveBooking(calendarEventId),
        optimisticNextStatus: BookingStatusLabel.APPROVED,
      });
    }

    options = options.concat(paOptions);
    options.push({
      label: 'Reject',
      action: () => serverFunctions.reject(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.REJECTED,
      confirmation: true,
    });

    return options;
  }, [status, paOptions]);

  const options = () => {
    if (isUserView) return userOptions;
    if (isAdminView) return adminOptions;
    return paOptions;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Select
        value={selectedValue}
        size="small"
        displayEmpty
        onChange={(e) => setSelectedValue(e.target.value)}
        renderValue={(selected) => {
          if (selected === null) {
            return (
              <span style={{ color: 'gray' }}>
                <em>Action</em>
              </span>
            );
          }

          return selected;
        }}
        sx={{
          width: 125,
        }}
      >
        <MenuItem value={null} sx={{ color: 'gray' }}>
          <em>Action</em>
        </MenuItem>
        {options().map(({ label }) => (
          <MenuItem value={label}>{label}</MenuItem>
        ))}
      </Select>
      <IconButton
        disabled={selectedValue === null}
        onClick={() => {
          console.log(selectedValue);
          // doAction(
          //   selectedValue.action,
          //   selectedValue.optimisticNextStatus,
          //   selectedValue.confirmation
          // )
        }}
      >
        <Check />
      </IconButton>
    </div>
  );
}
