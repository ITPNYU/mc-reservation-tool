import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';

const CALENDAR_ID = 'rh3555@nyu.edu';
const FIRST_APPROVER = 'rh3555@nyu.edu';
const SECOND_APPROVER = 'rh3555@nyu.edu';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q/edit#gid=1210315332';

const ACTIVE_SHEET_ID = '1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q';
const BOOKING_SHEET_NAME = 'bookings';
const BOOKING_STATES_SHEET_NAME = 'booking_states';
const SAFTY_TRAINING_SHEET_NAME = 'safety_training_users';

const AdminAction = () => {
  const [adminAction, setAdminAction] = useState('aaa');
  const approved = async () => {
    if (action === 'approved') {
      serverFunctions.firstApprove(calendarId).then((rows) => {
        console.log('bookings', rows);
      });
    }
  };
  useEffect(() => {
    approved();
    if (window) {
      console.log('window.adminAction', window.action);
      console.log('window.calendarId', window.calendarId);
      //setAdminAction(window.adminAction);
    }
  }, []);

  return (
    <div className="m-10">
      <div>{adminAction}</div>
    </div>
  );
};

export default AdminAction;
