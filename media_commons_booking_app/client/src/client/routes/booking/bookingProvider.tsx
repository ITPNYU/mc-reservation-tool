import {
  CalendarEvent,
  Department,
  Inputs,
  Role,
  RoomSetting,
} from '../../../types';
import React, {
  createContext,
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

export interface BookingContextType {
  bookingCalendarInfo: DateSelectArg | undefined;
  department: Department | undefined;
  existingCalendarEvents: CalendarEvent[];
  formData: Inputs | undefined;
  hasShownMocapModal: boolean;
  isBanned: boolean;
  isSafetyTrained: boolean;
  needsSafetyTraining: boolean;
  role: Role | undefined;
  selectedRooms: RoomSetting[];
  setBookingCalendarInfo: (x: DateSelectArg) => void;
  setDepartment: (x: Department) => void;
  setFormData: (x: Inputs) => void;
  setHasShownMocapModal: (x: boolean) => void;
  setRole: (x: Role) => void;
  setSelectedRooms: (x: RoomSetting[]) => void;
  setSubmitting: (x: boolean) => void;
  submitting: boolean;
}

export const BookingContext = createContext<BookingContextType>({
  bookingCalendarInfo: undefined,
  department: undefined,
  existingCalendarEvents: [],
  formData: undefined,
  hasShownMocapModal: false,
  isBanned: false,
  isSafetyTrained: true,
  needsSafetyTraining: false,
  role: undefined,
  selectedRooms: [],
  setBookingCalendarInfo: (x: DateSelectArg) => {},
  setDepartment: (x: Department) => {},
  setFormData: (x: Inputs) => {},
  setHasShownMocapModal: (x: boolean) => {},
  setRole: (x: Role) => {},
  setSelectedRooms: (x: RoomSetting[]) => {},
  setSubmitting: (x: boolean) => {},
  submitting: false,
});

export function BookingProvider({ children }) {
  const { bannedUsers, roomSettings, safetyTrainedUsers, userEmail } =
    useContext(DatabaseContext);

  const [bookingCalendarInfo, setBookingCalendarInfo] =
    useState<DateSelectArg>();
  const [department, setDepartment] = useState<Department>();
  const [formData, setFormData] = useState<Inputs>(undefined);
  const [hasShownMocapModal, setHasShownMocapModal] = useState(false);
  const [isSafetyTrained, setIsSafetyTrained] = useState(true);
  const [role, setRole] = useState<Role>();
  const [selectedRooms, setSelectedRooms] = useState<RoomSetting[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const existingCalendarEvents = fetchCalendarEvents(roomSettings);

  const isBanned = useMemo<boolean>(() => {
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

  useEffect(() => {
    const fetchIsSafetyTrained = async () => {
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
    };
    fetchIsSafetyTrained();
  }, [userEmail, safetyTrainedUsers]);

  return (
    <BookingContext.Provider
      value={{
        bookingCalendarInfo,
        department,
        existingCalendarEvents,
        formData,
        hasShownMocapModal,
        isBanned,
        isSafetyTrained,
        needsSafetyTraining,
        role,
        selectedRooms,
        setBookingCalendarInfo,
        setDepartment,
        setFormData,
        setHasShownMocapModal,
        setRole,
        setSelectedRooms,
        setSubmitting,
        submitting,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
