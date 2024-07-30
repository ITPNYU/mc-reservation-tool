import { Box, useScrollTrigger } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import BookingFormStepper from './Stepper';
import BookingStatusBar from './BookingStatusBar';
import React from 'react';
import { styled } from '@mui/system';

const StickyScroll = styled(Box)`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  padding-bottom: 20px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  if (location.pathname === '/book') {
    return null;
  }

  const goBack = (() => {
    switch (location.pathname) {
      case '/book/selectRoom':
        return () => navigate('/book/role');
      case '/book/form':
        return () => navigate('/book/selectRoom');
      default:
        return () => {};
    }
  })();

  const goNext = (() => {
    switch (location.pathname) {
      case '/book/selectRoom':
        return () => navigate('/book/form');
      default:
        return () => {};
    }
  })();

  const hideNextButton = location.pathname === '/book/form';

  const showStatusBar =
    location.pathname === '/book/selectRoom' ||
    location.pathname === '/book/form';

  return (
    <StickyScroll
      boxShadow={
        trigger
          ? '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
          : ''
      }
    >
      <div>
        <BookingFormStepper />
        {showStatusBar && (
          <BookingStatusBar {...{ goBack, goNext, hideNextButton }} />
        )}
      </div>
    </StickyScroll>
  );
};
