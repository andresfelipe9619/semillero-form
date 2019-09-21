$(document).ready(function() {
  $("#myForm #createEmail").on("click", function() {
    window.open(
      "https://accounts.google.com/SignUp?service=mail&hl=es&continue=http%3A%2F%2Fmail.google.com%2Fmail%2F%3Fpc%3Des-ha-latam-co-bk-xplatform1&utm_campaign=es&utm_source=es-ha-latam-co-bk-xplatform1&utm_medium=ha"
    );
  });

  //$("#myForm #pdfDoc").hide();
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
  $("#modBusqueda").hide();
  $("#myForm #modNas").hide();
  $("#myForm #estamento").on("change", function() {
    var val = $(this).val();
    var grado = $("#grado").val();
    if (val == "PUBLICO" || val == "COBERTURA") {
      if (grado == "EGRESADO") {
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
    } else if (val == "PRIVADO") {
      if (grado == "EGRESADO") {
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
  });

  $(".numeric").on("keypress", function(e) {
    return (
      e.metaKey || // cmd/ctrl
      e.which <= 0 || // arrow keys
      e.which == 8 || // delete key
      /[0-9]/.test(String.fromCharCode(e.which))
    ); // numbers
  });

  $("#myForm").on("click", 'input[name="convenio"]', function() {
    var val = $(this).val();
    var estamento = $("#estamento").val();
    if (val == "RELACION_UNIVALLE") {
      $("#myForm #pdfContanciaFun").fadeIn();
      $("#myForm #constanciaFuncFile").prop("disabled", false);
      $("#myForm #pdfRecibo").fadeIn();
      $("#myForm #reciboFile").prop("disabled", false);
      $("#myForm #pdfRecibos").fadeOut();
      $("#myForm #pdfCartaSolicitud").fadeOut();
      $("#myForm #recibosPublicos").prop("disabled", true);
      $("#myForm #cartaSolicitud").prop("disabled", true);
    } else if (val == "BECADOS") {
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
  });

  $("#eps").on("change", function() {
    var epsval = this.value;
    if (epsval.includes("OTRA")) return $("#otraeps").css("display", "block");
    $("#otraeps").css("display", "none");
  });

  $("#inscritoanterior").on("change", function() {
    var myres = this.value;
    if (myres.includes("SI")) return $("#otrocurso").css("display", "block");
    $("#otrocurso").css("display", "none");
  });

  $("#confirmEmail").on("copy cut paste", function(e) {
    e.preventDefault();
  });
  $("#email").on("copy cut paste", function(e) {
    e.preventDefault();
  });

  $("#otrocurso").on("change", function() {
    var grado = $("#myForm #grado").val();
    var val = this.value;
    if (
      (val.indexOf("racional") || val.indexOf("Conjuntos")) &&
      (grado == 6 || grado == 7)
    ) {
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeIn();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modArtes").fadeOut();
      $("#myForm #modArtes #temamuper").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
    } else if ((grado == 6 || grado == 7) && (val == "" || val == " ")) {
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temaentrac")
        .fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temalogcon")
        .fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temaalgfun")
        .fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temageopl")
        .fadeOut();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes #temamuper").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
    }
  });

  $("#myForm #grado").on("change", function() {
    var anterior = $("#otrocurso").val();
    console.log("MI ANTERIOR: ", anterior);
    var val = this.value;
    var estamento = $("#estamento").val();
    if (val == 8 || val == 9) {
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeIn();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modHumanidades").fadeIn();
      $("#myForm #modHumanidades #temalecr").fadeOut();
      $("#myForm #modBiologia").fadeIn();
      $("#myForm #modNas").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes .input-div")
        .children()
        .fadeOut();
      $("#myForm #modArtes #temamuper").fadeIn();
      $("#myForm #modArtes #temaapmus").fadeIn();
      $("#myForm #modArtes #tematjt").fadeIn();
    } else if (val == 10 || val == 11 || val == "EGRESADO") {
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeIn();
      $("#myForm #modFisica").fadeIn();
      $("#myForm #modQuimica").fadeIn();
      $("#myForm #modHumanidades").fadeIn();
      $("#myForm #modHumanidades  #temalecr").fadeIn();
      $("#myForm #modBiologia").fadeIn();
      $("#myForm #modNas").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes .input-div")
        .children()
        .fadeOut();
      $("#myForm #modArtes #tematpd").fadeIn();
      $("#myForm #modArtes #temamuper").fadeIn();

      if (val != "EGRESADO") {
        $("#myForm #modArtes #tematjt").fadeIn();
      }
    } else if (
      (val == 6 || val == 7) &&
      (anterior.indexOf("Conjuntos") >= 0 || anterior.indexOf("racional") >= 0)
    ) {
      console.log("MI ANTERIOR IN IF: ", anterior);
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeIn();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modArtes").fadeOut();
      $("#myForm #modArtes #temamuper").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
      $("#myForm #modBiologia").fadeOut();
      $("#myForm #modNas").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes .input-div")
        .children()
        .fadeOut();
      $("#myForm #modArtes #tematjt").fadeIn();
    } else if (val == 6 || val == 7) {
      $("#myForm #modMatematicas").fadeIn();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temaentrac")
        .fadeIn();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modArtes").fadeOut();
      $("#myForm #modArtes #temamuper").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
      $("#myForm #modBiologia").fadeOut();
      $("#myForm #modNas").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes .input-div")
        .children()
        .fadeOut();
      $("#myForm #modArtes #tematjt").fadeIn();
    } else if (val >= 1 && val <= 5) {
      $("#myForm #modNas").fadeOut();
      $("#myForm #modMatematicas").fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeOut();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
      $("#myForm #modBiologia").fadeOut();
      $("#myForm #modArtes").fadeIn();
      $("#myForm #modArtes .input-div")
        .children()
        .fadeOut();
      $("#myForm #modArtes #tematit").fadeIn();
    } else {
      $("#myForm #modMatematicas").fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children()
        .fadeOut();
      $("#myForm #modMatematicas #checkboxMate")
        .children("#temaentrac")
        .fadeOut();
      $("#myForm #modFisica").fadeOut();
      $("#myForm #modQuimica").fadeOut();
      $("#myForm #modHumanidades").fadeOut();
      $("#myForm #modArtes").fadeOut();
      $("#myForm #modBiologia").fadeOut();
      $("#myForm #modNas").fadeOut();
    }

    if (val == 11 || val == "EGRESADO") {
      $("#myForm #modNas").fadeIn();
      $("#myForm #pdfActaGrado").fadeOut();
    }

    if (val == "EGRESADO") {
      $("#myForm #pdfActaGrado").fadeIn();
      $("#myForm #actaGrado").prop("disabled", false);
      $("#myForm #pdfConstanciaEstu").fadeOut();
      $("#myForm #constanciaEstudFile").prop("disabled", true);
    }
    if (val != "EGRESADO") {
      $("#myForm #pdfActaGrado").fadeOut();
      $("#myForm #actaGrado").prop("disabled", true);
      $("#myForm #pdfConstanciaEstu").fadeIn();
      $("#myForm #constanciaEstudFile").prop("disabled", false);
    }
    if (estamento == "PRIVADO") {
      $("#myForm #pdfConstanciaEstu").fadeOut();
      $("#myForm #constanciaEstudFile").prop("disabled", true);
    }
  });

  $("#myForm #save").on("click", function(e) {
    var terminos = $("input[name=terms]:checked", "#myForm").val();
    console.log(terminos);
    if (terminos === "Acepto") return validateAndSave();
    e.preventDefault();
    swal({
      title: "Advertencia",
      text:
        "Debe aceptar los términos y condiciones para enviar el formulario.",
      type: "warning",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    });
  });
  $("#myForm #edit").on("click", editStudentData);

  populateCountries("deptres", "ciudadres");
});

function editStudentData() {
  var valid = validateAndSave();

  var onSuccess = function(person) {
    swal({
      title: "Exito!",
      text: "Se edito el estudiante satisfactoriamente!",
      type: "success",
      confirmButtonText: "Ok",
      closeOnConfirm: true
    });
  };
  if (valid) {
    var serialized = $("#myForm").serializeArray();
    var dataToEdit = [];

    for (var x in serialized) {
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

    google.script.run.withSuccessHandler(onSuccess).editStudent(dataToEdit);
  }
  console.log("SERIAL", serialized);
  console.log("NORMAL", dataToEdit);
}

function cargarInfo() {
  var ced = $("#cedula_buscada").val();
  ocultarRegistro();
  if (ced == "") {
    swal({
      title: "Advertencia ...",
      text: "Ingrese una cedula para consultar",
      type: "warning"
    });
  } else {
    setWaitCursor();
    google.script.run.withSuccessHandler(cargarPersona).buscarPersona(ced);
  }
}

function ocultarRegistro() {
  $("#myForm").css("display", "none");
  cleanForm();
  $("#modBusqueda").fadeOut();
}

function mostrarRegistro() {
  $("#modBusqueda").fadeOut();
  $("#myForm").css("display", "none");
  cleanForm();
  $("#myForm").css("display", "block");

  $("#myForm #save").css("display", "block");
  $("#myForm #edit").css("display", "none");
}

function cargarPersona(person) {
  console.log("the hell", person);
  if (!person) {
    setDefaultCursor();
    swal({
      title: "Advertencia ...",
      text: "La cedula ingresada no corresponde a ningún estudiante",
      type: "warning"
    });
  } else if (person.state == "antiguo") {
    swal({
      title: "Advertencia ...",
      text:
        "El estudiante esta inscrito anteriormente, pero no el periodo actual ",
      type: "warning"
    });
  } else if (person.state == "actual") {
    setWaitCursor();
    mostrarRegistro();
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
      var convenio = person.data[17].toLowerCase();
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
      google.script.run.withSuccessHandler(onSuccess).getModules();
      function onSuccess(modules) {
        for (var x in modules) {
          if (modules[x][0] == person.data[person.data.length - 4]) {
            $("#" + modules[x][1]).prop("checked", true);
            $("#" + modules[x][1]).trigger("change");
          }
        }
      }
    }
    setDefaultCursor();
  }
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
  var newArray = [];
  for (var i = 0, j = actual.length; i < j; i++) {
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
      var isequal = false;
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

  var isvalid = $("#myForm").validate({
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
            var valuecelular = $("#telcelular").val();
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
            var valeps = $("#eps").val();
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
            var valcur = $("#inscritoanterior").val();
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
      var modules = $(element).closest(".modules_matricular");
      var ismodule = $(element).closest(".modules_matricular").length;
      if (ismodule) {
        modules.addClass("has-error");
      } else {
        $(element)
          .closest(".input-div")
          .addClass("has-error");
      }
    },
    unhighlight: function(element) {
      var modules = $(element).closest(".modules_matricular");
      var ismodule = $(element).closest(".modules_matricular").length;
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
      var modules = $(element).closest(".modules_matricular");
      var ismodule = $(element).closest(".modules_matricular").length;

      if (ismodule) {
        error.insertAfter(modules);
      } else if ($(element).attr("name") == "convenio") {
        var parent = $(element).closest(".input-div");
        error.insertAfter(parent);
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function(form) {
      $("#mySpan").fadeIn();
      setWaitCursor();
      //google.script.run.withSuccessHandler(fileUploaded).uploadFiles(form);
      //var pag = location.href;
      console.log("FORM-->", form);

      google.script.run.withSuccessHandler(fileUploaded).uploadFiles(form);
    }
  });

  return isvalid;
}

function cleanForm(reload) {
  $(".numeric").val("");
  $(".text-uppercase").val("");
  $(".text-lowercase").val("");

  $(".file").val("");
  $("input:checkbox").removeAttr("checked");
  // $('#otrocurso').empty('');
  if (reload) {
    window.location.reload(true);
  }
}

var country_arr = new Array("CAUCA", "VALLE DEL CAUCA");
var s_a = new Array();
s_a[0] = "";
s_a[1] =
  "Popayán|Cajibío|El tambo|La Sierra|Morales|Piendamó|Rosas|Soatá|Timbío|Buenos aires|Caloto|Corintio|Guachené|Miranda|Padilla|Puerto Tejada|Santander de Quilichao|Suárez|Villa rica|Almaguer|Argelia|Balboa|Bolívar|Florencia|La vega|Mercaderes|Patía|Piamonte|San Sebastián|Santa Rosa|Sucre|Guapí|López de micay|Timbiquí|Caldono|Inzá|Jambaló|Páez|Puracé|Silvia|Toribío|Torotó";
s_a[2] =
  "|Cali|Candelaria|Dagua|Florida|Jamundí|La Cumbre|Palmira|Pradera|Vijes|Yumbo|Andalucía|Buga|Bugalagrande|Calima-El Darién|El Cerrito|Ginebra|Guacarí|Restrepo|Riofrío|San Pedro|Trujillo|Tuluá|Yotoco|Buenaventura|Caicedonia|Sevilla|Cartago|El águila|El Cairo|El Dovio|La Unión|La Victoria|Obando|Restrepo|Rodalnillo|Toro|Ulloa|Versalles|Zarzal|Alcalá";

function populateCountries(countryElementId, stateElementId) {
  // given the id of the <select> tag as function argument, it inserts <option> tags
  var countryElement = document.getElementById(countryElementId);
  countryElement.length = 0;
  countryElement.options[0] = new Option("Seleccione Departamento", "-1");
  countryElement.selectedIndex = 0;
  for (var i = 0; i < country_arr.length; i++) {
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
  var selectedCountryIndex = document.getElementById(countryElementId)
    .selectedIndex;

  var stateElement = document.getElementById(stateElementId);

  stateElement.length = 0;
  stateElement.options[0] = new Option("Seleccione Ciudad", "");
  stateElement.selectedIndex = 0;

  var state_arr = s_a[selectedCountryIndex].split("|");

  for (var i = 0; i < state_arr.length; i++) {
    stateElement.options[stateElement.length] = new Option(
      state_arr[i],
      state_arr[i].toUpperCase()
    );
  }
}

function fileUploaded(status) {
  if (status == "exito") {
    //swal('Exito','La inscripción se realizó satisfactoriamente','success');
    console.log("Estatus", status);
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
    // cleanForm();
  } else {
    console.log("Estatus", status);
    swal("Error", status, "error");
    $("#mySpan").fadeOut();
    setDefaultCursor();
  }
}
