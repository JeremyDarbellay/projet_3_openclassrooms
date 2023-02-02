/*
* file used in login.html 
* authentificate user
*/
document.body.onload = addSubmitEvent;

/**
 * add necessary event to login form
 */
function addSubmitEvent() {

    let form = document.querySelector('.login-form');

    form.addEventListener("submit", (e) => {
        
        e.preventDefault();

        // do form validation
        let formIsValid = validateForm();

        // do user authentication
        if (formIsValid == true) authenticateUser();

    });

    
}

/**
 * Function which authentificate the user
 */
async function authenticateUser() {

    let userEmail = document.querySelector('input#email').value;
    let userPass = document.querySelector('input#password').value;

    const postData = JSON.stringify({
        "email": userEmail,
        "password": userPass
    })

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: postData
    };

    await fetch("http://localhost:5678/api/users/login", options)
        .then( (res) => {
            if (res.status == "200") {
                // save token and redirect
                saveTokenAndRedirect(res);

            } else if (res.status == "404") {
                showErrorElt("Erreur dans l’identifiant ou le mot de passe");
            } else {
                return Promise.reject(res.status)
            }
        })
        .catch( (error) => showErrorElt("Une erreur est survenue"));


}

/**
 * show an error message before the form
 * @param {String}
 */
function showErrorElt(reason) {

    if (document.querySelector('.error')) document.querySelector('.error').remove();

    let formSection = document.getElementById('login-section');
    let form = document.getElementById('login-form');

    let errorElt = document.createElement('p');
    errorElt.classList.add('error');
    errorElt.appendChild(document.createTextNode(reason));

    formSection.insertBefore(errorElt, form);

}

/**
 * function for basic form validation
 */
function validateForm() {

    let formInputs = document.querySelectorAll('form#login-form>label>input');
    var valid = true;
    for (let input of formInputs) {
        valid &= input.reportValidity();
        if (!valid) {break;}
    };
    if (valid) return true;

}

/**
 * Save token in localStorage
 * and redirect to front
 * @param {Response} res the response
 */
async function saveTokenAndRedirect(res) {

    res = await res.json();

    const token = res.token;

    sessionStorage.setItem('token', token);

    // redirect to front
    window.location.href = "index.html";
}