var ROOT_FOLDER = "SCRIPTS SEMILLEROS";

function getPersonFolder(name, mainFolder) {
  // se crea la carpeta que va conener todos los docmuentos
  var nameFolder = "Bodega de archivos";
  var FolderFiles;
  var folders = mainFolder.getFoldersByName(nameFolder);
  if (folders.hasNext()) {
    FolderFiles = folders.next();
  } else {
    FolderFiles = mainFolder.createFolder(nameFolder);
  }

  // se crea la carpeta que va contener los documentos de cada inscrito
  var currentFolder;
  var mFolders = FolderFiles.getFoldersByName(name);
  if (mFolders.hasNext()) {
    currentFolder = mFolders.next();
  } else {
    currentFolder = FolderFiles.createFolder(name);
  }

  return currentFolder;
}

function getMainFolder() {
  var dropbox = ROOT_FOLDER;
  var mainFolder;
  var folders = DriveApp.getFoldersByName(dropbox);

  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
    mainFolder = DriveApp.createFolder(dropbox);
  }
  return mainFolder;
}
function createPersonFile(name, numdoc, data) {
  var result = {
    url: "",
    file: ""
  };
  var mainFolder = getMainFolder();
  var currentFolder = getPersonFolder(numdoc, mainFolder);

  var contentType = data.substring(5, data.indexOf(";"));
  var bytes = Utilities.base64Decode(data.substr(data.indexOf("base64,") + 7));
  var blob = Utilities.newBlob(bytes, contentType, file);

  var file = currentFolder.createFile(blob);
  file.setDescription("Subido Por " + numdoc);
  file.setName(numdoc + "_" + name);
  result.url = file.getUrl();
  result.file = file.getName();
  return result;
}

function createPonenciaFile(numdoc, data) {
  var res = createPersonFile("PONENCIA", numdoc, data);
  return res;
}
