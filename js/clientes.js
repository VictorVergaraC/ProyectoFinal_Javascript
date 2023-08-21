export const arrClientes = JSON.parse(localStorage.getItem('arrClientes')) || []

const getCliente = (xRut) => {
    return arrClientes.find(cliente => cliente.rut == xRut) || false
}

export const addCliente = (paramCliente) => {
    if (!existeCliente(paramCliente.rut)) {
        arrClientes.push(paramCliente)
        localStorage.setItem('arrClientes', JSON.stringify(arrClientes))
    }
    return true
}

const rellenarForm = (objCliente) => {
    document.getElementById('rut').value       = objCliente.rut
    document.getElementById('nombre').value    = objCliente.nombre 
    document.getElementById('email').value     = objCliente.email
    document.getElementById('direccion').value = objCliente.direccion
}

const limpiarForm = () => {
    document.getElementById('nombre').value    = ''
    document.getElementById('email').value     = ''
    document.getElementById('direccion').value = ''
}

export const arrCompras = JSON.parse(localStorage.getItem('arrCompras')) || []

export const addCompra = (idCliente) => {
    let idCompra = (arrCompras.length > 0) ? arrCompras[arrCompras.length -1].id_compra + 1 : 1
    arrCompras.push({   
            id_compra      : idCompra, 
            id_cliente     : idCliente, 
            detalle_compra : JSON.parse(localStorage.getItem('carrito'))
        })
    localStorage.setItem('arrCompras', JSON.stringify(arrCompras))
}

const ultimaCompra = (idCliente) => {
    const ultCarrito = arrCompras.filter(compra => compra.id_cliente == idCliente)
    if (ultCarrito) {
        return ultCarrito[ultCarrito.length -1]
    }
    return false
}

const existeCliente = (xRut) => arrClientes.some(cliente => cliente.rut == xRut) ? true : false

document.querySelectorAll('input').forEach(nodo => {
    nodo.addEventListener('keypress', (evt) => {
        if (evt.keyCode == 13) {
            evt.preventDefault()
        }
        switch(evt.target.getAttribute("name")) {
            case "rut":
                if (evt.keyCode == 13) {
                    const cli = getCliente(document.getElementById('rut').value)
                    if (cli) {
                        rellenarForm(cli)
                        Toastify({
                            text    : "Bienvenid@ de vuelta "+ cli.nombre + "!",
                            gravity : 'top',
                            position: 'right',
                                duration: 2000,
                                style   : {
                                    background : 'linear-gradient(to right, #00b09b, #96c92d)'
                                }
                        }).showToast()
                        let lastCompra = ultimaCompra(document.getElementById('rut').value)
                        if (lastCompra) {
                            let salidaHtml = ''
                            lastCompra = lastCompra.detalle_compra
                            const detalleUltCompra = document.getElementById('detalleUltCompra')
                            
                            lastCompra.forEach(producto => {
                                salidaHtml += `
                                <tr>
                                    <td>
                                        <img src="${producto.imgUrl}" class="img-fluid" style="height: 8rem;" alt="${producto.nombre}">
                                    </td>
                                    <td>
                                        <p class="card-text">Precio: ${formatter.format(producto.precio)}</p>
                                        <p class="card-text">Cantidad: ${producto.cantidad}</p>
                                        <p class="card-text">Sub-Total: ${ formatter.format(producto.cantidad * producto.precio)}</p>
                                        <p><strong>${producto.nombre}</strong></p>
                                    </td>
                                </tr>
                                `
                            })
                            detalleUltCompra.innerHTML = `
                            <br>
                            <div class="row">
                                <h5>¿Recuerdas tu última compra?</h5><br>
                                <div>
                                    <table class="table table-sm table-borderless">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th align="right">Detalle</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${salidaHtml}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            `

                        }
                    } else {
                        limpiarForm()
                    }
                    document.getElementById('nombre').focus()
                }
                break
            case "nombre":
                if (evt.keyCode == 13) {
                    document.getElementById('email').focus()
                }
                break
            case "email":
                if (evt.keyCode == 13) {
                    document.getElementById('direccion').focus()
                }
                break
            case "direccion":
                if (evt.keyCode == 13) {
                    document.getElementById('btnEnviar').focus()
                }
                break
        }
    })
})

const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
})