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
 * @param {Object} product - Product Object
*/
const displayProduct = (product) => {

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

const cartButton = document.getElementById('addToCart')
cartButton.addEventListener('click', (event) => {
    event.preventDefault()

    if (validateProductForm()) {

        let productName = document.getElementById('title').innerText

        let productToAddInCart = {
            "id":  productId,
            "color": colorsParent.value,
            "quantity": Number(quantity.value),
            "name": productName,
            "price": Number(document.getElementById('price').innerText),
            "imageUrl": document.querySelector('.item__img img').getAttribute('src'),
            "altTxt": document.querySelector('.item__img img').getAttribute('alt')
        }

        addProductToCart(productToAddInCart)
        alert(`votre produit ${productName} a bien été ajouté au panier`)
    }

    // TODO voir s'il faut générer des erreurs sur les champs en erreur

})

/**
 * Validate product Form to allow adding order to Cart
 * @return {boolean} True if form is valid with quantity > 0 and a color chosen
*/
const validateProductForm = () => {
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
    // Pas appliqué sur le select car le HTML ne contient pas de contrainte

    // Retourne vrai si une couleur a été choisie et si le champ quantité respecte le min et le max
    return colorsParent.value !== "" && quantity.checkValidity()
}

/**
 * Get LocalStorage
 * @return {Array} Empty if LocalStorage is not initialised or with products objects
*/
let getLocalStorage = () => {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

/**
 * Add product to Cart or update quantity if already present (LocalStorage)
 * @param {Object} productToAdd - Product Object
*/
const addProductToCart = (productToAdd) => {

    let orders = getLocalStorage()

    // Est-ce que le même produit est déjà présent dans le LocalStorage ?
    const searchProduct = orders.find(product => product.id === productToAdd.id && product.color === productToAdd.color)

    if (searchProduct) {
        searchProduct.quantity += productToAdd.quantity
        localStorage.setItem('orders', JSON.stringify(orders))
    } else {
        orders.push(productToAdd);
    }

    localStorage.setItem('orders', JSON.stringify(orders))
}