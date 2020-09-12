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

function createPersonFile(fileName, num_doc, fileData) {
  var result = {
    url: "",
    name: ""
  };
  var mainFolder = getMainFolder();
  Logger.log("Main Folder: " + mainFolder);
  var currentFolder = getPersonFolder(num_doc, mainFolder);
  Logger.log("Student Folder: " + currentFolder);
  var contentType = fileData.substring(5, fileData.indexOf(";"));
  Logger.log("Content Type: " + contentType);
  var bytes = Utilities.base64Decode(
    fileData.substr(fileData.indexOf("base64,") + 7)
  );
  var blob = Utilities.newBlob(bytes, contentType, fileName);

  var file = currentFolder.createFile(blob);
  file.setDescription("Subido Por " + num_doc);
  result.url = file.getUrl();
  result.name = file.getName();
  result.file = file;
  return result;
}

function uploadStudentFiles(num_doc, files) {
  Logger.log("=======UPLOADING STUDENT " + num_doc + " FILES======");
  if (!files.length) return;
  Logger.log("FILES:");
  var savedFiles = files.map(function(file) {
    var name = file.name || "";
    var base64 = file.base64 || "";
    Logger.log(name);
    var savedFile = createPersonFile(name, num_doc, base64);
    return savedFile.file;
  });
  var mainFolder = getMainFolder();
  var currentFolder = getPersonFolder(num_doc, mainFolder);
  var response = { files: savedFiles, folder: currentFolder.getUrl() };
  Logger.log("FILES RESPONSE:");
  Logger.log(response);

  Logger.log("=======END UPLOADING STUDENT " + num_doc + " FILES========");
  return response;
}
