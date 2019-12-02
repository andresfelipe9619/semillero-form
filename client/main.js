//<script>
let modulesByGrades = null;
let filesByname = {};
$(document).ready(runApp);

function runApp() {
  subscribeEventHandlers();
  fetchModulesByGrades();
  setTimeout(() => {
    AuthenticateCurrentUser();
    populateCountries("depto_res", "ciudad_res");
    setTimeout(getRequestPayload, 1000);
  }, 1000);
  // hideInitialData();
}

const fetchModulesByGrades = () =>
  google.script.run
    .withSuccessHandler(onSuccessGrades)
    .withFailureHandler(errorHandler)
    .getModulesByGrades();

const AuthenticateCurrentUser = () =>
  google.script.run
    .withSuccessHandler(onSuccessAuth)
    .withFailureHandler(errorHandler)
    .isAdmin();

function onSuccessAuth(isAdmin) {
  if (!isAdmin) return hideAdminData();
  return showSearchModule();
}

function subscribeEventHandlers() {
  $("#eps").on("change", handleChangeEps);
  $("#myForm #save").on("click", enrollStudent);
  $(".numeric").on("keypress", allowOnlyNumbers);
  $("input[type='file']").on("change", handleFileChange);
  $("#myForm #edit").on("click", editStudentData);
  $("#email").on("copy cut paste", DoNotCopyPaste);
  $("#myForm #createEmail").on("click", createEmail);
  $("#myForm #grado").on("change", hadleChangeGrade);
  $("#curso_anterior").on("change", handleChangeAnotherGrade);
  $("#confirmEmail").on("copy cut paste", DoNotCopyPaste);
  $("#myForm #estamento").on("change", handleChangeEstate);
  $("#inscrito_anterior").on("change", handleChangePreviousRegister);
  $("#myForm").on("click", 'input[name="convenio"]', handleClickAgreement);
}

function onSuccessGrades(modules) {
  if (!modules) return;
  modulesByGrades = modules;
}

function enrollStudent(e) {
  if (isAgreeWithTerms()) return validateAndSave();
  e.preventDefault();
  swal({
    title: "Advertencia",
    text: "Debe aceptar los términos y condiciones para enviar el formulario.",
    type: "warning",
    confirmButtonText: "Ok",
    closeOnConfirm: true
  });
}

function isAgreeWithTerms() {
  const terminos = $("input[name=terminos]:checked", "#myForm").val();
  return terminos === "Acepto";
}

function handleFileChange(e) {
  const { name } = e.target;
  const file = this.files[0];
  filesByname[name] = file;
  console.log("filesByname", filesByname);
}

function handleClickAgreement() {
  let val = $(this).val();
  if (val === "RELACION_UNIVALLE") {
    $("#myForm #pdfContanciaFun").fadeIn();
    $("#myForm #constanciaFuncFile").prop("disabled", false);
    $("#myForm #pdfRecibo").fadeIn();
    $("#myForm #reciboFile").prop("disabled", false);
    $("#myForm #pdfRecibos").fadeOut();
    $("#myForm #pdfCartaSolicitud").fadeOut();
    $("#myForm #recibosPublicos").prop("disabled", true);
    $("#myForm #cartaSolicitud").prop("disabled", true);
  } else if (val === "BECADOS") {
    $("#myForm #pdfRecibos").fadeIn();
    $("#myForm #pdfCartaSolicitud").fadeIn();
    $("#myForm #recibosPublicos").prop("disabled", false);
    $("#myForm #cartaSolicitud").prop("disabled", false);
    $("#myForm #pdfRecibo").fadeOut();
    $("#myForm #reciboFile").prop("disabled", true);
    $("#myForm #pdfContanciaFun").fadeOut();
    $("#myForm #constanciaFuncFile").prop("disabled", true);
  } else {
    $("#myForm #pdfContanciaFun").fadeOut();
    $("#myForm #constanciaFuncFile").prop("disabled", true);
    $("#myForm #pdfRecibos").fadeOut();
    $("#myForm #pdfCartaSolicitud").fadeOut();
    $("#myForm #recibosPublicos").prop("disabled", true);
    $("#myForm #cartaSolicitud").prop("disabled", true);
    $("#myForm #pdfRecibo").fadeIn();
    $("#myForm #reciboFile").prop("disabled", false);
  }
}

