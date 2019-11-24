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

function registerStudentActualPeriod(data, form) {
  Logger.log("=============Registrando Periodo actual===========");
  var inscritossheet = getSheetFromSpreadSheet(
    getActualPeriod()[2],
    "INSCRITOS"
  );

  Logger.log("Datos en registerStudentActualPeriod: ");
  Logger.log(data);
  Logger.log("Datos en FORM registerStudentActualPeriod: ");
  Logger.log(form);

  var lastRow = inscritossheet.getLastRow();
  inscritossheet.appendRow(data);
  var lastRowRes = inscritossheet.getLastRow();
  var res = "Error!";
  if (lastRowRes > lastRow) {
    res = "exito";
  }
  Logger.log("=============FIN Registrando Periodo actual===========");
  return res;
}

function registerStudentGeneral(data, form, person) {
  //se crea adifiona la informacion a la tabla
  var inscritossheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
  var modules = getModules();

  var lastRow = inscritossheet.getLastRow();
  var url = data.pop();
  var newData = [];

  Logger.log("data before clean up");
  Logger.log(data);
  Logger.log("Super data length: ");
  Logger.log(data.length);
  //quitamos los elemntos en blaco de los datos del formulario
  // y dejamos eldel telefono si lo esta
  for (var x in data) {
    if (data[x] == "x" || data[x] == "" || data[x] == " ") {
      if (x == 6 && form.telfijo == "") {
        newData.push(data[x]);
      }
    } else {
      newData.push(data[x]);
    }
  }
  var actualPeriod = newData.pop();
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
    for (var i = 0; i <= person.lastModules.length - 1; i += 2) {
      if (
        (person.lastModules[i] && person.lastModules[i] != "") ||
        (person.lastModules[i + 1] && person.lastModules[i + 1] != "")
      ) {
        newData.push(person.lastModules[i]);
        newData.push(person.lastModules[i + 1]);
      } else {
        spaces++;
      }
    }

    if (spaces == 0) {
      inscritossheet.insertColumnsAfter(person.data.length - 1, 2);
      // var periodColumns = inscritossheet.getRange(newData.length - 3, 1, 1, 2)
      // periodColumns.setValues([['periodo', 'modulo']])
    }
  }

  Logger.log(newData);
  for (var x in modules) {
    if (modules[x][1] == form.seleccion) {
      newData.push(actualPeriod);
      newData.push(modules[x][0]);
    }
  }

  Logger.log("NEW DATA");
  Logger.log(newData);
  Logger.log("-----------------");
  Logger.log("Last column");
  Logger.log(inscritossheet.getLastColumn());
  Logger.log("New data length: ");
  Logger.log(newData.length);

  if (inscritossheet.getLastColumn() > newData.length + 1) {
    var diff = inscritossheet.getLastColumn() - newData.length;
    while (diff > 1) {
      newData.push("");
      diff--;
    }
  }

  newData.push(url);
  var res = "Error!";

  if (person && person.index) {
    var inscritoRange = inscritossheet.getRange(
      Number(person.index) + 1,
      1,
      1,
      inscritossheet.getLastColumn()
    );
    inscritoRange.setValues([newData]);
    res = "exito";
  } else {
    inscritossheet.appendRow(newData);
    var lastRowRes = inscritossheet.getLastRow();

    if (lastRowRes > lastRow) {
      res = "exito";
    }
  }

  return res;
}

function registerStudent(data, form) {
  registerStudentActualPeriod(data, form);
  return registerStudentGeneral(data, form);
}

