function sendConfirmationEmail(data, files) {
  Logger.log("=============Sending Email===========");

  var body = getEmailTemplate(data);
  var subModule = "";
  var modules = getModules();

  for (var module in modules) {
    if (modules[module][1] == data.seleccion) {
      subModule = modules[module][0];
    }
  }
  var periodo = getCurrentPeriod()["periodo"];
  var subject = "Inscripción " + periodo + " " + subModule;
  Logger.log("Submodulo");
  Logger.log(subModule);
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: body,
    name: "SEMILLEROS UNIVALLE",
    attachments: files
  });

  var urlFolder = data.url_documentos;
  var links =
    '<p> <strong> Enlace Documentos: </strong> <a href="' +
    urlFolder +
    '"> Carpeta con Documentos del Estudiante</a></p>';
  var adminSubject = subject + " " + data.nombre + " " + data.apellido;
  var adminBody = body + links;

  sendEmailToAdmin(adminSubject, adminBody, files);
  Logger.log("=============END Sending Email===========");
}

function sendEmailToAdmin(subject, body, files) {
  MailApp.sendEmail({
    // to: "andresfelipe9619@gmail.com",
    to: "semillero@correounivalle.edu.co",
    subject: subject,
    htmlBody: body,
    name: "SEMILLEROS UNIVALLE",
    attachments: files
  });
}

function getEmailTemplate(data) {
  var modulos = getModules();

  var contenthtml = "";

  var moduleName = "";
  var modulo = data.seleccion;
  for (var y in modulos) {
    if (modulos[y][1] == modulo) {
      moduleName = modulos[y][0];
    }
  }
  contenthtml += '<div style="text-align:center">';
  contenthtml += "<h3>UNIVERSIDAD DEL VALLE</h3>";
  contenthtml += "<h3>INSCRIPCIÓN SEMILLERO DE CIENCIAS</h3>";
  contenthtml +=
    "<h3>Actualmente se encuentra inscrito en el semillero de ciencias, periodo académico Septiembre - Diciembre de 2020</h3></div>";
  contenthtml +=
    '<p><strong>NOTA: No olvide consultar su salón de clase en nuestra pagina <a href="http://semillerociencias.univalle.edu.co/">Semillero</a> o revisar el correo electrónico donde también serán enviados los listados.</p></strong>';
  contenthtml +=
    "<p><strong>Importante:</strong>Conserve el original del recibo de pago, la cual debe de ser entregado el primer dia de clases a los monitores. ESTA INSCRIPCIÓN NO SERÁ VÁLIDA SIN LA RESPECTIVA VERIFICACIÓN DE SU PAGO</p><hr>";
  contenthtml += "<h3> Modulo: " + moduleName + "</h3>";
  contenthtml +=
    "<p> <strong>Fecha de inscripcion:</strong>	" + new Date() + "</p>";
  contenthtml +=
    "<p> <strong>Nombre completo: </strong>" +
    data.nombre +
    " " +
    data.apellido +
    "</p>";
  contenthtml +=
    "<p> <strong>Documento de identidad:	</strong>" +
    data.tipo_doc +
    " " +
    data.num_doc +
    "</p>";
  contenthtml +=
    "<p> <strong>Ciudad expedición: </strong>" + data.ciudad_doc + "</p>";
  contenthtml += "<p> <strong>Email:	</strong>" + data.email + "</p>";
  contenthtml += "<p> <strong>Telefono: </strong>" + data.tel_fijo + "</p>";
  contenthtml += "<p> <strong>Celular: 	</strong>" + data.tel_celular + "</p>";
  contenthtml +=
    "<p> <strong>Ciudad residencia:	 </strong>" + data.ciudad_res + "</p>";
  contenthtml += "<p> <strong>Eps: </strong>" + data.eps + "</p>";
  contenthtml +=
    "<p> <strong>Institucion educativa: </strong>" + data.colegio + "</p>";
  contenthtml += "<p> <strong>Modalidad:  </strong>" + data.estamento + "</p>";
  contenthtml += "<p> <strong>Grado:	</strong>" + data.grado + "</p>";
  contenthtml +=
    "<p> <strong>Acudiente:  </strong>" + data.nombre_acudiente + "</p>";
  contenthtml +=
    "<p> <strong>Telefono nombre_acudiente: </strong>" +
    data.tel_acudiente +
    "</p>";

  if (!!(data.curso_anterior || "").trim()) {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" +
      data.inscrito_anterior +
      "</p>";
  } else {
    contenthtml +=
      "<p> <strong>Inscrito anteriormente: </strong>" +
      data.curso_anterior +
      "</p>";
  }
  contenthtml += "<p> <strong>Convenio: </strong>" + data.convenio + "</p>";
  contenthtml +=
    "<p> <strong>Costo del curso:  </strong>" + data.val_consignar + "</p>";
  contenthtml +=
    '<strong style="font-size: 2em;">RECUERDA QUE ESTA INSCRIPCIÓN NO SERÁ VÁLIDA SIN LA RESPECTIVA VERIFICACIÓN DE SU PAGO</strong>';
  contenthtml +=
    '<p> <strong><a href="' + data.link + '">Enlace de pago</a></strong></p>';

  return contenthtml;
}
