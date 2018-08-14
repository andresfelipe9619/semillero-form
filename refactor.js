var GENERAL_DB = "https://docs.google.com/spreadsheets/d/1TsbNe2yNzhhmJ4vwyS3X0qztIP8kdKeSgoFY95C5-5U/edit#gid=0"

function doGet(e) {
    var guess_email = Session.getActiveUser().getEmail();
    if (guess_email == 'andresfelipe9619@gmail.com' || guess_email == 'suarez.andres@correounivalle.edu.co' || guess_email == 'semillero@correounivalle.edu.co' || guess_email == 'yurany.velasco@correounivalle.edu.co' || guess_email == 'samuel.ramirez@correounivalle.edu.co') {
        return HtmlService.createHtmlOutputFromFile("admin.html");
    } else {
        return HtmlService.createHtmlOutputFromFile("close.html");
    }
}

function getModules() {
    var rawModules = getRawDataFromSheet(GENERAL_DB, "MODULOS");
    Logger.log('modules')

    return rawModules;

}


function getPeriods() {
    var rawPeriods = getRawDataFromSheet(GENERAL_DB, "PERIODOS");
    return rawPeriods;

}

function getActualPeriodStudents() {
    var rawStudents = getSheetFromSpreadSheet(getActualPeriod()[2], "INSCRITOS");
    return rawStudents;
}

function getStudents() {
    var rawStudents = getRawDataFromSheet(GENERAL_DB, "INSCRITOS")
    return rawStudents;
}

function getSheetFromSpreadSheet(url, sheet) {
    var Spreedsheet = SpreadsheetApp.openByUrl(url);
    if (url && sheet) return Spreedsheet.getSheetByName(sheet);
}

function getRawDataFromSheet(url, sheet) {
    var mSheet = getSheetFromSpreadSheet(url, sheet);
    if (mSheet) return mSheet.getSheetValues(1, 1, mSheet.getLastRow(), mSheet.getLastColumn());
}

function getRangeDataFromSheet(url, sheet) {
    var mSheet = getSheetFromSpreadSheet(url, sheet);
    return mSheet.getRange(1, 1, mSheet.getLastRow(), mSheet.getLastColumn()).getValues();
}


function registerStudentActualPeriod(data, form) {
    var inscritossheet = getSheetFromSpreadSheet(getActualPeriod()[2], "INSCRITOS")

    var lastRow = inscritossheet.getLastRow();
    inscritossheet.appendRow(data);
    var lastRowRes = inscritossheet.getLastRow();
    var res = "Error!";
    if (lastRowRes > lastRow) {
        res = "exito";
    }
    return res;
}

function registerStudentGeneral(data, form) {
    //se crea adifiona la informacion a la tabla
    var inscritossheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS")
    var lastRow = inscritossheet.getLastRow();
    data.push(focus.seleccion)
    var newData = []
    Logger.log('data')
    Logger.log(data)
    for (var x in data) {
        if (data[x] == 'x' || data[x] == '') {
        } else { newData.push(data[x]) }
    }

    // data.push()
    // moduleSheet.appendRow([
    //     data.name.toUpperCase(),
    //     data.lastname.toUpperCase(),
    //     data.tipo,
    //     data.numdoc,
    //     data.telfijo,
    //     data.email.toLowerCase(),
    //     data.grado,
    //     data.colegio,
    //     data.convenio,

    // ]);
    inscritossheet.appendRow(newData);
    var lastRowRes = inscritossheet.getLastRow();
    var res = "Error!";
    if (lastRowRes > lastRow) {
        res = "exito";
    }
    return res;
}


function registerEstudent(data, form) {
    registerStudentActualPeriod(data, form)
    return registerStudentGeneral(data, form)
}

function editEstudent(studentId, newEstudent) {

}

function editModule(moduleName, newModule) {

}

function createModule(module) {

}

function buscarPersona(cedula) {
    var mainFolder = getMainFolder()
    var folder;
    var esta;
    var inscritos = getStudents();

    for (var person in inscritos) {
        // Logger.log('buscando: ' + inscritos[person][3]);
        // Logger.log('cedula: ' + cedula);
        if (String(inscritos[person][3]) === String(cedula)) {
            folder = getCurrentFolder(cedula, mainFolder);
            var files = folder.getFiles();
            Logger.log('files: ' + files);
            for (var j in inscritos[0]) {
                if (inscritos[person][j] == "x") {
                    inscritos[person].push(inscritos[0][j]);
                    while (files.hasNext()) {
                        var file = files.next();
                        inscritos[person].push(file.getName());
                        inscritos[person].push(file.getUrl());
                    }

                    return inscritos[person];
                } else {
                    continue;
                }
            }
        }
    }
    esta = false;
    return esta;
}


