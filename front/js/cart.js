const cartContainer = document.getElementById('cart__items')
let html = ''

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

    console.log(product)

    // Mise en forme de l'attribut data-colors
    let color = product.color.replace('/', '-').toLowerCase()

    html +=
    `<article class="cart__item" data-id="${product.id}" data-color="${color}">
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

    cartContainer.innerHTML = html
}

let cart = getLocalStorage()

// If there is product objects in localStorage display them
if (cart.length > 0) {

    for (let product of cart) {
        displayProductCartLine(product)
    }
}

