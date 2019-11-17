var ROOT_FOLDER = "SCRIPTS SEMILLEROS";
var FILES_FOLDER = "Bodega de archivos";

function getPersonFolder(name, folder) {
  var filesFolder = getFilesFolder(folder);
  var personFolder = createPersonFolder(name, filesFolder);
  return personFolder;
}

function getFilesFolder(folder) {
  var mainFolder = folder;
  if (!folder) {
    mainFolder = getMainFolder();
  }
  var filesFolder;
  var folders = mainFolder.getFoldersByName(FILES_FOLDER);
  if (folders.hasNext()) {
    filesFolder = folders.next();
  } else {
    filesFolder = mainFolder.createFolder(FILES_FOLDER);
  }
  return filesFolder;
}

function createPersonFolder(name, filesFolder) {
  var currentFolder;
  var mFolders = filesFolder.getFoldersByName(name);
  if (mFolders.hasNext()) {
    currentFolder = mFolders.next();
  } else {
    currentFolder = filesFolder.createFolder(name);
  }
  return currentFolder;
}

function getMainFolder() {
  var mainFolder;
  var folders = DriveApp.getFoldersByName(ROOT_FOLDER);
  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
    mainFolder = DriveApp.createFolder(ROOT_FOLDER);
  }
  return mainFolder;
}

function createPersonFile(fileName, numdoc, fileData) {
  var result = {
    url: "",
    file: ""
  };
  var mainFolder = getMainFolder();
  var currentFolder = getPersonFolder(numdoc, mainFolder);

  var contentType = fileData.substring(5, fileData.indexOf(";"));
  var bytes = Utilities.base64Decode(
    fileData.substr(fileData.indexOf("base64,") + 7)
  );
  var blob = Utilities.newBlob(bytes, contentType, file);

  var file = currentFolder.createFile(blob);
  file.setDescription("Subido Por " + numdoc);
  file.setName(numdoc + "_" + fileName);
  result.url = file.getUrl();
  result.file = file.getName();
  return result;
}

function uploadEstudentFiles(numdoc, files) {
  Logger.log("=============UPLOADING STUDENT "+numdoc+ " FILES===========");

  if (!files.length) return;
  Logger.log("FILES:")
  Logger.log(files)
  var response = files.map(function(file) {
    var name = file.name || "";
    var base64 = file.base64 || "";
    return createPersonFile(name, numdoc, base64);
  })
  Logger.log("=============END UPLOADING STUDENT "+numdoc+ " FILES===========");
  return response;
}
