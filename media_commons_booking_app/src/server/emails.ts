import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
  DevBranch,
} from '../types';

import { getApprovalCcEmail } from '../policy';

const getCcEmail = (status: BookingStatusLabel): string => {
  if (status !== BookingStatusLabel.APPROVED) {
    return '';
  }
  return getApprovalCcEmail(process.env.BRANCH_NAME);
};

export const sendTextEmail = (
  targetEmail: string,
  status: BookingStatusLabel,
  eventTitle: string,
  body: string
) => {
  const subj = `${status}: Media Commons request for \"${eventTitle}\"`;
  const options = {
    replyTo: 'mediacommons.reservations@nyu.edu',
    cc: getCcEmail(status),
  };
  GmailApp.sendEmail(targetEmail, subj, body, options);
};

const getEmailBranchTag = () => {
  switch (process.env.BRANCH_NAME as DevBranch) {
    case 'development':
      return '[DEV] ';
    case 'staging':
      return '[STAGING] ';
    default:
      return '';
  }
};

export const sendHTMLEmail = (
  templateName: string,
  contents: BookingFormDetails,
  targetEmail: string,
  status: BookingStatusLabel,
  eventTitle: string,
  body
) => {
  const subj = `${getEmailBranchTag()}${status}: Media Commons request for \"${eventTitle}\"`;
  const htmlTemplate = HtmlService.createTemplateFromFile(templateName);
  for (const key in contents) {
    htmlTemplate[key] = contents[key] || '';
  }
  const htmlBody = htmlTemplate.evaluate().getContent();
  const options = {
    htmlBody,
    replyTo: 'mediacommons.reservations@nyu.edu',
    cc: getCcEmail(status),
  };
  GmailApp.sendEmail(targetEmail, subj, body, options);
};
