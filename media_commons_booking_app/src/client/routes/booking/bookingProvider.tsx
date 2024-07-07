import { CalendarEvent, Department, Role, RoomSetting } from '../../../types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DatabaseContext } from '../components/Provider';
import { DateSelectArg } from '@fullcalendar/core';
import { SAFETY_TRAINING_REQUIRED_ROOM } from '../../../policy';
import fetchCalendarEvents from './hooks/fetchCalendarEvents';
import { serverFunctions } from '../../utils/serverFunctions';
<<<<<<< HEAD
<<<<<<< HEAD
import { SAFETY_TRAINING_REQUIRED_ROOM } from '../../../policy';
=======
import useFakeDataLocalStorage from '../../utils/useFakeDataLocalStorage';
>>>>>>> 4300bf5 (send test booking data to server to react)
=======
>>>>>>> 4f4998e (show fake data for table testing)

export interface BookingContextType {
  bookingCalendarInfo: DateSelectArg | undefined;
  department: Department | undefined;
  existingCalendarEvents: CalendarEvent[];
  isBanned: boolean;
  isSafetyTrained: boolean;
  needsSafetyTraining: boolean;
  role: Role | undefined;
  selectedRooms: RoomSetting[];
  setBookingCalendarInfo: (x: DateSelectArg) => void;
  setDepartment: (x: Department) => void;
  setRole: (x: Role) => void;
  setSelectedRooms: (x: RoomSetting[]) => void;
  setNeedsSafetyTraining: (x: boolean) => void;
}

export const BookingContext = createContext<BookingContextType>({
  bookingCalendarInfo: undefined,
  department: undefined,
  existingCalendarEvents: [],
  isBanned: false,
  needsSafetyTraining: false,
  isSafetyTrained: true,
  needsSafetyTraining: false,
  role: undefined,
  selectedRooms: [],
  setBookingCalendarInfo: (x: DateSelectArg) => {},
  setDepartment: (x: Department) => {},
  setRole: (x: Role) => {},
  setSelectedRooms: (x: RoomSetting[]) => {},
  setNeedsSafetyTraining: (x: boolean) => {},
});

export function BookingProvider({ children }) {
  const { bannedUsers, roomSettings, safetyTrainedUsers, userEmail } =
    useContext(DatabaseContext);

  const [bookingCalendarInfo, setBookingCalendarInfo] =
    useState<DateSelectArg>();
  const [department, setDepartment] = useState<Department>();
  const [isSafetyTrained, setIsSafetyTrained] = useState(true);
  const [role, setRole] = useState<Role>();
  const [needsSafetyTraining, setNeedsSafetyTraining] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<RoomSetting[]>([]);
  const existingCalendarEvents = fetchCalendarEvents(roomSettings);

  const isBanned = useMemo<boolean>(() => {
    console.log('userEmail', userEmail);
    if (!userEmail) return false;
    return bannedUsers
      .map((bannedUser) => bannedUser.email)
      .includes(userEmail);
  }, [userEmail, bannedUsers]);

  // block progressing in the form is safety training requirement isn't met
  const needsSafetyTraining = useMemo(() => {
    const isStudent = role === Role.STUDENT;
    const roomRequiresSafetyTraining = selectedRooms.some((room) =>
      SAFETY_TRAINING_REQUIRED_ROOM.includes(room.roomId)
    );
    return isStudent && roomRequiresSafetyTraining && !isSafetyTrained;
  }, [selectedRooms, role, isSafetyTrained]);

  const fetchIsSafetyTrained = useCallback(async () => {
    if (!userEmail) return;
    let isTrained = safetyTrainedUsers
      .map((user) => user.email)
      .includes(userEmail);
    console.log('isTrained from tool', isTrained);
    // if not on active list, check old list
    if (!isTrained) {
      isTrained = await serverFunctions
        .getOldSafetyTrainingEmails()
        .then((rows) => rows.map((row) => row[0]).includes(userEmail));
    }
    console.log('isTrained from googlesheets', isTrained);
    setIsSafetyTrained(isTrained);
  }, [userEmail, safetyTrainedUsers]);

  useEffect(() => {
    fetchIsSafetyTrained();
  }, [fetchIsSafetyTrained]);

  return (
    <BookingContext.Provider
      value={{
        bookingCalendarInfo,
        department,
        existingCalendarEvents,
        isBanned,
        isSafetyTrained,
        needsSafetyTraining,
        role,
        selectedRooms,
        setBookingCalendarInfo,
        setDepartment,
        setRole,
        setSelectedRooms,
        setNeedsSafetyTraining,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
