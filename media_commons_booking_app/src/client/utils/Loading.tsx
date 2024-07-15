import { CircularProgress } from '@mui/material';
import React from 'react';

interface Props {
  style?: any;
}

export default function Loading({ style }: Props) {
  return <CircularProgress color="primary" style={style} />;
}
