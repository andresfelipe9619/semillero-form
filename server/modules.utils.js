var CURRENT_PERIOD_COLUMNS = [
  "nombre",
  "apellido",
  "tipo_doc",
  "ciudad_doc",
  "tel_fijo",
  "email",
  "grado",
  "colegio",
  "convenio",
  "val_consignar",
  "val_consignado",
  "dif_consignado",
  "recibo_consignacion",
  "fecha_consignacion",
];

function getModulesByGrades() {
  var rawModules = getModules();
  var modules = sheetValuesToObject(rawModules);
  var allowedColumns = ["nombre", "codigo", "area", "prueba"];
  modules = modules.reduce(function (acc, newModule) {
    if (newModule.disabled === "x") return acc;
    newModule.grades = Object.keys(newModule).reduce(function (prevArray, key) {
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
  var modulesByGrades = modules.reduce(function (prevModules, module) {
    module.grades.map(function (grade) {
      if (!(grade in prevModules)) {
        prevModules[grade] = {};
      }
      if (!(module.area in prevModules[grade])) {
        prevModules[grade][module.area] = [];
      }
      prevModules[grade][module.area].push({
        nombre: module.nombre,
        codigo: module.codigo,
        prueba: module.prueba,
      });
    });
    return prevModules;
  }, {});
  Logger.log(modulesByGrades);
  return modulesByGrades;
}

function addStudentToModuleSheet(module, data) {
  createModulesSheets();
  var actualPeriod = getCurrentPeriod()["link"];
  var modulos = getModules();
  for (var x in modulos) {
    if (module === modulos[x][1]) {
      var moduleSheet = getSheetFromSpreadSheet(actualPeriod, modulos[x][0]);
      var lastRow = moduleSheet.getLastRow();
      var data2Write = CURRENT_PERIOD_COLUMNS.map(function (column) {
        return data[column];
      });
      Logger.log("data2Write");
      Logger.log(data2Write);
      moduleSheet.appendRow(data2Write);
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
  var actualPeriod = getCurrentPeriod()["link"];
  var periodSpreadSheet = SpreadsheetApp.openByUrl(actualPeriod);

  var modules = getModules();

  Logger.log("creating modules");
  Logger.log(actualPeriod);
  Logger.log(modules[1][0]);
  Logger.log("--------------------------");
  var headers = CURRENT_PERIOD_COLUMNS;
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

function validateModule(moduleSelected) {
  var validModule = null;
  Logger.log("=============VALIDATING MODULES===========");
  Logger.log("module selected");
  Logger.log(moduleSelected);
  var modules = getModules();
  var modulesTitles = [];

  for (var x in modules) {
    if (x > 0) modulesTitles.push(modules[x][1]);
  }
  Logger.log("Titulos modules");
  Logger.log(modulesTitles);

  if (!moduleSelected) throw "No se reconoce el modulo seleccionado";
  for (var i in modulesTitles) {
    if (moduleSelected.localeCompare(modulesTitles[i]) === 0) {
      validModule = modules[++i][0];
    }
  }

  Logger.log("Valid Module");
  Logger.log(validModule);
  Logger.log("=============END VALIDATING MODULES===========");
  return validModule;
}
