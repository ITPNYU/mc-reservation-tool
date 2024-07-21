import { TableCell, TableSortLabel } from '@mui/material';

import { Booking } from '../../../../types';
import React from 'react';

interface Props {
  createSortHandler: any;
  property: keyof Booking;
  label: string;
  orderBy: keyof Booking;
  order: 'asc' | 'desc';
}

export default function SortableTableCell(props: Props) {
  const { orderBy, order, property } = props;

  return (
    <TableCell
      key={property}
      sortDirection={orderBy === property ? order : false}
    >
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : 'asc'}
        onClick={props.createSortHandler(property)}
      >
        {props.label}
      </TableSortLabel>
    </TableCell>
  );
}
