import { buildGallery } from "./gallery.js";
import { works, categories } from "./sets.js"
import { closeModal, openModal, focusableElts, buildFocusableEltList } from "./modale.js"

/**
 * function to replace
 * gallery modal by
 * add work form
 */
async function openAddWorkForm() {

    let modal = document.querySelector('.modal');

    // remove previous modal child
    let originalModalWrapper = document.querySelector('.modal-wrapper');
    modal.removeChild(originalModalWrapper);
        
    // create addWorkForm
    await createAddWorkForm();

    // populate categories
    addCategoriesToAddWorkForm();

    // then add events to this form
    addAddWorkFormEvents();


    // rebuild focusable elt list
    buildFocusableEltList();

    // add focus to this form
    focusableElts[0].focus();
}

/**
 * create add work form
 * then append it and return it
 */
async function createAddWorkForm() {


    let modal = document.querySelector('.modal');


    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-wrapper">
            <h3 id="modal-title">Ajout photo</h3>
            <button class="close-modal">
                <img 
                    src="assets/icons/close-svgrepo-com.svg"
                    alt="une croix pour fermer" 
                    width="24">
            </button>
            <button class="back-modal">
                <img 
                    src="assets/icons/back-svgrepo-com.svg" 
                    alt="une flèche pour revenir en arrière" 
                    width="21">
            </button>
            <form id="add-work">
                <div class="img-input">
                    <img 
                        src="assets/icons/picture-svgrepo-com.svg" 
                        class="placeholder"
                        alt="une icône d'image">
                    <input type="file" name="image" id="image-input" accept=".jpg, .png" required>
                    <label for="image-input">+ Ajouter photo</label>
                    <p>png, jpg: 4mo max</p>
                    <img src="" class="preview">
                </div>
                <label for="titre">
                    Titre
                    <input type="text" name="title" id="title-input" required>
                </label>
                <label for="category">
                    Catégorie
                    <select name="category" id="category-input" required>
                    </select>
                </label>
                <hr>
                <input type="submit" value="Valider" class="js-submit" disabled>
            </form>
    `);
}

/**
 * function which add events
 * Listener to add work form
 */
async function addAddWorkFormEvents() {


    document.getElementById('add-work').addEventListener("submit", (e) => {

        e.preventDefault();
        e.stopPropagation();

        postNewWork(e);

    });

    document.querySelector('button.close-modal').addEventListener('click', closeModal);

    document.querySelector('button.back-modal').addEventListener('click', openModal);

    // custom validity for image input
    document.querySelector('input#image-input').addEventListener('change', (e) => {
        for (const file of e.currentTarget.files ) {

            // size > 4Mb
            if ( file.size > 4194304 ) {
                e.currentTarget.setCustomValidity('Votre fichier est trop lourd.');
                e.currentTarget.reportValidity();
                e.currentTarget.value = "";
            } else if ( file.type !== "image/png" && file.type !== "image/jpeg" ) { 
                e.currentTarget.setCustomValidity("Votre fichier n'est pas au bon format.");
                e.currentTarget.reportValidity();
                e.currentTarget.value = "";
            } else {
                // if validity is ok preview image
                document.querySelector('.img-input > img.preview').setAttribute('src', URL.createObjectURL(file));
                // set opacity to 0 for others child
                document.querySelector('.img-input').classList.add('preview');
                // remove previous validity report
                e.currentTarget.setCustomValidity('');
            }
        };
    })

    document.querySelectorAll('#add-work input, #add-work select').forEach( (input) => {
        input.addEventListener('change', validateForm)
    })

}


/**
 * add default empty option
 * populate categories select element
 * with objects from categories' set
 */
async function addCategoriesToAddWorkForm() {

    let categoryInputSelect = document.getElementById('category-input');
    // add default option (nothing)
    let defaultOption = new Option();
    categoryInputSelect.appendChild(defaultOption);

    categories.forEach( (category) => {

        let option = new Option(category.name, category.id);
        categoryInputSelect.add(option);

    });

}

/** 
 * send new Work to backend
 * then add it to current set
 * and finally remove modal
 * @param {Event} e the event fired by submit button
*/
function postNewWork(e) {
    
    const form = e.currentTarget;
    var formData = new FormData(form);

    const token = sessionStorage.getItem('token');
    
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5678/api/works");
    request.responseType = 'json';
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.send(formData);
    request.onload = function() {

        if (request.status == 201) {

            let data = request.response;
    
            let categoryName;
            categories.forEach( (category) => { if (category.id == data.categoryId) categoryName = category.name} );
    
            let newWork = {
                "id": data.id,
                "title": data.title,
                "imageUrl": data.imageUrl,
                "categoryId": parseInt(data.categoryId),
                "userId": data.userId,
                "category": {
                    "id": parseInt(data.categoryId),
                    "name": categoryName
                }
    
            }
    
            works.add(newWork);
            
            buildGallery();
    
            closeModal();

        } else {
            // if there's an error, inform user with popup
            closeModal();
            alert("Une erreur est survenue, le média n'a pas été ajouté");

        }

    };

    // if there's an error, inform user with popup
    request.onerror = function() {
        closeModal();
        alert("Une erreur est survenue, le média n'a pas été ajouté");
    }

}

/**
 * validate form submitted
 */
function validateForm() {

    let formInputs = document.querySelectorAll('#add-work input, #add-work select');

    var valid = true;

    for (let input of formInputs) {
        valid &= input.reportValidity();
        if (!valid) {break;}
    };

    if (valid) document.querySelector('#add-work input[type="submit"]').disabled = false;
    else document.querySelector('#add-work input[type="submit"]').disabled = true;


    // rebuild focusable elements to include submit or exclude it
    buildFocusableEltList();

}


export { openAddWorkForm }