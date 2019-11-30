function getModules() {
  var rawModules = getRawDataFromSheet(GENERAL_DB, "MODULOS");
  Logger.log("modules");
  return rawModules;
}

function getPeriods() {
  var rawPeriods = getRawDataFromSheet(GENERAL_DB, "PERIODOS");
  var periods = sheetValuesToObject(rawPeriods);
  return periods;
}

function getStudents() {
  var rawStudents = getRawDataFromSheet(GENERAL_DB, "INSCRITOS");
  return rawStudents;
}

function getCurrentPeriodStudents() {
  var rawStudents = getRawDataFromSheet(
    getCurrentPeriod()["link"],
    "INSCRITOS"
  );
  return rawStudents;
}

function getSheetFromSpreadSheet(url, sheet) {
  var Spreedsheet = SpreadsheetApp.openByUrl(url);
  if (url && sheet) return Spreedsheet.getSheetByName(sheet);
}

function getRawDataFromSheet(url, sheet) {
  var mSheet = getSheetFromSpreadSheet(url, sheet);
  if (mSheet)
    return mSheet.getSheetValues(
      1,
      1,
      mSheet.getLastRow(),
      mSheet.getLastColumn()
    );
}

function getHeadersFromSheet(sheet) {
  var headers = [];
  if (!sheet) return headers;
  headers = sheet.getSheetValues(1, 1, 1, sheet.getLastColumn())[0];
  return headers;
}

function getCurrentPeriod() {
  var periods = getPeriods();
  for (var i in periods) {
    var period = periods[i];
    var active = normalizeString(period["activo"]);
    var isCurrentPeriod = active === "x";
    if (isCurrentPeriod) return period;
  }
}

function jsonToSheetValues(json, headers) {
  var arrayValues = new Array(headers.length);
  var lowerHeaders = headers.map(normalizeString);
  for (var key in json) {
    var keyValue = normalizeString(key);
    lowerHeaders.forEach(function(header, index) {
      if (keyValue === header) {
        arrayValues[index] = String(json[key]);
      }
    });
  }
  return arrayValues;
}

function normalizeString(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function sheetValuesToObject(sheetValues, headers) {
  var headings = headers || sheetValues[0].map(normalizeString);
  var people = null;
  if (sheetValues) people = sheetValues.slice(1);
  var peopleWithHeadings = addHeadings(people, headings);

  function addHeadings(people, headings) {
    return people.map(function(personAsArray) {
      var personAsObj = {};

      headings.forEach(function(heading, i) {
        personAsObj[heading] = personAsArray[i];
      });

      return personAsObj;
    });
  }
  return peopleWithHeadings;
}
