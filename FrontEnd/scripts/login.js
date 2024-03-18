// Fonction de vérification de champ vide
function verifierChamp(email,password) {
    // Vérifie si la valeur de la balise est vide
    if (email === "" || password ==="") {
        // Si c'est le cas, renvoie false
        console.log("champs vide")
        return false;
    }
    // Sinon, renvoie true
    return true;
}
// Fonction de validation de l'email
function verifierEmail(email) {
    const emailValide = "sophie.bluel@test.tld";
    if (email !== emailValide){
        console.log("email non valide")
        return false;
    }
    return true;
}
// Fonction de validation du mot de passe
function verifierPassword(password) {
    const passwordValide = "S0phie";
    if(password !== passwordValide){
        console.log("password invalide")
        return false;
    }
    // Sinon, renvoie true
    return true;
}

async function gererFormulaireConnexion() {
    const formulaire = document.querySelector('.connexion-form');
    formulaire.addEventListener('submit', async function(event) { 
        event.preventDefault();
        
        const baliseEmail = document.getElementById("email");
        const email = baliseEmail.value;
        const balisePassword = document.getElementById("password");
        const password = balisePassword.value;

        if (!verifierChamp(email, password)) {
            console.log("Veuillez remplir tous les champs.");
            return false;
        }

        if (!verifierEmail(email)) {
            console.log("L'email n'est pas valide.");
            return false;
        }

        if (!verifierPassword(password)) {
            console.log("Le mot de passe n'est pas valide.");
            return false;
        }
        
        const userLog = {
            email: email,
            motDePass: password,
        };

        await authentificationUtilisateur(userLog);

        baliseEmail.value = "";
        balisePassword.value = "";

    });
}

async function authentificationUtilisateur(userLog) {
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(userLog);
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: chargeUtile
        });

        if (!response.ok) {
            throw new Error('Échec de l\'authentification');
        }

        const data = await response.json();
        const token = data.token;

        console.log('Authentification réussie. Token:', token);
        window.localStorage.setItem("token", data.token);
        window.location.href = "index.html" ;
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error.message);
    }
};