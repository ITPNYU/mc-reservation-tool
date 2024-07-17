import React, { useContext } from 'react';

import { BookingContext } from '../bookingProvider';
import { CenterLoading } from '../../components/Loading';
import { DatabaseContext } from '../../components/Provider';
import FormInput from '../components/FormInput';
import Grid from '@mui/material/Unstable_Grid2';
import { Inputs } from '../../../../types';
import useSubmitBooking from '../hooks/useSubmitBooking';

export default function BookingFormDetailsPage() {
  const { userEmail, setUserEmail } = useContext(DatabaseContext);
  const { bookingCalendarInfo } = useContext(BookingContext);

  const [registerEvent, loading] = useSubmitBooking();

  const handleSubmit = async (data: Inputs) => {
    if (!bookingCalendarInfo) return;
    if (!userEmail && data.missingEmail) {
      setUserEmail(data.missingEmail);
    }
    registerEvent(data);
  };

  if (loading) {
    return <CenterLoading />;
  }

  return (
    <Grid container>
      <Grid width={330} />
      <Grid xs={7} paddingRight={2}>
        <FormInput handleParentSubmit={handleSubmit} />
      </Grid>
    </Grid>
  );
}
