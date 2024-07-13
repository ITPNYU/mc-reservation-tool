import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import React from 'react';
import { styled } from '@mui/system';

const TableCustom = styled(MuiTable)(({ theme }) => ({
  border: `1px solid ${theme.palette.custom.border}`,
}));

const ShadedHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.custom.gray,
}));

export const TableTopRow = styled(MuiTable)`
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: none;
  border-radius: 4px 4px 0px 0px;

  th,
  td {
    border: none;
  }
`;

export const TableEmpty = styled(Box)`
  color: rgba(0, 0, 0, 0.38);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
`;

interface Props {
  columns: React.ReactNode[];
  children: React.ReactNode[];
  topRow: React.ReactNode;
}

export default function Table({ columns, children, topRow }: Props) {
  return (
    <Box>
      <TableTopRow>
        <TableBody>
          <TableRow>
            <TableCell>{topRow}</TableCell>
          </TableRow>
        </TableBody>
      </TableTopRow>
      <TableCustom size="small">
        <ShadedHeader>
          <TableRow>{columns}</TableRow>
        </ShadedHeader>
        <TableBody>{children}</TableBody>
      </TableCustom>
    </Box>
  );
}
