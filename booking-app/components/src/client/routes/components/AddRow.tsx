import React, { useMemo, useState } from "react";

import Loading from "../../utils/Loading";
import { TableNames } from "../../../policy";
import { saveDataToFirestore } from "@/lib/firebase/firebase";
import { Timestamp } from "@firebase/firestore";
import { BookingStatusLabel } from "@/components/src/types";

interface Props {
  addDuplicateErrorMessage?: string;
  addFailedErrorMessage?: string;
  buttonText?: string;
  columnNameToAddValue: string;
  inputPlaceholder?: string;
  label: string;
  tableName: TableNames;
  rows: { [key: string]: string }[];
  rowsRefresh: () => Promise<void>;
}

export default function AddRow(props: Props) {
  const { tableName, rows, rowsRefresh } = props;
  const [valueToAdd, setValueToAdd] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const uniqueValues = useMemo<string[]>(
    () => rows.map((row) => row[props.columnNameToAddValue]),
    [rows]
  );

  const addValue = async () => {
    if (!valueToAdd || valueToAdd.length === 0) return;

    if (uniqueValues.includes(valueToAdd)) {
      alert(
        props.addDuplicateErrorMessage ?? "This value has already been added"
      );
      return;
    }

    const selectedRooms = [
      {
        id: "2cSxp18i87Hb1wUGgyhu",
        roomId: 202,
        name: "Lecture Hall",
        capacity: 210,
        calendarId:
          "c_cadf2be353a6162aab2c58b8b30ff75ea35b5f6c5163ed4fd57df71c00f03f6b@group.calendar.google.com",
        calendarRef: { current: null },
      },
      {
        id: "rREVwmFOnJDVD8FWkGh1",
        roomId: 260,
        name: "Post Production Lab",
        capacity: 20,
        calendarId:
          "c_ed4919e8a07e1338ed3df9c7d7bceaece5a466b8d669a8a70d83b30a8627089e@group.calendar.google.com",
        calendarRef: { current: null },
      },
    ];
    const bookingCalendarInfo = {
      start: "2024-07-24T02:30:00.000Z",
      end: "2024-07-24T03:00:00.000Z",
      startStr: "2024-07-23T22:30:00-04:00",
      endStr: "2024-07-23T23:00:00-04:00",
      allDay: false,
      jsEvent: { isTrusted: true },
      view: {
        type: "timeGridDay",
        dateEnv: {
          timeZone: "local",
          canComputeOffset: true,
          calendarSystem: {},
          locale: [Object],
          weekDow: 0,
          weekDoy: 4,
          weekText: "W",
          weekTextLong: "Week",
          cmdFormatter: null,
          defaultSeparator: " - ",
        },
      },
    };
    const data = {
      setupDetails: "setup",
      cateringService: "Outside Catering",
      sponsorFirstName: "",
      sponsorLastName: "",
      sponsorEmail: "",
      mediaServicesDetails: "aa",
      role: "Resident/Fellow",
      catering: "yes",
      chartFieldForCatering: "ChartField for Catering",
      chartFieldForSecurity: "hartField for Security",
      chartFieldForRoomSetup: "ChartField for Room Setup",
      hireSecurity: "yes",
      attendeeAffiliation: "NYU Members",
      department: "ITP / IMA / Low Res",
      roomSetup: "yes",
      reservationType: "test",
      firstName: "RIho",
      lastName: "Hagi",
      secondaryName: "",
      nNumber: "N12345678",
      netId: "rh3555",
      phoneNumber: "5513008348",
      title: "title",
      description: "a",
      expectedAttendance: "3",
      mediaServices: "Checkout equipment",
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "rh3555@nyu.edu",
          selectedRooms: selectedRooms,
          bookingCalendarInfo: bookingCalendarInfo,
          data: data,
        }),
      }
    );
    setLoading(true);
    try {
      await saveDataToFirestore(tableName, {
        [props.columnNameToAddValue]: valueToAdd,
        createdAt: Timestamp.now(),
      });
      await rowsRefresh();
    } catch (ex) {
      console.error(ex);
      alert(props.addFailedErrorMessage ?? "Failed to add value");
    } finally {
      setLoading(false);
      setValueToAdd("");
    }
  };
  return (
    <div className="mt-10 mr-10 ml-10">
      <form className="flex items-center">
        <div className="mb-6 mr-6">
          <label
            htmlFor="valueToAdd"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {props.label}
          </label>
          <input
            id="valueToAdd"
            onChange={(e) => {
              setValueToAdd(e.target.value);
            }}
            value={valueToAdd}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={props.inputPlaceholder ?? ""}
            required
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <button
            type="button"
            onClick={addValue}
            className="h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {props.buttonText ?? "Add"}
          </button>
        )}
      </form>
    </div>
  );
}
