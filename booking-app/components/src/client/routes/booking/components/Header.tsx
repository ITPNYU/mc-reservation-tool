"use client";
import React, { useContext } from "react";

import { BookingContext } from "../bookingProvider";
import { DatabaseContext } from "../../components/Provider";
import { usePathname } from "next/navigation";

export const Header = () => {
  const { isBanned, isSafetyTrained } = useContext(BookingContext);
  const { userEmail } = useContext(DatabaseContext);
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="px-3 absolute top-20 right-0 text-right">
      <p className="dark:text-white">
        Email:{" "}
        {userEmail ? `${userEmail}` : `Unable to retrieve the email address.`}
      </p>
      <div>
        {!isSafetyTrained && (
          <p className="text-red-500 text-bold  ">
            You have to take safety training before booking!
          </p>
        )}
        {isBanned && <p className="text-red-500 text-bold  ">You're banned </p>}
      </div>
    </div>
  );
};
