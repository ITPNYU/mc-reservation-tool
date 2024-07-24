"use client";

import React from "react";
import { NextPageContext } from "next";

type ErrorProps = {
  statusCode: number;
  message?: string;
};

const ErrorPage: React.FC<ErrorProps> = ({ statusCode, message }) => {
  console.error(`Error ${statusCode}: ${message}`);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{message || "An unexpected error occurred"}</i>
      </p>
    </div>
  );
};

export function getServerSideProps({ res, err }: NextPageContext) {
  let statusCode;
  let message;

  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode;
  } else {
    statusCode = 404;
  }

  if (err) {
    message = err.message;
  } else {
    message = "An error occurred";
  }

  return { props: { statusCode, message } };
}

export default ErrorPage;
