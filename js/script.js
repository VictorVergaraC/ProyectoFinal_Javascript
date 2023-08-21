import { addCarrito, formatter, arrCarrito } from "./carrito.js"
import { arrClientes, addCliente, addCompra } from "./clientes.js"

const getProducto = async (paramID) => {
    return await fetch('../url/data.json')
        .then(response => response.json())
        .then(data => {
            return data.find(objProducto => objProducto.id == paramID)
        })
}

const cargarData = () => {
   
    const productosView = document.getElementById('listadoProductos')
    if (productosView) {
        fetch('../url/data.json')
        .then(response => response.json())
        .then( response => {
            response.forEach( producto => {
                
                const newDiv = document.createElement('div')
                newDiv.classList.add('card','mx-1','mt-2','col-3','text-center')
                productosView.appendChild(newDiv)
                newDiv.innerHTML = `
                    <img src="${producto.imgUrl}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${formatter.format(producto.precio)}</p>
                        <button id="${producto.id}" name="${producto.id}" class="btn btn-outline-success addCart">Añadir al Carro</button>
                    </div>
                `
            })

            document.querySelectorAll(".addCart").forEach(elemento => {
                elemento.addEventListener("click", nodo => {
                    
                    let newProducto = nodo.target.getAttribute("name")
                    if (newProducto != "") {
                            
                        (async () => {
                            try {
                                let productoJS = await getProducto(newProducto)
                                addCarrito(productoJS)
                                Toastify({
                                    text    : "Producto agregado!",
                                    gravity : 'top',
                                    position: 'right',
                                        duration: 2000,
                                        destination : 'pages/carrito.html',
                                        style   : {
                                            background : 'linear-gradient(to right, #00b09b, #96c92d)'
                                        }
                                }).showToast()
                            } catch (error) {
                                console.error(error)
                            }
                        })()
                    }
                })
            })
        })
    }
}
const formContacto = document.getElementById('formContacto')
if (formContacto) {
    formContacto.onsubmit = (evt) => {
        evt.preventDefault()
        addCliente({
            rut       : document.getElementById('rut').value,
            nombre    : document.getElementById('nombre').value,
            email     : document.getElementById('email').value,
            direccion : document.getElementById('direccion').value
        })
        swal.fire({
            title: 'Estás a punto de realizar el pedido',
            text: '¿Deseas continuar?',
            icon: 'question',
            confirmButtonText : 'Si, seguro.',
            cancelButtonText  : 'No, cancelar',
            showCancelButton  : true,
            confirmButtonColor: '#d33',
            cancelButtonColor : '#3085d6'
        })
        .then(response => {
            if(response.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pedido Realizado!',
                    title: 'Aquí tienes el detalle ...',
                    showConfirmButton: false,
                    timer: 2000
                })
                .then(response => {
                    addCompra(document.getElementById('rut').value)
                    window.location.href = 'finalizar.html'
                })
            }
        })
    }
}

cargarData()