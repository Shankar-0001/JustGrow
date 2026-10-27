// Update the EXISTING Apps Script web-app deployment after reviewing its columns.
// Set SPREADSHEET_ID and SHEET_NAME in Script Properties.
// First nine columns retain the existing lead order; reserve column J for IDs.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(data.submissionId || '') || !data.fullName || !data.email || !data.message || data.privacyAgreed !== true) return reply({ success: false, error: 'Invalid enquiry' });
    lock.waitLock(30000);
    var props = PropertiesService.getScriptProperties();
    var sheet = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName(props.getProperty('SHEET_NAME'));
    if (!sheet) throw new Error('Sheet is not configured');
    var last = sheet.getLastRow();
    var duplicate = last > 0 && sheet.getRange(1, 10, last, 1).createTextFinder(data.submissionId).matchEntireCell(true).findNext();
    if (duplicate) return reply({ success: true, syncedToSheet: true, duplicate: true });
    var keys = ['timestamp', 'formType', 'fullName', 'email', 'phone', 'company', 'service', 'preferredDate', 'message', 'submissionId'];
    sheet.appendRow(keys.map(function (key) {
      var value = String(data[key] || '').trim();
      return /^[=+@-]/.test(value) ? "'" + value : value;
    }));
    SpreadsheetApp.flush();
    return reply({ success: true, syncedToSheet: true });
  } catch (error) {
    return reply({ success: false, error: 'Unable to save enquiry' });
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
function reply(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
