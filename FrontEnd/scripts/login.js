// Fonction de vérification de champ vide
function verifierChamp(email,password) {
    // Vérifie si la valeur de la balise est vide
    if (email.value === ""|| password.value ==="") {
        // Si c'est le cas, renvoie false
        return false;
    }
    // Sinon, renvoie true
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
    // Sinon, renvoie true
    return true;
}

// Fonction pour gérer la soumission du formulaire de connexion
function gererFormulaireConnexion() {
    // Récupération de la valeur de l'email depuis l'élément HTML correspondant
    const baliseEmail = document.getElementById("email");
    const email = baliseEmail.value;
    // Récupération de la valeur du mot de passe depuis l'élément HTML correspondant
    const balisePassword = document.getElementById("password");
    const password = balisePassword.value;
    // Vérification si les champs email et mot de passe sont vides
    if (!verifierChamp(email, password)) {
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
        console.log("Le mot de passe n'est pas valdie.");
        return false;
    }

    // Si toutes les validations sont réussies, renvoie true
    authentificationUtilisateur(email, password)
    baliseEmail.value = "";
    balisePassword.value = "";
}

async function authentificationUtilisateur(email, password) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
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
  }
 