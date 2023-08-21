export const arrCarrito = JSON.parse(localStorage.getItem('carrito')) || []

export const addCarrito = (paramProducto) => {

    if (existeEnCarrito(paramProducto.id)) {
        let indice = arrCarrito.findIndex(objProducto => objProducto.id === paramProducto.id)
        arrCarrito[indice].cantidad++
    } else {
        paramProducto.cantidad = 1
        arrCarrito.push(paramProducto)
    }
    console.table(arrCarrito)   
    localStorage.setItem('carrito', JSON.stringify(arrCarrito));
}

const existeEnCarrito = (xId) => {
    return (arrCarrito.some(objProducto => objProducto.id == xId)) ? true : false
}

const eliminarDeCarrito = (xId) => {
    const indice = arrCarrito.findIndex(objProducto => objProducto.id == xId)
    arrCarrito.splice(indice, 1);
    localStorage.setItem('carrito', JSON.stringify(arrCarrito))
}

const modificarCantidad = (paramAccion, paramID) => {
    const indice = arrCarrito.findIndex(objProducto => objProducto.id == paramID)
    if (paramAccion == '+') {
        arrCarrito[indice].cantidad++
    } else {
        if (arrCarrito[indice].cantidad > 1) {
            arrCarrito[indice].cantidad--;
        } else {
            swal.fire({
                title: '¿Desea continuar?',
                text: 'Está a punto de quitar un producto del carrito',
                icon: 'warning',
                confirmButtonText: 'Si, seguro.',
                cancelButtonText: 'No, cancelar',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6'
            }).then(response => {
                if (response.isConfirmed) {
                    eliminarDeCarrito(paramID)
                    cargarCarrito()
                }
            })
        }
    }
    localStorage.setItem('carrito', JSON.stringify(arrCarrito))
    cargarCarrito()
}
					
export const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
})
    
const cargarCarrito = () => {
    const carritoView = document.getElementById('listadoProductosCarrito')
    const detalleCarrito = document.getElementById('detalleCarritoText')

    if (carritoView) {

        carritoView.innerHTML = ``
        arrCarrito.forEach(producto => {
            let newDiv = document.createElement('div')
            newDiv.classList.add('card','mx-1','mt-1','col-2','text-center')
            newDiv.innerHTML = `
            <img src="${producto.imgUrl}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
            </div>
            <div class="card-footer bg-white">
                <p class="card-text">Cantidad: ${producto.cantidad}</p>
                <p class="card-text">${formatter.format(producto.precio)}</p>
                <p class="card-text">Sub-Total: ${ formatter.format(producto.cantidad * producto.precio)}</p>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <button id="${producto.id}" name="${producto.id}" href="#" class="btn btn-outline-warning my-1 modificarCantidad">-</button>
                <button id="${producto.id}" name="${producto.id}" href="#" class="btn btn-outline-success my-1 modificarCantidad">+</button>
                <button id="${producto.id}" name="${producto.id}" href="#" class="btn btn-outline-danger my-1 deleteCart"><i class="fa-solid fa-trash"></i></button>
            </div>
            `
            carritoView.appendChild(newDiv)
        });
       
        document.querySelectorAll(".deleteCart").forEach(elem => {
            elem.addEventListener("click", nodo => {
                
                let newProducto = nodo.target.getAttribute("name")

                swal.fire({
                    title : '¿Desea continuar?',
                    text  : 'Está a punto de quitar un producto del carrito',
                    icon  : 'warning',
                    confirmButtonText : 'Si, seguro.',
                    cancelButtonText  : 'No, cancelar',
                    showCancelButton  : true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor : '#3085d6'
                }).then(response => {
                    if(response.isConfirmed) {
                        eliminarDeCarrito(newProducto)
                        swal.fire({
                            title : 'Producto eliminado!',
                            text  : ' ',
                            icon  : 'success',
                            confirmButtonText : 'Continuar',
                            showCancelButton  : false
                        }).then(resp => {
                            cargarCarrito()
                        })
                    } 
                })
            })
        })
        document.querySelectorAll('.modificarCantidad').forEach(elem => {
            elem.addEventListener("click", nodo => {
                
                let accion = nodo.target.textContent.substring(0, 1)
                let producto = nodo.target.getAttribute("name")
                modificarCantidad(accion, producto)        
            })
        })
        cargarDetalle()
    }

}

