var GENERAL_DB =
  "https://docs.google.com/spreadsheets/d/1TsbNe2yNzhhmJ4vwyS3X0qztIP8kdKeSgoFY95C5-5U/edit#gid=0";

function doGet(e) {
  Logger.log(Session.getEffectiveUser());
  return HtmlService.createHtmlOutputFromFile("admin.html");
}

function isAdmin() {
  var guess_email = Session.getEffectiveUser();
  var admins = [
    "suarez.andres@correounivalle.edu.co",
    "semillero@correounivalle.edu.co",
    "yurany.velasco@correounivalle.edu.co",
    "samuel.ramirez@correounivalle.edu.co",
    "moreno.juan@correounivalle.edu.co"
  ];
  return admins.includes(guess_email);
}

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

function getActualPeriodStudents() {
  var rawStudents = getRawDataFromSheet(getActualPeriod()[2], "INSCRITOS");
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
  Logger.log("=============Validando Persona===========");
  var inscritos = getStudents();
  // var res = ""
  var result = {
    state: "",
    index: -1,
    data: null,
    lastModules: null
  };
  var actualPeriod = getActualPeriod()[0];

  for (var person in inscritos) {
    if (String(inscritos[person][3]) === String(cedula)) {
      result.index = person;
      result.lastModules = inscritos[person].slice(
        18,
        inscritos[person].length - 1
      );
      Logger.log("lastmodules");
      Logger.log(result.lastModules);
      for (var col in inscritos[person]) {
        if (String(inscritos[person][col]) === String(actualPeriod)) {
          result.state = "actual";
          break;
        } else {
          result.state = "antiguo";
        }
      }
      result.data = inscritos[person];
    }
  }
  Logger.log("=============FIN Validando Persona===========");
  if (result.index > -1) {
    return result;
  } else {
    result.state = "no esta";
    return result;
  }
}

function buscarPersona(cedula) {
  var mainFolder = getMainFolder();
  var folder;
  var person = validatePerson(cedula);
  Logger.log("THIS IS WHAT U ARE LOOKING FOR");
  Logger.log(person);
  if (person.state != "no esta") {
    person.files = [];
    folder = getCurrentFolder(cedula, mainFolder);
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

function validateModule(modulos, data) {
  var modulosMatriculados = [];
  Logger.log("=============Validando modulos===========");

  var miModulos = getModules();
  Logger.log("modulos selected");
  Logger.log(modulos);

  var titulosModulos = [];

  for (var x in miModulos) {
    if (x > 0) {
      titulosModulos.push(miModulos[x][1]);
    }
  }
  Logger.log("Titulos modulos");
  Logger.log(titulosModulos);

  if (modulos) {
    for (var i in titulosModulos) {
      if (modulos.localeCompare(titulosModulos[i]) == 0) {
        data.push("x");
        modulosMatriculados.push(titulosModulos[i]);
      } else {
        data.push("");
      }
    }
  } else {
    for (var i in titulosModulos) {
      data.push("");
    }
  }

  Logger.log("modulo matriculado");
  Logger.log(modulosMatriculados);
  Logger.log("=============FIN Validando modulos===========");

  return modulosMatriculados;
}

function getMainFolder() {
  var dropbox = "SCRIPTS SEMILLEROS";
  var mainFolder,
    folders = DriveApp.getFoldersByName(dropbox);

  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
    mainFolder = DriveApp.createFolder(dropbox);
  }
  return mainFolder;
}

function editModuleConditionals(module, conditions) {}

function getActualPeriod() {
  var periodos = getPeriods();
  // Logger.log(periodos)

  for (var x in periodos) {
    if (periodos[x][1] == "x") {
      return periodos[x];
    }
  }
}

function createStudentFolder(numdoc, data, arrayFiles) {
  //se crea la carpeta que va contener los arhivos actuales
  var mainFolder = getMainFolder();
  var currentFolder = getCurrentFolder(numdoc, mainFolder);
  var lastFiles = [];
  data.push(currentFolder.getUrl());
  for (var i in arrayFiles) {
    var file = currentFolder.createFile(arrayFiles[i]);
    lastFiles.push(file);
    file.setDescription("Subido Por " + numdoc);
  }
  return lastFiles;
}

function uploadFiles(form) {
  var lock = LockService.getPublicLock();
  lock.waitLock(20000); //espera 20 segundos  para evitar colisiones en accesos concurrentes
  try {
    //carpeta donde se almacenaran los archivos
    // var mainFolder = getMainFolder();

    if (form.otraeps !== "") {
      form.eps = form.otraeps;
    }
    Logger.log("anterior: " + form.inscritoanterior);
    if (form.inscritoanterior == "SI") {
      form.inscritoanterior = form.otrocurso;
    }

    var data = new Array(
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
    );
    Logger.log("Data uploadFiles before validateModule");
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
      arrayFiles = validateFormFiles(form, data);

      //se crea la carpeta que va contener los arhivos actuales
      lastFiles = createStudentFolder(form.numdoc, data, arrayFiles);

      //se crea adifiona la informacion a la tabla
      res = registerStudent(data, form);

      sendConfirmationEmail(form, lastFiles);
    } else if (person.state == "antiguo") {
      for (x in modulosMatriculados) {
        if (!addToModule(modulosMatriculados[x], form))
          throw "No se reconoce el modulo seleccionado";
      }
      arrayFiles = validateFormFiles(form, data);

      //se crea la carpeta que va contener los arhivos actuales
      lastFiles = createStudentFolder(form.numdoc, data, arrayFiles);

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

      sendConfirmationEmail(form, lastFiles);
    } else if (person.state == "actual") {
      throw "Ya esta inscrito en este periodo";
    }

    return res;
  } catch (error) {
    return error.toString();
  }
}

