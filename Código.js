//Datos propios del sitio de cada estudiante
var HE = SpreadsheetApp.openById('127ee9uqClvGu3Cp3y_Ft41Xm-CU-iY0kzpKPVZ-bhAY');
const rutaGlobal = "https://script.google.com/a/macros/umariana.edu.co/s/AKfycbz93zJWtHTTgi_xVMexiVLclprieCiehYPRtqjMTg6a/dev";
//Fin datos propios de cada estudiante

function doGet(e) {
  //-----------------------------------------------------

  let params = e.parameter;
  if (params.p == undefined) {
    params.p = 0
    console.log('Entro porque params.p es undefined')
  }
  console.log('Que es esto doGet : ' + params.p + ' nombres:' + params.nombres + ' apellidos:' + params.apellidos);

  switch (params.p) {
    case "0": //Pagina principal Index
      console.log('Entro por aqui cuando es cero')
      var template = HtmlService.createTemplateFromFile("pagina_2");
      var output = template.evaluate();
      break;
    case "1": //Vinculando otra pagina 
      console.log('Entro por aqui cuando es uno')
      var template = HtmlService.createTemplateFromFile("Index");
      var output = template.evaluate();
      break;
    case "2": //Vinculando otra pagina 
      console.log('Entro por aqui cuando es dos')
      break;
    case "3": //Vinculando otra pagina 
      var template = HtmlService.createTemplateFromFile("pagina_3");
      var output = template.evaluate();
      break;
    case "4": //Formulario Boostrap
      var template = HtmlService.createTemplateFromFile("formulario");
      template.pubUrl = rutaGlobal;
      template.msg="Prueba";
      var output = template.evaluate();
      break;
    case "5": //Guardando información del formulario

      var SS = SpreadsheetApp.getActiveSpreadsheet();
      var sheetRegistro = SS.getSheetByName('Formulario')
      var unsorted_length = sheetRegistro.getLastRow();
      console.log(unsorted_length);
      var id = unsorted_length;
      var fecReg = new Date().toLocaleString();
      var nombres = e.parameter.nombres.toUpperCase();
      var apellidos = e.parameter.apellidos.toUpperCase();
      var nombreUsuario = e.parameter.nombreUsuario;
      var ciudad = e.parameter.ciudad.toUpperCase();
      var pais = e.parameter.pais;
      var codigoZip = e.parameter.codigoZip;

      sheetRegistro.appendRow([id, fecReg, nombres, apellidos, nombreUsuario, ciudad, pais, codigoZip]);

      var template = HtmlService.createTemplateFromFile("formulario");
      template.msg = nombres;
      template.pubUrl = rutaGlobal;
      var output = template.evaluate();
      break;
    case "6": //Listando registros de contactos
      var template = HtmlService.createTemplateFromFile("frmListado");
      template.pubUrl = rutaGlobal;
      //Variables incorporadas para mostrar mensajes de eliminacion o edicion segun el caso
      template.msg = null;
      template.msg2 = null;
      var output = template.evaluate();
      break;
    case "7": //Borrando registro 
      var regElim = params.id;
      eliminarRegistro(regElim);
      var template = HtmlService.createTemplateFromFile("frmListado");
      template.pubUrl = rutaGlobal;
      //Variables incorporadas para mostrar mensajes de eliminacion o edicion segun el caso      
      template.msg = regElim;
      template.msg2 = null;
      var output = template.evaluate();
      break;
    case "8": //Editar Registro 
    //Al enviar el id del registro a modificar, se debe mostrar el formulario con los datos del contacto, para  realizar esto es necesario que con la accion de hacer
    //clic en el boton [EDITAR], se filtre todos los datos del contacto para enviarlos al formulario. 
      var regEdit = params.id;
      var id = params.id;
      const ss7 = SpreadsheetApp.getActiveSpreadsheet();
      const ws7 = ss7.getSheetByName("Formulario");
      const custIds7 = ws7.getRange(2, 1, ws7.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
      const posIndex7 = custIds7.indexOf(id.toString().toLowerCase());
      const rowNumber7 = posIndex7 === -1 ? 0 : posIndex7 + 2;
      //-- Dejar la posicion mas 1
      const registroContacto = ws7.getRange(rowNumber7, 1, 1, 8).getValues()[0];
      var template = HtmlService.createTemplateFromFile("frmEditar");
      template.frmContacto = registroContacto; //Pasando todas los datos obtenidos en la busqueda para realizar edicion
      template.pubUrl = rutaGlobal;
      var output = template.evaluate();
      break;
    case "9": //Guardar datos editados y retornar al listado principal
      var id = params.id;

      const ss = SpreadsheetApp.getActiveSpreadsheet(); // Esta línea obtiene el objeto de la hoja de cálculo activa actual. "ss" es una variable constante que se usa para referirse a esta hoja de cálculo activa en el código.

      const ws = ss.getSheetByName("Formulario"); //Esta línea obtiene una hoja de cálculo específica dentro de la hoja de cálculo activa, que se llama "Formulario". "ws" es una variable constante que se usa para referirse a esta hoja de cálculo en el código.

      const custIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString()); //Esta línea obtiene todos los valores de la primera columna en la hoja de cálculo "Formulario" . "custIds" es una variable constante que se usa para referirse a este arreglo de cadenas en el código.

      const posIndex = custIds.indexOf(id.toString().toLowerCase()); //Esta línea busca en el arreglo de cadenas "custIds" la posición de la cadena "id" proporcionada como argumento y la almacena en la variable "posIndex". Si la cadena "id" no se encuentra en el arreglo "custIds", "posIndex" será igual a -1.

      const rowNumber = posIndex === -1 ? 0 : posIndex + 2; //Esta línea determina el número de fila en la hoja de cálculo "Formulario" donde se encuentra la cadena "id". Si la cadena "id" no se encuentra en la hoja de cálculo "Formulario", "rowNumber" será igual a 0. Si la cadena "id" se encuentra en la hoja de cálculo "Formulario", "rowNumber" será igual a la posición de la cadena "id" más 2, porque los datos de la hoja de cálculo comienzan en la fila 2.      

      //Se ubica en la fila a modificar partiendo de la columna 3, para un solo registro, y avanza 6 posiciones hacia adelante
      //La columna 3 corresponde al campo Nombres , la columna de Id y Fecha Registro, no se permite el cambio de datos.
      ws.getRange(rowNumber, 3, 1, 6).setValues([[
        e.parameter.nombres.toUpperCase(),
        e.parameter.apellidos.toUpperCase(),
        e.parameter.nombreUsuario,
        e.parameter.ciudad.toUpperCase(),
        e.parameter.pais.toUpperCase(),
        e.parameter.codigoZip
      ]]);

      var template = HtmlService.createTemplateFromFile("frmListado");
      template.pubUrl = rutaGlobal;
      //Variables incorporadas para mostrar mensajes de eliminacion o edicion segun el caso      
      template.msg2 = id;
      template.msg = null;
      var output = template.evaluate();
      break;
    default:
      var template = HtmlService.createTemplateFromFile("Index");
      var output = template.evaluate();
      break;
  }
  return output;
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName)
    .getContent()
}
/*
Este metodo permite realizar la busqueda de registros por el identificador unico que se 
asigna a cada usuario que registra sus datos en el formulario de conctacto
Si en la busqueda no se especifica nada, trae todos los registros almacenados.

Este operador === se conoce como "igualdad estricta" o "igualdad de identidad".

Cuando se utiliza el operador ===, se comparan tanto el valor como el tipo de 
datos de los operandos. Si los operandos tienen el mismo valor y el mismo tipo de dato, 
la expresión se evalúa como verdadera (devuelve true). De lo contrario, la expresión
se evalúa como falsa (devuelve false).
*/

