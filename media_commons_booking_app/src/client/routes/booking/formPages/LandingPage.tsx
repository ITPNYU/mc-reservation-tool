import { Box, Link, Typography } from '@mui/material';

import Button from '@mui/material/Button';
import React from 'react';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Center = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Modal = styled(Center)(({ theme }) => ({
  border: `1px solid ${theme.palette.custom.border}`,
  borderRadius: 4,
  alignItems: 'flex-start',
  marginTop: 20,
  maxWidth: 800,
}));

const Title = styled(Typography)`
  font-weight: 700;
  font-size: 20px;
  line-height: 1.25;
  margin-bottom: 12px;
`;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Center sx={{ width: '100vw', height: '90vh' }}>
      <Title as="h1">370🅙 Media Commons Reservation Form</Title>
      <p>Thank you for your interest in booking with the Media Commons</p>
      <Modal padding={4}>
        <Link>
          Please read our Policy for using the 370 Jay Street Shared Spaces
        </Link>
        <Typography fontWeight={700} marginTop={3}>
          Booking Confirmation
        </Typography>
        <p>
          You will receive an email response from the 370J Operations team and a
          calendar invite once your request has been reviewed and processed.
          Please allow a minimum of 3 days for your request to be approved. If
          you do not hear back about your request within 48 hours, you can
          contact the Media Commons Team (
          <a href="mailto:mediacommons.reservations@nyu.edu">
            mediacommons.reservations@nyu.edu
          </a>
          ) to follow up. A request does not guarantee a booking.
        </p>
        <Typography fontWeight={700} marginTop={3}>
          Cancellation Policy
        </Typography>
        <p>
          To cancel reservations please email the Media Commons Team (
          <a href="mailto:mediacommons.reservations@nyu.edu">
            mediacommons.reservations@nyu.edu
          </a>
          ) at least 24 hours before the date of the event. Failure to cancel
          may result in restricted use of event spaces.
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/book/role')}
          sx={{
            alignSelf: 'center',
            marginTop: 6,
          }}
        >
          I accept
        </Button>
      </Modal>
    </Center>
    // <div
    //   id="staticModal"
    //   data-modal-backdrop="static"
    //   tabIndex={-1}
    //   aria-hidden="true"
    //   className="z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    // >
    //   <div className="relative w-full max-w-2xl max-h-full">
    //     <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
    //       <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
    //         <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
    //           370🅙 Media Commons Reservation Form
    //         </h3>
    //       </div>
    //       <p className="p-6 space-y-6">
    //         Thank you for your interest in booking with the Media Commons.
    //         <br />
    //         Please read our Policy for using the 370 Jay Street Shared Spaces
    //         <br />
    //         <br />
    //         <b>Booking Confirmation:</b> You will receive an email response from
    //         the 370J Operations team and a calendar invite once your request has
    //         been reviewed and processed. Please allow a minimum of 3 days for
    //         your request to be approved. If you do not hear back about your
    //         request within 48 hours, you can contact the Media Commons Team (
    //         <a
    //           href="mailto:mediacommons.reservations@nyu.edu"
    //           // className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
    //         >
    //           mediacommons.reservations@nyu.edu
    //         </a>
    //         ) to follow up. A request does not guarantee a booking.
    //         <br />
    //         <br />
    //         <b>Cancellation Policy:</b> To cancel reservations please email the
    //         Media Commons Team(
    //         <a
    //           href="mailto:mediacommons.reservations@nyu.edu"
    //           // className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
    //         >
    //           mediacommons.reservations@nyu.edu
    //         </a>
    //         ) at least 24 hours before the date of the event. Failure to cancel
    //         may result in restricted use of event spaces.
    //         <br />
    //         <a
    //           href="https://docs.google.com/document/d/1vAajz6XRV0EUXaMrLivP_yDq_LyY43BvxOqlH-oNacc/edit"
    //           // className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
    //           target="_blank"
    //         >
    //           Media Commons Policy
    //         </a>
    //         <a
    //           href="https://docs.google.com/document/d/1TIOl8f8-7o2BdjHxHYIYELSb4oc8QZMj1aSfaENWjR8/edit#heading=h.ns3jisyhutvq"
    //           // className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
    //           target="_blank"
    //         >
    //           Pre-Event Checklist
    //         </a>
    //       </p>
    //       <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
    //         <Button
    //           variant="contained"
    //           // color="primary"
    //           // data-modal-hide="staticModal"
    //           // type="button"
    //           onClick={handleClick}
    //           // className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //         >
    //           I accept
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
