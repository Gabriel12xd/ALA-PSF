let servicios = [];
const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

function agregarServicio() {
    let servicio = document.getElementById("servicio").value;
    let fecha = document.getElementById("fecha").value;
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFin = document.getElementById("horaFin").value;
    let tipo = document.getElementById("tipo").value;
    let esFeriado = document.getElementById("feriado").checked;

    if (!servicio || !fecha || !horaInicio || !horaFin) {
        alert("Complete todos los campos");
        return;
    }

    let fechaFormateada = formatearFecha(fecha);
    let { ordinarias, extraordinarias } = calcularHoras(fecha, horaInicio, horaFin, esFeriado);
    let precio = (tarifas[`${tipo}_ordinario`] * ordinarias) + (tarifas[`${tipo}_extraordinario`] * extraordinarias);

    servicios.push({
        servicio,
        fecha: fechaFormateada,
        horaInicio,
        horaFin,
        ordinarias,
        extraordinarias,
        precio,
        tipo
    });

    mostrarNotificacion();
    actualizarInterfaz();
}

function actualizarInterfaz() {
    let lista = document.getElementById("listaServicios");
    lista.innerHTML = "";
    let totalHoras = 0, totalPrecio = 0;

    servicios.forEach((servicio, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${servicio.servicio} - ${servicio.fecha} - ${servicio.horaInicio} a ${servicio.horaFin}
            <br>🕒 Horas: ${servicio.ordinarias + servicio.extraordinarias} | 💰 $${servicio.precio.toFixed(2)}
            <br>
            <button class="editar" onclick="editarServicio(${index})">✏️ Editar</button>
            <button class="eliminar" onclick="eliminarServicio(${index})">❌ Eliminar</button>
        `;
        lista.appendChild(li);

        totalHoras += servicio.ordinarias + servicio.extraordinarias;
        totalPrecio += servicio.precio;
    });

    document.getElementById("totalHoras").textContent = `Horas: ${totalHoras}`;
    document.getElementById("totalPrecio").textContent = `Total: $${totalPrecio.toFixed(2)}`;
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarInterfaz();
}

function editarServicio(index) {
    let servicio = servicios[index];

    document.getElementById("servicio").value = servicio.servicio;
    document.getElementById("fecha").value = servicio.fecha.split(" de ").reverse().join("-");
    document.getElementById("horaInicio").value = servicio.horaInicio;
    document.getElementById("horaFin").value = servicio.horaFin;
    document.getElementById("tipo").value = servicio.tipo;
    document.getElementById("feriado").checked = servicio.esFeriado || false;

    let botonAgregar = document.getElementById("agregarBtn");
    botonAgregar.textContent = "💾 GUARDAR CAMBIOS";
    botonAgregar.onclick = function () {
        guardarEdicion(index);
    };
}

function guardarEdicion(index) {
    let servicioEditado = document.getElementById("servicio").value;
    let fechaEditada = document.getElementById("fecha").value;
    let horaInicioEditada = document.getElementById("horaInicio").value;
    let horaFinEditada = document.getElementById("horaFin").value;
    let tipoEditado = document.getElementById("tipo").value;
    let esFeriadoEditado = document.getElementById("feriado").checked;

    if (!servicioEditado || !fechaEditada || !horaInicioEditada || !horaFinEditada) {
        alert("Complete todos los campos");
        return;
    }

    let fechaFormateada = formatearFecha(fechaEditada);
    let { ordinarias, extraordinarias } = calcularHoras(fechaEditada, horaInicioEditada, horaFinEditada, esFeriadoEditado);
    let precioEditado = (tarifas[`${tipoEditado}_ordinario`] * ordinarias) + (tarifas[`${tipoEditado}_extraordinario`] * extraordinarias);

    servicios[index] = {
        servicio: servicioEditado,
        fecha: fechaFormateada,
        horaInicio: horaInicioEditada,
        horaFin: horaFinEditada,
        ordinarias,
        extraordinarias,
        precio: precioEditado,
        tipo: tipoEditado
    };

    let botonAgregar = document.getElementById("agregarBtn");
    botonAgregar.textContent = "➕ AÑADIR";
    botonAgregar.onclick = agregarServicio;

    mostrarNotificacion();
    actualizarInterfaz();
}

function mostrarNotificacion() {
    alert("Guardado");
}

function formatearFecha(fecha) {
    return fecha.split("-").reverse().join(" de ");
}

function calcularHoras(fecha, inicio, fin, feriado) {
    return { ordinarias: 5, extraordinarias: 3 }; 
}
