import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

const steps = ["Affiliation", "Select Time", "Details", "Confirmation"];

export default function BookingFormStepper() {
  const pathname = usePathname();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    switch (pathname) {
      case "/walk-in/role":
      case "/book/role":
        setActiveStep(0);
        break;
      case "/walk-in/selectRoom":
      case "/book/selectRoom":
        setActiveStep(1);
        break;
      case "/walk-in/form":
      case "/book/form":
        setActiveStep(2);
        break;
      case "/walk-in/confirmation":
      case "/book/confirmation":
        setActiveStep(3);
        break;
      default:
        setActiveStep(0);
    }
  }, [pathname]);

  return (
    <Box sx={{ width: "100%", padding: 4 }}>
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
