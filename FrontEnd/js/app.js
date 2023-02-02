/* Script chargé de l'import des projets */

// retrieve our modules
import { buildGallery, buildCategories } from "./gallery.js"
import { createEditionElts } from "./modale.js"
import * as set from "./sets.js"

/* call our function to build non filtered gallery */
document.body.onload = buildPage;

/** 
* call necessary function to add dynamic elements
* to this page
* init sets to avoid other api calls
*/
async function buildPage() {

    await set.initWorksSet();
    await set.initCategoriesSet();

    // in case of error during init, do nothing
    if (set.categories.size !== 0) buildCategories();
    if (set.works.size !== 0) buildGallery();

    // use authentification token stored in sessionStorage
    const token = sessionStorage.getItem('token')

    if (token !== null) {
        createEditionElts();
    }
}