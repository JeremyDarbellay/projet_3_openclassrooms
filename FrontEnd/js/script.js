/* Script chargé de l'import des projets */

/* TODOLIST
 * @TODO rename superSet
 */

/* call our function to build non filtered gallery */
document.body.onload = buildPage;

/* Create our main set, to use it later */
let superSet = new Set();


/** 
* make an api call to retrieve all projects and return it 
* @return {object} All projects
*/
async function getAllProjects() {

    /* define our options */
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    /* use this url */
    const projectsUrl = 'http://localhost:5678/api/works';

    /* effectively fetch projects */
    const response = await fetch(projectsUrl, options);

    /* to Json for ease of use */
    const projects = await response.json();

    // Let it Here ? @TODO move this ?
    projects.forEach( (project) => {superSet.add(project)} );

    /* finally return projects */
    return projects;

}

/**
 * Make an api call to retrieve categories
 * @return {object}
 */
async function getAllCategories() {

    /* define our options */
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    /* use this url */
    const categoriesUrl = 'http://localhost:5678/api/categories';

    /* effectively fetch categories */
    const response = await fetch(categoriesUrl, options);

    /* to Json for ease of use */
    const categories = await response.json();

    /* finally return categories */
    return categories;

}

/*
* add all projects to gallery
* iterate over projects 
* create a figure element for each project
*/ 
async function addGallery() {

    // retrieve projects
    const projects = await getAllProjects();

    /* select gallery to add theses elements */
    const galleryContainer = document.querySelector('div.gallery');

    projects.forEach((project) => {

        let figureElt = createProjectElt(project);
        figureElt = galleryContainer.appendChild(figureElt);

    });
}

/**
 * Create a project element
 * for a given project
 * @param {Object} project The project containing informations
 * @return {Node} The project figure
 */
function createProjectElt(project) {

        /* create figure container */
        let figureElt = document.createElement('figure');


        /* create image */
        let imgElt = document.createElement('img');
        imgElt.setAttribute('src', project.imageUrl);
        imgElt.setAttribute('alt', project.title);

        /* add image to figure */
        figureElt.appendChild(imgElt);

        /* create caption */
        let captionElt = document.createElement('figcaption');

        /* add figcaption to figure */
        captionElt = figureElt.appendChild(captionElt);
        let captionText = document.createTextNode(project.title);

        /* add text to caption */
        captionElt.appendChild(captionText);

        return figureElt
}

/* 
* call necessary function to add dynamic elements
* to this page
* @TODO rework it !
*/
async function buildPage() {

    buildCategories();

    addGallery();
}

/* 
* main function to build category bar 
* and attach events listeners
*/
async function buildCategories() {


    let filterBarElt = await createFilterBar();

    filterBarElt = await addAllProjectFilter(filterBarElt);

    const categories = await getAllCategories();
    categories.forEach((category) => {

        // call creation of element, get final element
        let categoryElt = createCategoryElt(category.name, filterBarElt);

        // add an event to this element to be able to filter it
        categoryElt.addEventListener("click", (e) => {filterProjects(e, category.id)});
    });
}

/**
* build a filter element and return it
* @param {string} categoryName The category name
* @param {Node} filterBar The filterBar element
* @return {Node} the category element
*/
function createCategoryElt(categoryName, filterBar) {

    // create our element
    let categoryElt = document.createElement('button');

    // add category name inside button
    categoryElt.appendChild(document.createTextNode(categoryName));

    // add our element to it's parent (filterBar)
    categoryElt = filterBar.appendChild(categoryElt);

    return categoryElt;
}

/**
 * create div which contains categories
 * then return it
 * @return {Node}
 */
async function createFilterBar() {

    // create category bar, add style
    let filtersDiv = document.createElement('div');
    filtersDiv.classList.add('categories');

    // select section and gallery to insert our div
    const portfolio = document.getElementById('portfolio');
    const galleryContainer = document.querySelector('div.gallery');
    
    filtersDiv = portfolio.insertBefore(filtersDiv, galleryContainer);

    return filtersDiv;

}

/**
 * add "All" filter and attach filter Event to it
 * @param {Node} filterBar The filter div
 * @return {Node} the filter div with "all" filter
 */
async function addAllProjectFilter(filterBar) {

    // create default filter
    let allProjectsFilter = document.createElement('button');
    // add default style
    allProjectsFilter.classList.add('active');
    // then add text
    allProjectsFilter.appendChild(document.createTextNode('Tous'));

    // register an event listener to filter all projects (0)
    allProjectsFilter.addEventListener("click", (e) =>{filterProjects(e, 0)});

    // attach it to filterBar
    filterBar.appendChild(allProjectsFilter);

    return filterBar;
}

/**
 * hide projects if not in category provided
 * if no category provided show all projects
 * @param {Event} e the event propagated
 * @param {Int} categoryId category id
 */
async function filterProjects(e, categoryId) {


    /* select categories div, then remove active class */
    const categoriesButtons = document.querySelectorAll('div.categories>button');
    categoriesButtons.forEach( (categoryButton) => {
        categoryButton.classList.remove('active');
    })

    /* Then add active class */
    e.currentTarget.classList.add('active');

    /* select gallery */
    const galleryContainer = document.querySelector('div.gallery');
    const projectsElts = document.querySelectorAll('div.gallery>figure');

    /* reset all subnodes */
    for (let figure of projectsElts) {
        galleryContainer.removeChild(figure);
    }

    superSet.forEach( (project) => {
        if (project.categoryId == categoryId || categoryId == 0) {
            let newProjectElt = createProjectElt(project);
            galleryContainer.appendChild(newProjectElt);
        }
    });

    

}