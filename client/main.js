//<script>
let modulesByGrades = null;
let currentPeriod = null;
let filesByname = {};
$(document).ready(runApp);

function runApp() {
  subscribeEventHandlers();
  fetchModulesByGrades();
  fetchCurrentPeriodData();
  setTimeout(() => {
    AuthenticateCurrentUser();
    populateDepartments();
    setTimeout(getRequestPayload, 1500);
  }, 1000);
  // hideInitialData();
}

const fetchModulesByGrades = () =>
  google.script.run
    .withSuccessHandler(onSuccessGrades)
    .withFailureHandler(errorHandler)
    .getModulesByGrades();

const fetchCurrentPeriodData = () =>
  google.script.run
    .withSuccessHandler(loadCurrentPeriodData)
    .withFailureHandler(errorHandler)
    .getCurrentPeriodData();

function loadCurrentPeriodData(data) {
  if (!data) return;
  currentPeriod = data.currentPeriod;
  console.log("data", data);
  // let currentModules = data.modules;
  // $(`#myForm ${selector}`).fadeIn();
}

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
  console.log("modules", modules);
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
  if (myres.includes("SI")) return $("#curso_anterior").css("display", "block");
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

async function editStudentData() {
  let valid = validateAndSave();

  let onSuccess = function(person) {
    $("#save").attr("disabled", false);
    swal({
      title: "Exito!",
      text: "Se edito el estudiante satisfactoriamente!",
      type: "success",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    });
  };
  if (!valid) return;
  const form = $("#myForm");
  const dataToEdit = await getFormData(form);
  $("#save").attr("disabled", true);

  google.script.run
    .withSuccessHandler(onSuccess)
    .withFailureHandler(errorHandler)
    .editStudent(JSON.stringify(dataToEdit));
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

function loadStudent(personData) {
  console.log("Person", personData);
  const person = JSON.parse(personData);
  setDefaultCursor();
  if (!person) {
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

function showEditButton() {
  $("#myForm #save").css("display", "none");
  $("#myForm #edit").css("display", "block");
}

function fillInStudentData(person) {
  setWaitCursor();
  showStudentRecord();
  showEditButton();
  fillInDataInForm(person);
  setDefaultCursor();
}

function fillInDataInForm(person) {
  const { data } = person;
  const selects = ["depto_res", "grado"];
  for (prop in data) {
    $(`#${prop}`).val(String(data[prop]));
    if (selects.includes(prop)) {
      $(`#${prop}`).trigger("change");
    }
  }
  $("#confirmEmail").val(data.email);
  if (data.terminos === "Acepto") {
    $("#terminos").prop("checked", true);
  }
  $("#confirmEmail").val(data.email);
  if (data.otraeps) {
    $("#eps").val("OTRA");
    $("#eps").trigger("change");
    $("#otraeps").val(data.eps);
  }
  if (data.inscrito_anterior !== "NO") {
    console.log("atleast");
    $("#inscrito_anterior").val("SI");
    $("#inscrito_anterior").trigger("change");
    $("#curso_anterior").val(data.inscrito_anterior);
    $("#curso_anterior").trigger("change");
  }

  if (data.convenio) {
    let convenio = data.convenio.toLowerCase();
    $("#" + convenio).prop("checked", true);
    $("#" + convenio).trigger("change");
  }
  var periodName = currentPeriod;
  if (data[periodName]) {
    google.script.run
      .withSuccessHandler(onSuccess)
      .withFailureHandler(errorHandler)
      .getModules();
    function onSuccess(modules) {
      for (let x in modules) {
        if (modules[x][0] === data[periodName]) {
          const moduleCode = modules[x][1];
          $("#" + moduleCode).prop("checked", true);
          $("#" + moduleCode).trigger("change");
        }
      }
    }
  }
}

async function getFormData($form) {
  var serializedForm = $form.serializeArray();
  var formData = {};

  $.map(serializedForm, function(input, i) {
    formData[input["name"]] = input["value"];
  });

  const filesPromises = Object.keys(filesByname).map(fileKey => {
    const doc = formData.num_doc;
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
  $("#save").attr("disabled", false);
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
  const testPerson = {
    "2018A": "-",
    "2018B": "-",
    "2019A": "Música, Percusión y Flauta Dulce - Apreciación Musical",
    "2019B": "Funciones, Sucesiones y Límite",
    "2020A": "De los Enteros A los racionales",
    "2020B": "-",
    "2021A": "-",
    "2021B": "-",
    "2022A": "-",
    "2022B": "-",
    "2023A": "-",
    "2023B": "-",
    apellido: "SUAREZ",
    ciudad_doc: "CALI",
    depto_res: "VALLE DEL CAUCA",
    ciudad_res: "CALI",
    colegio: "CHINCA",
    convenio: "PARTICULAR",
    email: "andresfelipe9619@gmail.com",
    eps: "EPS SURAMERICANA S.A.",
    estamento: "PRIVADO",
    genero: "M",
    grado: "7",
    inscrito_anterior: "NO",
    nacimiento: "1996-11-25",
    nombre: "ANDRES",
    nombre_acudiente: "JULI",
    num_doc: "1144093949",
    tel_acudiente: "1111",
    tel_celular: "11111",
    tel_fijo: "2222",
    terminos: "Acepto",
    tipo_doc: "C.C",
    url_documentos: "folderUrl",
    val_consignado: "500000"
  };
  fillInDataInForm({ data: testPerson });
}
//</script>
