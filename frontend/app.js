function getOursList(){
    const promise1 = fetch('http://localhost:3000/api/teddies');
    promise1
    .then(res => res.json())
    .then(data =>{

    for(i=0; i<data.length; i++){
        const cardContainer = document.getElementById('card-container');
        // Créer la strucutre des produits sur la page d'accueil
        var structureCard  = `
        <div class="card">
        <a href='produit.html?id=${data[i]._id}'>
        <img src="${data[i].imageUrl}" alt="" class="image">
        <div class="name">${data[i].name}</div>
        <div class="price">${data[i].price/100} <span>€</span></div>
        <div class="description">${data[i].description}</div>
        </a>
        </div>
        `;

        cardContainer.insertAdjacentHTML("beforeend" ,structureCard);
        };
    });

};


function getOursById(idOurs){

    const promise2=  fetch ('http://localhost:3000/api/teddies/'+idOurs)
    promise2
        .then (res => res.json())
        .then(data => {

            const cardContainer = document.getElementById('card-container');
            // Créer la structure des produits sur la page produit par leur ID
            var structureCard  = `
            <div class="card card-pdt">
            <img src="${data.imageUrl}" alt="" class="image">
            <div class="name">${data.name}</div>
            <div class="price">${data.price/100} <span>€</span></div>
            <select class="colors">${data.colors}</select>
            <div class="description">${data.description}</div>
            <button type="submit" class="btn-add-to-basket">AJOUTER DANS PANIER</button>
            </div>
            `;

            cardContainer.insertAdjacentHTML("beforeend" ,structureCard);

            // Récupération des couleurs des produits en fonction de leurs ID
            const colorsSelector= document.querySelector('.colors');
            var optionColor= data.colors;
                let structureOptions = [];

                for (let i = 0; i< optionColor.length; i++){
                    structureOptions = structureOptions + `
                    <option> ${optionColor[i]}</option>
                    `;
                };
            colorsSelector.innerHTML = structureOptions;

            // Création du bouton d'ajout des produits au panier
            var btnSelect = document.querySelector('.btn-add-to-basket');

            btnSelect.addEventListener('click', function(myCart){
                myCart.preventDefault();


                var colorSelected = colorsSelector.value;

                var produitsLocalStorage = JSON.parse(localStorage.getItem('tableauItem'));
                if (produitsLocalStorage==undefined) {
                    produitsLocalStorage = [];
                } else{
                    var idItemInBasket=[];
                    for(j=0; j < produitsLocalStorage.length; j++){
                        idItemInBasket.push(produitsLocalStorage[j].idProduit);
                    };


                }

                var testIndex = produitsLocalStorage.findIndex(x => x.idProduit === data._id && x.color === colorSelected);
                if(testIndex==-1){
                    var itemInStorage ={
                        idProduit:data._id,
                        name:data.name,
                        price:data.price/100,
                        color:colorSelected,
                        quantite:1,
                    };
                    produitsLocalStorage.push(itemInStorage);

                }else{
                    produitsLocalStorage[testIndex].quantite= produitsLocalStorage[testIndex].quantite+1;
                }

                localStorage.setItem('tableauItem', JSON.stringify(produitsLocalStorage));

                var count = 1;

                if(localStorage.getItem('productcount')){
                    count = parseInt(localStorage.getItem('productcount')) + 1; // Créer l'incrémentation au productcount présent dans le panier
                }
                localStorage.setItem('productcount', count);

                basketCount();

            });
        });
};

// Ajout du nombre de produit présent dans le panier sur notre header
function basketCount(){
    if(localStorage.getItem('productcount') && document.getElementById('produit-count')){
    var productCount = document.getElementById('produit-count');
    productCount.innerHTML = localStorage.getItem('productcount');
    }
};

function myBasket(){


    // Création du tableau d'objet dans notre panier
    var produitsLocalStorage =JSON.parse(localStorage.getItem('tableauItem'));

    var idItemInBasket = [];
    var totalPriceTable=[];

    if(produitsLocalStorage === null){

    }else{

        for(j=0; j < produitsLocalStorage.length; j++){

            idItemInBasket.push(produitsLocalStorage[j].idProduit);

            const itemBasket = document.getElementById('tbody');
            var structurePanier = `
            <tr class="tbody-item">
            <td>${produitsLocalStorage[j].name}</td>
            <td>${produitsLocalStorage[j].color}</td>
            <td>${produitsLocalStorage[j].quantite}</td>
            <td>${produitsLocalStorage[j].price*produitsLocalStorage[j].quantite+"€"}</td>
            </tr>
            `;
            itemBasket.insertAdjacentHTML('beforeend', structurePanier);

            totalPriceTable.push(produitsLocalStorage[j].price*produitsLocalStorage[j].quantite);
            const reducer = (accumulator, currentValue ) => accumulator + currentValue;
            const totalPrice = totalPriceTable.reduce(reducer);
            var totalPriceAmount = document.getElementById('total-price-amount');
            totalPriceAmount.innerHTML = totalPrice + '€';
        }
    };
};

