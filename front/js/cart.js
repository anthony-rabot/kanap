const cartContainer = document.getElementById('cart__items')
let cartLineHtmlTemplate = ''

/**
 * Get LocalStorage
 * @return {Array} Empty if LocalStorage is not initialised or with products objects
 */
function getLocalStorage() {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

/**
 * Call API to get price
 * @param {number} productId Id of product
 * @return {Object} Product object
 */
async function getProduct(productId) {

    return fetch('http://localhost:3000/api/products/' + productId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            if (result.ok) {
                return result.json()
            }
        })
        .catch((erreur) => {
            console.log(`Erreur lors de la récupération du produit avec le message : ${erreur}`)
        })
}

/**
 * Parse Product and create HTML tags for displaying it on each Cart lines
 * @param {Object} product - Product Object
 */
async function displayProductCartLine(product) {

    // Price has to be outside localStorage. Get it form API
    let productAPI = await getProduct(product.id)

    cartLineHtmlTemplate +=
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${product.color}</p>
            <p>${productAPI.price} €</p>
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
async function calcTotal() {

    let cart = getLocalStorage()
    let totalQuantity = 0
    let totalPrice = 0

    // If there is product objects in localStorage
    if (cart.length > 0) {

        totalQuantity = cart.reduce((accumulator, product) => {
            return accumulator + product.quantity
        }, 0)

        totalPrice = await cart.reduce( async (accumulator, product) => {
            let productAPI = await getProduct(product.id)
            return (await accumulator) + productAPI.price * product.quantity
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
async function updateQuantity(event) {
    let newQuantity = event.target.value

    // Get Id and color of product objet to update
    let domProduct = event.target.closest('article')
    let productId = domProduct.dataset.id
    let productColor = domProduct.dataset.color

    // Load localStorage to find it
    let cart = getLocalStorage()
    let productToUpdate = cart.find(product => product.id === productId && product.color === productColor)

    // Update DOM element and localStorage
    if (newQuantity > 100) {
        event.target.value = 100
        event.target.setAttribute('value', 100) // DOM
        productToUpdate.quantity = 100 // localStorage
        alert('Vous ne pouvez pas en commander plus de 100')
    } else {
        event.target.setAttribute('value', newQuantity)
        productToUpdate.quantity = Number(newQuantity)
    }

    // Save localStorage
    localStorage.setItem('orders', JSON.stringify(cart))

    // Update Total
    await calcTotal()
}

/**
 * Delete product
 * @param {Event} event - Event of click listener on Delete text
 */
async function removeProduct(event) {

    // Get Id and color of product objet to delete
    let domProduct = event.target.closest('article')
    let productId = domProduct.dataset.id
    let productColor = domProduct.dataset.color

    // Load localStorage to find it and exclude it with filter()
    let cart = getLocalStorage()
    let productToDelete = cart.find(product => product.id === productId && product.color === productColor)
    let filteredCart = cart.filter(product => product !== productToDelete)

    // Remove from DOM and save to localStorage
    domProduct.remove()
    localStorage.setItem('orders', JSON.stringify(filteredCart))

    // Update Total
    await calcTotal()
}

/**
 * Open a confirmation popup
 * @param {Event} event - Event of click listener on Delete text
 */
async function confirmRemove(event) {
    if (window.confirm("Souhaitez vous vraiment supprimer ce produit ?")) {
        await removeProduct(event)
    }
}

/**
 * Main function to init cart display and set events on cart update
 */
async function main() {

    // Display Cart lines, Total Quantity and Price with localStorage datas
    let cart = getLocalStorage()

    // If there is product objects in localStorage display them
    if (cart.length > 0) {

        for (let product of cart) {
            await displayProductCartLine(product)
        }
    }

    // Calculate Total
    await calcTotal()

    // Listen change events on quantity inputs
    let inputsQuantity = document.querySelectorAll('.itemQuantity')

    inputsQuantity.forEach((item) => {
        item.addEventListener('change', updateQuantity)
    })

    // Listen click events on delete elements
    let deleteItems = document.querySelectorAll('.deleteItem')

    deleteItems.forEach((item) => {
        item.addEventListener('click', confirmRemove)
    })
}

await main()