import {displayTotalCartQuantity, getLocalStorage} from './utils.js'

const params = (new URL(document.location)).searchParams
let productId = params.get('id')
const colorsParent = document.getElementById('colors')
const quantity = document.getElementById('quantity')

/**
 * Main function which call API and listen on add to cart action
 */
function main() {

    // Call API to get product information with id

    fetch('http://localhost:3000/api/products/' + productId, {
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
        .then(
            product => displayProduct(product)
        )
        .catch((erreur) => {
            console.log(`Erreur lors de la récupération du produit avec le message : ${erreur}`)
        })

    // Listen event to add product in cart
    const cartButton = document.getElementById('addToCart')
    cartButton.addEventListener('click', (event) => {
        event.preventDefault()

        if (validateProductForm()) {

            let productName = document.getElementById('title').innerText

            let productToAddInCart = {
                id: productId,
                color: colorsParent.value,
                quantity: Number(quantity.value),
                name: productName,
                imageUrl: document.querySelector('.item__img img').getAttribute('src'),
                altTxt: document.querySelector('.item__img img').getAttribute('alt')
            }

            let productAdded = addProductToCart(productToAddInCart)
            alertUser(productAdded)
        }
    })

    displayTotalCartQuantity()
}

/**
 * Display an alter when user add product to cart
 * @param {Object} product - Product Object
 */
function alertUser(product) {

    // Format text depends quantity
    let alertString = ''

    if (quantity.value > 1) {
        alertString = `${product.quantity} canapés ${product.name} de couleur ${product.color} ont bien été ajoutés au panier`
    } else {
        alertString = `${product.quantity} canapé ${product.name} de couleur ${product.color} a bien été ajouté au panier`
    }

    alert(alertString)
}

/**
 * Parse Product and create HTML tags for displaying it
 * @param {Object} product - Product Object
 */
function displayProduct(product) {

    // Create Image
    let imageParent = document.getElementsByClassName('item__img')
    let image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    imageParent[0].appendChild(image)

    // Create Title and Header title
    let titleParent = document.getElementById('title')
    titleParent.textContent = product.name
    document.title = product.name

    // Create Price
    let priceParent = document.getElementById('price')
    priceParent.textContent = product.price

    // Create Description
    let descriptionParent = document.getElementById('description')
    descriptionParent.textContent = product.description

    // Create Color(s) (select options)
    for (let color of product.colors) {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
        let colorOption = document.createElement('option')
        colorOption.value = color.toLowerCase()
        colorOption.text = color.toLowerCase()
        colorsParent.add(colorOption, null)
    }
}

/**
 * Validate product Form to allow adding order to Cart
 * @return {boolean} True if form is valid with quantity > 0 and a color chosen
 */
function validateProductForm() {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation

    // Quantity validation
    const quantityValidationState = quantity.validity
    if (quantityValidationState.valueMissing) {
        quantity.setCustomValidity('Vous devez renseigner une quantité')
    } else if (quantityValidationState.rangeUnderflow) {
        quantity.setCustomValidity('Vous devez ajouter au moins 1 produit')
    } else if (quantityValidationState.rangeOverflow) {
        quantity.setCustomValidity('Vous ne pouvez en commander que 100 au maximum')
    } else {
        quantity.setCustomValidity('')
    }

    // Color validation
    if (colorsParent.value === "") {
        colorsParent.setCustomValidity('Vous devez choisir une couleur')
    } else {
        colorsParent.setCustomValidity('')
    }

    quantity.reportValidity()
    colorsParent.reportValidity()

    // Retourne vrai si une couleur a été choisie et si le champ quantité respecte le min et le max
    return colorsParent.value !== "" && quantity.checkValidity()
}

/**
 * Add product to Cart or update quantity if already present (LocalStorage)
 * Check for total quantity (has not to exceed 100)
 * @param {Object} productToAdd - Product Object
 * @return {Object} product - Product Object with real quantity added to display in alert
 */
function addProductToCart(productToAdd) {

    let orders = getLocalStorage()

    // Search product in localStorage to know if it's already in cart
    const searchProduct = orders.find(product => product.id === productToAdd.id && product.color === productToAdd.color)

    if (searchProduct) {
        let totalQuantity = searchProduct.quantity + productToAdd.quantity

        if (totalQuantity <= 100) {
            searchProduct.quantity += productToAdd.quantity
            localStorage.setItem('orders', JSON.stringify(orders))
            displayTotalCartQuantity()

            return productToAdd
        } else {
            alert(`Vous en avez déjà ${searchProduct.quantity} dans votre panier et le maximum est de 100.\nNous en avons ajouté seulement ${100 - searchProduct.quantity}.`)

            // Clone Object to generate alert with real quantity added to have total less or equal to 100
            let addedProduct = {...searchProduct}
            addedProduct.quantity = 100 - searchProduct.quantity

            // Update to max quantity and save in localStorage
            searchProduct.quantity = 100
            localStorage.setItem('orders', JSON.stringify(orders))
            displayTotalCartQuantity()

            return addedProduct
        }

    } else {
        orders.push(productToAdd);
    }

    localStorage.setItem('orders', JSON.stringify(orders))
    displayTotalCartQuantity()

    return productToAdd
}

// Execute main function
main()