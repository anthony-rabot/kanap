fetch('http://localhost:3000/api/products', {
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
    // Appeler une Méthode qui va construire le HTML
    .then(
        products => displayProducts(products)
    )
    .catch((erreur) => {
        console.log(`Erreur lors de la récupération des produits avec le message : ${erreur}`)
    });


/**
 * Parse Products and create HTML tags for each one
 * @param {Response} products - Array of products objects
 */
const displayProducts = (products) => {

    const parent = document.getElementById("items");

    for (const product of products) {

        // Create Link
        const link = document.createElement('a')
        link.href = `product.html?id=${product._id}`;
        parent.appendChild(link);

        // Create Article
        const article = document.createElement('article')
        link.appendChild(article);

        // Create Image
        const image = document.createElement('img')
        image.src = product.imageUrl
        image.alt = product.altTxt
        article.appendChild(image);

        // Create Title
        const title = document.createElement('h3')
        title.textContent = product.name
        title.classList.add('productName')
        article.appendChild(title);

        // Create Description
        const description = document.createElement('p')
        description.classList.add('productDescription')
        description.textContent = product.description
        article.appendChild(description);
    }
}