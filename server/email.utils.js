function sendConfirmationEmail(data, files) {
  var filetoSend = getPDFFile(data);
  var subModule = "";
  var modules = getModules();
  var mainFolder = getMainFolder();

  for (var module in modules) {
    if (modules[module][1] == data.seleccion) {
      subModule = modules[module][0];
    }
  }
  var periodo = getCurrentPeriod();
  Logger.log("Submodulo");
  Logger.log(subModule);
  MailApp.sendEmail({
    to: data.email,
    subject: "Inscripción " + periodo[0] + " " + subModule,
    htmlBody: filetoSend,
    name: "SEMILLEROS UNIVALLE",
    attachments: files
  });

  var links = "";
  var stFolder = getCurrentFolder(data.num_doc, mainFolder);
  var stFiles = stFolder.getFiles();
  Logger.log("last files: " + stFiles);

  var urlFolder = stFolder.getUrl();

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
      data.name.toUpperCase() +
      " " +
      data.lastname.toUpperCase(),
    htmlBody: filetoSend + links,
    name: "SEMILLEROS UNIVALLE",
    attachments: lastFiles
  });
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
    data.num_doc +
    "</p>";
  contenthtml +=
    "<p> <strong>Ciudad expedición: </strong>" +
    data.ciudad_doc.toUpperCase() +
    "</p>";
  contenthtml += "<p> <strong>Email:	</strong>" + data.email + "</p>";
  contenthtml += "<p> <strong>Telefono: </strong>" + data.tel_fijo + "</p>";
  contenthtml += "<p> <strong>Celular: 	</strong>" + data.tel_celular + "</p>";
  contenthtml +=
    "<p> <strong>Ciudad residencia:	 </strong>" +
    data.ciudad_res.toUpperCase() +
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
    "<p> <strong>Acudiente:  </strong>" + data.nombre_acudiente.toUpperCase() + "</p>";
  contenthtml +=
    "<p> <strong>Telefono nombre_acudiente: </strong>" + data.telacudiente + "</p>";

  if (
    data.inscrito_anterior === null ||
    data.inscrito_anterior === " " ||
    data.inscrito_anterior === ""
  ) {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" +
      data.inscritoanterior +
      "</p>";
  } else {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" + data.inscrito_anterior + "</p>";
  }

  contenthtml += "<p> <strong>Convenio: </strong>" + data.convenio + "</p>";

  return contenthtml;
}
