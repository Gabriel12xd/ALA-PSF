const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

let servicios = [];
let botonAgregar = document.getElementById("agregarBtn");

// Lógica de horarios
function calcularHoras(fecha, horaInicio, horaFin, esFeriado) {
    let inicio = new Date(`${fecha}T${horaInicio}`);
    let fin = new Date(`${fecha}T${horaFin}`);
    if (fin < inicio) fin.setDate(fin.getDate() + 1); // Ajustar si pasa de medianoche

    let horasTotales = (fin - inicio) / (1000 * 60 * 60);
    let horasOrdinarias = 0;
    let horasExtraordinarias = 0;

    let dia = inicio.getDay(); // 0 = Domingo, 6 = Sábado
    let esSabado = dia === 6;

    // Feriado: todo extraordinario
    if (esFeriado) {
        horasExtraordinarias = horasTotales;
        return { ordinarias: 0, extraordinarias: horasExtraordinarias };
    }

    // Domingo: todo extraordinario
    if (dia === 0) {
        horasExtraordinarias = horasTotales;
        return { ordinarias: 0, extraordinarias: horasExtraordinarias };
    }

    // Sábado: antes de las 12 ordinario, después extraordinario
    if (esSabado) {
        let horaCorte = new Date(`${fecha}T12:00`);
        if (inicio < horaCorte) {
            horasOrdinarias = Math.min((horaCorte - inicio) / (1000 * 60 * 60), horasTotales);
        }
        horasExtraordinarias = horasTotales - horasOrdinarias;
        return { ordinarias: horasOrdinarias, extraordinarias: horasExtraordinarias };
    }

    // Lunes a Viernes: 06:00-22:00 ordinario, 22:00-06:00 extraordinario
    let horaInicioOrdinario = new Date(`${fecha}T06:00`);
    let horaFinOrdinario = new Date(`${fecha}T22:00`);

    if (inicio < horaInicioOrdinario) {
        horasExtraordinarias += Math.min((horaInicioOrdinario - inicio) / (1000 * 60 * 60), horasTotales);
    }
    if (fin > horaFinOrdinario) {
        horasExtraordinarias += Math.min((fin - horaFinOrdinario) / (1000 * 60 * 60), horasTotales);
    }
    horasOrdinarias = horasTotales - horasExtraordinarias;

    return { ordinarias: horasOrdinarias, extraordinarias: horasExtraordinarias };
}

function agregarServicio() {
    // Validación y recolección de datos
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

    // Cálculos
    let { ordinarias, extraordinarias } = calcularHoras(fecha, horaInicio, horaFin, esFeriado);
    let precio = (tarifas[`${tipo}_ordinario`] * ordinarias) + (tarifas[`${tipo}_extraordinario`] * extraordinarias);

    // Guardar servicio
    servicios.push({
        servicio,
        fecha,
        horaInicio,
        horaFin,
        ordinarias,
        extraordinarias,
        precio,
        tipo
    });

    actualizarInterfaz();
    programarNotificacion(fecha, horaInicio);
}

function actualizarInterfaz() {
    // Actualizar lista y totales
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
                <span style="color: #28a745">(${servicio.ordinarias.toFixed(1)}h ordinarias)</span>
                <span style="color: #ff4444">(${servicio.extraordinarias.toFixed(1)}h extraordinarias)</span>
            </div>
        `;
    });

    document.getElementById("totalOrdinarias").textContent = totalOrdinarias.toFixed(1);
    document.getElementById("totalExtraordinarias").textContent = totalExtraordinarias.toFixed(1);
    document.getElementById("totalPrecio").textContent = totalPrecio.toFixed(2);
}

function agregarCalendario(servicio, fecha, horaInicio, horaFin) {
    let url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(servicio)}&dates=${fecha.replace(/-/g, '')}T${horaInicio.replace(/:/g, '')}00Z/${fecha.replace(/-/g, '')}T${horaFin.replace(/:/g, '')}00Z&ctz=UTC&sf=true&output=xml`;
    window.open(url, '_blank');
}

function eliminarServicio(index) {
    servicios.splice(index, 1);
    actualizarInterfaz();
}

function programarNotificacion(fecha, horaInicio) {
    let tiempoNotificacion = new Date(`${fecha}T${horaInicio}`);
    tiempoNotificacion.setHours(tiempoNotificacion.getHours() - 2);
    
    let ahora = new Date();
    let diferencia = tiempoNotificacion - ahora;

    if (diferencia > 0) {
        setTimeout(() => {
            let campana = document.getElementById("notificacionCampana");
            campana.style.display = "block";
            setTimeout(() => campana.style.display = "none", 10000);
        }, diferencia);
    }
                    }
