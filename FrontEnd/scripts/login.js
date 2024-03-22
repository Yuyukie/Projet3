export function loginForm() {
    const errorMessage = document.querySelector('.error-message');

    try {
        const form = document.querySelector('.form-login');
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Récupère les valeurs des champs email et password lors de la soumission du formulaire
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Réinitialise le message d'erreur
            errorMessage.style.display = 'none';

            // Vérifie si les champs email et password sont vides
            if (!verifierChamp(email)) {
                errorMessage.textContent = "Veuillez remplir tous les champs.";
                errorMessage.style.display = 'block';
                return false;
            }

            if (!verifierChamp(password)) {
                errorMessage.textContent = "Veuillez remplir tous les champs.";
                errorMessage.style.display = 'block';
                return false;
            }

            // Vérifie si l'email est valide
            if (!verifierEmail(email)) {
                errorMessage.textContent = "L'email n'est pas valide.";
                errorMessage.style.display = 'block';
                return false;
            }

            // Vérifie si le mot de passe est valide
            if (!verifierPassword(password)) {
                errorMessage.textContent = "Le mot de passe n'est pas valide.";
                errorMessage.style.display = 'block';
                return false;
            }

            // Appelle la fonction d'authentification de l'utilisateur
            await authentificationUtilisateur(email, password);
            // Efface les valeurs des champs email et password après la soumission du formulaire
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        });
    } catch (error) {
        console.error('Erreur lors de la gestion du formulaire de connexion:', error);
    }
}

// Fonction de vérification de champ vide
function verifierChamp(champs) {   
    if (champs === "") {
        return false;
    }
    return true;
}

// Fonction de validation de l'email
function verifierEmail(email) {
    const emailValide = "sophie.bluel@test.tld";
    if (email !== emailValide){
        return false;
    }
    return true;
}

// Fonction de validation du mot de passe
function verifierPassword(password) {
    const passwordValide = "S0phie"; 
    if(password !== passwordValide){
        return false;
    }
    return true;
}



// Fonction pour l'authentification de l'utilisateur
async function authentificationUtilisateur(email,password,) {
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
        
        
        
    } catch (error) {
        // Affiche une erreur en cas d'échec de l'authentification
        console.error('Erreur lors de l\'authentification:', error.message);
    }
}

// Actions principales

loginForm();


