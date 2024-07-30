import React from 'react';
import { TableCell } from '@mui/material';
import { styled } from '@mui/system';

interface Props {
  topText: string;
  bottomText: string;
}

interface CellProps {
  $bold: boolean;
}

const Stacked = styled(TableCell)<CellProps>(({ $bold }) => ({
  p: {
    fontWeight: $bold ? 500 : 400,
  },
  label: {
    fontSize: '12px',
  },
}));

export default function StackedTableCell({ topText, bottomText }: Props) {
  return (
    <Stacked $bold={bottomText?.length > 0}>
      <p>{topText}</p>
      <label>{bottomText}</label>
    </Stacked>
  );
}
