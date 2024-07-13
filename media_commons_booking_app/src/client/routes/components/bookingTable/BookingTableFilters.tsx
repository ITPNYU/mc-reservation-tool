import { BookingStatusLabel } from '../../../../types';
import { Box } from '@mui/material';
import FilterList from '@mui/icons-material/FilterList';
import React from 'react';
import StatusChip from './StatusChip';

interface Props {
  allowedStatuses: BookingStatusLabel[];
  selected: BookingStatusLabel[];
  setSelected: any;
}

export default function BookingTableFilters({
  allowedStatuses,
  selected,
  setSelected,
}: Props) {
  const handleChipClick = (status: BookingStatusLabel) => {
    setSelected((prev: BookingStatusLabel[]) => {
      if (prev.includes(status)) {
        return prev.filter((x) => x !== status);
      }
      return [...prev, status];
    });
  };

  return (
    <>
      <FilterList sx={{ marginRight: '14px', color: 'rgba(0,0,0,0.8)' }} />
      {allowedStatuses.map((status) =>
        status === BookingStatusLabel.UNKNOWN ? null : (
          <Box
            onClick={() => handleChipClick(status)}
            key={status}
            sx={{
              cursor: 'pointer',
              display: 'inline-block',
              padding: '0px 8px 0px 4px',
            }}
          >
            <StatusChip status={status} disabled={!selected.includes(status)} />
          </Box>
        )
      )}
    </>
  );
}
