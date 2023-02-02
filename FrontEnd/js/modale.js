import { works } from "./sets.js"
import { buildGallery } from "./gallery.js";
import { openAddWorkForm } from "./add-work-form.js"

/** var for accessibility */
let focusableElts = []
let previouslyFocusedElement = null;


/**
 * function to show admin functionalities
 * on page, editions buttons, admin bar and logout link.
 */
async function createEditionElts() {

    // insert admin bar
    document.body.insertAdjacentHTML('afterbegin', `
    <div class="admin-bar">
        <div>
            <img src="assets/icons/edit-svgrepo-com-white.svg" alt="une icône d'un crayon sur du papier" width="19">
            Mode édition
            <button>publier les changements</button>
        </div>
    </div>
    `);

    // button for edition
    const editButton = `
        <button class="edit-button">
            <img src="assets/icons/edit-svgrepo-com.svg" alt="une icône d'un crayon sur du papier" width="18">
            modifier
        </button>
    `;

    // button above main article
    document.querySelector('#introduction>article')
        .insertAdjacentHTML('afterbegin', editButton);

    // button under figure
    document.querySelector('#introduction>figure')
        .insertAdjacentHTML(`beforeend`, editButton);

    // portfolio button
    await document.querySelector('section#portfolio>h2')
        .insertAdjacentHTML(`beforeend`, editButton);

    // event for modal
    document.querySelector('#portfolio .edit-button')
        .addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });

    // logout link
    let logoutLink = document.createElement('a');
    logoutLink.appendChild(document.createTextNode('logout'));
    logoutLink.classList.add('login-link');
    logoutLink.setAttribute('href', '#');

    // add event to logout user
    logoutLink.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.reload();
    });

    //replace login with logout
    document.querySelector('a.login-link')
        .replaceWith(logoutLink);

}

/**
 * construct modal
 * if modal exist delete it before
 * handle focus and key events
 */
async function openModal() {

    closeModal();

    previouslyFocusedElement = document.querySelector(':focus')

    let modal = await createModal();

    document.body.appendChild(modal);

    // build focusable elt list
    buildFocusableEltList();
    // add focus to modal
    focusableElts[0].focus();

    // register escape event to close modal
    window.addEventListener( 'keydown', keyEvents ) 

}

/** 
 * close modal from close button 
 * remove key events listeners
 * set focus to previous focused element
 */
async function closeModal() {

    let modal = document.querySelector('.modal');

    if (modal != undefined) {

        window.removeEventListener('keydown', keyEvents);

        document.body.removeChild(document.querySelector('.modal'));

        if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    }
}

/**
 * create the modal
 * insert html
 * add events to buttons
 * then call addWorksToModal
 * to populate works container
 * @return {Node} the modal
 */
