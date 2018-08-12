function Period(period, actual, url){
    this.period = period; 
    this.actual  = actual;
    this.url = url; 

}

function Module(name, code, conditions){
    this.name = name;
    this.code = code;
    this.conditions = conditions;
}

function Student(name, lastname, tipo, numdoc, ciudadDoc,
    email, telfijo, telcelular,deptres,
    ciudadres,eps,colegio, estamento,
    grado,acudiente,telacudiente, inscritoanterior, convenio) {



}

function createEstudent(student){

}

function registerEstudent(student){

}

function editEstudent(studentId, newEstudent){

}  

function editModule(moduleName, newModule){

}

function createModule(module){

}

function validateModule(module){

        //array que almacena todos los modulos matriculados
        var modulosMatriculados = new Array();

        // se adicionan modulos matematicas
        //var modulosMatematicas = form.matematicas;
        var modulos = form.seleccion;

        var arraytitulos = new Array(
            "ern",
            "lcsn",
            "af",
            "gpe",
            "gat",
            "pe",
            "fsl"
        );

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

        // se adicionan modulos fisica
        //var modulosFisica = form.fisica;
        var arraytitulos = new Array("em");

        if (modulos) {
            for (var i in arraytitulos) {
                if (modulos.indexOf(arraytitulos[i]) >= 0) {
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

        // se adicionan modulos de quimica
        //var modulosQuimica = form.quimica;
        var arraytitulos = new Array("age", "ese", "bioq");
        if (modulos) {
            for (var i in arraytitulos) {
                if (modulos.indexOf(arraytitulos[i]) >= 0) {
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

        var arraytitulos = new Array("lecr", "escr");
        if (modulos) {
            for (var i in arraytitulos) {
                if (modulos.indexOf(arraytitulos[i]) >= 0) {
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

        var arraytitulos = new Array("muper", "apmus");
        if (modulos) {
            for (var i in arraytitulos) {
                if (modulos.indexOf(arraytitulos[i]) >= 0) {
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


        //adicionar a lista de modulos los modulos

        for (x in modulosMatriculados) {
            if (!addToModule(modulosMatriculados[x], form, Spreedsheet))
                throw "No se reconoce el modulo seleccionado";
        }
}

function validateEstudent(student){

}


function editModuleConditionals(module, conditions){

}

function createPeriod(period){

}

function createStudentFolder(student) {

}

function arrayToObject(array) {

}

function serverValidation(student){
    
        //incio validaciones en el servidor

        var Spreedsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1TsbNe2yNzhhmJ4vwyS3X0qztIP8kdKeSgoFY95C5-5U/edit#gid=0");

        var administracion = Spreedsheet.getSheetByName("PERIODOS");
        var inscritossheet = Spreedsheet.getSheetByName("INSCRITOS");
        //
        var periodo = administracion.getSheetValues(2, 2, 1, 1)[0][0];

        if (periodo == "")
            throw "No se puede realizar la inscripción ya que no se ha definido un periodo académico";
        var inscritos = inscritossheet.getSheetValues(
            2,
            1,
            inscritossheet.getLastRow(),
            inscritossheet.getLastColumn()
        );
        for (x in inscritos) {
            //throw 'doc: '+inscritos[x][4] + ' * compara con: ' + form.numdoc + ' - periodo: ' + inscritos[x][27] + 'comparar con: ' + periodo;
            if (inscritos[x][3] == form.numdoc && inscritos[x][32] == periodo) {
                throw "Ya existe un persona inscrita con el numero de documento " +
                form.numdoc +
                " en el periodo " +
                periodo;
            }
        }

        data.push(periodo);
        Logger.log("MY DATAAAAAA:", data);
        //fin validaciones en el servidor
}


function uploadFiles(form) {
    var lock = LockService.getPublicLock();
    lock.waitLock(20000); //espera 20 segundos  para evitar colisiones en accesos concurrentes
    try {
        //carpeta donde se almacenaran los archivos
        var dropbox = "semillero 2018";
        var mainFolder,
            folders = DriveApp.getFoldersByName(dropbox);

        if (folders.hasNext()) {
            mainFolder = folders.next();
        } else {
            mainFolder = DriveApp.createFolder(dropbox);
        }

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
            form.convenio
        );

        Logger.log(data);


        //VALIDATE FILES

        //se crea la carpeta que va contener los arhivos actuales
        var currentFolder = getCurrentFolder(form.numdoc, mainFolder);
        var lastFiles = [];
        data.push(currentFolder.getUrl());
        for (var i in arrayFiles) {
            var file = currentFolder.createFile(arrayFiles[i]);
            lastFiles.push(file);
            file.setDescription("Subido Por " + form.numdoc);
        }

        //se crea adifiona la informacion a la tabla

        var lastRow = inscritossheet.getLastRow();
        inscritossheet.appendRow(data);
        var lastRowRes = inscritossheet.getLastRow();
        var res = "Error!";
        if (lastRowRes > lastRow) {
            res = "exito";
        }

        //SEND EMAIL

        return res;
    } catch (error) {
        return error.toString();
    }
}


function sendConfirmationEmail(form) {

    // se envia el correo con el detalle de la informcación subministrada

    var filetoSend = getPDFFile(form, validatorFiles);
    var subModule = "";
    var modules = [
        { codigo: "ern", nombre: "De los Enteros A los racionales NUEVO!!" },
        { codigo: "lcsn", nombre: "Lógica, Conjuntos y Sistemas Numéricos" },
        { codigo: "af", nombre: "Álgebra Fundamental" },
        { codigo: "gpe", nombre: "Geometría Plana y del Espacio" },
        { codigo: "gat", nombre: "Geometría Analítica y Trigonometría" },
        { codigo: "pe", nombre: "Probabilidad y Estadística" },
        { codigo: "fsl", nombre: "Funciones, Sucesiones y Límite" },
        { codigo: "em", nombre: "Energía y Movimiento" },
        { codigo: "age", nombre: "AGE: átomo, gases y estequiometría" },
        {
            codigo: "ese",
            nombre: "ESE: Estequiometría II, Soluciones y Equilibrio"
        },
        { codigo: "bioq", nombre: "BIOQ: Química Orgánica y Bioquímica" },
        { codigo: "lecr", nombre: "Lectura Crítica" },
        { codigo: "escr", nombre: "Escritura Creativa" },
        { codigo: "muper", nombre: "Música, Percusión y Flauta Dulce" },
        { codigo: "apmus", nombre: "Apreciación Musical" }

    ];
    for (var module in modules) {
        if (modules[module].codigo == form.seleccion) {
            subModule = modules[module].nombre;
        }
    }

    MailApp.sendEmail({
        to: form.email,
        subject: "Inscripción " + periodo + " " + subModule + " " + form.name.toUpperCase() + " " + form.lastname.toUpperCase(),
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

function validateFormFiles(form) {

    //arreglo que almacena temporalmente los archivos
    var arrayFiles = new Array();
    var convenio = form.convenio;

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
}

