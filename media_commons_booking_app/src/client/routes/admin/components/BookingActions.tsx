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

enum Actions {
  CANCEL = 'Cancel',
  NO_SHOW = 'No Show',
  CHECK_IN = 'Check In',
  FIRST_APPROVE = '1st Approve',
  SECOND_APPROVE = '2nd Approve',
  REJECT = 'Reject',
  PLACEHOLDER = '',
}

type ActionDefinition = {
  action: () => Promise<void>;
  optimisticNextStatus: BookingStatusLabel;
  confirmation?: boolean;
};

export default function BookingActions({
  status,
  calendarEventId,
  isAdminView,
  isUserView,
  setOptimisticStatus,
}: Props) {
  const [uiLoading, setUiLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Actions>(
    Actions.PLACEHOLDER
  );
  const { reloadBookings, reloadBookingStatuses } = useContext(DatabaseContext);

  const reload = async () => {
    await Promise.all([reloadBookings(), reloadBookingStatuses()]);
  };

  const onError = () => alert('Failed to perform action on booking');

  const doAction = async ({
    action,
    optimisticNextStatus,
    confirmation,
  }: ActionDefinition) => {
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
      setSelectedAction(Actions.PLACEHOLDER);
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

  const actions: { [key in Actions]: ActionDefinition } = {
    [Actions.CANCEL]: {
      action: () => serverFunctions.cancel(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.CANCELED,
      confirmation: true,
    },
    [Actions.NO_SHOW]: {
      action: () => serverFunctions.noShow(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.NO_SHOW,
    },
    [Actions.CHECK_IN]: {
      action: () => serverFunctions.checkin(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.CHECKED_IN,
    },
    [Actions.FIRST_APPROVE]: {
      action: () => serverFunctions.approveBooking(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.PRE_APPROVED,
    },
    [Actions.SECOND_APPROVE]: {
      action: () => serverFunctions.approveBooking(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.APPROVED,
    },
    [Actions.REJECT]: {
      action: () => serverFunctions.reject(calendarEventId),
      optimisticNextStatus: BookingStatusLabel.REJECTED,
      confirmation: true,
    },
    // never used, just make typescript happy
    [Actions.PLACEHOLDER]: {
      action: async () => {},
      optimisticNextStatus: BookingStatusLabel.UNKNOWN,
    },
  };

  const userOptions = useMemo(
    () => (status === BookingStatusLabel.CANCELED ? [] : [Actions.CANCEL]),
    [status]
  );

  const paOptions = useMemo(() => {
    let options = [];

    if (status === BookingStatusLabel.APPROVED) {
      options.push(Actions.CHECK_IN);
      options.push(Actions.NO_SHOW);
    } else if (status === BookingStatusLabel.CHECKED_IN) {
      options.push(Actions.NO_SHOW);
    } else if (status === BookingStatusLabel.NO_SHOW) {
      options.push(Actions.CHECK_IN);
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
      options.push(Actions.FIRST_APPROVE);
    } else if (status === BookingStatusLabel.PRE_APPROVED) {
      options.push(Actions.SECOND_APPROVE);
    }

    options = options.concat(paOptions);
    options.push(Actions.REJECT);
    return options;
  }, [status, paOptions]);

  const options = () => {
    if (isUserView) return userOptions;
    if (isAdminView) return adminOptions;
    return paOptions;
  };

  if (options().length === 0) {
    return <></>;
  }

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
        value={selectedAction}
        size="small"
        displayEmpty
        onChange={(e) => setSelectedAction(e.target.value as Actions)}
        renderValue={(selected) => {
          if (selected === Actions.PLACEHOLDER) {
            return <em style={{ color: 'gray' }}>Action</em>;
          }
          return selected;
        }}
        sx={{
          width: 125,
        }}
      >
        <MenuItem value={Actions.PLACEHOLDER} sx={{ color: 'gray' }}>
          <em>Action</em>
        </MenuItem>
        {options().map((action) => (
          <MenuItem value={action} key={action}>
            {action}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        disabled={selectedAction === Actions.PLACEHOLDER}
        color={'primary'}
        onClick={() => {
          console.log(selectedAction);
          const actionDetails = actions[selectedAction];
          doAction(actionDetails);
        }}
      >
        <Check />
      </IconButton>
    </div>
  );
}
