const params = (new URL(document.location)).searchParams
let productId = params.get('id')
const colorsParent = document.getElementById('colors')
const quantity = document.getElementById('quantity')

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

/**
 * Parse Product and create HTML tags for displaying it
 * @param {Response} product - Product Object
*/
const displayProduct = (product) => {
    console.log(product)

    // Create Image
    const imageParent = document.getElementsByClassName('item__img')
    const image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    imageParent[0].appendChild(image)

    // Create Title
    const titleParent = document.getElementById('title')
    titleParent.textContent = product.name

    // Create Price
    const priceParent = document.getElementById('price')
    priceParent.textContent = product.price

    // Create Description
    const descriptionParent = document.getElementById('description')
    descriptionParent.textContent = product.description

    // Create Color(s) (select options)
    //const colorsParent = document.getElementById('colors')

    for (const color of product.colors) {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
        const colorOption = document.createElement('option')
        colorOption.value = color.toLowerCase()
        colorOption.text = color.toLowerCase()
        colorsParent.add(colorOption, null)
    }
}

const cartButton = document.getElementById('addToCart')
cartButton.addEventListener('click', (event) => {
    event.preventDefault()

    if (validateProductForm()) {
        if (isProductInCart(productId, colorsParent.value)) {
            updateCartQuantity()
        } else {
            addProductToCart()
        }
    }

    // TODO voir s'il faut générer des erreurs sur les champs en erreur

})

/**
 * Validate product Form to allow adding order to Cart
*/
const validateProductForm = () => {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
    // Pas appliqué sur le select car le HTML ne contient pas de contrainte

    // Retourne vrai si une couleur a été choisie et si le champ quantité respecte le min et le max
    return colorsParent.value !== "" && quantity.checkValidity()
}

/**
 * Add order to Cart
*/
const addProductToCart = () => {

    let ordersLocalStorage = localStorage.getItem('orders')
    ordersLocalStorage = ordersLocalStorage ? ordersLocalStorage.split(',') : []
    let cart = []
    let items = [productId, colorsParent.value, quantity.value]
    cart.push(items)
    console.log(cart)
    ordersLocalStorage.push(cart)
    localStorage.setItem('orders', ordersLocalStorage.toString());

    //console.log(ordersLocalStorage)

    // Vérifier si le produit est déjà présent dans le panier
    // if (isProductInCart(productId, colorsParent.value)) {
    //     const ordersLocalStorage = localStorage.getItem("orders")
    //     const jsonOrders = JSON.parse(ordersLocalStorage)
    //     Number(jsonOrders[productId].quantity ++)
    //
    //     console.log(jsonOrders[productId].quantity)
    //     console.log(Number(jsonOrders[productId].quantity))
    //     localStorage.setItem('orders', JSON.stringify(jsonOrders))
    // } else {
    //     let order = {}
    //     order[productId] = {}
    //     // order[productId]["color"] = colorsParent.value
    //     // order[productId]["quantity"] = quantity.value
    //
    //     order[productId]["color"] = colorsParent.value
    //     order[productId]["quantity"] = quantity.value
    //     localStorage.setItem('orders', JSON.stringify(order))
    // }
}

/**
 * Add order to Cart
*/
const isProductInCart = (id, color) => {
    // Vérifier si le produit est déjà présent dans le panier
    const ordersLocalStorage = localStorage.getItem("orders");

    return false

    // if (ordersLocalStorage) {
    //
    //     // const jsonOrders = JSON.parse(ordersLocalStorage);
    //     // // Si l'id du produit est retrouvé dans le tableau renvoyé par Object.keys alors le produit est présent.
    //     // if (Object.keys(jsonOrders).includes(id)) {
    //     //
    //     //     // Retourne true quand le produit de même couleur est déjà présent
    //     //     return jsonOrders[id].color === color
    //     //
    //     // } else {
    //     //     return false
    //     // }
    // }




}

/**
 * Update Quantity for a product already in localStorage
*/
const updateCartQuantity = (id, color) => {

}