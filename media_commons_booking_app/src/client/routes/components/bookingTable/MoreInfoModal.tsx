import {
  Box,
  Button,
  Modal,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { BookingRow } from '../../../../types';
import React from 'react';
import StackedTableCell from './StackedTableCell';
import { styled } from '@mui/system';

interface Props {
  booking: BookingRow;
  closeModal: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  padding: 4,
};

const LabelCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.custom.border}`,
  width: 175,
  verticalAlign: 'top',
}));

export default function MoreInfoModal({ booking, closeModal }: Props) {
  return (
    <Modal open={booking != null} onClose={closeModal}>
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6">
          More Info
        </Typography>
        <Table size="small">
          <TableRow>
            <LabelCell>Sponsor</LabelCell>
            <StackedTableCell
              topText={`${booking.sponsorFirstName} ${booking.sponsorLastName}`}
              bottomText={booking.sponsorEmail}
            />
          </TableRow>
          <TableRow>
            <LabelCell>Description</LabelCell>
            <TableCell>{booking.description}</TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>Expected Attendance</LabelCell>
            <TableCell>{booking.expectedAttendance}</TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>Setup</LabelCell>
            <TableCell>{booking.setupDetails}</TableCell>
          </TableRow>
        </Table>

        <Typography variant="h6" sx={{ paddingTop: 4 }}>
          Services
        </Typography>
        <Table size="small">
          <TableRow>
            <LabelCell>Media Service</LabelCell>
            <TableCell>
              {booking.mediaServices.split(',').map((service) => (
                <p style={{ fontWeight: 500 }}>{service.trim()}</p>
              ))}
              <p>{booking.mediaServicesDetails}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>Catering</LabelCell>
            <TableCell>
              <p style={{ fontWeight: 500 }}>{booking.cateringService}</p>
              <p>{booking.chartFieldForCatering}</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>Security</LabelCell>
            <TableCell>
              <p style={{ fontWeight: 500 }}>{booking.hireSecurity}</p>
              <p>{booking.chartFieldForSecurity}</p>
            </TableCell>
          </TableRow>
        </Table>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button variant="text" onClick={closeModal}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