async function createModal() {

    let modal = document.createElement('aside');
    modal.classList.add('modal');
    modal.setAttribute('aria-modal', true);
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modal-title')
       
    // ajout de l'événement pour fermer la modale
    modal.addEventListener('click', (e) => {
        if ( e.target !== e.currentTarget ) return;
        else closeModal();
    })

    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-wrapper">
            <button class="close-modal">
                <img src="assets/icons/close-svgrepo-com.svg"
                    alt="une croix pour fermer" width="24">
            </button>
            <h3 id="modal-title">Galerie photo</h3>
            <div class="works">
            </div>
            <hr>
            <button class="button-primary js-open-add-form">Ajouter une photo</button>
            <button class="danger">Supprimer la galerie</button>
        </div>
    `);

    modal.querySelector('button.close-modal').addEventListener('click', closeModal );
    modal.querySelector('button.js-open-add-form').addEventListener('click', openAddWorkForm );

    modal = addWorksToModal(modal);

    return modal;
}

/**
 * function which take works from works
 * and append them in workContainer
 * @param {Node} modal the modal
 * @return {Node} the modal
 */
async function addWorksToModal(modal) {

    // reset works' div
    document.querySelectorAll(".works>.edit-work").forEach( (work) => work.remove())

    works.forEach( (work) => {

        modal.querySelector('.works').insertAdjacentHTML('beforeend', `
            <div class="edit-work" data-workid="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <button>éditer</button>
                <button class="icon-button js-delete-work">
                    <img src="assets/icons/bin-svgrepo-com.svg" alt="une icône de 4 flèches dans toutes les directions" width="9">
                </button>
                <button class="icon-button">
                    <img src="assets/icons/arrow-4-way-svgrepo-com.svg" width="12">
                </button>
            </div>
        `)

    });

    // add event listeners for each work
    modal.querySelectorAll("button.js-delete-work")
        .forEach((button) => button.addEventListener('click',  (e) => deleteConfirmation(e)))
        // If no popup wanted, uncomment below, comment line above 
        // .forEach( (button) => button.addEventListener('click',  (e) => {
        //     let id = e.currentTarget.parentNode.getAttribute('data-workid');
        //     deleteWork(id)
        //     })
        // )
        

    return modal;
}


/**
 * Function to send post request
 * to delete work from db
 * @param id the id of the project to delete
 */
async function deleteWork(id) {
  
    // use authentification token stored in cookie
    const token = sessionStorage.getItem('token');

    const options = {
        method: "DELETE",

        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
    };

    await fetch(`http://localhost:5678/api/works/${id}`, options)
        .then( (res) => {
            if (res.ok) {

                    // remove this work from our set
                    works.forEach( (work) => {
                        if (work.id == id) works.delete(work)
                    });

                    openModal();

                    // then rebuild gallery
                    buildGallery();

            } else {

                throw new Error("Quelque chose s'est mal passé");

            }
        })
        .catch( (error) => {
            // if there's an error, inform user with popup
            closeModal();
            alert("Une erreur est survenue, le média n'a pas été supprimé");
        });
}

/**
 * Accessibility function
 * take care of focus in modal
 * @param {Event} e the event fired by the key tab
 */
function focusInModal(e) {

    e.preventDefault();

    const modal = document.querySelector('.modal');

    let index = focusableElts.findIndex(f => f === modal.querySelector(':focus'));

    if (e.shiftKey === true) index--
    else index++

    if ( index >= focusableElts.length ) index = 0
    else if ( index < 0 ) index = focusableElts.length - 1

    focusableElts[index].focus();

}

/**
 * handle accessibility function in modal
 * removed with modal in closeModal()
 * @param {Event} e the key event
 */
let keyEvents = function (e) {
    if (e.key === "Escape" || e.key === "Esc") closeModal(e)
    if (e.key === 'Tab') focusInModal(e)
}

/**
 * populate focusableElts var
 * can be used in another module
 */
function buildFocusableEltList() {
    let modal = document.querySelector('.modal')
    focusableElts = Array.from(modal.querySelectorAll('button, input:not(:disabled), select'))
}

/**
 * show modal to confirm deletion of work
 */
async function deleteConfirmation(e) {

    let id = e.currentTarget.parentNode.getAttribute('data-workid');

    let modal = document.querySelector('.modal');

    // remove previous modal child
    let originalModalWrapper = document.querySelector('.modal-wrapper');
    modal.removeChild(originalModalWrapper);

    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-wrapper delete-confirmation">
            <h3 id="modal-title">Confirmation de suppression</h3>
            <p>Voulez-vous réellement supprimer ce projet ?</p>
            <div>
                <button class="danger">Confirmer la suppression</button> 
                <button class="cancel">Annuler la suppression</button>
            </div>
        </div>
    `)

    modal.querySelector('button.cancel').addEventListener('click', openModal);
    modal.querySelector('button.danger').addEventListener('click', (e) => deleteWork(id));

    // rebuild focusable elt list
    buildFocusableEltList();
    // add focus to "cancel" button (to avoid mistakes)
    focusableElts[1].focus();
}

export {
    focusableElts,
    closeModal,
    openModal,
    createEditionElts,
    buildFocusableEltList
}