
/* Create our sets, to use it later */
let works = new Set();
let categories = new Set();


/** 
* make an api call to retrieve all works 
* and adds it to worksSet
* @return {object} All works
*/
async function initWorksSet() {

    return fetch('http://localhost:5678/api/works')
        .then( data => data.json() )
        .then( set => set.forEach( (work) => works.add(work)) );

}

/**
 * Make an api call to retrieve categories
 * @return {object}
 */
async function initCategoriesSet() {

    return fetch('http://localhost:5678/api/categories')
        .then( data => data.json() )
        .then( set => set.forEach( (category) => categories.add(category)) );

}

export {
    works,
    categories,
    initCategoriesSet,
    initWorksSet
}
