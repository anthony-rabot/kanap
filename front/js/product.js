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
    let imageParent = document.getElementsByClassName('item__img')
    let image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    imageParent[0].appendChild(image);


}