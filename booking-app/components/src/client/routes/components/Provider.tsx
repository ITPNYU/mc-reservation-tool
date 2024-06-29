import {
  AdminUser,
  Ban,
  Booking,
  BookingStatus,
  LiaisonType,
  PaUser,
  PagePermission,
  ReservationType,
  RoomSetting,
  SafetyTraining,
  Settings,
} from "../../../types";
import React, { createContext, useEffect, useMemo, useState } from "react";

import axios from "axios";

export interface DatabaseContextType {
  adminUsers: AdminUser[];
  bannedUsers: Ban[];
  bookings: Booking[];
  bookingStatuses: BookingStatus[];
  liaisonUsers: LiaisonType[];
  pagePermission: PagePermission;
  paUsers: PaUser[];
  roomSettings: RoomSetting[];
  safetyTrainedUsers: SafetyTraining[];
  settings: Settings;
  userEmail: string | undefined;
  reloadAdminUsers: () => Promise<void>;
  reloadBannedUsers: () => Promise<void>;
  reloadBookings: () => Promise<void>;
  reloadBookingStatuses: () => Promise<void>;
  reloadLiaisonUsers: () => Promise<void>;
  reloadPaUsers: () => Promise<void>;
  reloadReservationTypes: () => Promise<void>;
  reloadSafetyTrainedUsers: () => Promise<void>;
  setUserEmail: (x: string) => void;
}

export const DatabaseContext = createContext<DatabaseContextType>({
  adminUsers: [],
  bannedUsers: [],
  bookings: [],
  bookingStatuses: [],
  liaisonUsers: [],
  pagePermission: PagePermission.BOOKING,
  paUsers: [],
  roomSettings: [],
  safetyTrainedUsers: [],
  settings: { reservationTypes: [] },
  userEmail: undefined,
  reloadAdminUsers: async () => {},
  reloadBannedUsers: async () => {},
  reloadBookings: async () => {},
  reloadBookingStatuses: async () => {},
  reloadLiaisonUsers: async () => {},
  reloadPaUsers: async () => {},
  reloadReservationTypes: async () => {},
  reloadSafetyTrainedUsers: async () => {},
  setUserEmail: (x: string) => {},
});

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bannedUsers, setBannedUsers] = useState<Ban[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStatuses, setBookingStatuses] = useState<BookingStatus[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [liaisonUsers, setLiaisonUsers] = useState<LiaisonType[]>([]);
  const [paUsers, setPaUsers] = useState<PaUser[]>([]);
  const [roomSettings, setRoomSettings] = useState<RoomSetting[]>([]);
  const [safetyTrainedUsers, setSafetyTrainedUsers] = useState<
    SafetyTraining[]
  >([]);
  const [settings, setSettings] = useState<Settings>({ reservationTypes: [] });
  const [userEmail, setUserEmail] = useState<string | undefined>();

  // page permission updates with respect to user email, admin list, PA list
  const pagePermission = useMemo<PagePermission>(() => {
    if (!userEmail) return PagePermission.BOOKING;

    if (adminUsers.map((admin) => admin.email).includes(userEmail))
      return PagePermission.ADMIN;
    else if (paUsers.map((pa) => pa.email).includes(userEmail))
      return PagePermission.PA;
    else return PagePermission.BOOKING;
  }, [userEmail, adminUsers, paUsers]);

  useEffect(() => {
    // fetch most important tables first - determine page permissions
    Promise.all([
      fetchActiveUserEmail(),
      fetchAdminUsers(),
      fetchPaUsers(),
    ]).then(() => {
      fetchBookings();
      fetchBookingStatuses();
      fetchSafetyTrainedUsers();
      fetchBannedUsers();
      fetchLiaisonUsers();
      fetchRoomSettings();
      fetchSettings();
    });

    // refresh booking data every 10s;
    setInterval(() => {
      console.log("UPDATING");
      fetchBookings();
      fetchBookingStatuses();
    }, 10000);
  }, []);

  const fetchActiveUserEmail = () => {
    //TODO: Use firebase auth to get user email
    setUserEmail("rh3555@nyu.edu");
  };

  const fetchBookings = async () => {
    const response = await axios.get<Booking[]>("/api/bookings");
    setBookings(response.data);
  };

  const fetchBookingStatuses = async () => {
    const response = await axios.get<BookingStatus[]>("/api/bookingStatuses");
    setBookingStatuses(response.data);
  };

  const fetchAdminUsers = async () => {
    const response = await axios.get<AdminUser[]>("/api/admins");
    setAdminUsers(response.data);
  };

  const fetchPaUsers = async () => {
    const response = await axios.get<PaUser[]>("/api/pas");
    setPaUsers(response.data);
  };

  const fetchSafetyTrainedUsers = async () => {
    const response = await axios.get<SafetyTraining[]>("/api/safetyTrainings");
    setSafetyTrainedUsers(response.data);
  };

  const fetchBannedUsers = async () => {
    const response = await axios.get<Ban[]>("/api/bannedUsers");
    setBannedUsers(response.data);
  };

  const fetchLiaisonUsers = async () => {
    const response = await axios.get<LiaisonType[]>("/api/liaisons");
    setLiaisonUsers(response.data);
  };

  const fetchRoomSettings = async () => {
    const response = await axios.get<RoomSetting[]>("/api/rooms");
    setRoomSettings(response.data);
  };

  const fetchBookingReservationTypes = async () => {
    const response = await axios.get<ReservationType[]>(
      "/api/reservationTypes"
    );
    setSettings((prev) => ({
      ...prev,
      ...response.data,
    }));
  };

  const fetchSettings = async () => {
    await fetchBookingReservationTypes();
  };

  return (
    <DatabaseContext.Provider
      value={{
        adminUsers,
        bannedUsers,
        bookings,
        bookingStatuses,
        liaisonUsers,
        paUsers,
        pagePermission,
        roomSettings,
        safetyTrainedUsers,
        settings,
        userEmail,
        reloadAdminUsers: fetchAdminUsers,
        reloadBannedUsers: fetchBannedUsers,
        reloadBookings: fetchBookings,
        reloadBookingStatuses: fetchBookingStatuses,
        reloadLiaisonUsers: fetchLiaisonUsers,
        reloadPaUsers: fetchPaUsers,
        reloadReservationTypes: fetchBookingReservationTypes,
        reloadSafetyTrainedUsers: fetchSafetyTrainedUsers,
        setUserEmail,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
