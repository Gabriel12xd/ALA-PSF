const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

let servicios = [];
let botonAgregar = document.getElementById("agregarBtn");

// Formatear fecha en formato legible
function formatearFecha(fechaStr) {
    const [year, month, day] = fechaStr.split("-");
    const fechaObj = new Date(year, month - 1, day);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
}

// Calcular horas ordinarias/extraordinarias
function calcularHoras(fechaStr, horaInicio, horaFin, esFeriado) {
    const [year, month, day] = fechaStr.split("-");
    const [horaInicioH, horaInicioM] = horaInicio.split(":");
    const [horaFinH, horaFinM] = horaFin.split(":");

    let inicio = new Date(year, month - 1, day, horaInicioH, horaInicioM);
    let fin = new Date(year, month - 1, day, horaFinH, horaFinM);
    
    if (fin < inicio) fin.setDate(fin.getDate() + 1);

    let horasOrdinarias = 0;
    let horasExtraordinarias = 0;
    let horaActual = new Date(inicio);

    while (horaActual < fin) {
        const dia = horaActual.getDay();
        const hora = horaActual.getHours();
        const esSabado = dia === 6;

        if (esFeriado) {
            horasExtraordinarias++;
        } else {
            if (dia === 0) { // Domingo
                horasExtraordinarias++;
            } else if (esSabado) { // Sábado
                horasOrdinarias += (hora >= 6 && hora < 12) ? 1 : 0;
                horasExtraordinarias += (hora >= 12 || hora < 6) ? 1 : 0;
            } else { // Lunes a Viernes
                horasOrdinarias += (hora >= 6 && hora < 22) ? 1 : 0;
                horasExtraordinarias += (hora >= 22 || hora < 6) ? 1 : 0;
            }
        }
        horaActual.setHours(horaActual.getHours() + 1);
    }

    return { ordinarias: horasOrdinarias, extraordinarias: horasExtraordinarias };
}

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

    // Asegurar formato de hora
    horaInicio = horaInicio.split(":")[0] + ":00";
    horaFin = horaFin.split(":")[0] + ":00";

    // Calcular horas
    let { ordinarias, extraordinarias } = calcularHoras(fecha, horaInicio, horaFin, esFeriado);
    let precio = (tarifas[`${tipo}_ordinario`] * ordinarias) + (tarifas[`${tipo}_extraordinario`] * extraordinarias);

    // Agregar servicio
    servicios.push({
        servicio,
        fecha: formatearFecha(fecha),
        horaInicio,
        horaFin,
        ordinarias,
        extraordinarias,
        precio,
        tipo
    });

    // Mostrar notificación y actualizar
    mostrarNotificacion();
    actualizarInterfaz();
}

function mostrarNotificacion() {
    let notificacion = document.getElementById("notificacion");
    notificacion.style.display = "block";
    setTimeout(() => {
        notificacion.style.display = "none";
    }, 2000);
}

function actualizarInterfaz() {
    let lista = document.getElementById("listaServicios");
    lista.innerHTML = "";
    
    let totalOrdinarias = 0;
    let totalExtraordinarias = 0;
    let totalPrecio = 0;

    servicios.forEach((servicio, index) => {
        totalOrdinarias += servicio.ordinarias;
        totalExtraordinarias += servicio.extraordinarias;
        totalPrecio += servicio.precio;

        lista.innerHTML += `
            <div class="servicio-item">
                <b>${servicio.servicio}</b><br>
                ${servicio.fecha} | ${servicio.horaInicio} - ${servicio.horaFin}
                <button class="delete-btn" onclick="eliminarServicio(${index})">🗑️</button>
                <button class="calendar-btn" onclick="agregarCalendario('${servicio.servicio}', '${servicio.fecha}', '${servicio.horaInicio}', '${servicio.horaFin}')">📅</button>
                <div class="precio-servicio">$${servicio.precio.toFixed(2)}</div>
                <span style="color: #28a745">(${servicio.ordinarias.toFixed(1)}h ordinarias)</span>
                <span style="color: #ff4444">(${servicio.extraordinarias.toFixed(1)}h extraordinarias)</span>
            </div>
        `;
    });

    document.getElementById("totalOrdinarias").textContent = totalOrdinarias.toFixed(1);
    document.getElementById("totalExtraordinarias").textContent = totalExtraordinarias.toFixed(1);
    document.getElementById("totalPrecio").textContent = totalPrecio.toFixed(2);
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarInterfaz();
}

function agregarCalendario(servicio, fecha, horaInicio, horaFin) {
    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(servicio)}&dates=${fecha.replace(/-/g, '')}T${horaInicio.replace(/:/g, '')}00Z/${fecha.replace(/-/g, '')}T${horaFin.replace(/:/g, '')}00Z`;
    window.open(url, '_blank');
}
