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
  contenthtml += "<h3>INSCRIPCIÓN</h3>";
  contenthtml += "<h3>SEMILLERO UNIVERSIDAD DEL VALLE</h3>";
  contenthtml +=
    "<h3>Actualmente se encuentra inscrito(a) en el Semillero Universidad del Valle para el primer periodo académico del 2021</h3></div>";
  contenthtml +=
    '<p><strong>NOTA: Durante el primer periodo académico del 2021, toda la información con respecto a la confirmación de su matrícula, el calendario académico,  el inicio y las citaciones de las clases,  la programación de las actividades curriculares y el material académico, serán enviados al correo electrónico que registró en esta inscripción.</strong></p>';
   contenthtml +=
    "<p><strong>Importante: </strong>Esta inscripción no será válida sin la respectiva verificación de su pago. Una vez realizada la verificación recibirá una confirmación de su matrícula por parte de la Coordinación General del Semillero Universidad del Valle. Por favor conserve su recibo de pago.</p><hr>";
  contenthtml += "<h3> Módulo: " + moduleName + "</h3>";
  contenthtml +=
    "<p> <strong>Fecha de Inscripcion:</strong>	" + new Date() + "</p>";
  contenthtml +=
    "<p> <strong>Nombre Completo: </strong>" +
    data.nombre +
    " " +
    data.apellido +
    "</p>";
  contenthtml +=
    "<p> <strong>Documento de Identidad:	</strong>" +
    data.tipo_doc +
    " " +
    data.num_doc +
    "</p>";
  contenthtml +=
    "<p> <strong>Ciudad de Expedición: </strong>" + data.ciudad_doc + "</p>";
  contenthtml += "<p> <strong>Email:	</strong>" + data.email + "</p>";
  contenthtml += "<p> <strong>Teléfono: </strong>" + data.tel_fijo + "</p>";
  contenthtml += "<p> <strong>Celular: 	</strong>" + data.tel_celular + "</p>";
  contenthtml +=
    "<p> <strong>Ciudad Residencia:	 </strong>" + data.ciudad_res + "</p>";
  contenthtml += "<p> <strong>EPS: </strong>" + data.eps + "</p>";
  contenthtml +=
    "<p> <strong>InstituciÓn Educativa: </strong>" + data.colegio + "</p>";
  contenthtml += "<p> <strong>Modalidad:  </strong>" + data.estamento + "</p>";
  contenthtml += "<p> <strong>Grado:	</strong>" + data.grado + "</p>";
  contenthtml +=
    "<p> <strong>Acudiente:  </strong>" + data.nombre_acudiente + "</p>";
  contenthtml +=
    "<p> <strong>Teléfono del Acudiente: </strong>" +
    data.tel_acudiente +
    "</p>";
  if (!!(data.curso_anterior || "").trim()) {
    contenthtml +=
      "<p> <strong>Inscrito Anteriormente: </strong>" +
      data.inscrito_anterior +
      "</p>";
  } 
  contenthtml += "<p> <strong>Convenio: </strong>" + data.convenio + "</p>";
  contenthtml +=
    "<p> <strong>Costo del Curso:  </strong>" + data.val_consignar + "</p>";
  contenthtml +=
    '<strong style="font-size: 2em;">RECUERDA QUE ESTA INSCRIPCIÓN NO SERÁ VÁLIDA SIN LA RESPECTIVA VERIFICACIÓN DE SU PAGO</strong>';
  contenthtml +=
    '<p> <strong><a href="' + data.link + '">Enlace de pago</a></strong></p>';

  return contenthtml;
}