// Création du formulaire de renseignement pour valider la commande
function dataUser(){

    var userFirstName = document.getElementById('user-first-name');
    userFirstName = userFirstName.value;

    var userLastName = document.getElementById('user-last-name');
    userLastName = userLastName.value;

    var  userAddress= document.getElementById('user-adress');
    userAddress = userAddress.value;

    var userCity = document.getElementById('user-city');
    userCity = userCity.value;

    var userEmail = document.getElementById('user-email');
    userEmail = userEmail.value;

    var sendForm = true;

// Création des REGEX pour chaques éléments du formulaire
    let requireFirstName = document.getElementById('require-firstname');
    var letterFilter = /^[a-z]+$/i;
    if(userFirstName == ""){
        requireFirstName.innerHTML = "Veuillez entrer votre prénom";
        sendForm = false;
    } else if(!userFirstName.match(letterFilter)){
        requireFirstName.innerHTML = "Veuillez entrer un prénom valide";
        sendForm = false
    }else{
        requireFirstName.innerHTML = "";
        localStorage.setItem('userFirstName', userFirstName);
    };

    let requireLastName = document.getElementById('require-lastname');
    if(userLastName == ""){
        requireLastName.innerHTML = "Veuillez entrer votre nom";
        sendForm = false;
    } else if(!userLastName.match(letterFilter)){
        requireLastName.innerHTML = "Veuillez entrer un nom valide";
        sendForm = false
    }else{

        requireLastName.innerHTML = "";
        localStorage.setItem('userLastName', userLastName);
    };

    let requireAdress = document.getElementById('require-adress');
    var adressFilter = /^[a-zA-Z0-9\s,'-]*$/;
    if(userAddress == ""){
        requireAdress.innerHTML = "Veuillez entrer votre adresse";
        sendForm = false;
    } else if(!userAddress.match(adressFilter)){
        requireAdress.innerHTML = "Veuillez entrer une adresse valide";
        sendForm = false
    }else{

        requireAdress.innerHTML = "";
        localStorage.setItem('userAdress', userAddress);
    };

    let requireCity = document.getElementById('require-city');
    var cityFilter = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    if(userCity == ""){
        requireCity.innerHTML = "Veuillez entrer votre ville";
        sendForm = false;
    } else if(!userCity.match(cityFilter)){
        requireCity.innerHTML = "Veuillez entrer une ville valide";
        sendForm = false
    }else{

        requireCity.innerHTML = "";
        localStorage.setItem('userCity', userCity);
    };

    let requireEmail = document.getElementById('require-email');
    var emailFilter =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(userEmail == ""){
        requireEmail.innerHTML = "Veuillez entrer votre email";
        sendForm = false;
    }
    else if(!userEmail.match(emailFilter)) {
        requireEmail.innerHTML = "Veuillez entrer un email valide";
        sendForm = false;
    }else{
        requireEmail.innerHTML = "";
        localStorage.setItem('userEmail', userEmail);
    };

    return sendForm;
};

// Envoie du formulaire au localStorage
function dataBasketPost(sendForm){

    var produitsLocalStorage = JSON.parse(localStorage.getItem('tableauItem'));

    if(produitsLocalStorage==null){
        produitsLocalStorage=[];
    }else{
        var idItemInBasket=[];
        for(j=0; j < produitsLocalStorage.length; j++){
            idItemInBasket.push(produitsLocalStorage[j].idProduit);
        };

        localStorage.setItem('idtab', idItemInBasket.join());
    };

    if(idItemInBasket==null){
    alert('votre panier est vide :(');
    sendForm = false;
    };

    if(sendForm){
        const promise3 =  fetch("http://localhost:3000/api/teddies/order",{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            contact:{
                firstName : localStorage.getItem('userFirstName'),
                lastName : localStorage.getItem('userLastName'),
                address : localStorage.getItem('userAdress'),
                city : localStorage.getItem('userCity'),
                email : localStorage.getItem('userEmail'),
            },

            products:localStorage.getItem('idtab').split(','),
        })
    });

        promise3
        .then (res=>res.json())
        .then (data=>{

        localStorage.setItem('orderId',data.orderId);
        pageConfirmation();
        });
    };
}


function validationCommande(){

    var userFirstNameStorage = localStorage.getItem('userFirstName');
    var produitsLocalStorage =JSON.parse(localStorage.getItem('tableauItem'));
    var recupeOrderId = localStorage.getItem('orderId');

    var firstNameField = document.getElementById('user-first-name');
    var totalPriceField = document.getElementById('total-price-field');
    var orderIdField = document.getElementById('orderId');

    firstNameField.innerHTML = userFirstNameStorage;

    var totalPriceTable =[];
    if(produitsLocalStorage){
        for(j=0; j<produitsLocalStorage.length; j++){
            totalPriceTable.push(produitsLocalStorage[j].price*produitsLocalStorage[j].quantite);
            const reducer = (accumulator, currentValue ) => accumulator + currentValue;
            const totalPrice = totalPriceTable.reduce(reducer);
            totalPriceField.innerHTML =  totalPrice + '€';
        };
    }

    orderIdField.innerHTML = recupeOrderId;

};

// Suppression du panier et des informations d'identités après validation de la commande
function clearProductCount(){
    localStorage.removeItem('tableauItem');
    localStorage.removeItem('productcount');
    localStorage.removeItem('idtab');
    document.location.href="./index.html";
};

function pageConfirmation(){
    document.location.href="./confirmation.html?page=confirmation";

};



var queryString = window.location.search;
const urlSearchParams = new URLSearchParams(queryString);
let idOurs = urlSearchParams.get('id');
let page= urlSearchParams.get('page');


basketCount();
if (idOurs){
    getOursById(idOurs);

}else if(page==="panier" ){
    myBasket();

    var btnValider = document.getElementById('btn-valider');
    btnValider.addEventListener('click', async function(event){
        event.preventDefault();
        var sendForm = await dataUser();
        dataBasketPost(sendForm);
    });

}else if(page==="confirmation" ){
    validationCommande();

    var backToHome= document.getElementById('retour-accueil');
    backToHome.addEventListener('click', function(event){
        event.preventDefault();
        clearProductCount();
    });

}else{
    getOursList();
};
