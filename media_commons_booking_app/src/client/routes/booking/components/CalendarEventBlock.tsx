import { BookingStatusLabel } from '../../../../types';
import { Box } from '@mui/material';
import { EventContentArg } from '@fullcalendar/core';
import React from 'react';
import { styled } from '@mui/system';

interface Props {
  bgcolor: string;
}

const Block = styled(Box)<Props>(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor ?? theme.palette.primary.main,
  border: `2px solid ${bgcolor ?? theme.palette.primary.main}`,
  borderRadius: '2px',
  outline: 'none',
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
  cursor: bgcolor ? 'unset' : 'pointer',
}));

export default function CalendarEventBlock(eventInfo: EventContentArg) {
  const match = eventInfo.event.title.match(/\[(.*?)\]/);
  const title = match ? match[1] : eventInfo.event.title;

  const backgroundColor = () => {
    if (!match) {
      return null;
    }
    let backgroundColor = 'rgba(72, 196, 77, 1)';
    // Change the background color of the event depending on its title
    if (eventInfo.event.title.includes(BookingStatusLabel.REQUESTED)) {
      backgroundColor = 'rgba(255, 122, 26, 1)';
    } else if (
      eventInfo.event.title.includes(BookingStatusLabel.PRE_APPROVED)
    ) {
      backgroundColor = 'rgba(223, 26, 255, 1)';
    }
    return backgroundColor;
  };

  return (
    <Block bgcolor={backgroundColor()}>
      <b>{title}</b>
    </Block>
  );
}
