import { getGoogleSheet } from "@/lib/googleClient";
import { NextRequest, NextResponse } from "next/server";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const COLUMN = "B";

export async function GET(request: NextRequest) {
  try {
    const sheets = await getGoogleSheet(SPREADSHEET_ID);

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [`${SHEET_ID}`],
      fields: "sheets.properties",
    });

    const rowCount =
      sheetInfo.data.sheets[0].properties.gridProperties?.rowCount || 0;

    // First row is header
    const range = `${SHEET_ID}!${COLUMN}2:${COLUMN}${rowCount}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ emails: [] });
    }

    const emails = rows
      .flat()
      .filter(email => email && typeof email === "string");
    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
