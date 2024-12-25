const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image 
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture Of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favourite';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Footer content Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date,copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favourites Back
    if (localStorage.getItem('NasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('NasaFavourites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        // Catch Error
    }
}

// Add Result To Favourites
function saveFavourite(itemUrl) {
    // 
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            console.log(favourites);
            // Show Save Confirmation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Save In LocalStorage
            localStorage.setItem('NasaFavourites', JSON.stringify(favourites));
        }
    });
}

// Remove Result From Favourite
function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Save In LocalStorage
        localStorage.setItem('NasaFavourites', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

// Loading
getNasaPictures();