function handleChangeEstate() {
  let val = $(this).val();
  let grado = $("#grado").val();
  if (val === "PUBLICO" || val === "COBERTURA") {
    if (grado === "EGRESADO") {
      $("#myForm #pdfActaGrado").fadeIn();
      $("#myForm #actaGrado").prop("disabled", false);
      $("#myForm #pdfConstanciaEstu").fadeOut();
      $("#myForm #constanciaEstudFile").prop("disabled", true);
    } else {
      $("#myForm #pdfConstanciaEstu").fadeIn();
      $("#myForm #constanciaEstudFile").prop("disabled", false);
      $("#myForm #pdfActaGrado").fadeOut();
      $("#myForm #actaGrado").prop("disabled", true);
    }
  } else if (val === "PRIVADO") {
    if (grado === "EGRESADO") {
      $("#myForm #pdfActaGrado").fadeIn();
      $("#myForm #actaGrado").prop("disabled", false);
      $("#myForm #pdfConstanciaEstu").fadeOut();
      $("#myForm #constanciaEstudFile").prop("disabled", true);
    } else {
      $("#myForm #pdfConstanciaEstu").fadeOut();
      $("#myForm #constanciaEstudFile").prop("disabled", true);
      $("#myForm #pdfActaGrado").fadeOut();
      $("#myForm #actaGrado").prop("disabled", true);
    }
  } else {
    $("#myForm #pdfConstanciaEstu").fadeOut();
    $("#myForm #constanciaEstudFile").prop("disabled", true);
  }
}
const createEmail = () =>
  window.open(
    "https://accounts.google.com/SignUp?service=mail&hl=es&continue=http%3A%2F%2Fmail.google.com%2Fmail%2F%3Fpc%3Des-ha-latam-co-bk-xplatform1&utm_campaign=es&utm_source=es-ha-latam-co-bk-xplatform1&utm_medium=ha"
  );

function handleChangeEps() {
  let epsval = this.value;
  if (epsval.includes("OTRA")) return $("#otraeps").css("display", "block");
  $("#otraeps").css("display", "none");
}

function hadleChangeGrade() {
  let anterior = $("#curso_anterior").val();
  console.log("MI ANTERIOR: ", anterior);
  let grade = String(this.value).toLocaleLowerCase();
  console.log("grade", grade);
  let state = $("#estamento").val();
  hideModules();
  if (grade in modulesByGrades) {
    showModules(grade);
    showFiles({ grade, state });
  }
}
function handleChangePreviousRegister() {
  let myres = this.value;
  if (myres.includes("SI"))
    return $("#curso_anterior").css("display", "block");
  $("#curso_anterior").css("display", "none");
}
function handleChangeAnotherGrade() {
  let grado = $("#myForm #grado").val();
  let val = this.value;
  if (
    (val.indexOf("racional") || val.indexOf("Conjuntos")) &&
    (grado == 6 || grado == 7)
  ) {
    $("#myForm #modMatematicas").fadeIn();
    $("#myForm #modMatematicas .input-div")
      .children()
      .fadeIn();
    $("#myForm #modFisica").fadeOut();
    $("#myForm #modQuimica").fadeOut();
    $("#myForm #modArtes").fadeOut();
    $("#myForm #modArtes #temamuper").fadeOut();
    $("#myForm #modHumanidades").fadeOut();
  } else if ((grado == 6 || grado == 7) && (val == "" || val == " ")) {
    $("#myForm #modMatematicas").fadeIn();
    $("#myForm #modMatematicas .input-div")
      .children()
      .fadeOut();
    $("#myForm #modMatematicas .input-div")
      .children("#temaentrac")
      .fadeIn();
    $("#myForm #modMatematicas .input-div")
      .children("#temalogcon")
      .fadeIn();
    $("#myForm #modMatematicas .input-div")
      .children("#temaalgfun")
      .fadeOut();
    $("#myForm #modMatematicas .input-div")
      .children("#temageopl")
      .fadeOut();
    $("#myForm #modFisica").fadeOut();
    $("#myForm #modQuimica").fadeOut();
    $("#myForm #modArtes").fadeIn();
    $("#myForm #modArtes #temamuper").fadeOut();
    $("#myForm #modHumanidades").fadeOut();
  }
}

function editStudentData() {
  let valid = validateAndSave();

  let onSuccess = function(person) {
    swal({
      title: "Exito!",
      text: "Se edito el estudiante satisfactoriamente!",
      type: "success",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    });
  };
  if (!valid) return;
  let serialized = $("#myForm").serializeArray();
  let dataToEdit = [];

  for (let x in serialized) {
    if (x == 7) {
      dataToEdit.push(serialized[Number(x) + 1].value);
      dataToEdit.push(serialized[x].value);
    } else if (
      x != 6 &&
      x != 8 &&
      serialized[x].value != "" &&
      serialized[x].value != "OTRA" &&
      serialized[x].value != "SI"
    ) {
      dataToEdit.push(serialized[x].value);
    }
  }

  google.script.run
    .withSuccessHandler(onSuccess)
    .withFailureHandler(errorHandler)
    .editStudent(dataToEdit);
}

