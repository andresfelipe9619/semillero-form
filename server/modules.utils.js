function getModulesByGrades() {
  var rawModules = getModules();
  var modules = sheetValuesToObject(rawModules);
  var allowedColumns = ["nombre", "codigo", "area", "prueba"];
  modules = modules.map(function(newModule) {
    newModule.grades = Object.keys(newModule).reduce(function(prevArray, key) {
      if (allowedColumns.indexOf(key) >= 0) return prevArray;
      var currentValue = newModule[key];
      delete newModule[key];
      if (currentValue === "x") {
        prevArray.push(key);
      }
      return prevArray;
    }, []);
    return newModule;
  });
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
    "tipo de documento",
    "número de documento",
    "telefono",
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

function validateModule(modulos, data) {
  var modulosMatriculados = [];
  Logger.log("=============Validando modulos===========");

  var miModulos = getModules();
  Logger.log("modulos selected");
  Logger.log(modulos);

  var titulosModulos = [];

  for (var x in miModulos) {
    if (x > 0) {
      titulosModulos.push(miModulos[x][1]);
    }
  }
  Logger.log("Titulos modulos");
  Logger.log(titulosModulos);

  if (modulos) {
    for (var i in titulosModulos) {
      if (modulos.localeCompare(titulosModulos[i]) == 0) {
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
  Logger.log("=============FIN Validando modulos===========");

  return modulosMatriculados;
}
