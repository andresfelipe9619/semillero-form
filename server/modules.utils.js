function getModulesByGrades() {
  var rawModules = getModules();
  var modules = sheetValuesToObject(rawModules);
  var allowedColumns = ["nombre", "codigo", "area", "prueba"];
  modules = modules.reduce(function(acc, newModule) {
    if (newModule.disabled === "x") return acc;
    newModule.grades = Object.keys(newModule).reduce(function(prevArray, key) {
      if (allowedColumns.indexOf(key) >= 0) return prevArray;
      var currentValue = newModule[key];
      delete newModule[key];
      if (currentValue === "x") {
        prevArray.push(key);
      }
      return prevArray;
    }, []);
    acc.push(newModule);
    return acc;
  }, []);
  var modulesByGrades = modules.reduce(function(prevModules, module) {
    module.grades.map(function(grade) {
      if (!(grade in prevModules)) {
        prevModules[grade] = {};
      }
      if (!(module.area in prevModules[grade])) {
        prevModules[grade][module.area] = [];
      }
      prevModules[grade][module.area].push({
        nombre: module.nombre,
        codigo: module.codigo,
        prueba: module.prueba
      });
    });
    return prevModules;
  }, {});
  Logger.log(modulesByGrades);
  return modulesByGrades;
}

function addToModule(module, data) {
  Logger.log("addtomodule");
  Logger.log(module);
  Logger.log(data);
  // data.push(module)
  createModulesSheets();
  var actualPeriod = getActualPeriod()[2];
  var modulos = getModules();
  for (var x in modulos) {
    if (module == modulos[x][1]) {
      var moduleSheet = getSheetFromSpreadSheet(actualPeriod, modulos[x][0]);
      var lastRow = moduleSheet.getLastRow();
      moduleSheet.appendRow([
        data.name.toUpperCase(),
        data.lastname.toUpperCase(),
        data.tipo,
        data.numdoc,
        data.telfijo,
        data.email.toLowerCase(),
        data.grado,
        data.colegio,
        data.convenio
      ]);
      var lastRowRes = moduleSheet.getLastRow();
      var res = false;

      if (lastRowRes > lastRow) {
        res = true;
      }
      return res;
    }
  }
  return true;
}

function createModulesSheets() {
  var actualPeriod = getActualPeriod()[2];
  var periodSpreadSheet = SpreadsheetApp.openByUrl(actualPeriod);

  var modules = getModules();

  Logger.log("creating modules");
  Logger.log(actualPeriod);
  Logger.log(modules[1][0]);
  Logger.log("--------------------------");
  var headers = [
    "nombre",
    "apellido",
    "tipo_doc",
    "ciudad_doc",
    "tel_fijo",
    "email",
    "grado",
    "colegio",
    "convenio_colegio"
  ];
  for (var x in modules) {
    var moduleSheet;
    if (x > 0) {
      if (!getSheetFromSpreadSheet(actualPeriod, modules[x][0])) {
        periodSpreadSheet.insertSheet(modules[x][0]);
        moduleSheet = getSheetFromSpreadSheet(actualPeriod, modules[x][0]);
        if (moduleSheet.getLastRow() == 0) {
          moduleSheet.appendRow(headers);
        }
      }
    }
  }
  return true;
}

function validateModule(moduleSelected, data) {
  var modulosMatriculados = [];
  Logger.log("=============VALIDATING MODULES===========");
  Logger.log("module selected");
  Logger.log(moduleSelected);
  var modules = getModules();
  var titulosModulos = [];

  for (var x in modules) {
    if (x > 0) {
      titulosModulos.push(modules[x][1]);
    }
  }
  Logger.log("Titulos modules");
  Logger.log(titulosModulos);

  if (moduleSelected) {
    for (var i in titulosModulos) {
      if (moduleSelected.localeCompare(titulosModulos[i]) == 0) {
        data.push("x");
        modulosMatriculados.push(titulosModulos[i]);
      } else {
        data.push("");
      }
    }
  } else {
    for (var i in titulosModulos) {
      data.push("");
    }
  }

  Logger.log("modulo matriculado");
  Logger.log(modulosMatriculados);
  Logger.log("=============FIN VALIDATING MODULES===========");

  return modulosMatriculados;
}