function getCurrentFolder(name, mainFolder) {
  //se crea la carpeta que va conener todos los docmuentos
  var nameFolder = "Bodega de archivos";
  var actualPeriod = getActualPeriod()[0];
  var FolderFiles,
    folders = mainFolder.getFoldersByName(nameFolder);
  if (folders.hasNext()) {
    FolderFiles = folders.next();
  } else {
    FolderFiles = mainFolder.createFolder(nameFolder);
  }

  // se crea la carpeta que va contener los documentos de cada inscrito
  var currentFolder,
    folders = FolderFiles.getFoldersByName(name);
  if (folders.hasNext()) {
    currentFolder = folders.next();
  } else {
    currentFolder = FolderFiles.createFolder(name);
  }

  var periodFolder,
    pfolders = currentFolder.getFoldersByName(actualPeriod);
  if (pfolders.hasNext()) {
    periodFolder = pfolders.next();
  } else {
    periodFolder = currentFolder.createFolder(actualPeriod);
  }

  return periodFolder;
}

function sendConfirmationEmail(form, lastFiles) {
  // se envia el correo con el detalle de la informcación subministrada

  var filetoSend = getPDFFile(form);
  var subModule = "";
  var modules = getModules();
  var mainFolder = getMainFolder();

  for (var module in modules) {
    if (modules[module][1] == form.seleccion) {
      subModule = modules[module][0];
    }
  }
  var periodo = getActualPeriod();
  Logger.log("Submodulo");
  Logger.log(subModule);
  MailApp.sendEmail({
    to: form.email,
    subject: "Inscripción " + periodo[0] + " " + subModule,
    htmlBody: filetoSend,
    name: "SEMILLEROS UNIVALLE",
    attachments: lastFiles
  });

  var links = "";
  var stFolder = getCurrentFolder(form.numdoc, mainFolder);
  var stFiles = stFolder.getFiles();
  Logger.log("last files: " + stFiles);

  var urlFolder = stFolder.getUrl();

  /*
    while (stFiles.hasNext()) {
        var mfile = stFiles.next();
        //Logger.log('my name:' + typeof mfile.getName());
        var myname = mfile.getName();

        if (myname.indexOf('STUD') > -1) {
            links += '<p> <strong>Enlace Constancia Estudio: </strong><a href="' + mfile.getUrl() + '">Constancia de Estudio</a></p>';

        } else if (myname.indexOf('FUNC') > -1) {
            links += '<p> <strong>Enlace Constancia Funcionario: </strong><a href="' + mfile.getUrl() + '">Constancia de Funcionario</a></p>';

        } else if (myname.indexOf('DOC') > -1) {
            links += '<p> <strong>Enlace Documento: </strong><a href="' + mfile.getUrl() + '">Documento Identidad</a></p>';

        } else if (myname.indexOf('RECI') > -1) {
            links += '<p> <strong>Enlace Recibo: </strong><a href="' + mfile.getUrl() + '">Recibo de Pago</a></p>';

        }
    } */

  links +=
    '<p> <strong> Enlace Documentos: </strong> <a href="' +
    urlFolder +
    '"> Carpeta con Documentos del Estudiante</a></p>';

  //CORREO AL ADMIN
  MailApp.sendEmail({
    to:
      /*"suarez.andres@correounivalle.edu.co" "moreno.juan@correounivalle.edu.co"*/ "semillero@correounivalle.edu.co",
    subject:
      "Inscripción " +
      periodo[0] +
      " " +
      subModule +
      " " +
      form.name.toUpperCase() +
      " " +
      form.lastname.toUpperCase(),
    htmlBody: filetoSend + links,
    name: "SEMILLEROS UNIVALLE",
    attachments: lastFiles
  });
}

