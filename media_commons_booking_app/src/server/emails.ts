import { Booking, BookingStatusLabel } from '../types';

export const sendTextEmail = (
  targetEmail: string,
  status: BookingStatusLabel,
  title: string,
  body: string
) => {
  const subj = `${status}: Media Commons request for \"${title}\"`;
  GmailApp.sendEmail(targetEmail, subj, body);
};

export const sendHTMLEmail = (
  templateName: string,
  contents: Booking,
  targetEmail: string,
  title: string,
  body
) => {
  console.log('contents', contents);
  const htmlTemplate = HtmlService.createTemplateFromFile(templateName);
  for (const key in contents) {
    htmlTemplate[key] = contents[key] || '';
  }
  const htmlBody = htmlTemplate.evaluate().getContent();
  const options = {
    htmlBody,
  };
  GmailApp.sendEmail(targetEmail, title, body, options);
};
