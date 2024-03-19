

// Fonction de vérification de champ vide
function verifierChamp(champs) {
    // Vérifie si la valeur de la balise est vide
    if (champs === "") {
        // Si c'est le cas, renvoie false
        return false;
    }
    // Sinon, renvoie true
    return true;
}

// Fonction de validation de l'email
function verifierEmail(email) {
    // Email valide
    const emailValide = "sophie.bluel@test.tld";
    // Vérifie si l'email fourni correspond à l'email valide
    if (email !== emailValide){
        return false;
    }
    return true;
}

// Fonction de validation du mot de passe
function verifierPassword(password) {
    // Mot de passe valide
    const passwordValide = "S0phie"; 
    // Vérifie si le mot de passe fourni correspond au mot de passe valide
    if(password !== passwordValide){
        return false;
    }
    // Sinon, renvoie true
    return true;
}

// Fonction pour gérer le formulaire de connexion
function gererFormulaireConnexion() {
        try {
            // Sélectionne le formulaire de connexion
            const formulaire = document.querySelector('.connexion-form');
            // Écoute l'événement de soumission du formulaire
            formulaire.addEventListener('submit', async function(event) { 
                // Empêche le comportement par défaut du formulaire
                event.preventDefault();
                // Récupère la valeur de l'email et du mot de passe depuis les balises correspondantes
                const baliseEmail = document.getElementById("email");
                const email = baliseEmail.value;
                const balisePassword = document.getElementById("password");
                const password = balisePassword.value;
                // Vérifie si les champs email et password sont vides
                if (!verifierChamp(email)) {
                    console.log("Veuillez remplir tous les champs.");
                    return false;
                }
                if (!verifierChamp(password)) {
                    console.log("Veuillez remplir tous les champs.");
                    return false;
                }

                // Vérifie si l'email est valide
                if (!verifierEmail(email)) {
                    console.log("L'email n'est pas valide.");
                    return false;
                }

                // Vérifie si le mot de passe est valide
                if (!verifierPassword(password)) {
                    console.log("Le mot de passe n'est pas valide.");
                    return false;
                }
                console.log("email");
                console.log("password");
                // Appelle la fonction d'authentification de l'utilisateur
                await authentificationUtilisateur(email,password);
                // Efface les valeurs des champs email et password après la soumission du formulaire
                baliseEmail.value = "";
                balisePassword.value = "";
                 
            });
        } catch (error) {
            console.error('Erreur lors de la gestion du formulaire de connexion:', error);
            
        }
};


// Fonction pour l'authentification de l'utilisateur
async function authentificationUtilisateur(email,password) {
    // Crée un objet contenant l'email et le mot de passe
    const userLog = {
        email: email,
        password: password,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(userLog);
    try {
        // Envoie une requête POST pour l'authentification de l'utilisateur
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: chargeUtile
        });

        // Vérifie si la réponse est OK
        if (!response.ok) {
            throw new Error('Échec de l\'authentification');
        }

        // Récupère les données de la réponse au format JSON
        const data = await response.json();
        const token = data.token;

        // Affiche un message en cas d'authentification réussie
        console.log('Authentification réussie. Token:', token);
        // Enregistre le token dans le stockage local du navigateur
        window.localStorage.setItem("token", data.token);
        // Redirige l'utilisateur vers la page index.html après l'authentification réussie
        window.location.href = "index.html" ;
        await executeApresAuthentification(); 
    } catch (error) {
        // Affiche une erreur en cas d'échec de l'authentification
        console.error('Erreur lors de l\'authentification:', error.message);
    }
}

function cacherElements (){
    // Sélectionne l'élément avec la classe spécifiée
    const elements = document.querySelector(".filtres");
    if (elements) {
        console.log("Éléments cibles trouvés :", elements);
    } else {
        console.log("Aucun élément cible trouvé.");
    }
    elements.style.display = 'none';
}

function afficherElements(){
    const elements = document.querySelector(".button-modal");
    if (elements) {
        console.log("Éléments cibles trouvés :", elements);
    } else {
        console.log("Aucun élément cible trouvé.");
    }
    elements.style.display = 'flex';
}

// Fonction pour exécuter des actions après l'authentification
function executeApresAuthentification() {
    // Une fois que l'authentification est réussie, cacher et afficher les éléments
    cacherElements();
    afficherElements();
}

// Actions principales
gererFormulaireConnexion();

const filtresElement = document.querySelector('.filtres');
const displayValue = window.getComputedStyle(filtresElement).getPropertyValue('display');
    // Affichez la valeur de la propriété CSS display
    console.log("La valeur de la propriété CSS display est :", displayValue);