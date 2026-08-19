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

  // Existing RSVP / newsletter logging behavior — extended with the
  // class-interest fields added to the RSVP & Updates form. classInterests
  // arrives pre-joined as a comma-separated string from the API route.
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
    body.classInterests || "",
    body.experienceLevel || "",
    body.accessibilityNotes || "",
  ]);

  return jsonResponse({ ok: true });
}

// Charleston, SC is always Eastern Time.
var EVENT_TIME_ZONE = "America/New_York";

// Google Sheets auto-converts recognizable date/time text (like the
// "2026-09-18" or "9:00 AM" the admin forms save) into real Date-typed
// cells. Naively stringifying those with String(value) produces
// JavaScript's verbose toString() output, e.g.
// "Fri Sep 18 2026 20:00:00 GMT-0400 (Eastern Daylight Time)" — exactly
// the GMT/UTC-laden text the site must never show. Format explicitly by
// column instead, anchored to Eastern Time, with no timezone suffix.
function formatCellValue(value, header) {
  if (value === undefined || value === null) return "";
  if (!(value instanceof Date)) return String(value);

  var h = String(header || "").toLowerCase();
  if (h.indexOf("time") !== -1) {
    // Time-only fields (StartTime, EndTime) — Sheets anchors these on
    // Dec 30, 1899; only the time-of-day portion matters.
    return Utilities.formatDate(value, EVENT_TIME_ZONE, "h:mm a");
  }
  if (h.indexOf("date") !== -1) {
    // Date-only fields (Date, ClassDate).
    return Utilities.formatDate(value, EVENT_TIME_ZONE, "yyyy-MM-dd");
  }
  // Fallback for any other Date-typed cell.
  return Utilities.formatDate(value, EVENT_TIME_ZONE, "yyyy-MM-dd HH:mm");
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
        obj[h] = formatCellValue(r[i], h);
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

## Submissions sheet header row

The "Submissions" tab header row should read (columns A–K):

`Timestamp | Type | Name | Email | Phone | Organization | Interest | Message | ClassInterests | ExperienceLevel | AccessibilityNotes`

The last three columns support the class-interest fields added to the RSVP
& Updates form.

## Posts sheet header row

A new "Posts" tab was added for the blog feature. Its header row reads
(columns A–M):

`ID | Title | Slug | FeaturedImageURL | Excerpt | Content | Author | PublishDate | Category | Tags | MetaTitle | MetaDescription | Published`

No Code.gs changes were needed for this — the existing generic `doGet`/`doPost`
handlers and the `formatCellValue` date/time formatting (matches any header
containing "date" or "time", so `PublishDate` is covered automatically) work
for any sheet name passed in.

## Vercel environment variables to add

| Variable | Value |
|---|---|
| `ADMIN_API_SECRET` | The same random value set as `ADMIN_SECRET` in Apps Script Script Properties |
| `ADMIN_PASSWORD` | The shared password your team will use to log into `/admin` |
| `BLOB_READ_WRITE_TOKEN` | Auto-added by Vercel when you connect a Blob store to this project (Storage tab → Create Database → Blob → Connect to Project) |
