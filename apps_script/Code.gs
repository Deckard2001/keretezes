/**
 * Keretezés-labor – minimális háttér egy Google Táblázatban.
 * Telepítés: lásd README.md („Csoportos mód”).
 * Névtelen: csak a válaszokat, a csoportkódot és egy véletlen azonosítót tárolja.
 */
var SHEET_NAME = 'valaszok';

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'add') return add_(p);
    if (p.action === 'list') return list_(p.s);
    return json_({ ok: false, error: 'Ismeretlen művelet' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange('A:D').setNumberFormat('@');
    sh.appendRow(['idopont', 'csoport', 'azonosito', 'adatok_json']);
  }
  return sh;
}

function add_(p) {
  var s = String(p.s || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
  var id = String(p.id || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 40);
  var d = String(p.d || '');
  if (!s || !id) return json_({ ok: false, error: 'Hiányzó csoportkód vagy azonosító' });
  if (d.length > 800) return json_({ ok: false, error: 'Túl hosszú adat' });
  var obj;
  try { obj = JSON.parse(d); } catch (e) { return json_({ ok: false, error: 'Érvénytelen adat' }); }
  if (!obj || !obj.v) return json_({ ok: false, error: 'Érvénytelen adat' });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date().toISOString(), s, id, d]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function list_(s) {
  s = String(s || '');
  var values = sheet_().getDataRange().getValues().slice(1);
  var latest = {};
  values.forEach(function (row) {
    if (String(row[1]) === s) latest[String(row[2])] = { id: String(row[2]), d: String(row[3]) };
  });
  return json_({ ok: true, rows: Object.keys(latest).map(function (k) { return latest[k]; }) });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
