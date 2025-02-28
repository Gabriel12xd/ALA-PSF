let servicios = [];

function agregarServicio() {
    let fecha = document.getElementById("fecha").value;
    let tipo = document.getElementById("tipo").value;
    let horas = parseInt(document.getElementById("horas").value);
    let nombre = document.getElementById("nombre").value || "Sin Nombre";

    if (!fecha || isNaN(horas) || horas <= 0) {
        alert("❌ Ingrese una fecha y una cantidad válida de horas.");
        return;
    }

    let tarifas = {
        "publico_ordinario": 5051.25,
        "publico_extraordinario": 6061.50,
        "privado_ordinario": 8378.10,
        "privado_extraordinario": 6981.75
    };

    let monto = horas * tarifas[tipo];

    let servicio = { fecha, tipo, horas, monto, nombre };
    servicios.push(servicio);
    actualizarLista();
}

function actualizarLista() {
    let lista = document.getElementById("listaServicios");
    lista.innerHTML = "";

    let totalHoras = 0;
    let totalMonto = 0;

    servicios.forEach((servicio, index) => {
        totalHoras += servicio.horas;
        totalMonto += servicio.monto;

        let li = document.createElement("li");
        li.innerHTML = `
            📅 <strong>${servicio.fecha}</strong> | ${servicio.nombre} 
            ⏳ ${servicio.horas}h 💵 $${servicio.monto.toFixed(2)}
            <button onclick="eliminarServicio(${index})">❌</button>
        `;
        lista.appendChild(li);
    });

    document.getElementById("totalHoras").innerText = totalHoras;
    document.getElementById("totalMonto").innerText = totalMonto.toFixed(2);
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarLista();
}