function validateModule(modulos, data) {

    //array que almacena todos los modulos matriculados
    var modulosMatriculados = []

    // se adicionan modulos matematicas
    //var modulosMatematicas = form.matematicas;

    var miModulos = getModules()
    Logger.log('modulos selected')
    Logger.log(modulos)

    var arraytitulos = []

    for (var x in miModulos) {
        if (x > 0) {
            arraytitulos.push(miModulos[x][1])
        }
    }
    Logger.log('array titulos')
    Logger.log(arraytitulos)

    if (modulos) {
        for (var i in arraytitulos) {
            if (modulos.localeCompare(arraytitulos[i]) == 0) {
                data.push("x");
                modulosMatriculados.push(arraytitulos[i]);
            } else {
                data.push("");
            }
        }
    } else {
        for (var i in arraytitulos) {
            data.push("");
        }
    }
    Logger.log('modulo matriculado')
    Logger.log(modulosMatriculados)
    return modulosMatriculados;
}

function getMainFolder() {
    var dropbox = "semillero 2018";
    var mainFolder,
        folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
        mainFolder = folders.next();
    } else {
        mainFolder = DriveApp.createFolder(dropbox);
    }
    return mainFolder;
}

function editModuleConditionals(module, conditions) {

}

function setActualPeriod() {

}

function getActualPeriod() {
    var periodos = getPeriods();
    // Logger.log(periodos)

    for (var x in periodos) {
        if (periodos[x][1] == 'x') {
            return periodos[x];
        }
    }
}

function createPeriod(period) {

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
        Logger.log('anterior: ' + form.inscritoanterior);
        if (form.otrocurso !== "") {
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
            getActualPeriod()[0]
        );

        // Logger.log(data);

        var modulosMatriculados = validateModule(form.seleccion, data)

        for (x in modulosMatriculados) {
            if (!addToModule(modulosMatriculados[x], form))
                throw "No se reconoce el modulo seleccionado";
        }

        buscarPersona(form.numdoc)

        //VALIDATE FILES

        var arrayFiles = validateFormFiles(form, data)

        //se crea la carpeta que va contener los arhivos actuales
        var lastFiles = createStudentFolder(form.numdoc, data, arrayFiles)

        //se crea adifiona la informacion a la tabla
        var res = registerEstudent(data, form);

        //SEND EMAIL
        // sendConfirmationEmail(form, lastFiles)

        return res;
    } catch (error) {
        return error.toString();
    }
}
function getCurrentFolder(name, mainFolder) {
    //se crea la carpeta que va conener todos los docmuentos
    var nameFolder = "Bodega de archivos";
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

    return currentFolder;
}

function sendConfirmationEmail(form, lastFiles) {

    // se envia el correo con el detalle de la informcación subministrada

    var filetoSend = getPDFFile(form);
    var subModule = "";
    var modules = getModules();
    var mainFolder = getMainFolder();

    for (var module in modules) {
        if (modules[module].codigo == form.seleccion) {
            subModule = modules[module].nombre;
        }
    }
    var periodo = getActualPeriod()[2];
    MailApp.sendEmail({
        to: form.email,
        subject: "Inscripción " + periodo[0] + " " + subModule + " " + form.name.toUpperCase() + " " + form.lastname.toUpperCase(),
        htmlBody: filetoSend,
        name: "SEMILLEROS UNIVALLE",
        attachments: lastFiles
    });

    var links = '';
    var stFolder = getCurrentFolder(form.numdoc, mainFolder);
    var stFiles = stFolder.getFiles();
    Logger.log("last files: " + stFiles);

    while (stFiles.hasNext()) {
        var mfile = stFiles.next();
        //Logger.log('my name:' + typeof mfile.getName());
        var myname = mfile.getName();

        if (myname.indexOf('STUD') !== -1) {
            links += '<p> <strong>Enlace Constancia Estudiante: </strong><a href="' + mfile.getUrl() + '">Constancia de Estudiante</a></p>';

        } else if (myname.indexOf('FUNC') !== -1) {
            links += '<p> <strong>Enlace Constancia Funcionario: </strong><a href="' + mfile.getUrl() + '">Constancia de Funcionario</a></p>';

        } else if (myname.indexOf('DOC') !== -1) {
            links += '<p> <strong>Enlace Documento: </strong><a href="' + mfile.getUrl() + '">Documento Identidad</a></p>';

        } else if (myname.indexOf('RECI') !== -1) {
            links += '<p> <strong>Enlace Recibo: </strong><a href="' + mfile.getUrl() + '">Recibo de Pago</a></p>';

        }
    }

    //CORREO AL ADMIN
    MailApp.sendEmail({
        to: /*"suarez.andres@correounivalle.edu.co"*/ "semillero@correounivalle.edu.co",
        subject: "Inscripción " + periodo + " " + subModule + " " + form.name.toUpperCase() + " " + form.lastname.toUpperCase(),
        htmlBody: filetoSend + links,
        name: "SEMILLEROS UNIVALLE"
    });
}

