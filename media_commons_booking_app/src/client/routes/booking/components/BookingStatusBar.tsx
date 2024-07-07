import { Alert, AlertColor, Box, Button, Tooltip } from '@mui/material';
import { Check, ChevronLeft, ChevronRight } from '@mui/icons-material';
import React, { useContext, useMemo } from 'react';

import { BookingContext } from '../bookingProvider';
import Grid from '@mui/material/Unstable_Grid2';
import useCalculateOverlap from '../hooks/useCalculateOverlap';
import useCheckAutoApproval from '../hooks/useCheckAutoApproval';

interface Props {
  goBack: () => void;
  goNext: () => void;
}

export default function BookingStatusBar(props: Props) {
  const { isAutoApproval, errorMessage } = useCheckAutoApproval();
  const { bookingCalendarInfo, selectedRooms, isBanned, needsSafetyTraining } =
    useContext(BookingContext);
  const isOverlap = useCalculateOverlap();

  const showAlert =
    isBanned ||
    needsSafetyTraining ||
    (bookingCalendarInfo != null && selectedRooms.length > 0);

  // order of precedence matters
  // unfixable blockers > fixable blockers > non-blockers
  const state: {
    message: React.ReactNode;
    severity: AlertColor;
    icon?: React.ReactNode;
    variant?: 'filled' | 'standard' | 'outlined';
    btnDisabled: boolean;
    btnDisabledMessage?: string;
  } = (() => {
    if (isBanned)
      return {
        btnDisabled: true,
        btnDisabledMessage: 'You are banned',
        message: <p>You are banned from booking with the Media Commons</p>,
        severity: 'error',
        variant: 'filled',
      };
    if (needsSafetyTraining)
      return {
        btnDisabled: true,
        btnDisabledMessage: 'You need to take safety training',
        message: (
          <p>
            You have not taken safety training, which is required for at least
            one of the rooms you have selected
          </p>
        ),
        severity: 'error',
      };
    if (isOverlap)
      return {
        btnDisabled: true,
        btnDisabledMessage:
          "Select a different time slot that doesn't conflict with existing reservations",
        message: (
          <p>
            Your selection conflicts with at least one existing reservation.
            Please make another selection.
          </p>
        ),
        severity: 'error',
      };
    if (isAutoApproval)
      return {
        btnDisabled: false,
        btnDisabledMessage: null,
        message: <p>Yay! This request is eligible for automatic approval</p>,
        severity: 'success',
        icon: <Check fontSize="inherit" />,
      };

    return {
      btnDisabled: false,
      btnDisabledMessage: null,
      message: (
        <p>
          This request will require approval.{' '}
          <Tooltip title={errorMessage}>
            <a>Why?</a>
          </Tooltip>
        </p>
      ),
      severity: 'warning',
    };
  })();

  const [disabled, disabledMessage] = (() => {
    if (state.btnDisabled) {
      return [true, state.btnDisabledMessage];
    }
    if (bookingCalendarInfo == null) {
      return [true, 'Click and drag on the calendar to select a time slot'];
    }
    return [false, ''];
  })();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ alignItems: 'center' }}>
        <Grid width={330} sx={{ paddingLeft: '24px' }}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={props.goBack}
          >
            Back
          </Button>
        </Grid>
        <Grid>
          {showAlert && (
            <Alert
              severity={state.severity}
              icon={state.icon}
              variant={state.variant ?? 'standard'}
              sx={{ padding: '3px 16px' }}
            >
              {state.message}
            </Alert>
          )}
        </Grid>
        <Grid sx={{ marginLeft: 'auto', paddingRight: '18px' }}>
          <Tooltip title={disabledMessage}>
            <span>
              <Button
                variant="outlined"
                endIcon={<ChevronRight />}
                onClick={props.goNext}
                disabled={disabled}
              >
                Next
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}
