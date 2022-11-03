const cartContainer = document.getElementById('cart__items')
let cartLineHtmlTemplate = ''

/**
 * Get LocalStorage
 * @return {Array} Empty if LocalStorage is not initialised or with products objects
*/
let getLocalStorage = () => {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

/**
 * Parse Product and create HTML tags for displaying it on each Cart lines
 * @param {Object} product - Product Object
*/
const displayProductCartLine = (product) => {

    cartLineHtmlTemplate +=
    `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${product.color}</p>
            <p>${product.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`

    cartContainer.innerHTML = cartLineHtmlTemplate
}

/**
 * Calculate total quantity and price. Called on init display, update or remove products
*/

let calcTotal = () => {

    let cart = getLocalStorage()
    let totalQuantity = 0
    let totalPrice = 0

    // If there is product objects in localStorage
    if (cart.length > 0) {

        totalQuantity = cart.reduce((accumulator, product) => {
            return accumulator + product.quantity
        }, 0)

        totalPrice = cart.reduce((accumulator, product) => {
            return accumulator + product.price * product.quantity
        }, 0)
    }

    // Display total information
    document.getElementById('totalQuantity').textContent = totalQuantity.toString()
    document.getElementById('totalPrice').textContent = totalPrice.toString()
}

/**
 * Update quantity
 * @param {Event} event - Event of change listener on Quantity inputs
*/
let updateQuantity = (event) => {
    let newQuantity = event.target.value

    // Get Id and color of product objet to update
    let domProduct = event.target.closest('article')
    let productId = domProduct.dataset.id
    let productColor = domProduct.dataset.color

    // Load localStorage to find it
    let cart = getLocalStorage()
    let productToUpdate = cart.find( product => product.id === productId && product.color === productColor)

    // Update DOM element and localStorage
    if (newQuantity > 100) {
        event.target.value = 100
        event.target.setAttribute('value', 100) // DOM
        productToUpdate.quantity = 100 // localStorage
    } else {
        event.target.setAttribute('value', newQuantity)
        productToUpdate.quantity = Number(newQuantity)
    }

    // Save localStorage
    localStorage.setItem('orders', JSON.stringify(cart))

    // Update Total
    calcTotal()
}

/**
 * Delete product
 * @param {Event} event - Event of click listener on Delete text
 */
let removeProduct = (event) => {

    // Get Id and color of product objet to delete
    let domProduct = event.target.closest('article')
    let productId = domProduct.dataset.id
    let productColor = domProduct.dataset.color

    // Load localStorage to find it and exclude it with filter()
    let cart = getLocalStorage()
    let productToDelete = cart.find( product => product.id === productId && product.color === productColor)
    let filteredCart = cart.filter(product => product !== productToDelete)

    // Remove from DOM and save to localStorage
    domProduct.remove()
    localStorage.setItem('orders', JSON.stringify(filteredCart))

    // Update Total
    calcTotal()
}

/**
 * Display Cart lines, Total Quantity and Price with localStorage datas
*/

let cart = getLocalStorage()

// If there is product objects in localStorage display them
if (cart.length > 0) {

    for (let product of cart) {
        displayProductCartLine(product)
    }
}

// Calculate Total
calcTotal()

/**
 * Listen change events on quantity inputs
*/

let inputsQuantity = document.querySelectorAll('.itemQuantity')

inputsQuantity.forEach((item) => {
    item.addEventListener('change', updateQuantity)
})

/**
 * Listen click events on delete elements
*/

let deleteItems = document.querySelectorAll('.deleteItem')

deleteItems.forEach((item) => {
    item.addEventListener('click', removeProduct)
})

