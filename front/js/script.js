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
    .then(result => console.log(result))
    .catch((erreur) => {
        console.log(`Erreur avec le message : ${erreur}`)
    });