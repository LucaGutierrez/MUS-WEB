/* ===========================
   CHECKOUT MUSÉ
=========================== */

const carritoCheckout = JSON.parse(
    localStorage.getItem("carritoMuse")
) || [];

const productosResumen = document.getElementById("productosResumen");
const subtotalCheckout = document.getElementById("subtotalCheckout");
const envioCheckout = document.getElementById("envioCheckout");
const totalCheckout = document.getElementById("totalCheckout");

const formularioCheckout = document.getElementById("formularioCheckout");
const confirmacionPedido = document.getElementById("confirmacionPedido");
const datosTransferencia = document.getElementById("datosTransferencia");
const confirmacionEfectivo = document.getElementById("confirmacionEfectivo");
const numeroPedido = document.getElementById("numeroPedido");
const mensajeError = document.getElementById("mensajeError");
const enlaceWhatsApp = document.getElementById("enlaceWhatsApp");

const provincia = document.getElementById("provincia");
const precioCorreo = document.getElementById("precioCorreo");
const precioAndreani = document.getElementById("precioAndreani");

let costoEnvioSeleccionado = 0;

/*
    Tarifas provisorias de prueba.
    Más adelante pueden reemplazarse por una API real.
*/

const tarifasEnvio = {
    caba: {
        correo: 4500,
        andreani: 5200
    },

    "buenos-aires": {
        correo: 5900,
        andreani: 6800
    },

    cordoba: {
        correo: 8200,
        andreani: 9600
    },

    "santa-fe": {
        correo: 8200,
        andreani: 9600
    },

    "entre-rios": {
        correo: 7800,
        andreani: 9000
    },

    mendoza: {
        correo: 9100,
        andreani: 10400
    },

    "san-juan": {
        correo: 9300,
        andreani: 10600
    },

    "san-luis": {
        correo: 8800,
        andreani: 10100
    },

    tucuman: {
        correo: 9500,
        andreani: 10900
    },

    salta: {
        correo: 9800,
        andreani: 11200
    },

    jujuy: {
        correo: 9900,
        andreani: 11400
    },

    catamarca: {
        correo: 9500,
        andreani: 10900
    },

    "la-rioja": {
        correo: 9400,
        andreani: 10800
    },

    "santiago-del-estero": {
        correo: 9400,
        andreani: 10800
    },

    chaco: {
        correo: 9600,
        andreani: 11000
    },

    corrientes: {
        correo: 9500,
        andreani: 10900
    },

    formosa: {
        correo: 9900,
        andreani: 11400
    },

    misiones: {
        correo: 9800,
        andreani: 11200
    },

    "la-pampa": {
        correo: 8500,
        andreani: 9800
    },

    neuquen: {
        correo: 10300,
        andreani: 11900
    },

    "rio-negro": {
        correo: 10500,
        andreani: 12100
    },

    chubut: {
        correo: 11500,
        andreani: 13200
    },

    "santa-cruz": {
        correo: 12800,
        andreani: 14700
    },

    "tierra-del-fuego": {
        correo: 13900,
        andreani: 15900
    }
};


/* ===========================
   FORMATO DE PRECIOS
=========================== */

function formatearPrecio(precio) {

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(precio);

}


/* ===========================
   CALCULAR SUBTOTAL
=========================== */

function calcularSubtotal() {

    return carritoCheckout.reduce(
        (total, producto) =>
            total + producto.precio * producto.cantidad,
        0
    );

}


/* ===========================
   MOSTRAR PRODUCTOS
=========================== */

