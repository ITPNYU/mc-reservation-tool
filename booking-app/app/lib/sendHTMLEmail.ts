import fs from "fs";
import path from "path";
import handlebars, { templates } from "handlebars";
import { getGmailClient } from "@/lib/googleClient";
import { BookingStatusLabel } from "@/components/src/types";
import { app } from "firebase-admin";
import { approvalUrl, rejectUrl } from "@/components/src/server/ui";
import { formatDate } from "@/components/src/client/utils/date";
import { getEmailBranchTag } from "@/components/src/server/emails";

interface BookingFormDetails {
  [key: string]: string;
}

interface SendHTMLEmailParams {
  templateName: string;
  contents: BookingFormDetails;
  targetEmail: string;
  status: string;
  eventTitle: string;
  body: string;
}

export const sendHTMLEmail = async (params: SendHTMLEmailParams) => {
  const { templateName, contents, targetEmail, status, eventTitle, body } =
    params;

  const subj = `${getEmailBranchTag}${status}: Media Commons request for "${eventTitle}"`;

  const templatePath = path.join(
    process.cwd(),
    "app/templates",
    `${templateName}.html`,
  );
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const htmlBody = template({
    eventTitle,
    status,
    body,
    contents,
    startDate: formatDate(contents.startDate),
    endDate: formatDate(contents.endDate),
    approvalUrl: approvalUrl(contents.calendarEventId),
    rejectUrl: rejectUrl(contents.calendarEventId),
  });

  const messageParts = [
    "From: 'Media Commons' <>",
    `To: ${targetEmail}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subj}`,
    "",
    htmlBody,
  ];
  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const gmail = await getGmailClient();

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
};
