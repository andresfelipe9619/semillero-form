//   <script>

let modulesByGrades = null;
let filesByname = {};
$(document).ready(runApp);

function runApp() {
  subscribeEventHandlers();
  fetchModulesByGrades();
  setTimeout(() => {
    AuthenticateCurrentUser();
    populateCountries("deptres", "ciudadres");
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

function hideAdminData() {
  $("#modBusqueda").hide();
  showForm();
  hideInitialData();
}

function showSearchModule() {
  $("#modBusqueda").fadeIn();
  hideInitialData();
}

function hideInitialData() {
  $("#myForm #pdfConstanciaEstu").hide();
  $("#myForm #pdfContanciaFun").hide();
  $("#myForm #pdfRecibos").hide();
  $("#myForm #pdfCartaSolicitud").hide();
  $("#myForm #pdfActaGrado").hide();
  $("#myForm #modMatematicas").hide();
  $("#myForm #modMatematicas #checkboxMate")
    .children()
    .hide();
  $("#myForm #modFisica").hide();
  $("#myForm #modQuimica").hide();
  $("#myForm #modBiologia").hide();
  $("#myForm #modHumanidades").hide();
  $("#myForm #modArtes").hide();
  $("#myForm #modNas").hide();
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
  $("#otrocurso").on("change", handleChangeAnotherGrade);
  $("#confirmEmail").on("copy cut paste", DoNotCopyPaste);
  $("#myForm #estamento").on("change", handleChangeEstate);
  $("#inscritoanterior").on("change", handleChangePreviousRegister);
  $("#myForm").on("click", 'input[name="convenio"]', handleClickAgreement);
}

function onSuccessGrades(modules) {
  if (!modules) return;
  modulesByGrades = modules;
}

function enrollStudent(e) {
  let terminos = $("input[name=terms]:checked", "#myForm").val();
  console.log(terminos);
  if (terminos === "Acepto") return validateAndSave();
  e.preventDefault();
  swal({
    title: "Advertencia",
    text: "Debe aceptar los términos y condiciones para enviar el formulario.",
    type: "warning",
    confirmButtonText: "Ok",
    closeOnConfirm: true
  });
}

function handleFileChange(e) {
  const { name } = e.target;
  const file = this.files[0];
  filesByname[name] = file;
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
  let anterior = $("#otrocurso").val();
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
  if (myres.includes("SI")) return $("#otrocurso").css("display", "block");
  $("#otrocurso").css("display", "none");
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
      (serialized[x].value != "" &&
        serialized[x].value != "OTRA" &&
        serialized[x].value != "SI")
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
}

const searchPerson = id =>
  google.script.run
    .withSuccessHandler(loadStudent)
    .withFailureHandler(errorHandler)
    .buscarPersona(id);

const allowOnlyNumbers = e =>
  e.metaKey || // cmd/ctrl
  e.which <= 0 || // arrow keys
  e.which == 8 || // delete key
  /[0-9]/.test(String.fromCharCode(e.which)); // numbers

const DoNotCopyPaste = e => () => e.preventDefault();

function showFiles({ grade, state }) {
  if (grade == 11 || grade === "EGRESADO") {
    $("#myForm #modNas").fadeIn();
    $("#myForm #pdfActaGrado").fadeOut();
  }

  if (grade === "EGRESADO") {
    $("#myForm #pdfActaGrado").fadeIn();
    $("#myForm #actaGrado").prop("disabled", false);
    $("#myForm #pdfConstanciaEstu").fadeOut();
    $("#myForm #constanciaEstudFile").prop("disabled", true);
  }
  if (grade !== "EGRESADO") {
    $("#myForm #pdfActaGrado").fadeOut();
    $("#myForm #actaGrado").prop("disabled", true);
    $("#myForm #pdfConstanciaEstu").fadeIn();
    $("#myForm #constanciaEstudFile").prop("disabled", false);
  }
  if (state === "PRIVADO") {
    $("#myForm #pdfConstanciaEstu").fadeOut();
    $("#myForm #constanciaEstudFile").prop("disabled", true);
  }
}

function showModules(grade) {
  if (!(grade in modulesByGrades) || !modulesByGrades) return;
  Object.keys(modulesByGrades[grade]).map(module => {
    const courses = modulesByGrades[grade][module];
    return showModuleCourses({ courses, module });
  });
}

function showModuleCourses({ module, courses }) {
  const selector = `${moduleSelector(module)}`;
  $(`#myForm ${selector}`).fadeIn();
  $(`#myForm ${selector} .input-div`)
    .children()
    .fadeIn();
  if (!courses.length) return;
  const coursesSelector = courses
    .map(course => `#tema${course.codigo}`)
    .join(", ");
  $(`#myForm ${selector} .input-div`)
    .children()
    .not(coursesSelector)
    .hide();
}

function showCourse({ course, selector }) {
  const courseSelector = `#myForm ${selector} #${course.codigo}`;
  console.log("courseSelector", courseSelector);
  $(courseSelector).fadeIn();
}

function moduleSelector(module) {
  const selector = `#mod${module.charAt(0).toUpperCase()}${module.slice(1)}`;
  return selector;
}

function hideModules() {
  if (!modulesByGrades) return;
  Object.keys(modulesByGrades["11"]).map(module => {
    $(`#myForm ${moduleSelector(module)}`).fadeOut();
  });
}

function hideFiles() {
  $("#myForm #pdfConstanciaEstu").hide();
  $("#myForm #pdfContanciaFun").hide();
  $("#myForm #pdfRecibos").hide();
  $("#myForm #pdfCartaSolicitud").hide();
  $("#myForm #pdfActaGrado").hide();
}

function hideStudentRecord() {
  cleanForm();
  $("#myForm").css("display", "none");
}

function showForm() {
  $("#myForm").css("display", "block");
  $("#myForm #save").css("display", "block");
}

function showStudentRecord() {
  cleanForm();
  showForm();
  $("#myForm #edit").css("display", "none");
}

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
  $("#tipo").val(String(person.data[2]));
  $("#numdoc").val(String(person.data[3]));
  $("#ciudadDoc").val(String(person.data[4]));
  $("#email").val(String(person.data[5]));
  $("#confirmEmail").val(String(person.data[5]));
  $("#telfijo").val(String(person.data[6]));
  $("#telcelular").val(String(person.data[7]));
  $("#deptres").val(String(person.data[8]));
  $("#deptres").trigger("change");
  $("#ciudadres").val(String(person.data[9]));
  $("#eps").val(String(person.data[10]));
  $("#colegio").val(String(person.data[11]));
  $("#estamento").val(String(person.data[12]));
  $("#grado").val(String(person.data[13]));
  $("#grado").trigger("change");
  $("#acudiente").val(String(person.data[14]));
  $("#telacudiente").val(String(person.data[15]));
  console.log("eps", $("#eps").val());
  if (!$("#eps").val()) {
    $("#eps").val("OTRA");
    $("#eps").trigger("change");
    $("#otraeps").val(String(person.data[10]));
  }
  if (String(person.data[16]) != "NO") {
    console.log("atleast");
    $("#inscritoanterior").val("SI");
    $("#inscritoanterior").trigger("change");
    $("#otrocurso").val(String(person.data[16]));
    $("#otrocurso").trigger("change");
  }

  if (String(person.data[17])) {
    //convenio
    let convenio = person.data[17].toLowerCase();
    $("#" + convenio).prop("checked", true);
    $("#" + convenio).trigger("change");
  }

  if (String(person.data[18])) {
    $("#valconsignado").val(String(person.data[18]));
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

function setWaitCursor() {
  $("#btn-buscar").css("cursor", "wait");
  $("body").css("cursor", "wait");
}

function setDefaultCursor() {
  $("#btn-buscar").css("cursor", "");
  $("body").css("cursor", "");
}

function cleanArray(actual) {
  let newArray = [];
  for (let i = 0, j = actual.length; i < j; i++) {
    if (actual[i] != "") {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function validateAndSave() {
  jQuery.extend(jQuery.validator.messages, {
    required: "Este campo es obligatorio.",
    number: "Este campo es numérico"
  });

  jQuery.validator.addMethod(
    "EqualToGroup",
    function(value, element, param) {
      let isequal = false;
      for (x in param) {
        if (param[x] == value) {
          isequal = true;
        }
      }
      return this.optional(element) || isequal;
    },
    "selecciona un valor valido"
  );

  $.validator.addMethod(
    "filesize",
    function(value, element, param) {
      return this.optional(element) || element.files[0].size <= param * 1000000;
    },
    "File size must be less than {0}"
  );

  let isvalid = $("#myForm").validate({
    debug: false,
    rules: {
      name: {
        required: true
      },
      lastname: {
        required: true
      },
      tipo: {
        required: true,
        EqualToGroup: ["T.I", "C.C"]
      },
      ciudadDoc: {
        required: true
      },
      numdoc: {
        required: true,
        number: true
      },
      email: {
        required: true,
        email: true
      },
      confirmEmail: {
        required: true,
        email: true,
        equalTo: "#email"
      },
      numdoc: {
        required: true,
        number: true
      },
      telfijo: {
        required: {
          depends: function(element) {
            let valuecelular = $("#telcelular").val();
            if (valuecelular == "") return true;
            return false;
          }
        },
        number: true
      },
      telcelular: {
        required: true,
        number: true
      },
      ciudadres: {
        required: true
      },
      deptres: {
        required: true
      },
      eps: {
        required: true
      },
      otraeps: {
        required: {
          depends: function(element) {
            let valeps = $("#eps").val();
            if (valeps.includes("OTRA")) return true;
            return false;
          }
        }
      },
      colegio: {
        required: true
      },
      estamento: {
        required: true,
        EqualToGroup: ["PUBLICO", "PRIVADO", "COBERTURA"]
      },
      grado: {
        required: true,
        EqualToGroup: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "EGRESADO"
        ]
      },
      acudiente: {
        required: true
      },
      telacudiente: {
        required: true,
        number: true
      },
      inscritoanterior: {
        required: true,
        EqualToGroup: ["SI", "NO"]
      },
      otrocurso: {
        required: {
          depends: function(element) {
            let valcur = $("#inscritoanterior").val();
            if (valcur.includes("SI")) return true;
            return false;
          }
        }
      },
      seleccion: {
        required: {
          depends: function(element) {
            if (!$("[name='seleccion']").is(":checked")) return true;
            return false;
          }
        }
      },
      convenio: {
        EqualToGroup: [
          "CONVENIO_COLEGIO",
          "PARTICULAR",
          "RELACION_UNIVALLE",
          "BECADOS"
        ],
        required: true
      },
      valconsignado: {
        required: true,
        number: true
      },
      terms: {
        required: true
      },
      docFile: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return true;
          }
        }
      },
      constanciaEstudFile: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return $("#estamento").val() == "público";
          }
        }
      },
      constanciaFuncFile: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return $("#relacion_univalle").is(":checked");
          }
        }
      },
      reciboFile: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return true;
          }
        }
      },
      recibosPublicos: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return $("#becado").is(":checked");
          }
        }
      },
      cartaSolicitud: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return $("#becado").is(":checked");
          }
        }
      },
      actaGrado: {
        required: {
          depends: function(element) {
            if ($("#btn-registrar").is(":visible")) return false;
            return $("#grado").val() == "EGRESADO";
          }
        }
      }
    },
    messages: {
      tipo: {
        EqualToGroup: "Por favor selecciona un tipo válido"
      },
      email: {
        email: "Correo inválido"
      },
      confirmEmail: {
        equalTo: "Los correos no son iguales",
        email: "Correo inválido"
      },
      telfijo: {
        required: "Por favor escribe por lo menos un número de contacto"
      },
      telcelular: {
        required: "Por favor escribe por lo menos un número de contacto"
      },
      estamento: {
        EqualToGroup: " Selecciona un estamento"
      },
      grado: {
        EqualToGroup: "selecciona un grado"
      },
      seleccion: {
        required: "selecciona por lo menos un modulo"
      },
      valconsignado: {
        required: "Por favor digita el valor total consignado"
      },
      docFile: {
        required:
          "Seleeciona un archivo PDF correspondiente a la copia de su número de Identificación"
      },
      constanciaEstudFile: {
        required:
          "Seleeciona un archivo PDF correspondiente a la copia de su constancia estudiantil"
      },
      constanciaFuncFile: {
        required:
          "Seleeciona un archivo PDF correspondiente a la copia de la constancia del Funcionario"
      },
      reciboFile: {
        required:
          "Seleeciona un archivo PDF correspondiente a la copia de su recibo de pago"
      },
      actaGrado: {
        required:
          "Selecciona un archivo PDF correspondiente a la copia de su acta de grado"
      }
    },
    highlight: function(element) {
      let modules = $(element).closest(".modules_matricular");
      let ismodule = $(element).closest(".modules_matricular").length;
      if (ismodule) {
        modules.addClass("has-error");
      } else {
        $(element)
          .closest(".input-div")
          .addClass("has-error");
      }
    },
    unhighlight: function(element) {
      let modules = $(element).closest(".modules_matricular");
      let ismodule = $(element).closest(".modules_matricular").length;
      if (ismodule) {
        modules.removeClass("has-error");
      } else {
        $(element)
          .closest(".input-div")
          .removeClass("has-error");
      }
    },
    errorElement: "span",
    errorClass: "help-block",
    errorPlacement: function(error, element) {
      let modules = $(element).closest(".modules_matricular");
      let ismodule = $(element).closest(".modules_matricular").length;

      if (ismodule) {
        error.insertAfter(modules);
      } else if ($(element).attr("name") == "convenio") {
        let parent = $(element).closest(".input-div");
        error.insertAfter(parent);
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      $("#mySpan").fadeIn();
      setWaitCursor();
      let form = $("#myForm");
      const formData = getFormData(form);
      console.log("FORM-->", { form, formData });
      google.script.run
        .withSuccessHandler(fileUploaded)
        .withFailureHandler(errorHandler)
        .uploadFiles(JSON.stringify(formData));
    }
  });

  return isvalid;
}