function validateFormFiles(form) {
  //arreglo que almacena temporalmente los archivos
  var arrayFiles = new Array();

  //validador de la existencia de archivos
  var validatorFiles = {
    docFile: false,
    constanciaEstudFile: false,
    reciboFile: false,
    constanciaFuncFile: false,
    recibosPublicos: false,
    cartaSolicitud: false,
    actaGrado: false
  };

  if (form.docFile) {
    var fileDoc = form.docFile;
    fileDoc.setName(form.numdoc + "_DOCUMENTO");
    arrayFiles.push(fileDoc);
    validatorFiles.docFile = true;
  }

  if (form.constanciaEstudFile) {
    var fileConstanciaEstud = form.constanciaEstudFile;
    fileConstanciaEstud.setName(form.numdoc + "_COSNTANCIA_ESTUD");
    arrayFiles.push(fileConstanciaEstud);
    validatorFiles.constanciaEstudFile = true;
  }

  if (form.reciboFile) {
    var fileRecibo = form.reciboFile;
    fileRecibo.setName(form.numdoc + "_RECIBO");
    arrayFiles.push(fileRecibo);
    validatorFiles.reciboFile = true;
  }

  if (form.constanciaFuncFile) {
    var fileConstanciaFunc = form.constanciaFuncFile;
    fileConstanciaFunc.setName(form.numdoc + "_CONSTANCIA_FUNC");
    arrayFiles.push(fileConstanciaFunc);
    validatorFiles.constanciaFuncFile = true;
  }

  if (form.recibosPublicos) {
    var fileRecibosPublicos = form.recibosPublicos;
    fileRecibosPublicos.setName(form.numdoc + "_REC_PUBLICOS");
    arrayFiles.push(fileRecibosPublicos);
    validatorFiles.recibosPublicos = true;
  }

  if (form.cartaSolicitud) {
    var fileCartaSolicitud = form.cartaSolicitud;
    fileCartaSolicitud.setName(form.numdoc + "_CARTA_SOLIC");
    arrayFiles.push(fileCartaSolicitud);
    validatorFiles.cartaSolicitud = true;
  }

  if (form.actaGrado) {
    var fileActaGrado = form.actaGrado;
    fileActaGrado.setName(form.numdoc + "_ACTA_GRADO");
    arrayFiles.push(fileActaGrado);
    validatorFiles.actaGrado = true;
  }

  return arrayFiles;
}

