import { Alert, Box, Button } from '@mui/material';
import { Check, ChevronLeft, ChevronRight } from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';

interface Props {
  goBack: () => void;
  goNext: () => void;
}

export default function BookingStatusBar(props: Props) {
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
          <Alert
            severity="success"
            icon={<Check fontSize="inherit" />}
            sx={{ padding: '3px 16px' }}
          >
            Yay! This request is eligible for automatic approval
          </Alert>
        </Grid>
        <Grid sx={{ marginLeft: 'auto', paddingRight: '18px' }}>
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={props.goNext}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
