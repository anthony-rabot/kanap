const cartContainer = document.getElementById('cart__items')
let cartLineHtmlTemplate = ''
const submitButton = document.getElementById('order')
const contactForm = document.querySelector('.cart__order__form')

/**
 * Get LocalStorage
 * @return {Array} Empty if LocalStorage is not initialised or with products objects
 */
function getLocalStorage() {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

/**
 * Call API to get product information
 * @param {number} productId Id of product
 * @return {Object} Product object
 */
function getProduct(productId) {

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
 * Parse Product and create HTML tags for displaying it on each Cart line
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

        totalPrice = await cart.reduce(async (accumulator, product) => {
            let productAPI = await getProduct(product.id)
            return (await accumulator) + productAPI.price * product.quantity
        }, 0)
    }

    // Display total information
    document.getElementById('totalQuantity').textContent = totalQuantity.toString()
    document.querySelector('.menu nav a:last-child li').textContent = 'Panier (' + totalQuantity.toString() + ')'
    document.getElementById('totalPrice').textContent = totalPrice.toString()
}

/**
 * Update quantity
 * @param {Event} event - Change Event on Quantity inputs
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
 * @param {Event} event - Click Event on Delete text
 */
async function removeProduct(event) {

    // Get id and color of product objet to delete
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
 * @param {Event} event - Click Event on Delete text
 */
async function confirmRemove(event) {
    if (window.confirm("Souhaitez vous vraiment supprimer ce produit ?")) {
        await removeProduct(event)
    }
}

/**
 * Validation of contact form
 * @return {Boolean} isValid -  Used for submit & click listener on contact form
 */
function validateContactForm() {

    // Listen change events on input fields of contact form
    let contactFormFields = document.querySelectorAll('.cart__order__form__question input')
    let isValid = false

    // Validate each form fields to display custom error messages
    contactFormFields.forEach((field) => {
        validateFormField(field)

        field.addEventListener('change', () => {
            validateFormField(field)
        })
    })

    // Once all fields have been tested, search for error class or empty field
    for (let formField of contactFormFields) {
        isValid = !(formField.value === '' || formField.classList.contains('error'))

        if (!isValid) {
            break
        }
    }

    return isValid
}

/**
 * Validation of form field
 * @param {HTMLInputElement} input - Form field
 */
function validateFormField(input) {

    // Regex rules https://www.programiz.com/javascript/regex
    // Tests made on https://regex101.com/r/YDB9CJ/1
    let regexCharacters = new RegExp('^[a-zA-ZÀ-ú-\'\\s]+$')
    let regexAddress = new RegExp('^[a-zA-ZÀ-ú0-9,\\-\'\\s]+$') // 6, lotissement de la petite Oie match. \s for whitespaces
    let regexCity = new RegExp('^[a-zA-ZÀ-ú\'-\\s]+$')
    let regexMail = new RegExp('[a-z0-9.-]+@[a-z]+\\.[a-z]{2,3}')

    let errorMessage = input.nextElementSibling

    // Display error message depend on context and add 'error' class to input when necessary
    if (input.value === '' && input.required) {
        errorMessage.textContent = 'Veuillez remplir ce champ'
        input.className = 'error'
    } else if (input.id === 'firstName') {
        errorMessage.textContent = regexCharacters.test(input.value) ? '' : 'Veuillez saisir un prénom valide'
        regexCharacters.test(input.value) ? input.className = '' : input.className = 'error'
    } else if (input.id === 'lastName') {
        errorMessage.textContent = regexCharacters.test(input.value) ? '' : "Veuillez saisir un nom valide"
        regexCharacters.test(input.value) ? input.className = '' : input.className = 'error'
    } else if (input.id === 'address') {
        errorMessage.textContent = regexAddress.test(input.value) ? '' : "Veuillez saisir une adresse valide"
        regexAddress.test(input.value) ? input.className = '' : input.className = 'error'
    } else if (input.id === 'city') {
        errorMessage.textContent = regexCity.test(input.value) ? '' : "Veuillez saisir une ville valide"
        regexCity.test(input.value) ? input.className = '' : input.className = 'error'
    } else if (input.id === 'email') {
        errorMessage.textContent = regexMail.test(input.value) ? '' : "Veuillez saisir un mail valide"
        regexMail.test(input.value) ? input.className = '' : input.className = 'error'
    }
}

/**
 * Send Order to API to get back order id
 * @param {string} datasToSend - JSON datas with contact and products
 */
function sendOrder(datasToSend) {
    return fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: datasToSend
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

    // Form validation on each click on submit button
    submitButton.addEventListener('click', () => {
        validateContactForm()
    })

    // If all values are ok, send order to API
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        // Form is validated
        if (validateContactForm()) {

            // Prepare Datas before send them
            let contact = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value
            }

            let products = cart.map(product => product.id)

            let datasToSend = JSON.stringify({
                'contact': contact,
                'products': products
            })

            // Send request to API and wait for orderId in response
            let orderResponse = await sendOrder(datasToSend)

            if (orderResponse) {
                localStorage.clear()
                window.location.replace("./confirmation.html?order_id=" + orderResponse.orderId);
            }
        }
    })
}

main()