function dibujarResumen() {

    productosResumen.innerHTML = "";

    if (carritoCheckout.length === 0) {

        productosResumen.innerHTML = `
            <p class="carrito-checkout-vacio">
                Tu carrito está vacío.
            </p>
        `;

    }

    carritoCheckout.forEach(producto => {

        const articulo = document.createElement("article");

        articulo.className = "producto-resumen";

        articulo.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}">

            <div>

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.descripcion || ""}
                    · Cantidad: ${producto.cantidad}
                </p>

            </div>

            <strong>
                ${formatearPrecio(
                    producto.precio * producto.cantidad
                )}
            </strong>

        `;

        productosResumen.appendChild(articulo);

    });

    actualizarTotales();

}


/* ===========================
   ACTUALIZAR TOTALES
=========================== */

function actualizarTotales() {

    const subtotal = calcularSubtotal();

    const total =
        subtotal + costoEnvioSeleccionado;

    subtotalCheckout.textContent =
        formatearPrecio(subtotal);

    envioCheckout.textContent =
        costoEnvioSeleccionado === 0
            ? "Gratis"
            : formatearPrecio(costoEnvioSeleccionado);

    totalCheckout.textContent =
        formatearPrecio(total);

}


/* ===========================
   ACTUALIZAR TARIFAS
=========================== */

function actualizarTarifas() {

    const seleccionProvincia =
        provincia.value;

    const tarifas =
        tarifasEnvio[seleccionProvincia];

    const radioCorreo = document.querySelector(
        'input[name="envio"][value="correo"]'
    );

    const radioAndreani = document.querySelector(
        'input[name="envio"][value="andreani"]'
    );

    if (!tarifas) {

        precioCorreo.textContent =
            "Elegí provincia";

        precioAndreani.textContent =
            "Elegí provincia";

        radioCorreo.dataset.precio = "0";
        radioAndreani.dataset.precio = "0";

    } else {

        precioCorreo.textContent =
            formatearPrecio(tarifas.correo);

        precioAndreani.textContent =
            formatearPrecio(tarifas.andreani);

        radioCorreo.dataset.precio =
            String(tarifas.correo);

        radioAndreani.dataset.precio =
            String(tarifas.andreani);

    }

    const envioActual = document.querySelector(
        'input[name="envio"]:checked'
    );

    costoEnvioSeleccionado =
        Number(envioActual?.dataset.precio || 0);

    actualizarTotales();

}


/* ===========================
   MARCAR TARJETAS ELEGIDAS
=========================== */

function actualizarTarjetasSeleccionadas(nombreGrupo) {

    document
        .querySelectorAll(
            `input[name="${nombreGrupo}"]`
        )
        .forEach(input => {

            input
                .closest(".tarjeta-opcion")
                ?.classList.toggle(
                    "seleccionada",
                    input.checked
                );

        });

}


/* ===========================
   CAMBIO DE PROVINCIA
=========================== */

provincia.addEventListener(
    "change",
    actualizarTarifas
);


/* ===========================
   CAMBIO DE ENVÍO
=========================== */

document
    .querySelectorAll('input[name="envio"]')
    .forEach(input => {

        input.addEventListener("change", () => {

            costoEnvioSeleccionado =
                Number(input.dataset.precio || 0);

            actualizarTarjetasSeleccionadas("envio");

            actualizarTotales();

            const efectivo = document.querySelector(
                'input[name="pago"][value="efectivo"]'
            );

            if (
                input.value !== "retiro" &&
                efectivo.checked
            ) {

                document.querySelector(
                    'input[name="pago"][value="transferencia"]'
                ).checked = true;

                actualizarTarjetasSeleccionadas("pago");

            }

        });

    });


/* ===========================
   CAMBIO DE PAGO
=========================== */

document
    .querySelectorAll('input[name="pago"]')
    .forEach(input => {

        input.addEventListener("change", () => {

            actualizarTarjetasSeleccionadas("pago");

        });

    });


/* ===========================
   VALIDAR FORMULARIO
=========================== */

function validarFormulario() {

    mensajeError.textContent = "";

    if (carritoCheckout.length === 0) {

        mensajeError.textContent =
            "Tu carrito está vacío. Agregá un producto antes de continuar.";

        return false;

    }

    const camposObligatorios = [
        "email",
        "nombre",
        "apellido",
        "telefono",
        "provincia",
        "codigoPostal",
        "localidad",
        "calle",
        "numero"
    ];

    const campoIncompleto =
        camposObligatorios.find(id => {

            const campo =
                document.getElementById(id);

            return !campo.value.trim();

        });

    if (campoIncompleto) {

        mensajeError.textContent =
            "Completá todos los datos obligatorios.";

        document
            .getElementById(campoIncompleto)
            .focus();

        return false;

    }

    const envio = document.querySelector(
        'input[name="envio"]:checked'
    );

    const pago = document.querySelector(
        'input[name="pago"]:checked'
    );

    if (
        envio.value !== "retiro" &&
        costoEnvioSeleccionado === 0
    ) {

        mensajeError.textContent =
            "Elegí una provincia para calcular el envío.";

        provincia.focus();

        return false;

    }

    if (
        pago.value === "efectivo" &&
        envio.value !== "retiro"
    ) {

        mensajeError.textContent =
            "El efectivo solo está disponible con retiro en showroom.";

        return false;

    }

    return true;

}


/* ===========================
   GENERAR NÚMERO DE PEDIDO
=========================== */

function generarNumeroPedido() {

    const fecha = new Date();

    const parteFecha =
        String(fecha.getFullYear()).slice(-2) +
        String(fecha.getMonth() + 1).padStart(2, "0") +
        String(fecha.getDate()).padStart(2, "0");

    const aleatorio = Math.floor(
        1000 + Math.random() * 9000
    );

    return `MUSE-${parteFecha}-${aleatorio}`;

}


/* ===========================
   CONFIRMAR PEDIDO
=========================== */

/* ===========================
   ENVIAR PEDIDO A FORMSPREE
=========================== */

async function enviarPedidoAFormspree(datosPedido) {

    const respuesta = await fetch(
        "https://formspree.io/f/xlgqwagd",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify(datosPedido)
        }
    );

    if (!respuesta.ok) {

        const resultado = await respuesta.json().catch(() => null);

        console.error(
            "Error de Formspree:",
            resultado
        );

        throw new Error(
            "No pudimos registrar el pedido. Intentá nuevamente."
        );

    }

    return respuesta.json();

}

/* ===========================
   CONFIRMAR Y ENVIAR PEDIDO
=========================== */

formularioCheckout.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const botonConfirmar = formularioCheckout.querySelector(
            'button[type="submit"]'
        );

        botonConfirmar.disabled = true;
        botonConfirmar.textContent = "Registrando pedido...";

        mensajeError.textContent = "";

        const pedido = generarNumeroPedido();

        const pagoSeleccionado = document.querySelector(
            'input[name="pago"]:checked'
        );

        const envioSeleccionado = document.querySelector(
            'input[name="envio"]:checked'
        );

        const pago = pagoSeleccionado.value;
        const envio = envioSeleccionado.value;

        const subtotal = calcularSubtotal();

        const total =
            subtotal + costoEnvioSeleccionado;

        const nombre = document
            .getElementById("nombre")
            .value
            .trim();

        const apellido = document
            .getElementById("apellido")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const telefono = document
            .getElementById("telefono")
            .value
            .trim();

        const provinciaSeleccionada =
            provincia.options[provincia.selectedIndex].text;

        const codigoPostal = document
            .getElementById("codigoPostal")
            .value
            .trim();

        const localidad = document
            .getElementById("localidad")
            .value
            .trim();

        const calle = document
            .getElementById("calle")
            .value
            .trim();

        const numero = document
            .getElementById("numero")
            .value
            .trim();

        const departamento = document
            .getElementById("departamento")
            .value
            .trim();

        const indicaciones = document
            .getElementById("indicaciones")
            .value
            .trim();

        const nombreEnvio = {
            retiro: "Retiro en Paraguay 1275",
            correo: "Correo Argentino",
            andreani: "Andreani"
        };

        const nombrePago = {
            transferencia: "Transferencia bancaria",
            efectivo: "Efectivo al retirar"
        };

        /*
            Convertimos los productos en un texto fácil
            de leer dentro del correo.
        */

        const detalleProductos = carritoCheckout
            .map(producto => {

                const totalProducto =
                    producto.precio * producto.cantidad;

                return (
                    `${producto.cantidad} x ${producto.nombre}` +
                    ` — ${formatearPrecio(totalProducto)}`
                );

            })
            .join("\n");

        const direccionCompleta =
            envio === "retiro"
                ? "Retiro en Paraguay 1275, CABA"
                : (
                    `${calle} ${numero}` +
                    `${departamento
                        ? `, departamento ${departamento}`
                        : ""
                    }` +
                    `, ${localidad}, ${provinciaSeleccionada}` +
                    `, CP ${codigoPostal}`
                );

        /*
            Estos son los datos que vas a recibir
            por Formspree.
        */

        const datosPedido = {

            _subject:
                `Nuevo pedido MUSÉ — ${pedido}`,

            codigo_pedido:
                pedido,

            cliente:
                `${nombre} ${apellido}`,

            email_cliente:
                email,

            telefono_cliente:
                telefono,

            productos:
                detalleProductos,

            subtotal:
                formatearPrecio(subtotal),

            metodo_envio:
                nombreEnvio[envio],

            costo_envio:
                costoEnvioSeleccionado === 0
                    ? "Gratis"
                    : formatearPrecio(costoEnvioSeleccionado),

            total:
                formatearPrecio(total),

            metodo_pago:
                nombrePago[pago],

            direccion:
                direccionCompleta,

            indicaciones:
                indicaciones || "Sin indicaciones",

            fecha:
                new Date().toLocaleString(
                    "es-AR"
                )

        };

        try {

            /*
                Primero lo enviamos a Formspree.
                Si falla, no borramos el carrito.
            */

            await enviarPedidoAFormspree(
                datosPedido
            );

            formularioCheckout.style.display =
                "none";

            confirmacionPedido.classList.add(
                "visible"
            );

            numeroPedido.textContent =
                `Número de pedido: ${pedido} · ` +
                `Total: ${formatearPrecio(total)}`;

            datosTransferencia.classList.toggle(
                "visible",
                pago === "transferencia"
            );

            confirmacionEfectivo.classList.toggle(
                "visible",
                pago === "efectivo"
            );

            const textoWhatsapp = encodeURIComponent(

                `Hola MUSÉ. Realicé el pedido ${pedido}.\n\n` +

                `Cliente: ${nombre} ${apellido}\n` +

                `Total: ${formatearPrecio(total)}\n` +

                `Entrega: ${nombreEnvio[envio]}\n\n` +

                `Adjunto el comprobante de transferencia.`

            );

            enlaceWhatsApp.href =
                "https://wa.me/5491133491144" +
                `?text=${textoWhatsapp}`;

            localStorage.setItem(
                "ultimoPedidoMuse",
                JSON.stringify({
                    pedido,
                    total,
                    pago,
                    envio,
                    cliente: `${nombre} ${apellido}`,
                    fecha: new Date().toISOString()
                })
            );

            /*
                Solo vaciamos el carrito después
                de que Formspree confirme el envío.
            */

            localStorage.removeItem(
                "carritoMuse"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            console.error(error);

            mensajeError.textContent =
                "No pudimos registrar el pedido. " +
                "Revisá tu conexión e intentá nuevamente.";

            botonConfirmar.disabled = false;

            botonConfirmar.textContent =
                "Confirmar pedido";

        }

    }
);

/* ===========================
   INICIALIZAR
=========================== */

dibujarResumen();

actualizarTarjetasSeleccionadas("envio");

actualizarTarjetasSeleccionadas("pago");