// app/book/form/page.tsx

"use client";

import BookingForm from "@/components/src/client/routes/booking/BookingForm";
import BookingFormDetailsPage from "@/components/src/client/routes/booking/formPages/BookingFormDetailsPage";
import UserSectionPage from "@/components/src/client/routes/booking/formPages/UserSectionPage";
import React from "react";

const Form: React.FC = () => (
  <BookingForm>
    <BookingFormDetailsPage />
  </BookingForm>
);

export default Form;
