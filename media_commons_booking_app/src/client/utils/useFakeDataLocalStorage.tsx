import React, { useEffect } from 'react';

import useWebSocket from 'react-use-websocket';

export const STORAGE_KEY_BOOKING = 'mediaCommonsDevBooking';

export default function useFakeDataLocalStorage() {
  const { lastMessage } = useWebSocket(
    'ws://localhost:3001',
    { shouldReconnect: (closeEvent) => true },
    process.env.BRANCH_NAME === 'development'
  );

  useEffect(() => {
    if (lastMessage == null) {
      return;
    }

    if (lastMessage.data.startsWith('ADD:')) {
      const fakeBookings = localStorage.getItem(STORAGE_KEY_BOOKING);
      const data = lastMessage.data.substring('ADD:'.length);
      if (fakeBookings == null) {
        initialize(data);
      } else {
      }
    }
    console.log('FROM SERVER:', lastMessage);
  }, [lastMessage]);

  const initialize = (data: string) => {
    localStorage.setItem(STORAGE_KEY_BOOKING, data);
  };
}
