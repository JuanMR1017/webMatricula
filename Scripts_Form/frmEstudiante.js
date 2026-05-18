var dir = "http://localhost:52960/api/";
var oTabla = $("#tblDatos").DataTable();
jQuery(function () {
    
  
    //Carga el menú
    $("#dvMenu").load("../Paginas/Menu.html");

    //Registrar los botones para responder al evento click
    $("#btnAgre").on("click", function () {
        //alerta("Agregar", "Información");
        Agregar();
    });
    $("#btnModi").on("click", function () {
        //alerta("Modificar");
        Modificar();
    });
    $("#btnBusc").on("click", function () {
        //alerta("Buscar", "Información");
        Consultar();
    });
    $("#btnCanc").on("click", function () {
        //alerta("Cancelar");
        Cancelar();
    });
    $("#btnImpr").on("click", function () {
        alerta("Impresión");
        //Imprimir();
    });

    llenarComboFac();
    llenarComboJornada();
    llenarComboTipDoc();

    //LISTENER DATATABLE
    $("#tblDatos tbody").on("click", 'tr', function (evento) {
        evento.preventDefault();

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $("#tblDatos tbody tr").removeClass('selected');
            $(this).addClass('selected');
            editarFila($(this).closest('tr'));
        }
    });

    $("#txtNroDoc").trigger("focus");



});  //Del: jQuery

function mensajeError(texto) {
    $("#dvMensaje").removeClass("alert alert-success alert-info");
    $("#dvMensaje").addClass("alert alert-danger");
    $("#dvMensaje").html(texto);
}
function mensajeInfo(texto) {
    $("#dvMensaje").removeClass("alert alert-success alert-danger");
    $("#dvMensaje").addClass("alert alert-info");
    $("#dvMensaje").html(texto);
}
function mensajeOk(texto) {
    $("#dvMensaje").removeClass("alert alert-info alert-danger");
    $("#dvMensaje").addClass("alert alert-success");
    $("#dvMensaje").html(texto);


}

function alerta(msj, titulo) {
    swal.fire({
        position: 'center', // Corrección: 'center' sin comillas raras
        type: 'info',
        title: titulo,
        text: msj
    });
}

async function ejecutarComando(accion) {
    mensajeInfo("");
    //Capturar los datos de entraDA
    let idPR = $("#cboPrograma").val();
    let NroD = $("#txtNroDoc").val();
    let idTD = $("#cboTipoDoc").val();
    let Nomb = $("#txtNombre").val();
    let Cod = $("#txtCarnet").val();
    let idJO = $("#cboJornada").val();
    let Acti = $("#chkActivo").prop("checked");
    let Obse = $("#txtObserv").val();

    if (parseInt(idPR ,10) <= 0) {
        mensajeError("Error, el programa no es válido");
        $("#cboPrograma").trigger("focus");
        return;
    }

    if (parseInt(idTD, 10) <= 0) {
        mensajeError("Error, el tipo de documento no es válido");
        $("#cboTipoDoc").trigger("focus");
        return;
    }

    if (parseInt(idJO, 10) <= 0) {
        mensajeError("Error, la jornada no es válida");
        $("#cboJornada").trigger("focus");
        return;
    }

    //Crear Json                                                                           
    let datosOut = {
        codigo: Cod,
        nroDoc: NroD,
        idTdoc: idTD,
        nombre: Nomb,
        idPro: idPR,
        idJor: idJO,
        observac: Obse,
        activo: Acti,
    }
    //Invocar el servicio con fetch
    try {
        const response = await fetch(dir + "Estuadiante", {
            method: accion,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosOut),
        });   // stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON
        const rpta = await response.json();
        if (rpta == -1)
            mensajeError("Problema al grabar el registro (Revisar si existe)");
        else if (rpta == 0)
            mensajeError("Error al momento del grabar, reintente por favor");
        else if (rpta > 0) {
            mensajeOk("Registro grabado con éxito");
            $("#txt_vr1").val(rpta);
            llenarTabla();
        }
        else
            mensajeError(rpta);
    } catch (error) {
        mensajeError("Error: " + error);
    }
}

async function llenarComboProgXFac() {
    var idFac = $("#cboFacultad").val();
    var url = dir + "Programa/ListadoProgramas?codFac=" + idFac;
    let rpta = await llenarComboGral(url, "#cboPrograma");
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");

        return;
    }
    llenarTabla();
}

