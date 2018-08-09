        //var  modulos = new array({codigo: "ern", nombre: "De los Enteros A los racionales NUEVO!!"}, {codigo: "lcsn", nombre: "Lógica, Conjuntos y Sistemas Numéricos"}, {codigo: "af", nombre: "Álgebra Fundamental"}, {codigo: "gpe", nombre: "Geometría Plana y del Espacio"}, {codigo: "gat", nombre: "Geometría Analítica y Trigonometría"}, {codigo: "pe", nombre: "Probabilidad y Estadística"}, {codigo: "fsl", nombre: "Funciones, Sucesiones y Límite"}, {codigo: "em", nombre: "Energía y Movimiento"}, {codigo: "age", nombre: "AGE: átomo, gases y estequiometría"}, {codigo: "ese", nombre: "ESE: Estequiometría II, Soluciones y Equilibrio"});

        function doGet(e) {
            var guess_email = Session.getActiveUser().getEmail();
            if (guess_email == 'suarez.andres@correounivalle.edu.co' || guess_email == 'semillero@correounivalle.edu.co' || guess_email == 'yurany.velasco@correounivalle.edu.co' || guess_email == 'samuel.ramirez@correounivalle.edu.co') {
                return HtmlService.createHtmlOutputFromFile("admin.html");
            } else {
                return HtmlService.createHtmlOutputFromFile("close.html");
            }
        }

        function uploadFiles(form) {
            var lock = LockService.getPublicLock();
            lock.waitLock(30000); //espera 30 segundos  para evitar colisiones en accesos concurrentes
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

                //array que almacena todos los modulos matriculados
                var modulosMatriculados = new Array();

                // se adicionan modulos matematicas
                //var modulosMatematicas = form.matematicas;
                var modulos = form.seleccion;
              Logger.log('SELECCION MODULO : '+ modulos + typeof modulos)
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
                      Logger.log("titulos"+ i);
                        if (modulos.localeCompare(arraytitulos[i]) == 0) {
                            data.push("x");
                          Logger.log("TITULO SI");
                            modulosMatriculados.push(arraytitulos[i]);
                        } else {
                                                    Logger.log("TITULO NO");
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

                var arraytitulos = new Array("muper","apmus");
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

                //incio validaciones en el servidor

                var Spreedsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1u6kKPHPb_0-j6Oa8IqJlfD-Vm-QlKsPE48kyb_e4RN0/edit#gid=0");

                var administracion = Spreedsheet.getSheetByName("ADMINISTRACIÓN");
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
              Logger.log("MY DATAAAAAA:",data);
                //fin validaciones en el servidor

                //adicionar a lista de modulos los modulos

                for (x in modulosMatriculados) {
                    if (!addToModule(modulosMatriculados[x], form, Spreedsheet))
                        throw "No se reconoce el modulo seleccionado";
                }

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

                // var mfolder = getCurrentFolder(data.numdoc, mainFolder);
                // var mfiles = mfolder.getFiles();
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



        function buscarPersona(cedula) {
            var dropbox = "semillero 2018";
            var mainFolder,
                folders = DriveApp.getFoldersByName(dropbox);
            mainFolder = folders.next();
            var folder;
            var esta;

            var Spreedsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1u6kKPHPb_0-j6Oa8IqJlfD-Vm-QlKsPE48kyb_e4RN0/edit#gid=0");
            var inscritossheet = Spreedsheet.getSheetByName("INSCRITOS");
            var inscritos = inscritossheet.getSheetValues(
                1,
                1,
                inscritossheet.getLastRow(),
                inscritossheet.getLastColumn()
            );
            for (var person in inscritos) {
                Logger.log('buscando: ' + inscritos[person][3]);
                Logger.log('cedula: ' + cedula);
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
                // swal({
                //     title: 'Advertencia ...',
                //     text: 'La cedula ingresada no corresponde a ningún estudiante',
                //     type: 'warning',
                // });
            }
            esta = false;
            return esta;
        }

        function getSpreadSheet(name, mainFolder) {
            var Spreadsheet,
                files = mainFolder.getFilesByName(name);

            if (files.hasNext()) {
                Spreadsheet = SpreadsheetApp.open(files.next());
            } else {
                Spreadsheet = SpreadsheetApp.create(name);
                var copyFile = DriveApp.getFileById(Spreadsheet.getId());
                mainFolder.addFile(copyFile);
                //sheet = SpreadsheetApp.open(mainFolder.getFileById(sheet.getId()));
                DriveApp.getRootFolder().removeFile(copyFile);
            }

            var activesheet = Spreadsheet.getActiveSheet();
            activesheet.setName("INSCRITOS");

            var numsheet = Spreadsheet.getNumSheets();
            if (numsheet == 1) {
                var adminsheet = Spreadsheet.insertSheet("ADMINISTRACIÓN");
                if (adminsheet.getLastRow() == 0) {
                    adminsheet.appendRow(["ADMINISTRADORES", "PERIODOS"]);
                }
            }

            var modulos = [
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

            if (numsheet == 2) {
                for (x in modulos) {
                    var moduleSheet = Spreadsheet.insertSheet(modulos[x].nombre);
                    if (moduleSheet.getLastRow() == 0) {
                        moduleSheet.appendRow([
                            "nombre",
                            "apellido",
                            "tipo de documento",
                            "número de documento",
                            "telefono",
                            "email",
                            "grado"
                        ]);
                    }
                }
            }

            if (activesheet.getLastRow() == 0) {
                activesheet.appendRow([
                    "nombre",
                    "apellido",
                    "tipo_doc",
                    "num_doc",
                    "ciudad_doc",
                    "email",
                    "tel_fijo",
                    "tel_celular",
                    "depto_res",
                    "ciudad_res",
                    "eps",
                    "colegio",
                    "estamento",
                    "grado",
                    "nombre_acudiente",
                    "tel_acudiente",
                    "inscrito anterior",
                    "convenio",
                    "De los Enteros A los racionales",
                    "Lógica, Conjuntos y Sistemas Numéricos",
                    "Álgebra Fundamental",
                    "Geometría Plana y del Espacio",
                    "Geometría Analítica y Trigonometría",
                    "Probabilidad y Estadística",
                    "Funciones, Sucesiones y Límites",
                    "Energía y Movimiento",
                    "AGE: átomo, gases y estequiometría",
                    "ESE: Estequiometría II, Soluciones y Equilibrio",
                    "BIOQ: Química Organíca y Bioquímica",
                    "Lectura Crítica",
                    "Escritura Creativa",
                    "Música, Percusión y Flauta Dulce",
                    "Apreciación Musical",
                    "periodo",
                    "url_documentos"
                ]);
            }

            return Spreadsheet;
        }

        function getPDFFile(data, validatorFiles) {

            var modulos = [
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
                if (modulos[y].codigo == modulo) {
                    moduleName = modulos[y].nombre;
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

        function addToModule(module, data, spreedsheet) {
          Logger.log("MY MODULE ", module);
          Logger.log("MY DATA ",data);
          Logger.log("MY Spreadsheet ", spreedsheet);

            var modulos = [
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
            for (x in modulos) {
                if (module == modulos[x].codigo) {
                    var moduleSheet = spreedsheet.getSheetByName(modulos[x].nombre);
                    var lastRow = moduleSheet.getLastRow();
                    moduleSheet.appendRow([
                        data.name.toUpperCase(),
                        data.lastname.toUpperCase(),
                        data.tipo,
                        data.numdoc,
                        data.telfijo,
                        data.email.toLowerCase(),
                        data.grado
                    ]);
                    var lastRowRes = moduleSheet.getLastRow();
                    var res = false;

                    if (lastRowRes > lastRow) {
                        res = true;
                    }
                    return res;
                }
            }
            return false;
        }

        function prueba(data) {
            //var hmtlOutput = HtmlService.createHtmlOutputFromFile('form.html');
            //var contenthtml = hmtlOutput.getContent();
            //contenthtml += '<script>document.getElementById("name").value = "My value pruba";</script>';
            // var filetoSend = Utilities.newBlob(data, "text/html", "text.html");
            //
            //
            // MailApp.sendEmail('jhonkrave@gmail.com', 'pruba fomurlario 9', 'Two files are attached.', {
            //    name: 'Automatic Emailer Script',
            //    attachments: [getPDFFile(data)[0]]
            //});
            //
            //
            //
            //
            return data.reciboFile.name;
        }