function getPDFFile(data) {
  var modulos = getModules();

  var contenthtml = "";

  var moduleName = "";
  var moduleUrl = "";
  var modulo = data.seleccion;
  for (var y in modulos) {
    if (modulos[y][1] == modulo) {
      moduleName = modulos[y][0];
      moduleUrl = modulos[y][4];
    }
  }
  contenthtml += '<div style="text-align:center">';
  contenthtml += "<h3>UNIVERSIDAD DEL VALLE</h3>";
  contenthtml += "<h3>CONFIRMACION INSCRIPCION SEMILLERO DE CIENCIAS</h3>";
  contenthtml +=
    "<h3>Actualmente se encuentra inscrito en el semillero de ciencias, periodo académico Febrero - Junio de 2019.</h3></div>";
  contenthtml +=
    '<p><strong>NOTA: No olvide consultar su salón de clase en nuestra pagina <a href="http://semillerociencias.univalle.edu.co/">Semillero</a> o revisar el correo electrónico donde también serán enviados los listados.</p></strong>';
  contenthtml +=
    "<p><strong>Importante:</strong>Conserve el original del recibo de pago, la cual debe de ser entregado el primer dia de clases a los monitores.</p><hr>";

  contenthtml += "<h3> Modulo: " + moduleName + "</h3>";
  contenthtml +=
    "<p> <strong>Fecha de inscripcion:</strong>	" + new Date() + "</p>";
  contenthtml +=
    "<p> <strong>Nombre completo: </strong>" +
    data.name.toUpperCase() +
    " " +
    data.lastname.toUpperCase() +
    "</p>";
  contenthtml +=
    "<p> <strong>Documento de identidad:	</strong>" +
    data.tipo +
    " " +
    data.numdoc +
    "</p>";
  contenthtml +=
    "<p> <strong>Ciudad expedición: </strong>" +
    data.ciudadDoc.toUpperCase() +
    "</p>";
  contenthtml += "<p> <strong>Email:	</strong>" + data.email + "</p>";
  contenthtml += "<p> <strong>Telefono: </strong>" + data.telfijo + "</p>";
  contenthtml += "<p> <strong>Celular: 	</strong>" + data.telcelular + "</p>";
  contenthtml +=
    "<p> <strong>Ciudad residencia:	 </strong>" +
    data.ciudadres.toUpperCase() +
    "</p>";

  if (data.otraeps === null || data.otraeps === " " || data.otraeps === "") {
    Logger.log("yes it is");
    contenthtml += "<p> <strong>Eps: </strong>" + data.eps + "</p>";
  } else {
    contenthtml += "<p> <strong>Eps: </strong>" + data.otraeps + "</p>";

    Logger.log("no it isnt");
  }
  contenthtml +=
    "<p> <strong>Institucion educativa: </strong>" + data.colegio + "</p>";
  contenthtml += "<p> <strong>Modalidad:  </strong>" + data.estamento + "</p>";
  contenthtml += "<p> <strong>Grado:	</strong>" + data.grado + "</p>";
  contenthtml +=
    "<p> <strong>Acudiente:  </strong>" + data.acudiente.toUpperCase() + "</p>";
  contenthtml +=
    "<p> <strong>Telefono acudiente: </strong>" + data.telacudiente + "</p>";

  if (
    data.otrocurso === null ||
    data.otrocurso === " " ||
    data.otrocurso === ""
  ) {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" +
      data.inscritoanterior +
      "</p>";
  } else {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" + data.otrocurso + "</p>";
  }

  contenthtml += "<p> <strong>Convenio: </strong>" + data.convenio + "</p>";

  return contenthtml;
}

function addToModule(module, data) {
  Logger.log("addtomodule");
  Logger.log(module);
  Logger.log(data);
  // data.push(module)
  createModulesSheets();
  var actualPeriod = getActualPeriod()[2];
  var modulos = getModules();
  for (var x in modulos) {
    if (module == modulos[x][1]) {
      var moduleSheet = getSheetFromSpreadSheet(actualPeriod, modulos[x][0]);
      var lastRow = moduleSheet.getLastRow();
      moduleSheet.appendRow([
        data.name.toUpperCase(),
        data.lastname.toUpperCase(),
        data.tipo,
        data.numdoc,
        data.telfijo,
        data.email.toLowerCase(),
        data.grado,
        data.colegio,
        data.convenio
      ]);
      var lastRowRes = moduleSheet.getLastRow();
      var res = false;

      if (lastRowRes > lastRow) {
        res = true;
      }
      return res;
    }
  }
  return true;
}

function createModulesSheets() {
  var actualPeriod = getActualPeriod()[2];
  var periodSpreadSheet = SpreadsheetApp.openByUrl(actualPeriod);

  var modules = getModules();

  Logger.log("creating modules");
  Logger.log(actualPeriod);
  Logger.log(modules[1][0]);
  Logger.log("--------------------------");

  for (var x in modules) {
    var moduleSheet;
    if (x > 0) {
      if (!getSheetFromSpreadSheet(actualPeriod, modules[x][0])) {
        periodSpreadSheet.insertSheet(modules[x][0]);
        moduleSheet = getSheetFromSpreadSheet(actualPeriod, modules[x][0]);
        if (moduleSheet.getLastRow() == 0) {
          moduleSheet.appendRow([
            "nombre",
            "apellido",
            "tipo de documento",
            "número de documento",
            "telefono",
            "email",
            "grado",
            "colegio",
            "convenio_colegio"
          ]);
        }
      }
    }
  }
  return true;
}