async function llenarComboFac() {
    var url = dir + "Facultad/ListadoFacultades";
    let rpta = await llenarComboGral(url, "#cboFacultad");
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}


async function llenarComboTipDoc() {
    var url = dir + "tipoDoc/ListarTipoDoc"; 
    let rpta = await llenarComboGral(url, "#cboTipoDoc");
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}



async function llenarComboJornada() {
    var url = dir + "jornada/ListarJornada";
    let rpta = await llenarComboGral(url, "#cboJornada");
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}

async function Consultar() {
    mensajeInfo("");
    try {
        let nroCarn = $("#txtCarnet").val();
        if (nroCarn == undefined || nroCarn.trim() == "" || parseInt(nroCarn, 10) <= 0) {
            mensajeError("Error, el numero de carné no es válido");
            $("#txtCarnet").trigger("focus");
            return;
        }
        const datosOut = await fetch(dir + "Estuadiante/consultarDatosEst?dato=" + nroCarn + "&cmd=1",
            { 
                method: "GET",
                mode: "cors",
                headers:
                {
                    "content-type": "application/json",
                }
            }
        );
        const datosln = await datosOut.json();
        if (datosln == "") {

            mensajeInfo("No se encontró estudiante con carnet vigente :" + nroCarn);
            return;
        }
        $("#cboFacultad").val(datosln[0].idF);
        llenarComboProgXFac(datosln[0].idP)
        $("#txtNroDoc").val(datosln[0].nroDoc);                              
        $("#cboTipoDoc").val(datosln[0].idTD);
        $("#txtNombre").val(datosln[0].nombre);
        $("#txtCarnet").val(datosln[0].carnet);
        $("#cboJornada").val(datosln[0].idJ);
        $("#chkActivo").prop("checked",datosln[0].activo);
        $("#txtObserv").val(datosln[0].observ);
        mensajeOk("registro Recuperado");



    }

    catch (erro) {
    mensajeError("Error: " + erro)

    }
}

async function Cancelar() {
    $("#cboFacultad")[0].selected = true;
    llenarComboProgXFac();
    $("#txtNroDoc").val("");
    $("#cboTipoDoc")[0].selected = true;
    $("#txtNombre").val("");
    $("#txtCarnet").val("");
    $("#cboJornada")[0].selected = true;
    $("#chkActivo").prop("checked", false);
    $("#txtObserv").val("");
    $("#cboFacultad").trigger("focus");
}

async function llenarTabla() {

    let idProg = $("#cboPrograma").val();

    let rpta = await llenarTablaGral(
        dir + "Estuadiante/consultarDatosEst?dato=" + idProg + "&cmd=2",
        "#tblDatos"
    );

    if (rpta != "Termino") {
        alerta("Error en el llenado de la tabla", rpta);
    }
}

function editarFila(datosFila) {                        
    $("#txtCarnet").val(datosFila.find('td:eq(1)').text());
    Consultar();
}

function Agregar() {
    mensajeInfo("");
    $("#txtCarnet").val(0);
    let nroDoc = $("#txtNroDoc").val();
    let name = $("#txtNombre").val();

    if (name.trim() == "" || nroDoc.trim() == "" || parseInt(nroDoc, 10) <= 0) {
        mensajeError("Error, los datos ingresados no son válidos");
        $("#txtNroDoc").trigger("focus");
        return;
    }

    let rpta = window.confirm("¿Confirma que desea agregar el estudiante?");
    if (rpta == true) {
        ejecutarComando("POST");

    }
    else {
        window.alert("Operación cancelada por el usuario");
        mensajeInfo("Cancelada opcion agregar");

    }


}

function Modificar() {
    mensajeInfo("");

    let Codi = $("#txtCarnet").val();
    let Nomb = $("#txtNombre").val();
    let nroD = $("#txtNroDoc").val();

    // Validaciones seguras

    if (nroD.trim() == "" || parseInt(nroD) <= 0) {
        mensajeError("Número de documento inválido");
        $("#txtNroDoc").trigger("focus");
        return;
    }

    if (Nomb.trim() == "" || Codi.trim() == "" || parseInt(Codi , 10) <=0 ) {
        mensajeError("Debe buscar 1 estudiante");
        $("#txtCarnet").trigger("focus");
        return;
    }

    let rpta = window.confirm("¿Confirma que desea modificar el estudiante?");

    if (rpta == true) {
        ejecutarComando("PUT");
    } else {
        window.alert("Operación cancelada por el usuario");
        mensajeInfo("Cancelada opcion modificar");
    }
}