function validateFormFiles(form, data) {

    //arreglo que almacena temporalmente los archivos
    var arrayFiles = new Array();

    //validador de la existencia de archivos
    var validatorFiles = {
        docFile: false,
        constanciaEstudFile: false,
        reciboFile: false,
        constanciaFuncFile: false
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


    return arrayFiles;

}

function getPDFFile(data) {

    var modulos = getModules();


    var contenthtml = "";
    //           contenthtml += '<img src="http://semillero.univalle.edu.co/images/AFICHE-2017B.png" />  <img src="http://semillero.univalle.edu.co/images/AFICHE-2017B.png" style="margin-left:50px"/> '
    contenthtml += '<div style="text-align:center">';
    contenthtml += "<h3>UNIVERSIDAD DEL VALLE</h3>";
    contenthtml += "<h3>CONFIRMACION INSCRIPCION SEMILLERO DE CIENCIAS</h3>";
    contenthtml +=
        "<h3>Actualmente se encuentra inscrito en el semillero de ciencias, periodo académico Marzo - Junio de 2018.</h3></div>";
    contenthtml +=
        '<p><strong>NOTA: No olvide consultar su salón de clase el día 2 de Marzo a partir de las 4:00 pm  en nuestra pagina <a href="http://semillerociencias.univalle.edu.co/">Semillero</a> o revisar el correo electrónico donde también serán enviados los listados.</p></strong>';
    contenthtml +=
        "<p><strong>Importante:</strong>Conserve el original del recibo de pago, la cual debe de ser entregado el primer dia de clases a los monitores.</p><hr>";


    var moduleName = "";
    var modulo = data.seleccion;
    for (var y in modulos) {
        if (modulos[y][1] == modulo) {
            moduleName = modulos[y][0];
        } else {
            continue;
        }
    }


    contenthtml += '<h3> Modulo: ' + moduleName + "</h3>";
    contenthtml += "<p> <strong>Fecha de inscripcion:</strong>	" + new Date() + "</p>";
    contenthtml += "<p> <strong>Nombre completo: </strong>" + data.name.toUpperCase() + " " + data.lastname.toUpperCase() + "</p>";
    contenthtml += "<p> <strong>Documento de identidad:	</strong>" + data.tipo + " " + data.numdoc + "</p>";
    contenthtml += "<p> <strong>Ciudad expedición: </strong>" + data.ciudadDoc.toUpperCase() + "</p>";
    contenthtml += "<p> <strong>Email:	</strong>" + data.email + "</p>";
    contenthtml += "<p> <strong>Telefono: </strong>" + data.telfijo + "</p>";
    contenthtml += "<p> <strong>Celular: 	</strong>" + data.telcelular + "</p>";
    contenthtml += "<p> <strong>Ciudad residencia:	 </strong>" + data.ciudadres.toUpperCase() + "</p>";

    if (data.otraeps === null || data.otraeps === " " || data.otraeps === "") {
        Logger.log('yes it is');
        contenthtml += "<p> <strong>Eps: </strong>" + data.eps + "</p>";

    } else {
        contenthtml += "<p> <strong>Eps: </strong>" + data.otraeps + "</p>";

        Logger.log('no it isnt');

    }
    contenthtml += "<p> <strong>Institucion educativa: </strong>" + data.colegio + "</p>";
    contenthtml += "<p> <strong>Modalidad:  </strong>" + data.estamento + "</p>";
    contenthtml += "<p> <strong>Grado:	</strong>" + data.grado + "</p>";
    contenthtml += "<p> <strong>Acudiente:  </strong>" + data.acudiente.toUpperCase() + "</p>";
    contenthtml += "<p> <strong>Telefono acudiente: </strong>" + data.telacudiente + "</p>";

    if (data.otrocurso === null || data.otrocurso === " " || data.otrocurso === "") {
        contenthtml += "<p> <strong>Inscrito anteriormente: </strong>" + data.inscritoanterior + "</p>";

    } else {
        contenthtml += "<p> <strong>Inscrito anteriormente: </strong>" + data.otrocurso + "</p>";
    }

    contenthtml += "<p> <strong>Convenio: </strong>" + data.convenio + "</p>";

    return contenthtml;
}

function addToModule(module, data) {
    Logger.log('addtomodule')
    Logger.log(module)
    Logger.log(data)
    // data.push(module)
    createModulesSheets();
    var actualPeriod = getActualPeriod()[2]
    var modulos = getModules();
    for (var x in modulos) {
        if (module == modulos[x][1]) {
            var moduleSheet = getSheetFromSpreadSheet(actualPeriod, modulos[x][0])
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
    return true
}


function addSheetToSpreadSheet(sheet, spreadsheet) {
    spreadsheet.insertSheet(sheet)
}

function createModulesSheets() {
    var actualPeriod = getActualPeriod()[2]
    var periodSpreadSheet = SpreadsheetApp.openByUrl(actualPeriod);

    var modules = getModules();

    Logger.log('creating modules')
    Logger.log(actualPeriod)
    Logger.log(modules[1][0])
    Logger.log('--------------------------')

    for (var x in modules) {
        var moduleSheet;
        if (x > 0) {

            if (!getSheetFromSpreadSheet(actualPeriod, modules[x][0])) {
                addSheetToSpreadSheet(modules[x][0], periodSpreadSheet)
                moduleSheet = getSheetFromSpreadSheet(actualPeriod, modules[x][0])
                Logger.log('created modules')

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