function getFormData($form) {
  var serializedForm = $form.serializeArray();
  var formData = {};

  $.map(serializedForm, function(input, i) {
    formData[input["name"]] = input["value"];
  });
  formData = Object.assign({}, formData, filesByname);
  return formData;
}

const getFile = file => {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

function cleanForm(reload) {
  $(".numeric").val("");
  $(".text-uppercase").val("");
  $(".text-lowercase").val("");

  $(".file").val("");
  $("input:checkbox").removeAttr("checked");
  // $('#otrocurso').empty('');
  if (reload) window.location.reload(true);
}

let country_arr = new Array("CAUCA", "VALLE DEL CAUCA");
let s_a = new Array();
s_a[0] = "";
s_a[1] =
  "Popayán|Cajibío|El tambo|La Sierra|Morales|Piendamó|Rosas|Soatá|Timbío|Buenos aires|Caloto|Corintio|Guachené|Miranda|Padilla|Puerto Tejada|Santander de Quilichao|Suárez|Villa rica|Almaguer|Argelia|Balboa|Bolílet|Florencia|La vega|Mercaderes|Patía|Piamonte|San Sebastián|Santa Rosa|Sucre|Guapí|López de micay|Timbiquí|Caldono|Inzá|Jambaló|Páez|Puracé|Silvia|Toribío|Torotó";
s_a[2] =
  "|Cali|Candelaria|Dagua|Florida|Jamundí|La Cumbre|Palmira|Pradera|Vijes|Yumbo|Andalucía|Buga|Bugalagrande|Calima-El Darién|El Cerrito|Ginebra|Guacarí|Restrepo|Riofrío|San Pedro|Trujillo|Tuluá|Yotoco|Buenaventura|Caicedonia|Sevilla|Cartago|El águila|El Cairo|El Dovio|La Unión|La Victoria|Obando|Restrepo|Rodalnillo|Toro|Ulloa|Versalles|Zarzal|Alcalá";

function populateCountries(countryElementId, stateElementId) {
  // given the id of the <select> tag as function argument, it inserts <option> tags
  let countryElement = document.getElementById(countryElementId);
  countryElement.length = 0;
  countryElement.options[0] = new Option("Seleccione Departamento", "-1");
  countryElement.selectedIndex = 0;
  for (let i = 0; i < country_arr.length; i++) {
    countryElement.options[countryElement.length] = new Option(
      country_arr[i],
      country_arr[i]
    );
  }

  // Assigned all countries. Now assign event listener for the states.

  if (stateElementId) {
    countryElement.onchange = function() {
      populateStates(countryElementId, stateElementId);
    };
  }
}

function populateStates(countryElementId, stateElementId) {
  let selectedCountryIndex = document.getElementById(countryElementId)
    .selectedIndex;

  let stateElement = document.getElementById(stateElementId);

  stateElement.length = 0;
  stateElement.options[0] = new Option("Seleccione Ciudad", "");
  stateElement.selectedIndex = 0;

  let state_arr = s_a[selectedCountryIndex].split("|");

  for (let i = 0; i < state_arr.length; i++) {
    stateElement.options[stateElement.length] = new Option(
      state_arr[i],
      state_arr[i].toUpperCase()
    );
  }
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
// </script>