function buscarContacto(codigo = "11") {
  let registrosbusqueda = [];
  const SS2 = SpreadsheetApp.getActiveSpreadsheet();
  const sheetRegistros = SS2.getSheetByName("Formulario");

  var rango = sheetRegistros.getRange(2, 1, sheetRegistros.getLastRow() - 1, sheetRegistros.getLastColumn());
  var valorBusqueda = rango.getValues();

  valorBusqueda.forEach(valorBusqueda => {
    if (codigo === '') registrosbusqueda = rango.getValues()
    else {
      //console.log('dato:'+typeof valorBusqueda[0]+' - '+typeof Math.floor(codigo))
      if (valorBusqueda[0] === Math.floor(codigo)) {
        console.log('se cumple condicion');
        registrosbusqueda.push(valorBusqueda);
      }
    }
  })
  //console.log(registrosbusqueda);
  return registrosbusqueda;
}

/*
Este metodo permite eliminar el registro del cual se hace clic como hipervinculo
*/
function eliminarRegistro(codigo = "5") {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Formulario");
  var datos = hoja.getDataRange().getValues();

  for (var i = 1; i < datos.length; i++) {
    if (datos[i][0] == codigo) { // id que se requiere eliminar
      hoja.deleteRow(i + 1); // Se suma 1 para considerar el encabezado
      break;
    }
  }
}

function getUserName() {
  var user = Session.getActiveUser();
  if (user) {
    var email = user.getEmail();
    var atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.substring(0, atIndex); // Retorna el nombre de usuario antes de "@"
    } else {
      return email; // Si no hay "@" en el correo, retorna el correo completo
    }
  } else {
    return 'Usuario no autenticado';
  }
}


