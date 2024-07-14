import { Box, IconButton, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { AddCircleOutline } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Loading from '../../utils/Loading';
import { TableNames } from '../../../policy';
import { serverFunctions } from '../../utils/serverFunctions';

interface Props {
  addDuplicateErrorMessage?: string;
  addFailedErrorMessage?: string;
  columnNameToAddValue: string;
  inputPlaceholder?: string;
  tableName: TableNames;
  rows: { [key: string]: string }[];
  rowsRefresh: () => Promise<void>;
  title: string;
}

export default function AddRow(props: Props) {
  const { tableName, rows, rowsRefresh, title } = props;
  const [valueToAdd, setValueToAdd] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const uniqueValues = useMemo<string[]>(
    () => rows.map((row) => row[props.columnNameToAddValue]),
    [rows]
  );

  const addValue = async () => {
    if (!valueToAdd || valueToAdd.length === 0) return;

    if (uniqueValues.includes(valueToAdd)) {
      alert(
        props.addDuplicateErrorMessage ?? 'This value has already been added'
      );
      return;
    }

    setLoading(true);
    try {
      await serverFunctions.appendRowActive(tableName, [
        valueToAdd,
        new Date().toString(),
      ]);
      await rowsRefresh();
    } catch (ex) {
      console.error(ex);
      alert(props.addFailedErrorMessage ?? 'Failed to add value');
    } finally {
      setLoading(false);
      setValueToAdd('');
    }
  };

  return (
    <Grid
      container
      spacing={2}
      display="flex"
      justifyContent={'space-between'}
      alignItems={'center'}
      paddingRight="16px"
    >
      <Grid sx={{ paddingLeft: '16px', color: 'rgba(0,0,0,0.6)' }}>
        {title}
      </Grid>
      <Grid paddingLeft={0} paddingRight={0}>
        <TextField
          id="valueToAdd"
          onChange={(e) => {
            setValueToAdd(e.target.value);
          }}
          value={valueToAdd}
          placeholder={props.inputPlaceholder ?? ''}
          size="small"
        />
        {loading ? (
          <Loading />
        ) : (
          <IconButton onClick={addValue} color="primary">
            <AddCircleOutline />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}
