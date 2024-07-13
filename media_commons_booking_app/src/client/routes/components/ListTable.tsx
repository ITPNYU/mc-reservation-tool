import { Box, TableCell } from '@mui/material';
import React, { useMemo } from 'react';

import ListTableRow from './ListTableRow';
import Table from './Table';
import { TableNames } from '../../../policy';
import { serverFunctions } from '../../utils/serverFunctions';

interface Props {
  columnFormatters?: { [key: string]: (value: string) => string };
  columnNameToRemoveBy: string;
  tableName: TableNames;
  rows: { [key: string]: string }[];
  rowsRefresh: () => Promise<void>;
  topRow: React.ReactNode;
}

export default function ListTable(props: Props) {
  const refresh = props.rowsRefresh;
  const topRow = props.topRow;
  const columnFormatters = props.columnFormatters || {};

  const columnNames = useMemo<string[]>(() => {
    if (props.rows.length === 0) {
      return [];
    }
    return Object.keys(props.rows[0]) as string[];
  }, [props.rows]);

  // if (props.rows.length === 0) {
  //   return <p>No results</p>;
  // }

  const columns = useMemo(
    () => [
      ...columnNames.map((columnName, idx) => (
        <TableCell key={idx}>{formatColumnName(columnName)}</TableCell>
      )),
      <TableCell align="right">Action</TableCell>,
    ],
    [columnNames]
  );

  return (
    <Table {...{ columns, topRow }}>
      {props.rows.map((row, index: number) => (
        <ListTableRow
          key={index}
          removeRow={() =>
            serverFunctions.removeFromListByValue(
              props.tableName,
              row[props.columnNameToRemoveBy]
            )
          }
          {...{ columnNames, columnFormatters, index, row, refresh }}
        />
      ))}
    </Table>
  );
}

function formatColumnName(columnName: string): string {
  // Split the column name at capital letters or underscores
  const parts = columnName.split(/(?=[A-Z])|_/);

  // Capitalize the first letter of each word and join with spaces
  const formattedName = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return formattedName;
}
