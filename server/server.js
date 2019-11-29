var GENERAL_DB =
  "https://docs.google.com/spreadsheets/d/1TsbNe2yNzhhmJ4vwyS3X0qztIP8kdKeSgoFY95C5-5U/edit#gid=0";

function doGet(e) {
  return HtmlService.createTemplateFromFile("admin.html").evaluate();
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

  var inscritossheet = getSheetFromSpreadSheet(
    getCurrentPeriod()[2],
    "INSCRITOS"
  );
  var lastRow = inscritossheet.getLastRow();
  var headers = getHeadersFromSheet(inscritossheet);
  Logger.log("headers");
  Logger.log(headers);

  var personValues = jsonToSheetValues(data, headers);
  Logger.log("personValues");
  Logger.log(personValues);

  var finalValues = personValues.map(function(value) {
    return String(value);
  });

  inscritossheet.appendRow(finalValues);
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
  var finalValues = personValues.map(function(value) {
    return String(value);
  });

  var lastRow = inscritossheet.getLastRow();

  Logger.log("data before clean up");
  Logger.log(data);

  var spaces = 0;
  //si viene con index, revisamos la fila y cojemos los modulos ya inscritos
  if (person && person.data.length) {
    Logger.log("Person data");
    Logger.log(person.data);
    Logger.log("Data length after super data length: ");
    Logger.log(person.data.length);
    Logger.log("Person last modules");
    Logger.log(person.lastModules);
    Logger.log("Last modudules length");
    Logger.log(person.lastModules.length);
    // for (var i = 0; i <= person.lastModules.length - 1; i += 2) {
    //   if (
    //     (person.lastModules[i] && person.lastModules[i] != "") ||
    //     (person.lastModules[i + 1] && person.lastModules[i + 1] != "")
    //   ) {
    //     newData.push(person.lastModules[i]);
    //     newData.push(person.lastModules[i + 1]);
    //   } else {
    //     spaces++;
    //   }
    // }

    if (spaces == 0) {
      inscritossheet.insertColumnsAfter(person.data.length - 1, 2);
      // var periodColumns = inscritossheet.getRange(newData.length - 3, 1, 1, 2)
      // periodColumns.setValues([['periodo', 'modulo']])
    }
  }

  Logger.log("NEW DATA");
  Logger.log(finalValues);
  Logger.log("-----------------");
  Logger.log("Last column");
  Logger.log(inscritossheet.getLastColumn());
  Logger.log("New data length: ");
  Logger.log(finalValues.length);

  var response = "Error!";

  if (person && person.index) {
    var inscritoRange = inscritossheet.getRange(
      Number(person.index) + 1,
      1,
      1,
      inscritossheet.getLastColumn()
    );
    inscritoRange.setValues([finalValues]);
    response = "exito";
  } else {
    inscritossheet.appendRow(finalValues);
    var lastRowRes = inscritossheet.getLastRow();

    if (lastRowRes > lastRow) {
      response = "exito";
    }
  }
  Logger.log("=============END Registering In General DB===========");
  return response;
}

function registerStudentInSheets(data, currentSheetData) {
  registerStudentCurrentPeriod(data);
  return registerStudentGeneral(data, currentSheetData);
}

function editStudent(student) {
  var person = validatePerson(student[3]);
  var url = person.data.pop();

  var newData = student.slice();
  newData.pop();
  var general = newData.slice();
  newData.push(getCurrentPeriod()[0]);

  var selectedModule = validateModule(student[student.length - 1]);

  var last = person.lastModules.length;
  while (last-- && person.lastModules[last] == "");
  Logger.log("last");

  last = parseInt(last);
  Logger.log(last);
  var mModule = null;
  if (selectedModule) {
    var modulos = getModules();
    for (var y in modulos) {
      if (String(selectedModule[x]) === String(modulos[y][1])) {
        Logger.log("lastModules");
        Logger.log(person.lastModules[last]);
        mModule = person.lastModules[last];
        person.lastModules[last] = modulos[y][0];
        for (var z in person.lastModules) {
          general.push(person.lastModules[z]);
        }
      }
    }
  }
  general.push(url);
  newData.push(url);
  editEstudentGeneral({ data: general, index: person.index });
  editStudentActualPeriod({ data: newData, module: mModule });
}