function cargarInfo() {
  try {
    let ced = $("#cedula_buscada").val();
    hideStudentRecord();
    if (!ced) {
      return swal({
        title: "Advertencia ...",
        text: "Ingrese una cedula para consultar",
        type: "warning"
      });
    }
    setWaitCursor();
    searchPerson(ced);
  } catch (error) {
    errorHandler(error);
  }
}

const searchPerson = id =>
  google.script.run
    .withSuccessHandler(loadStudent)
    .withFailureHandler(errorHandler)
    .buscarPersona(id);

function loadStudent(person) {
  console.log("Person", person);
  if (!person) {
    setDefaultCursor();
    return swal({
      title: "Advertencia ...",
      text: "La cedula ingresada no corresponde a ningún estudiante",
      type: "warning"
    });
  }
  if (person.state === "antiguo") {
    return swal({
      title: "Advertencia ...",
      text:
        "El estudiante esta inscrito anteriormente, pero no el periodo actual ",
      type: "warning"
    });
  }
  if (person.state === "actual") return fillInStudentData(person);
}

function fillInStudentData(person) {
  setWaitCursor();
  showStudentRecord();
  $("#myForm #save").css("display", "none");
  $("#myForm #edit").css("display", "block");
  $("#name").val(String(person.data[0]));
  $("#lastname").val(String(person.data[1]));
  $("#tipo_doc").val(String(person.data[2]));
  $("#num_doc").val(String(person.data[3]));
  $("#ciudad_doc").val(String(person.data[4]));
  $("#email").val(String(person.data[5]));
  $("#confirmEmail").val(String(person.data[5]));
  $("#tel_fijo").val(String(person.data[6]));
  $("#tel_celular").val(String(person.data[7]));
  $("#depto_res").val(String(person.data[8]));
  $("#depto_res").trigger("change");
  $("#ciudad_res").val(String(person.data[9]));
  $("#eps").val(String(person.data[10]));
  $("#colegio").val(String(person.data[11]));
  $("#estamento").val(String(person.data[12]));
  $("#grado").val(String(person.data[13]));
  $("#grado").trigger("change");
  $("#nombre_acudiente").val(String(person.data[14]));
  $("#tel_acudiente").val(String(person.data[15]));
  console.log("eps", $("#eps").val());
  if (!$("#eps").val()) {
    $("#eps").val("OTRA");
    $("#eps").trigger("change");
    $("#otraeps").val(String(person.data[10]));
  }
  if (String(person.data[16]) != "NO") {
    console.log("atleast");
    $("#inscrito_anterior").val("SI");
    $("#inscrito_anterior").trigger("change");
    $("#curso_anterior").val(String(person.data[16]));
    $("#curso_anterior").trigger("change");
  }

  if (String(person.data[17])) {
    //convenio
    let convenio = person.data[17].toLowerCase();
    $("#" + convenio).prop("checked", true);
    $("#" + convenio).trigger("change");
  }

  if (String(person.data[18])) {
    $("#val_consignado").val(String(person.data[18]));
  }
  if (String(person.data[person.data.length - 4])) {
    //modulos.
    //IMPORTANTE:
    //CADA VEZ QUE SE AÑADA UN NUEVO CAMPO AL FORMULARIO, SE DEBE REVISAR ESTE CONDICIONAL.
    //AÑADIR SIEMPRE EL NUEVO CAMPO ANTES DE LA CARGA DE LA URL DE LOS ARCHIVOS EN LA HOJA DE
    //CALCULO.
    google.script.run
      .withSuccessHandler(onSuccess)
      .withFailureHandler(errorHandler)
      .getModules();
    function onSuccess(modules) {
      for (let x in modules) {
        if (modules[x][0] == person.data[person.data.length - 4]) {
          $("#" + modules[x][1]).prop("checked", true);
          $("#" + modules[x][1]).trigger("change");
        }
      }
    }
  }
  setDefaultCursor();
}

async function getFormData($form) {
  var serializedForm = $form.serializeArray();
  var formData = {};

  $.map(serializedForm, function(input, i) {
    formData[input["name"]] = input["value"];
  });

  const filesPromises = Object.keys(filesByname).map(fileKey => {
    const doc = formData.num_doc
    return new Promise(async resolve => {
      const fileString = await getFile(filesByname[fileKey]);
      const file = { base64: fileString, name: getFileName(fileKey, doc) };
      resolve(file);
    });
  });

  const files = await Promise.all(filesPromises);
  formData = Object.assign({}, formData, { files });
  console.log("formData", formData);
  return formData;
}