function editStudent(student) {
  var person = validatePerson(student[3]);
  var url = person.data.pop();

  var newData = student.slice();
  newData.pop();
  var general = newData.slice();
  newData.push(getActualPeriod()[0]);

  var modulosMatriculados = validateModule(
    student[student.length - 1],
    newData
  );

  var last = person.lastModules.length;
  while (last-- && person.lastModules[last] == "");
  Logger.log("last");

  last = parseInt(last);
  Logger.log(last);
  var mModule = null;
  for (x in modulosMatriculados) {
    if (modulosMatriculados[x]) {
      var modulos = getModules();
      for (var y in modulos) {
        if (String(modulosMatriculados[x]) === String(modulos[y][1])) {
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
  }
  general.push(url);
  newData.push(url);
  editEstudentGeneral({ data: general, index: person.index });
  editStudentActualPeriod({ data: newData, module: mModule });
}

function editStudentActualPeriod(student) {
  Logger.log("ACTUAL PERIOD");
  Logger.log(student);

  var students = getActualPeriodStudents();
  var studentSheet = getSheetFromSpreadSheet(getActualPeriod()[2], "INSCRITOS");
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
      getActualPeriod()[2],
      student.module
    );
    var moduleSheet = getSheetFromSpreadSheet(
      getActualPeriod()[2],
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
  var actualPeriod = getActualPeriod()[0];
  var textFinder = sheet.createTextFinder(cedula);
  var studentFound = textFinder.findNext();
  var studentIndex = studentFound ? studentFound.getRow() - 1 : -1;
  var values = studentFound.getValues();
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
      if (String(student[col]) === String(actualPeriod)) {
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
  Logger.log("FORM");
  Logger.log(form);
  if (!Object.keys(form).length) throw "No data sent";
  avoidCollisionsInConcurrentAccessess();
  try {
    if (form.otraeps !== "") {
      form.eps = form.otraeps;
    }
    Logger.log("anterior: " + form.inscritoanterior);
    if (form.inscritoanterior == "SI") {
      form.inscritoanterior = form.otrocurso;
    }

    var data = [
      form.name.toUpperCase(),
      form.lastname.toUpperCase(),
      form.tipo,
      form.numdoc,
      form.ciudadDoc.toUpperCase(),
      form.email.toLowerCase(),
      form.telfijo,
      form.telcelular,
      form.deptres.toUpperCase(),
      form.ciudadres.toUpperCase(),
      form.eps,
      form.colegio.toUpperCase(),
      form.estamento.toUpperCase(),
      form.grado,
      form.acudiente.toUpperCase(),
      form.telacudiente,
      form.inscritoanterior,
      form.convenio,
      form.valconsignado,
      form.terms,
      getActualPeriod()[0]
    ];
    Logger.log("Data registerStudent before validateModule");
    Logger.log(data);

    var modulosMatriculados = validateModule(form.seleccion, data);

    Logger.log("Data uploadedFiles after validateModule");
    Logger.log(data);

    var res, arrayFiles, lastFiles;
    var person = validatePerson(form.numdoc);
    Logger.log("Validated person", person);
    Logger.log(person);
    if (person.state == "no esta") {
      for (x in modulosMatriculados) {
        if (!addToModule(modulosMatriculados[x], form))
          throw "No se reconoce el modulo seleccionado";
      }
      //VALIDATE FILES
      // arrayFiles = validateFormFiles(form, data);
      Logger.log("{arrayFiles, form, data}");
      Logger.log({ files: arrayFiles, form: form, data: data });

      //se crea la carpeta que va contener los arhivos actuales
      // lastFiles = uploadEstudentFiles(form.numdoc, data, arrayFiles[0]);

      //se crea adifiona la informacion a la tabla
      res = registerStudent(data, form);

      // sendConfirmationEmail(form, lastFiles);
    } else if (person.state == "antiguo") {
      for (x in modulosMatriculados) {
        if (!addToModule(modulosMatriculados[x], form))
          throw "No se reconoce el modulo seleccionado";
      }
      // arrayFiles = validateFormFiles(form, data);
      Logger.log("{arrayFiles, form, data}");
      Logger.log({ files: arrayFiles, form: form, data: data });
      //se crea la carpeta que va contener los arhivos actuales
      // lastFiles = uploadEstudentFiles(form.numdoc, data, arrayFiles[0]);
      Logger.log(
        "Data before registerStudentActualPeriod when student exists "
      );
      Logger.log(data);

      //se crea adifiona la informacion a la tabla
      res = registerStudentActualPeriod(data, form);

      Logger.log("Data after registerStudentActualPeriod when student exists ");
      Logger.log(data);

      registerStudentGeneral(data, form, person);

      Logger.log("Data after registerStudentGeneral when student exists ");
      Logger.log(data);

      // sendConfirmationEmail(form, lastFiles);
    } else if (person.state == "actual") {
      throw "Ya esta inscrito en este periodo";
    }

    return res;
  } catch (error) {
    Logger.log("Error registering student");
    Logger.log(error);
    return error.toString();
  }
}
