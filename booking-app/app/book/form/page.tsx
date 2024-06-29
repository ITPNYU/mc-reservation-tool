// app/book/form/page.tsx
"use client";
import BookingForm from "@/components/src/client/routes/booking/BookingForm";
import UserSectionPage from "@/components/src/client/routes/booking/formPages/UserSectionPage";
import React from "react";

const Form: React.FC = () => {
  return (
    <BookingForm>
      <UserSectionPage />
    </BookingForm>
  );
};

export default Form;
