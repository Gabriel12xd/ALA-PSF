let servicios = [];
const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

function agregarServicio() {
    let fecha = document.getElementById('fecha').value;
    let servicio = document.getElementById('servicio').value || "Sin nombre";
    let tipo = document.getElementById('tipo').value;
    let horas = parseInt(document.getElementById('horas').value);

    if (!fecha || isNaN(horas) || horas < 1) {
        alert("Por favor, ingrese una fecha y horas válidas.");
        return;
    }

    let precio = tarifas[tipo] * horas;

    servicios.push({ fecha, servicio, tipo, horas, precio });
    actualizarLista();
}

function actualizarLista() {
    let lista = document.getElementById('listaServicios');
    lista.innerHTML = "";
    let total = 0;

    servicios.forEach((s, index) => {
        total += s.precio;
        let item = document.createElement('li');
        item.innerHTML = `<strong>${s.fecha} - ${s.servicio}:</strong> ${s.horas}h - $${s.precio.toFixed(2)}
                          <button onclick="eliminarServicio(${index})">❌</button>`;
        lista.appendChild(item);
    });

    document.getElementById('total').innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarLista();
}
