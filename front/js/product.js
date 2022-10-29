const params = (new URL(document.location)).searchParams;
let productId = params.get('id');

fetch('http://localhost:3000/api/products/' + productId, {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(result => {
        if (result.ok) {
            return result.json();
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
    imageParent[0].appendChild(image);

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
    const colorsParent = document.getElementById('colors')

    for (const color of product.colors) {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
        const colorOption = document.createElement('option')
        colorOption.value = color.toLowerCase()
        colorOption.text = color.toLowerCase()
        colorsParent.add(colorOption, null);
    }
}

// TODO gérer l'event du clic sur le bouton ajouter au panier
// TODO Construire l'objet à envoyer à l'API (récupérer la couleur)
