/**
 * Get LocalStorage
 * @return {Array} Empty if LocalStorage is not initialised or with products objects
 */
export function getLocalStorage() {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

/**
 * Calculate total quantity and display on cart menu item
 */
export function displayTotalCartQuantity() {

    let cart = getLocalStorage()
    let totalQuantity = 0

    // If there is product objects in localStorage
    if (cart.length > 0) {

        totalQuantity = cart.reduce((accumulator, product) => {
            return accumulator + product.quantity
        }, 0)

        // Display total information
        document.querySelector('.menu nav a:last-child li').textContent = 'Panier (' + totalQuantity.toString() + ')'
    }
}