function editStudentActualPeriod(student) {
  Logger.log("ACTUAL PERIOD");
  Logger.log(student);

  var students = getCurrentPeriodStudents();
  var studentSheet = getSheetFromSpreadSheet(
    getCurrentPeriod()[2],
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
      getCurrentPeriod()[2],
      student.module
    );
    var moduleSheet = getSheetFromSpreadSheet(
      getCurrentPeriod()[2],
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

function editEstudentGeneral(student) {
  var inscritossheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
  Logger.log("GENEAL PERIOD");
  Logger.log(student);
  var inscritoRange = inscritossheet.getRange(
    Number(student.index) + 1,
    1,
    1,
    inscritossheet.getLastColumn()
  );
  inscritoRange.setValues([student.data]);
  res = "exito";
}

function validatePerson(cedula) {
  Logger.log("=============Validating Person===========");
  var inscritos = getStudents();
  var sheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
  var result = {
    state: "",
    index: -1,
    data: null,
    lastModules: null
  };
  var currentPeriod = getCurrentPeriod()[0];
  var textFinder = sheet.createTextFinder(cedula);
  var studentFound = textFinder.findNext();
  var studentIndex = studentFound ? studentFound.getRow() - 1 : -1;
  var values = studentFound && studentFound.getValues();
  Logger.log("range values");
  Logger.log(values);
  result.state = "no esta";
  if (studentIndex <= -1) return result;
  // var headers = getHeadersFromSheet(sheet);
  if (String(inscritos[studentIndex][3]) === String(cedula)) {
    var student = inscritos[studentIndex];
    result.index = studentIndex;
    result.lastModules = student.slice(18, student.length - 1);
    Logger.log("lastmodules");
    Logger.log(result.lastModules);
    for (var col in student) {
      if (String(student[col]) === String(currentPeriod)) {
        result.state = "actual";
        break;
      }
      result.state = "antiguo";
    }
    // var studentData = sheetValuesToObject(student, headers);
    result.data = student;
  }
  Logger.log("=============END Validating Person===========");
  return result;
}

function buscarPersona(cedula) {
  var folder;
  var person = validatePerson(cedula || "1144093949");
  Logger.log("THIS IS WHAT U ARE LOOKING FOR");
  Logger.log(person);
  if (person.state !== "no esta") {
    person.files = [];
    folder = getPersonFolder(cedula);
    var files = folder.getFiles();
    Logger.log("files: " + files);
    while (files.hasNext()) {
      var file = files.next();
      person.files.push(file.getName());
      person.files.push(file.getUrl());
    }
  } else {
    person = null;
  }

  return person;
}

function avoidCollisionsInConcurrentAccessess() {
  var lock = LockService.getPublicLock();
  lock.waitLock(20000);
}

function registerStudent(formString) {
  var form = JSON.parse(formString);
  if (!form || !Object.keys(form).length) throw "No data sent";
  avoidCollisionsInConcurrentAccessess();
  try {
    if (form.otraeps) form.eps = form.otraeps;

    Logger.log("anterior: " + form.inscrito_anterior);
    if (form.inscrito_anterior === "SI") {
      form.inscrito_anterior = form.curso_anterior;
    }
    var selectedModule = validateModule(form.seleccion);
    var currentPeriod = getCurrentPeriod()[0];

    var data = mergeObjects(form, {
      nombre: form.name.toUpperCase(),
      apellido: form.lastname.toUpperCase(),
      ciudad_doc: form.ciudad_doc.toUpperCase(),
      email: form.email.toLowerCase(),
      colegio: form.colegio.toUpperCase(),
      estamento: form.estamento.toUpperCase(),
      depto_res: form.depto_res.toUpperCase(),
      nombre_acudiente: form.nombre_acudiente.toUpperCase(),
      ciudad_res: form.ciudad_res.toUpperCase(),
      modulo: selectedModule
    });
    delete data.name;
    delete data.lastname;
    data[currentPeriod] = selectedModule;
    Logger.log("data[currentPeriod]");
    Logger.log(currentPeriod);
    Logger.log(selectedModule);
    Logger.log(Object.keys(data));

    var response;
    var person = validatePerson(data.num_doc);
    Logger.log("person");
    Logger.log(person);
    var isOldStudent = person.state === "antiguo";
    var isCurrentStudent = person.state === "actual";
    if (isCurrentStudent) {
      throw "Ya esta inscrito en este periodo";
    }

    var filesResult = uploadStudentFiles(data.num_doc, data.files);
    Logger.log("filesResult");
    Logger.log(filesResult);
    var folderUrl = (filesResult || {}).folder;
    data.url_documentos = folderUrl;
    var currentSheetData = isOldStudent ? person : null;
    response = registerStudentInSheets(data, currentSheetData);
    Logger.log("response");
    Logger.log(response);
    sendConfirmationEmail(data, filesResult.files);

    return response;
  } catch (error) {
    Logger.log("Error registering student");
    Logger.log(error);
    return error.toString();
  }
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
