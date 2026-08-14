# Apps Script setup (Google Sheets CMS backend)

This extends the existing Apps Script Web App (the same one already used for
the RSVP form's Google Sheets logging) so it can also serve as the backend
for the admin content area — reading published Teachers/Sponsors/Organizers/
Schedule rows for the public pages, and accepting authenticated writes from
the admin forms.

## One-time setup

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Replace the existing `Code.gs` contents with the script below (it
   preserves the original RSVP-logging behavior and adds the new actions).
3. Click **Deploy → Manage deployments** → edit the existing deployment →
   set **Version: New version** → **Deploy**. This keeps the same Web App
   URL, so the existing `GOOGLE_SHEETS_WEBHOOK_URL` env var in Vercel keeps
   working without changes.
4. In the script editor, go to **Project Settings → Script Properties** and
   add a property `ADMIN_SECRET` with a long random value. Copy that same
   value into the Vercel project's `ADMIN_API_SECRET` environment variable
   (see the main setup instructions).

## Code.gs

```javascript
function getAdminSecret() {
  return PropertiesService.getScriptProperties().getProperty("ADMIN_SECRET");
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Admin CMS write (organizers/teachers/sponsors/schedule)
  if (body.action === "upsert") {
    if (!body.secret || body.secret !== getAdminSecret()) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }
    var sheet = ss.getSheetByName(body.sheet);
    if (!sheet) return jsonResponse({ ok: false, error: "Unknown sheet: " + body.sheet });

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = body.row || {};
    var idCol = headers.indexOf("ID");
    var id = row.ID;

    // Look for an existing row with this ID to update in place, otherwise append.
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (idCol >= 0 && data[i][idCol] === id) {
        rowIndex = i + 1; // 1-indexed
        break;
      }
    }

    var values = headers.map(function (h) {
      return Object.prototype.hasOwnProperty.call(row, h) ? row[h] : "";
    });

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
    } else {
      sheet.appendRow(values);
    }

    return jsonResponse({ ok: true, id: id });
  }

  // Existing RSVP / newsletter logging behavior — unchanged.
  var sheet = ss.getSheetByName("Submissions");
  sheet.appendRow([
    new Date(),
    body.type || "",
    body.name || "",
    body.email || "",
    body.phone || "",
    body.organization || "",
    body.interest || "",
    body.message || "",
  ]);

  return jsonResponse({ ok: true });
}

function doGet(e) {
  if (e.parameter.action === "list") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(e.parameter.sheet);
    if (!sheet) return jsonResponse({ ok: false, error: "Unknown sheet: " + e.parameter.sheet });

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1).map(function (r) {
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = r[i] === undefined || r[i] === null ? "" : String(r[i]);
      });
      return obj;
    });

    return jsonResponse({ ok: true, rows: rows });
  }

  return jsonResponse({ ok: false, error: "Unknown action" });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

## Vercel environment variables to add

| Variable | Value |
|---|---|
| `ADMIN_API_SECRET` | The same random value set as `ADMIN_SECRET` in Apps Script Script Properties |
| `ADMIN_PASSWORD` | The shared password your team will use to log into `/admin` |
| `BLOB_READ_WRITE_TOKEN` | Auto-added by Vercel when you connect a Blob store to this project (Storage tab → Create Database → Blob → Connect to Project) |
