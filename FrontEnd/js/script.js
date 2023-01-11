/* Script chargé de l'import des projets */

async function importProject() {

    /* define our options */
    const options = {
        method: 'GET',
        mode: 'cors',
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

async function buildGallery() {

    const projects = await importProject();

    console.log(projects);

    projects.forEach((project) => {


        /* init our vars */
        let figureElt;
        let imgElt;
        let captionElt;
        let captionText;
        let galleryContainer;


        /* create figure container */
        figureElt = document.createElement('figure');

        /* create image */
        imgElt = document.createElement('img');
        imgElt.setAttribute('src', project.imageUrl);
        imgElt.setAttribute('alt', project.title);

        /* add image to figure */
        figureElt = figureElt.appendChild(imgElt);

        /* create caption */
        captionElt = document.createElement('figcaption');
        captionText = document.createTextNode(project.title);

        /* add text to caption */
        captionElt.appendChild(captionText);

        /* add figcaption to figure */
        figureElt = figureElt.appendChild(captionElt);

        /* select gallery to add theses elements */
        galleryContainer = document.querySelector('div.gallery');

        /* finally add figure to gallery */
        galleryContainer.appendChild(figureElt);
    
    });
}

document.body.onload = buildGallery;

