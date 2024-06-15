import { Box, Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router';

const steps = ['Affiliation', 'Select Time', 'Details'];

export default function BookingFormStepper() {
  const { pathname } = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    switch (pathname) {
      case '/book/role':
        setActiveStep(0);
        break;
      case '/book/selectRoom':
        setActiveStep(1);
        break;
      case '/book/form':
        setActiveStep(2);
        break;
      default:
        setActiveStep(0);
    }
  }, [pathname]);

  return (
    <Box sx={{ width: '100%', padding: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
