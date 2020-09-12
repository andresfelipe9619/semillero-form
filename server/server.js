/* PLEASE NOTE that google script doesn't support a VCS like git
  so we use a repository on github and we can keep track
  of changes and come back some code if needed.
  Feel free to clone the project and make some nice PRs.
  HAPPY CODING!!
  https://github.com/andresfelipe9619/semillero-form
*/

var GENERAL_DB =
  "https://docs.google.com/spreadsheets/d/1TsbNe2yNzhhmJ4vwyS3X0qztIP8kdKeSgoFY95C5-5U/edit#gid=0";

function doGet(e) {
  return HtmlService.createTemplateFromFile("index.html").evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function isAdmin() {
  var guess_email = Session.getActiveUser().getEmail();
  var admins = [
    "suarez.andres@correounivalle.edu.co",
    "semillero@correounivalle.edu.co",
    "yurany.velasco@correounivalle.edu.co",
    "samuel.ramirez@correounivalle.edu.co",
    "moreno.juan@correounivalle.edu.co"
  ];
  Logger.log("guess_email");
  Logger.log(guess_email);
  var isGuessAdmin = admins.indexOf(String(guess_email)) >= 0;
  Logger.log(isGuessAdmin);

  return isGuessAdmin;
}

function doPost(request) {
  Logger.log("request");
  Logger.log(request);

  if (typeof request != "undefined") {
    Logger.log(request);
    var params = request.parameter;
    Logger.log("params");
    Logger.log(params);
    return ContentService.createTextOutput(JSON.stringify(request.parameter));
  }
}

function readRequestParameter(request) {
  if (typeof request !== "undefined") {
    var params = request.parameter;
    Logger.log(params.test);
    if (params.test) {
      return true;
    }
    return false;
  }
}

function registerStudentCurrentPeriod(data) {
  Logger.log("=============Registering In Current Period===========");
  Logger.log("Datos en registerStudentCurrentPeriod: ");
  Logger.log(data);

  addStudentToModuleSheet(data.seleccion, data);
  var inscritossheet = getSheetFromSpreadSheet(
    getCurrentPeriod()["link"],
    "INSCRITOS"
  );
  var lastRow = inscritossheet.getLastRow();
  var headers = getHeadersFromSheet(inscritossheet);
  var personValues = jsonToSheetValues(data, headers);
  Logger.log("personValues");
  Logger.log(personValues);

  inscritossheet.appendRow(personValues);
  var lastRowRes = inscritossheet.getLastRow();
  var response = "Error!";
  if (lastRowRes > lastRow) {
    response = "exito";
  }

  Logger.log("=============END Registering In Current Period===========");
  return response;
}

function registerStudentGeneral(data, person) {
  Logger.log("=============Registering In GENERAL DB===========");
  var inscritossheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
  var headers = getHeadersFromSheet(inscritossheet);
  var personValues = jsonToSheetValues(data, headers);
  Logger.log("PERSON VALUES");
  Logger.log(personValues);

  var response = "Error!";

  if (person && person.index) {
    var inscritoRange = inscritossheet.getRange(
      Number(person.index),
      1,
      1,
      inscritossheet.getLastColumn()
    );
    inscritoRange.setValues([personValues]);
    response = "exito";
  } else {
    var lastRow = inscritossheet.getLastRow();
    inscritossheet.appendRow(personValues);
    var lastRowRes = inscritossheet.getLastRow();

    if (lastRowRes > lastRow) {
      response = "exito";
    }
  }
  Logger.log("=============END Registering In General DB===========");
  return response;
}

function registerStudentInSheets(data, currentStudentData) {
  registerStudentCurrentPeriod(data);
  return registerStudentGeneral(data, currentStudentData);
}

function editStudent(serializedData) {
  var form = JSON.parse(serializedData);
  var person = validatePerson(form.num_doc);
  console.log("form", form);
  var newData = getDataForRegistering(form, person);

  editEstudentGeneral(newData, person.index);
  // editStudentActualPeriod( newData );
}

function editStudentActualPeriod(student) {
  Logger.log("ACTUAL PERIOD");
  Logger.log(student);

  var students = getCurrentPeriodStudents();
  var studentSheet = getSheetFromSpreadSheet(
    getCurrentPeriod()["link"],
    "INSCRITOS"
  );
  var esta = false;
  var indice = -1;
  for (var x in students) {
    if (String(students[x][3]) === String(student.data[3])) {
      esta = true;
      indice = x;
    } else {
      esta = false;
    }
  }
  Logger.log("esta");
  Logger.log(esta);

  if (esta) {
    var inscritoRange = studentSheet.getRange(
      Number(indice) + 1,
      1,
      1,
      studentSheet.getLastColumn()
    );
    Logger.log("data");
    Logger.log(student);
    inscritoRange.setValues([student.data]);
  } else {
    studentSheet.appendRow(student.data);
  }
  if (student.module) {
    var studentsModule = getRawDataFromSheet(
      getCurrentPeriod()["link"],
      student.module
    );
    var moduleSheet = getSheetFromSpreadSheet(
      getCurrentPeriod()["link"],
      student.module
    );
    var estais = false;
    for (var x in studentsModule) {
      if (studentsModule[x][3] == student.data[3]) {
        estais = true;
        index = x;
      }
    }
    Logger.log("estais");
    Logger.log(estais);
    var corte = student.data.slice(0, 9);
    Logger.log(corte);
    if (estais) {
      var moduleRange = moduleSheet.getRange(
        Number(index) + 1,
        1,
        1,
        moduleSheet.getLastColumn()
      );
      moduleRange.setValues([corte]);
    } else {
      moduleSheet.appendRow(corte);
    }
  }
}

function editEstudentGeneral(student, studentIndex) {
  try {
    var inscritossheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
    var headers = getHeadersFromSheet(inscritossheet);
    Logger.log("GENERAL PERIOD");
    Logger.log(student);
    var studentRange = inscritossheet.getRange(
      Number(studentIndex),
      1,
      1,
      inscritossheet.getLastColumn()
    );
    var studentData = jsonToSheetValues(student, headers);
    studentRange.setValues([studentData]);
    return "exito";
  } catch (error) {
    Logger.log(error);
    throw "Error editing student on General DB";
  }
}

function validatePerson(cedula) {
  Logger.log("=============Validating Person===========");
  var sheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
  var result = {
    state: "no esta",
    index: -1,
    data: null
  };
  var currentPeriod = getCurrentPeriod()["periodo"];
  var textFinder = sheet.createTextFinder(cedula);
  var studentFound = textFinder.findNext();
  var studentIndex = studentFound ? studentFound.getRow() : -1;
  if (studentIndex <= -1) return result;

  var studentRange = sheet.getSheetValues(
    Number(studentIndex),
    1,
    1,
    sheet.getLastColumn()
  );
  var headers = getHeadersFromSheet(sheet);
  var studentData = sheetValuesToObject(studentRange, headers)[0];
  var isSameDocument = String(studentData.num_doc) === String(cedula);
  if (!isSameDocument) return result;

  var isFromCurrentPeriod = String(studentData[currentPeriod]) !== "-";
  result.index = studentIndex;
  result.state = isFromCurrentPeriod ? "actual" : "antiguo";
  result.data = studentData;
  Logger.log(result);
  Logger.log("=============END Validating Person===========");
  return result;
}

function getCurrentPeriodData() {
  var rawModules = getModules();
  var modules = sheetValuesToObject(rawModules);
  var currentPeriod = getCurrentPeriod()["periodo"];
  return { currentPeriod: currentPeriod, modules: modules };
}

function buscarPersona(cedula) {
  var folder;
  var person = validatePerson(cedula);
  if (person.state !== "no esta") {
    person.files = [];
    folder = getPersonFolder(cedula);
    var files = folder.getFiles();
    Logger.log("files: " + files);
    while (files.hasNext()) {
      var file = files.next();
      person.files.push({ name: file.getName(), url: file.getUrl() });
    }
  } else {
    person = null;
  }
  Logger.log("THIS IS WHAT U ARE LOOKING FOR");
  Logger.log(person);
  return JSON.stringify(person);
}

function avoidCollisionsInConcurrentAccessess() {
  var lock = LockService.getPublicLock();
  lock.waitLock(15000);
}

function registerStudent(formString) {
  var form = JSON.parse(formString);
  if (!form || !Object.keys(form).length) throw "No data sent";
  try {
    var response;
    var person = validatePerson(form.num_doc);
    Logger.log("person");
    Logger.log(person);
    var isOldStudent = person.state === "antiguo";
    var isCurrentStudent = person.state === "actual";
    if (isCurrentStudent) {
      throw "Ya esta inscrito en este periodo";
    }
    avoidCollisionsInConcurrentAccessess();
    var currentStudentData = isOldStudent ? person : null;
    var data = getDataForRegistering(form, currentStudentData);
    Logger.log("Data for registering");
    Logger.log(data);
    var filesResult = uploadStudentFiles(data.num_doc, data.files);
    Logger.log("Files Result");
    Logger.log(filesResult);
    var folderUrl = (filesResult || {}).folder;
    data.url_documentos = folderUrl;
    response = registerStudentInSheets(data, currentStudentData);
    Logger.log("Response");
    Logger.log(response);
    sendConfirmationEmail(data, filesResult.files);

    return response;
  } catch (error) {
    Logger.log("Error Registering Student");
    Logger.log(error);
    return error.toString();
  }
}

function getDataForRegistering(form, currentStudentData) {
  if (form.otraeps) form.eps = form.otraeps;
  if (!form.comuna_res) form.comuna_res = "-";
  if (form.inscrito_anterior === "SI") {
    form.inscrito_anterior = form.curso_anterior;
  }
  var selectedModule = validateModule(form.seleccion);
  var periods = getPersonPeriods(selectedModule, currentStudentData);

  var data = mergeObjects(
    form,
    {
      nombre: form.nombre.toUpperCase(),
      apellido: form.apellido.toUpperCase(),
      ciudad_doc: form.ciudad_doc.toUpperCase(),
      eps: form.eps.toUpperCase(),
      email: form.email.toLowerCase(),
      colegio: form.colegio.toUpperCase(),
      estamento: form.estamento.toUpperCase(),
      depto_res: form.depto_res.toUpperCase(),
      nombre_acudiente: form.nombre_acudiente.toUpperCase(),
      ciudad_res: form.ciudad_res.toUpperCase(),
      modulo: selectedModule,
      observaciones: ""
    },
    periods
  );

  return data;
}

function getPersonPeriods(selectedModule, currentStudentData) {
  Logger.log("Current Student Data");
  Logger.log(currentStudentData);

  var currentPeriod = getCurrentPeriod()["periodo"];
  var periods = getPeriods().reduce(function(acc, p) {
    var value = "-";
    var sheetDataPeriod =
      ((currentStudentData || {}).data || {})[p.periodo] || value;

    var hasModuleOnOldPeriod = sheetDataPeriod && sheetDataPeriod !== "-";
    var isCurrentPeriod = p.periodo === currentPeriod;

    if (hasModuleOnOldPeriod) {
      value = sheetDataPeriod;
    }
    if (isCurrentPeriod) {
      value = selectedModule;
    }
    acc[p.periodo] = value;
    return acc;
  }, {});
  Logger.log("Student Periods");
  Logger.log(periods);
  return periods;
}

function objectValuesToUpperCase(object, keys) {
  if (!object) return null;
  if (!keys.length) return object;
  var upperCaseValues = keys.reduce(function(acc, key) {
    if (key in object) {
      acc[key] = object[key].toUpperCase();
    }
    return acc;
  }, {});
  return mergeObjects(object, upperCaseValues);
}

function mergeObjects() {
  var resObj = {};
  for (var i = 0; i < arguments.length; i += 1) {
    var obj = arguments[i],
      keys = Object.keys(obj);
    for (var j = 0; j < keys.length; j += 1) {
      resObj[keys[j]] = obj[keys[j]];
    }
  }
  return resObj;
}
