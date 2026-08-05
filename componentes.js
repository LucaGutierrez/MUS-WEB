/* ===========================
   COMPONENTES COMPARTIDOS
=========================== */

async function cargarComponente(
    selector,
    archivo
) {
    const contenedor =
        document.querySelector(selector);

    if (!contenedor) {
        return;
    }

    try {
        const respuesta =
            await fetch(archivo);

        if (!respuesta.ok) {
            throw new Error(
                `No se pudo cargar ${archivo}`
            );
        }

        contenedor.innerHTML =
            await respuesta.text();

    } catch (error) {
        console.error(error);

        contenedor.innerHTML = `
            <p>
                No se pudo cargar esta sección.
            </p>
        `;
    }
}


function cargarScriptPrincipal() {

    const script =
        document.createElement("script");

    script.src = "script.js";

    script.defer = true;

    document.body.appendChild(script);
}


async function iniciarComponentes() {

    await Promise.all([

        cargarComponente(
            "#navbarCompartido",
            "componentes/navbar.html"
        ),

        cargarComponente(
            "#footerCompartido",
            "componentes/footer.html"
        )

    ]);

    /*
        Cargamos script.js recién después de
        insertar navbar y footer en el HTML.
    */

    cargarScriptPrincipal();
}


document.addEventListener(
    "DOMContentLoaded",
    iniciarComponentes
);