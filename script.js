const tarifas = {
    publico_ordinario: 5051.25,
    publico_extraordinario: 6061.50,
    privado_ordinario: 8378.10,
    privado_extraordinario: 6981.75
};

let servicios = [];
let botonAgregar = document.getElementById("agregarBtn");

// Formatear fecha dinámica
function formatearFecha(fecha) {
    let fechaObj = new Date(fecha);
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
}

// Lógica de horarios CORREGIDA
function calcularHoras(fecha, horaInicio, horaFin, esFeriado) {
    let inicio = new Date(`${fecha}T${horaInicio}`);
    let fin = new Date(`${fecha}T${horaFin}`);
    if (fin < inicio) fin.setDate(fin.getDate() + 1);

    let horasOrdinarias = 0;
    let horasExtraordinarias = 0;
    let horaActual = new Date(inicio);

    while (horaActual < fin) {
        let dia = horaActual.getDay(); // 0 = Domingo, 6 = Sábado
        let hora = horaActual.getHours();
        let esSabado = dia === 6;

        if (esFeriado) {
            horasExtraordinarias++;
        } else {
            // Domingo: todas extraordinarias
            if (dia === 0) {
                horasExtraordinarias++;
            }
            // Sábado
            else if (esSabado) {
                if (hora >= 6 && hora < 12) {
                    horasOrdinarias++;
                } else {
                    horasExtraordinarias++;
                }
            }
            // Lunes a Viernes
            else if (dia >= 1 && dia <= 5) {
                if (hora >= 6 && hora < 22) {
                    horasOrdinarias++;
                } else {
                    horasExtraordinarias++;
                }
            }
            // Horario nocturno (22:00-06:00)
            else {
                horasExtraordinarias++;
            }
        }
        
        horaActual.setHours(horaActual.getHours() + 1);
    }

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

    // Asegurar que las horas tengan 00 minutos
    horaInicio = horaInicio.split(":")[0] + ":00";
    horaFin = horaFin.split(":")[0] + ":00";

    // Cálculos
    let { ordinarias, extraordinarias } = calcularHoras(fecha, horaInicio, horaFin, esFeriado);
    let precio = (tarifas[`${tipo}_ordinario`] * ordinarias) + (tarifas[`${tipo}_extraordinario`] * extraordinarias);

    // Guardar servicio
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
