const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

let servicios = [];

function agregarServicio() {
    let servicio = document.getElementById("servicio").value;
    let fecha = document.getElementById("fecha").value;
    let horas = parseInt(document.getElementById("horas").value);
    let tipo = document.getElementById("tipo").value;

    if (!servicio || !fecha || isNaN(horas) || horas <= 0) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    let precio = tarifas[tipo] * horas;

    let nuevoServicio = {
        servicio,
        fecha,
        horas,
        precio
    };

    servicios.push(nuevoServicio);
    actualizarLista();
}

function actualizarLista() {
    let listaServicios = document.getElementById("listaServicios");
    listaServicios.innerHTML = "";

    let totalHoras = 0;
    let totalPrecio = 0;

    servicios.forEach((servicio, index) => {
        totalHoras += servicio.horas;
        totalPrecio += servicio.precio;

        let div = document.createElement("div");
        div.classList.add("servicio-item");
        div.innerHTML = `
            <b>${servicio.servicio.toUpperCase()}</b> - ${servicio.fecha} - 
            <b>${servicio.horas} Hs</b> - $${servicio.precio.toFixed(2)}
            <button class="delete-btn" onclick="eliminarServicio(${index})">🗑️</button>
        `;
        listaServicios.appendChild(div);
    });

    document.getElementById("totalHoras").innerText = totalHoras;
    document.getElementById("totalPrecio").innerText = totalPrecio.toFixed(2);
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarLista();
}