const getFileName = (fileKey, doc) => {
  if (fileKey === "docFile") {
    return `${doc}_DOCUMENTO`;
  }
  if (fileKey === "constanciaEstudFile") {
    return `${doc}_COSNTANCIA_ESTUDIO`;
  }
  if (fileKey === "reciboFile") {
    return `${doc}_RECIBO_PAGO`;
  }
  if (fileKey === "constanciaFuncFile") {
    return `${doc}_CONSTANCIA_FUNCIONARIO`;
  }
  if (fileKey === "recibosPublicos") {
    return `${doc}_RECIBO_PUBLICOS`;
  }
  if (fileKey === "cartaSolicitud") {
    return `${doc}_CARTA_SOLICITUD`;
  }
  if (fileKey === "actaGrado") {
    return `${doc}_ACTA_GRADO`;
  }
};

function getRequestPayload() {
  google.script.url.getLocation(function(location) {
    let payload = location.parameter.test || null;
    if (payload) return fillInTestData();
  });
}

function getFile(file) {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onerror = function(event) {
      reader.abort();
      errorHandler(event);
    };
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function errorHandler(error) {
  console.log("Error Handler ==>", error);
  setDefaultCursor();
  swal({
    title: "Error",
    text: String(error),
    type: "error",
    confirmButtonText: "Ok",
    closeOnConfirm: true
  });
}

function fileUploaded(status) {
  console.log("Estatus", status);
  if (status === "exito") {
    swal({
      title: "Exito!",
      text:
        "La inscripción se realizó satisfactoriamente!\nRecibiras un correo para confirmar los datos de tu inscripcion.\nFavor entregar el recibo original el primer dia de clases a los monitores",
      type: "success",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    });
    $("#mySpan").fadeOut();
    setDefaultCursor();
    return;
  }
  swal("Error", status, "error");
  $("#mySpan").fadeOut();
  setDefaultCursor();
}

function fillInTestData() {
  showStudentRecord();
  const testPerson = [
    "ANDRES",
    "SUAREZ",
    "C.C",
    1144093949,
    "CALI",
    "andresfelipe9619@gmail.com",
    2222,
    11111,
    "VALLE DEL CAUCA",
    "CALI",
    "EPS SURAMERICANA S.A.",
    "CHINCA",
    "PRIVADO",
    7,
    "JULI",
    1111,
    "NO",
    "PARTICULAR",
    500000,
    "Acepto",
    "2019B",
    "Taller infantil de Teatro"
  ];
  $("#myForm #save").css("display", "block");
  $("#myForm #edit").css("display", "none");
  $("#name").val(String(testPerson[0]));
  $("#lastname").val(String(testPerson[1]));
  $("#tipo_doc").val(String(testPerson[2]));
  $("#num_doc").val(String(testPerson[3]));
  $("#ciudad_doc").val(String(testPerson[4]));
  $("#email").val(String(testPerson[5]));
  $("#confirmEmail").val(String(testPerson[5]));
  $("#tel_fijo").val(String(testPerson[6]));
  $("#tel_celular").val(String(testPerson[7]));
  $("#depto_res").val(String(testPerson[8]));
  $("#depto_res").trigger("change");
  $("#ciudad_res").val(String(testPerson[9]));
  $("#eps").val(String(testPerson[10]));
  $("#colegio").val(String(testPerson[11]));
  $("#estamento").val(String(testPerson[12]));
  $("#grado").val(String(testPerson[13]));
  $("#grado").trigger("change");
  $("#nombre_acudiente").val(String(testPerson[14]));
  $("#tel_acudiente").val(String(testPerson[15]));
  console.log("eps", $("#eps").val());
  if (!$("#eps").val()) {
    $("#eps").val("OTRA");
    $("#eps").trigger("change");
    $("#otraeps").val(String(testPerson[10]));
  }
  if (String(testPerson[16]) != "NO") {
    console.log("atleast");
    $("#inscrito_anterior").val("SI");
    $("#inscrito_anterior").trigger("change");
    $("#curso_anterior").val(String(testPerson[16]));
    $("#curso_anterior").trigger("change");
  }

  if (String(testPerson[17])) {
    //convenio
    let convenio = testPerson[17].toLowerCase();
    $("#" + convenio).prop("checked", true);
    $("#" + convenio).trigger("change");
  }

  if (String(testPerson[18])) {
    $("#val_consignado").val(String(testPerson[18]));
  }
}
//</script>
