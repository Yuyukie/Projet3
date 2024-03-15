// Fonction de récupération des données depuis l'API
async function recuperationDonnees() {
    // Récupération des projets
    const responseProjet = await fetch("http://localhost:5678/api/works");
    const projets = await responseProjet.json();

    // Récupération des catégories
    const responseCategorie = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategorie.json();

    // Utilisation d'un Set pour stocker les identifiants des projets
    const idProjets = new Set();

    // Ajoute un identifiants à chaque projet
    for (let i = 0; i < projets.length; i++) {
        idProjets.add(projets[i].id);
    }
    // Génération des projets avec les données récupérées
    genererProjets(projets, categories);
    // Vérification projets avec un id respectifs et sa categories attitré
    console.log(projets, categories);

    // Ajout des écouteurs d'événements aux boutons de filtre
    const filtresButtons = document.querySelectorAll('.filtres-button');
    for (let i = 0; i < filtresButtons.length; i++) {
        filtresButtons[i].addEventListener('click', function() {
            filtrerProjets(this.value, projets, categories); //grace a this.value on pointe sur la valeur du bouton sur lequel on a cliqué pour ensuite le compare au categorie d'objet. 
        });
    }
}

// Fonction de génération des projets dans le DOM
function genererProjets(projets, categories) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionProjet = document.querySelector(".gallery");
    // Supprimer tous les projets existants dans la galerie
    sectionProjet.innerHTML = '';
    // Vérification si sectionProjet est null avant d'ajouter des éléments
    if (sectionProjet) {
        // Création des éléments pour chaque projet
        for (let i = 0; i < projets.length; i++) {
            const projet = projets[i];

            // Création d’une balise dédiée à un projet
            const projetElement = document.createElement("div");
            projetElement.dataset.id = projet.id;

            // Création des balises pour les informations du projet
            const nomElement = document.createElement("h2");
            nomElement.innerText = projet.title;

            const imageElement = document.createElement("img");
            imageElement.src = projet.imageUrl;

            // Récupération de la catégorie du projet à partir de son identifiant
            const categorie = categories.find(cat => cat.id === projet.categoryId);

            // Ajout des balises au projet
            projetElement.appendChild(nomElement);
            projetElement.appendChild(imageElement);

            // Ajout du projet à la section
            sectionProjet.appendChild(projetElement);
        }
    }
}

// Fonction de filtrage des projets
function filtrerProjets(categorie, projets, categories) {
    const sectionProjet = document.querySelector('.gallery');
    if (sectionProjet) {
        // Afficher tous les projets
        const projetElements = document.querySelectorAll('.gallery > div');
        for (let i = 0; i < projetElements.length; i++) {
            projetElements[i].style.display = 'block';
        }

        // Cacher les projets qui ne correspondent pas à la catégorie sélectionnée
        if (categorie !== 'Tous') {
            for (let i = 0; i < projets.length; i++) {
                const projet = projets[i];
                const projetElement = document.querySelector(`[data-id="${projet.id}"]`);
                const categorieProjet = categories.find(cat => cat.id === projet.categoryId);
                if (categorieProjet && categorieProjet.name !== categorie) {
                    projetElement.style.display = 'none';
                }
            }
        }
    }
}

// Appel de la fonction de récupération des données au chargement de la page
recuperationDonnees();

function ajoutUser (){

    const connexionFormulaire = document.querySelector(".connexion-form");
    connexionFormulaire.addEventListener("submit", function (event){
    event.preventDefault();
    gererLoginForm();
        // Création de l'objet userLog
            const userLog = {
                email : event.target.querySelector("[name=email]").value,
                motDePass : event.target.querySelector("[name=password]").value,
            };
            // Création de la charge utile au format JSON
            const chargeUtile = JSON.stringify(userLog);
            // Appel a la fonction fetch pour envoyer toutes les informations a l'API
            fetch("http://localhost:5678/api/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: chargeUtile
            })
            // fonction callback pour etre sur que l'API a bien recu les informations
            .then(response => {
                if (response.ok) {
                    console.log("Les informations du formulaire ont été envoyées avec succès !");
                } else {
                    console.error("Erreur lors de l'envoi des informations du formulaire à l'API.");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la requête fetch :", error);
            });
        });
};


// Fonction de validation du mot de passe
function verifierPassword(password) {
    // Vérifie si la longueur du mot de passe est inférieure à 2
    if (password.length < 2) {
        // Si c'est le cas, renvoie false
        return false;
    }
    // Sinon, renvoie true
    return true;
}

// Fonction de validation de l'email
function verifierEmail(email) {
    // Expression régulière pour valider l'email
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    // Vérifie si l'email correspond au format attendu
    if (!emailRegExp.test(email)) {
        // Si ce n'est pas le cas, renvoie false
        return false;
    }
    // Sinon, renvoie true
    return true;
}

// Fonction de vérification de champ vide
function verifierChamp(balise) {
    // Vérifie si la valeur de la balise est vide
    if (balise.value === "") {
        // Si c'est le cas, renvoie false
        return false;
    }
    // Sinon, renvoie true
    return true;
}

// Fonction pour gérer la soumission du formulaire de connexion
function gererLoginForm() {
    // Récupération de la valeur de l'email depuis l'élément HTML correspondant
    const baliseEmail = document.getElementById("email");
    const email = baliseEmail.value;
    // Récupération de la valeur du mot de passe depuis l'élément HTML correspondant
    const balisePassword = document.getElementById("password");
    const password = balisePassword.value;

    // Vérification si les champs email et mot de passe sont vides
    if (!verifierChamp(email) || !verifierChamp(password)) {
        // Affiche un message d'erreur et renvoie false si un champ est vide
        console.log("Veuillez remplir tous les champs.");
        return false;
    }

    // Vérification de la validité de l'email
    if (!verifierEmail(email)) {
        // Affiche un message d'erreur et renvoie false si l'email n'est pas valide
        console.log("L'email n'est pas valide.");
        return false;
    }

    // Vérification de la longueur du mot de passe
    if (!verifierPassword(password)) {
        // Affiche un message d'erreur et renvoie false si le mot de passe est trop court
        console.log("Le mot de passe est trop court.");
        return false;
    }

    // Si toutes les validations sont réussies, renvoie true
    return true;
}

ajoutUser ();