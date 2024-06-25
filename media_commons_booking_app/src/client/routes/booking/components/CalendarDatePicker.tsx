import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const CalendarDatePicker = ({ handleChange }) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));

  const handleDateChange = (newVal: Dayjs) => {
    setDate(newVal);
    handleChange(newVal.toDate());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={date}
        onChange={handleDateChange}
        views={['day', 'month']}
        autoFocus
        disablePast
        showDaysOutsideCurrentMonth
      />
    </LocalizationProvider>
  );
};
