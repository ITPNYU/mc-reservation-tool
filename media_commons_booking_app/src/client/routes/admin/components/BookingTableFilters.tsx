import { Box, TableCell, TableHead, TableRow } from '@mui/material';

import { BookingStatusLabel } from '../../../../types';
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
    setSelected((prev) => {
      if (prev.includes(status)) {
        return prev.filter((x) => x !== status);
      }
      return [...prev, status];
    });
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
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
                <StatusChip
                  status={status}
                  disabled={!selected.includes(status)}
                />
              </Box>
            )
          )}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
