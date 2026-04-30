var dir = "http://localhost:XXXXX/api/";

jQuery(function () {

    llenarComboFac();
    llenarComboJornada();
    llenarComboTipDoc();
    //Carga el menú
    $("#dvMenu").load("../Paginas/Menu.html");

    //Registrar los botones para responder al evento click
    $("#btnAgre").on("click", function () {
        alerta("Agregar", "Información");
        //Agregar();
    });
    $("#btnModi").on("click", function () {
        alerta("Modificar");
        //Modificar();
    });
    $("#btnBusc").on("click", function () {
        alerta("Buscar", "Información");
        //Consultar();
    });
    $("#btnCanc").on("click", function () {
        alerta("Cancelar");
        //Cancelar();
    });
    $("#btnImpr").on("click", function () {
        alerta("Impresión");
        //Imprimir();
    });


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
        position: '¨center',
        type: 'info',
        title: titulo,
        text: msj
    });
}

async function ejecutarComando(accion) {
    mensajeInfo("");
    //Capturar los datos de entrada
    let _vr1 = $("#txt_vr1").val();
    let _vr2 = $("#cbo_vr2").val();
    let _vr3 = $("#txt_vr3").val();
    let _vr4 = $("#chk_vr4").prop("checked");

    alert("vr1: " + _vr1 + "..." + ", vr2: " + _vr2 + "..." + ", vr3: " + _vr3 + "..." + ", vr4: " + _vr4);

    if (_vr1 == undefined || _vr1.trim() == "" || parseInt(_vr1, 10) < 0) {
        mensajeError("xxx no válido");
        $("#txtCarnet").trigger("focus");
        return;
    }
    if (parseInt(_vr2, 10) <= 0) {
        mensajeError(" xxx no válido");
        $("#cboPrograma").trigger("focus");
        return;
    }

    //Crear Json 
    let datosOut = {
        campo1: _vr1,
        campo2: _vr2,
        campo3: _vr3,
        campo4: _vr4
    }
    //Invocar el servicio con fetch
    try {
        const response = await fetch(dir + "nombre servicio", {
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
            //llenarTabla();
        }
        else
            mensajeError(rpta);
    } catch (error) {
        mensajeError("Error: ", error);
    }
}


async function llenarComboFac() {
    var url = dir + "facultad/listadoFacultades";
    let rpta = await llenarComboGral(url, #cboFacultad);
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}


async function llenarComboTipDoc() {
    var url = dir + "tipoDoc/listadoTipDocs";
    let rpta = await llenarComboGral(url, #cboTipoDoc);
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}



async function llenarComboJornada() {
    var url = dir + "jornada/listadoJornadas";
    let rpta = await llenarComboGral(url, #cboJornada);
    if (rpta != "Termino") {
        alerta("Error en el llenado Combo", "ERROR");
        return;
    }
}


