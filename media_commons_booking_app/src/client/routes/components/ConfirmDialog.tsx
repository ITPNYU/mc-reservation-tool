import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { cloneElement, useState } from 'react';

interface Props {
  message: string;
  title?: string;
  callback: (result: boolean) => void;
  children: React.ReactElement;
}

export default function ConfirmDialog(props: Props) {
  const { message, title, callback, children } = props;
  const [open, setOpen] = useState(false);

  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });

  const handleClose = (result: boolean) => {
    setOpen(false);
    callback(result);
  };

  return (
    <>
      {trigger}
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {title != null && (
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
