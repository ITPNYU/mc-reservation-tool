import { Alert, Box, Button } from '@mui/material';
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
  const { bookingCalendarInfo, selectedRooms } = useContext(BookingContext);
  const isOverlap = useCalculateOverlap();

  const showAlert = bookingCalendarInfo != null && selectedRooms.length > 0;

  const message = useMemo(() => {
    if (isOverlap)
      return 'Your selection conflicts with at least one existing reservation. Please make another selection.';
    if (isAutoApproval)
      return 'Yay! This request is eligible for automatic approval';
    else return 'This request will require approval';
  }, [isAutoApproval, isOverlap]);

  const color = useMemo(() => {
    if (isOverlap) return 'error';
    if (isAutoApproval) return 'success';
    else return 'warning';
  }, [isOverlap, isAutoApproval]);

  const icon = useMemo(() => {
    if (isOverlap) return undefined;
    if (isAutoApproval) return <Check fontSize="inherit" />;
    else return undefined;
  }, [isOverlap, isAutoApproval]);

  const canContinue = !isOverlap && bookingCalendarInfo != null;

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
            <Alert severity={color} icon={icon} sx={{ padding: '3px 16px' }}>
              {message}
            </Alert>
          )}
        </Grid>
        <Grid sx={{ marginLeft: 'auto', paddingRight: '18px' }}>
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={props.goNext}
            disabled={!canContinue}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
