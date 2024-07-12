import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { getGmailClient } from "@/lib/googleClient";
import { BookingStatusLabel } from "@/components/src/types";

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

  const subj = `${status}: Media Commons request for "${eventTitle}"`;

  const templatePath = path.join(
    process.cwd(),
    "app/templates",
    `${templateName}.html`
  );
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const htmlBody = template({
    eventTitle,
    status,
    body,
    contents,
  });

  const messageParts = [
    `From: "Media Commons" <>`,
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