const cargarDetalle = () => {
    let carga         = false
    let totalItems    = 0
    let totalCantidad = 0
    let totalNeto     = 0
    let totalCompra   = 0

    arrCarrito.forEach(producto => {
        carga = true
        totalCantidad += parseFloat(producto.cantidad)
        totalCompra   += parseFloat(producto.cantidad * producto.precio)
        totalNeto     += parseFloat((producto.cantidad * producto.precio) / 1.19)
        totalItems    += parseFloat(1)
    })
    if (carga == false) { loadCarrito() }
    const detalleCarrito = document.getElementById('detalleCarritoText')
    const parrafoDetalle = document.createElement('p')
    detalleCarrito.innerHTML = ``
    parrafoDetalle.innerHTML = `
        <table class="table-sm table-borderless">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Totales</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td align="left">Total Items</td>
                    <td align="end">${totalItems}</td>
                </tr>
                <tr>
                    <td align="left">Cantidad</td>
                    <td align="end">${totalCantidad}</td>
                </tr>
                <tr>
                    <td align="left">Total Neto</td>
                    <td align="end">${formatter.format(totalNeto)}</td>
                </tr>
                <tr>
                    <td align="left">Total Compra (IVA 19%)</td>
                    <td align="end">${formatter.format(totalCompra)}</td>
                </tr>
            </tbody>            
        <table>
        <button id="btnFinalizar" class="mt-3 btn btn-outline-success">Finalizar Compra</button>
        `
        detalleCarrito.appendChild(parrafoDetalle)

        let btnFinalizar = document.getElementById('btnFinalizar')
        
        btnFinalizar.onclick = (evt) => {
            evt.preventDefault()
            Swal.fire({
                icon: 'success',
                title: 'Stock Reservado!',
                title: 'Rellenemos los datos de contacto!',
                showConfirmButton: false,
                timer: 2000
            })
            .then(response => {
                window.location.href = 'usuario.html'
            })
        }
}

const loadCarrito = () => {
    const carritoView = document.getElementById('listadoProductosCarrito')
    if (carritoView) {
        
        if (arrCarrito.length > 0) {
            cargarCarrito()
        } else {
            
            const newDiv = document.createElement('div')
            newDiv.classList.add('alert','alert-secondary', 'col-5')
            carritoView.appendChild(newDiv)
            newDiv.innerHTML = `No existen productos... :(`

            let detalleCarrito = document.getElementById('detalleCarrito')
            detalleCarrito.style.display = 'none'
        }

    }
}

const limpiarCarrito = () => {
    localStorage.removeItem('carrito')
}

const loadDetalleCompra = () => {
    const detalleCompra = document.getElementById('detalleCompra')
    
    if (detalleCompra) {
        const newInfo = document.createElement('div')
        let totalCompra = 0
        let tableHtml = ''
        
        if (arrCarrito.length == 0) {
            window.location.href = '../index.html'
        }
        arrCarrito.forEach(producto => {
            tableHtml += `
            <tr>
                <td>
                    <img src="${producto.imgUrl}" alt="Producto" class="img-fluid" style="max-width: 70px;">
                    <p><strong>${producto.nombre}</strong></p>
                </td>
                <td align="center">
                    <p><strong>Precio:</strong> ${formatter.format(producto.precio)}</p>
                    <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                    <p><strong>Sub-Total:</strong> ${formatter.format(producto.precio * producto.cantidad)}</p>
                </td>
            </tr>
            `
            totalCompra += (producto.precio * producto.cantidad)
        })
        newInfo.innerHTML = `
        <table class="table table-borderless">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Detalle</th>
                </tr>
            </thead>
            <tbody>
                ${tableHtml}   
            </tbody>
        </table>
        <p><strong>Total de la compra: ${formatter.format(totalCompra)}</strong></p>
        `
        detalleCompra.appendChild(newInfo)
        limpiarCarrito()
    }
}

loadCarrito()
loadDetalleCompra()