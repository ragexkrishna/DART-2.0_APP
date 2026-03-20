import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const spreadsheetId = "1ukomuNdIHHhrmETeZgUNuYuVFYsCG4b-CqdkNw1VTBY";

export async function getSheetData() {

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:Z",
  });

  return response.data.values;
}