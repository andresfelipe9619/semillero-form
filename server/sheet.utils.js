function getModules() {
  var rawModules = getRawDataFromSheet(GENERAL_DB, "MODULOS");
  Logger.log("modules");
  return rawModules;
}

function getPeriods() {
  var rawPeriods = getRawDataFromSheet(GENERAL_DB, "PERIODOS");
  return rawPeriods;
}

function getStudents() {
  var rawStudents = getRawDataFromSheet(GENERAL_DB, "INSCRITOS");
  return rawStudents;
}

function getCurrentPeriodStudents() {
  var rawStudents = getRawDataFromSheet(getCurrentPeriod()[2], "INSCRITOS");
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
  var periodos = getPeriods();
  for (var x in periodos) {
    if (periodos[x][1] == "x") {
      return periodos[x];
    }
  }
}

function jsonToSheetValues(json, headers) {
  var arrayValues = new Array(headers.length);
  var lowerHeaders = headers.map(function(item) {
    return String(item).toLowerCase();
  });
  for (var key in json) {
    lowerHeaders.forEach(function(header, index) {
      Logger.log("key");
      Logger.log({ key: key, header: header });
      if (String(key) == String(header)) {
        Logger.log("IS EQUAL");
        arrayValues[index] = json[key];
      } 
    });
  }
  // logFunctionOutput(jsonToSheetValues.name, arrayValues)
  return arrayValues;
}

function sheetValuesToObject(sheetValues, headers) {
  var headings = headers || sheetValues[0].map(String.toLowerCase);
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
  // logFunctionOutput(sheetValuesToObject.name, peopleWithHeadings)
  return peopleWithHeadings;
}
