//<script>
let currentPeriod = null;
let filesByname = {};
const PRICE_DATA = { estate: null, moduleCode: null, agreement: null };
const MODULES = { byGrades: null, all: null, byArea: null };
$(document).ready(runApp);

function runApp() {
  fetchCurrentPeriodData();
  fetchModulesByGrades();
  setTimeout(() => {
    authenticateCurrentUser();
    populateDepartments();
    subscribeEventHandlers();
    setTimeout(getRequestPayload, 1500);
  }, 1500);
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
  console.log("Current Period Data", data);
  currentPeriod = data.currentPeriod;
  MODULES.all = data.modules;
  loadModules();
}

function loadModules() {
  const modulesByArea = MODULES.all
    .filter(module => module.disabled !== "x")
    .reduce((acc, module) => {
      let { area } = module;
      if (acc[area]) {
        acc[area].push(module);
      } else {
        acc[area] = [module];
      }
      return acc;
    }, {});
  MODULES.byArea = modulesByArea;
  setModulesSelectionHTML(modulesByArea);
  populateModulesSelect(MODULES.all);
}

const authenticateCurrentUser = () =>
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
  $("#myForm #edit").on("click", editStudentData);
  $("#email").on("copy cut paste", DoNotCopyPaste);
  $("#myForm #createEmail").on("click", createEmail);
  $("#myForm #grado").on("change", hadleChangeGrade);
  $("input[type='file']").on("change", handleFileChange);
  $("#confirmEmail").on("copy cut paste", DoNotCopyPaste);
  $("#myForm #estamento").on("change", handleChangeEstate);
  $("#curso_anterior").on("change", handleChangeAnotherGrade);
  $("#val_consignado").on("change", handleChangePriceData);
  $("#inscrito_anterior").on("change", handleChangePreviousRegister);
  $("#myForm").on("click", 'input[name="convenio"]', handleClickAgreement);
}

function onSuccessGrades(modules) {
  console.log("modules", modules);
  if (!modules) return;
  MODULES.byGrades = modules;
}

function enrollStudent(e) {
  let isAgree = isAgreeWithTerms();
  if (isAgree) return validateAndSave();
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
  PRICE_DATA.agreement = val;
  handleChangePriceData();
  if (val === "RELACION_UNIVALLE") return showUnivalleRelationFiles();
  if (val === "BECADOS") return showScholarshipFiles();

  hideStudyCertificate();
  hideScholarshipFiles();
  $("#myForm #pdfRecibo").fadeIn();
  $("#myForm #reciboFile").prop("disabled", false);
}

function handleChangeModule() {
  let moduleCode = $(this).val();
  PRICE_DATA.moduleCode = moduleCode;
  handleChangePriceData();
}

function handleChangePriceData() {
  const { moduleCode, estate, agreement } = PRICE_DATA;
  const module = MODULES.all.find(m => m.codigo === moduleCode);
  console.log("{module, estate}", { module, estate });
  if (!module || !estate) return;
  let price = 0;
  let payed = $("#val_consignado").val();
  if (estate === "PRIVADO") price = module.precio_privado;
  if (estate === "PUBLICO") price = module.precio_publico;
  if (estate === "COBERTURA") price = module.precio_cobertura;
  //Univalle and scolarship overrides whatever estate is selected
  if (agreement === "RELACION_UNIVALLE") price = module.precio_univalle;
  if (agreement === "BECADOS") {
    price = 0;
    $("#val_consignado").val(0);
  }
  let diff = +payed - +price;
  if (diff > 0) {
    $("#dif_consignado").removeClass("negative");
    diff = 0;
  } else if (diff < 0) {
    $("#dif_consignado").removeClass("positive");
    $("#dif_consignado").addClass("negative");
  } else {
    $("#dif_consignado").removeClass("positive");
    $("#dif_consignado").removeClass("negative");
  }
  $("#dif_consignado").val(diff);
  $("#val_consignar").val(price);
}

function handleChangeEstate() {
  let estate = $(this).val();
  PRICE_DATA.estate = estate;
  handleChangePriceData();
  let grado = $("#grado").val();
  if (estate === "PUBLICO" || estate === "COBERTURA") {
    if (grado === "EGRESADO") return showGraduateFiles();
    showStudyCertificate();
    hideGraduateFiles();
    return;
  }
  if (estate === "PRIVADO") {
    if (grado === "EGRESADO") return showGraduateFiles();
    hideStudyCertificate();
    hideGraduateFiles();
    return;
  }
  return hideStudyCertificate();
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
  let estate = $("#estamento").val();
  hideModules();
  if (grade in MODULES.byGrades) {
    showModules(grade);
    showFiles({ grade, estate });
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
    val_consignado: "500000",
    val_consignar: "300000",
    recibo_consignacion: "999999",
    fecha_consignacion: "2020-01-20"
  };
  fillInDataInForm({ data: testPerson });
}
//</script>
