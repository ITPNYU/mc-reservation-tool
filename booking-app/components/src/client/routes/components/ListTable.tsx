import { Box, TableCell } from "@mui/material";
import React, { useMemo } from "react";

import ListTableRow from "./ListTableRow";
import Table from "./Table";
import { TableNames } from "../../../policy";
import { deleteDataFromFirestore } from "@/lib/firebase/firebase";

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

  const columns = useMemo(
    () => [
      ...columnNames?.map((columnName) => (
        <TableCell key={columnName}>{formatColumnName(columnName)}</TableCell>
      )),
      <TableCell align="right" key="action">
        Action
      </TableCell>,
    ],
    [columnNames]
  );

  return (
    <Table {...{ columns, topRow }}>
      {props?.rows.map((row, index: number) => (
        <ListTableRow
          key={index}
          removeRow={() => deleteDataFromFirestore(props.tableName, row.id)}
          columnNames={columnNames}
          columnFormatters={columnFormatters}
          index={index}
          row={row}
          refresh={refresh}
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
    .join(" ");

  return formattedName;
}
