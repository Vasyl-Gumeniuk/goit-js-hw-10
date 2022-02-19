var debounce = require('lodash.debounce');
import Notiflix from "notiflix";
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

Notiflix.Notify.init({
  position: 'right-top',
  width: '500px',
  fontSize: '20px',
});


const DEBOUNCE_DELAY = 300;

const refs = {
    inputData: document.querySelector('#search-box'),
    dataList: document.querySelector('.country-list'),
    countriesInfo: document.querySelector('.country-info'),
}
let name = '';

refs.inputData.addEventListener('input', debounce(countryRequest, DEBOUNCE_DELAY));



function countryRequest(e) {
    name = e.target.value.toLowerCase().trim();
    clearInput();
    onCoutriesFetch(name);

    function onCoutriesFetch(name) {
        fetchCountries(name)
            .then(countries => {
                const amount = countries.length;
                console.log(amount);
                console.log(countries);

                if (amount > 10) {
                    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                    
                } else if(amount >= 2 && amount <= 10) {
                    renderCountryList(countries);    
                } else { 
                    renderCountryInfo(countries); 
                }
            })
            .catch(onFetchError);

    }
};

function renderCountryList(countries) {
    countries.map(country => {
        const { name, flags } = country;
        return refs.dataList.insertAdjacentHTML('afterbegin',
            `<li class = "country-list-item">
                    <div class="list-img-thumb">
                         <img src="${flags.svg}" alt="flag">
                    </div>
                    <p class="country-list-text">${name.official}</p>
                </li>`)
    })
};

function renderCountryInfo(countries) {
    countries.map(country => {
        const { name, capital, population, languages, flags } = country;
        const keys = Object.values(languages);
        let language = keys.map(lang => lang).join(', ');
        
        return refs.countriesInfo.insertAdjacentHTML('afterbegin',
                `<div class="list-img-thumb">
                    <img src=${flags.svg} alt="flags">
                    <h2 class="card-title">${name.official}</h1>
                </div>
                    <p class="card-item"><b>Capital: </b>${capital}</p>
                    <p class="card-item"><b>Population: </b>${population}</p>
                    <p class="card-item"><b>Languages: </b>${language}</p>`)
    })
};


function onFetchError(error) {
  if (name !== '') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function clearInput() {
  refs.dataList.innerHTML = '';
  refs.countriesInfo.innerHTML = '';
}
