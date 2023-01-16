/* Script chargé de l'import des projets */

/* call our function to build non filtered gallery */
document.body.onload = buildPage;


/* make an api call to retrieve all projects and return it */
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

    /* finally return projects */
    return projects;

}

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


        /* init our vars */
        let figureElt;
        let imgElt;
        let captionElt;
        let captionText;

        /* create figure container */
        figureElt = document.createElement('figure');

        figureElt = galleryContainer.appendChild(figureElt);

        /* create image */
        imgElt = document.createElement('img');
        imgElt.setAttribute('src', project.imageUrl);
        imgElt.setAttribute('alt', project.title);

        /* add image to figure */
        figureElt.appendChild(imgElt);

        /* create caption */
        captionElt = document.createElement('figcaption');

        /* add figcaption to figure */
        captionElt = figureElt.appendChild(captionElt);
        captionText = document.createTextNode(project.title);

        /* add text to caption */
        captionElt.appendChild(captionText);
    
    });
}

/*
* async function which add filter menu on page
*/
async function addCategories() {

    /* retrieve categories */
    const categories = await getAllCategories();
    console.log(categories);

    // create category bar, add style
    let categoriesDiv;
    categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories');

    // select section and gallery to insert our div
    const portfolio = document.getElementById('portfolio');
    const galleryContainer = document.querySelector('div.gallery');
    
    categoriesDiv = portfolio.insertBefore(categoriesDiv, galleryContainer);

    let allProjectsFilter = document.createElement('button');
    allProjectsFilter.classList.add('active');
    allProjectsFilter.appendChild(document.createTextNode('Tous'));
    categoriesDiv.appendChild(allProjectsFilter);

    /* iterate over categories to add an entry */
    categories.forEach((category) => {

        let categoryElt = document.createElement('button');
        let buttonText = document.createTextNode(category.name);

        categoryElt = categoriesDiv.appendChild(categoryElt);
        categoryElt.appendChild(buttonText);

    });
}


/* 
* call necessary function to add dynamic elements
* to this page
*/
async function buildPage() {
    addCategories();
    addGallery();
}