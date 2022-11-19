const DEFAULT_URL = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=e72bce039e734896aa0ac9ade21090dc";
const TOP_COMPANY_URL = "https://newsapi.org/v2/everything?q=tesla&from=2022-11-18&to=2022-11-18&sortBy=popularity&apiKey=e72bce039e734896aa0ac9ade21090dc"

const elSearchForm = document.querySelector(".site-header__form");
const elSearchInput = elSearchForm.querySelector(".site-header__input");

const elCategoryList = document.querySelector(".site-header__list");
const elTopCompanyNameList  = document.querySelector(".top-company");
const elTopCompanyList  = document.querySelector(".top-company__list");

const elCountrySelect = document.querySelector(".site-header__country-select");

const elNewsList = document.querySelector(".news__list");

// get template
const elNewsTemplate = document.querySelector(".news-template").content;
const elTopCompanyTemplate = document.querySelector(".top-company-template").content;

//global fragment
const newsFragment = new DocumentFragment();

//Render news
function renderNews(arr){
    elNewsList.innerHTML = "";
    arr.forEach(item => {
        const templateClone = elNewsTemplate.cloneNode(true);
        templateClone.querySelector(".news__add-time").textContent = item.publishedAt.split("T")[0]
        templateClone.querySelector(".news__img").src = item.urlToImage;
        templateClone.querySelector(".news__img").alt = item.title;
        templateClone.querySelector(".news__subtitle").textContent = item.title;
        templateClone.querySelector(".news__description").textContent = item.description;


        newsFragment.appendChild(templateClone);
    });
    elNewsList.appendChild(newsFragment)
}

// Render Top Company news
function renderTopCompanyNews(arr){
    elTopCompanyList.innerHTML = "";
    arr.forEach(item => {
        const templateClone = elTopCompanyTemplate.cloneNode(true);
       templateClone.querySelector(".top-company__img").src = item.urlToImage;
       templateClone.querySelector(".top-company__subtitle").textContent = item.title;

       newsFragment.appendChild(templateClone);
    });

    elTopCompanyList.appendChild(newsFragment);
}

//Get news data
async function getData(url){
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderNews(data.articles);
    } catch(err){
        console.log(err)
    }
}

//Get Top company news data
async function getTopCompanyData(url){
    try {
        const res = await fetch(url);
        const data = await res.json();
        const sliceData = data.articles.slice(0, 5);
        renderTopCompanyNews(sliceData);
    } catch(err){
        console.log(err)
    }
}

//Debounce
function debounce(callback, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(callback, delay)
    }
}
function check() {
    let searchInputValue = elSearchInput.value;
    const searchUrl = `https://newsapi.org/v2/top-headlines?q=${searchInputValue}&apiKey=e72bce039e734896aa0ac9ade21090dc`
    if(searchInputValue === ""){
        getData(DEFAULT_URL)
    }else{
        getData(searchUrl)
    }
}
elSearchForm.addEventListener("keyup", debounce(check, 1000));

//Click select
elCountrySelect.addEventListener("click", () => {
    const countrySelectValue = elCountrySelect.value;
    const countrySelect = `https://newsapi.org/v2/top-headlines?country=${countrySelectValue}&category=business&apiKey=e72bce039e734896aa0ac9ade21090dc`
    getData(countrySelect)

});

//Event delegation category list
elCategoryList.addEventListener("click", (evt) => {
    if(evt.target.matches(".site-header__item")){
       const category = evt.target.textContent;
       const getCategoryUrl = `https://newsapi.org/v2/top-headlines?country=de&category=${category}&apiKey=e72bce039e734896aa0ac9ade21090dc`
        getData(getCategoryUrl);
    }
});

//evet delegation top company name
elTopCompanyNameList.addEventListener("click", (evt) => {
    if(evt.target.matches(".top-company__name")){
        const companyName = evt.target.textContent;
        const companyUrl = `https://newsapi.org/v2/everything?q=${companyName}&from=2022-11-18&to=2022-11-18&sortBy=popularity&apiKey=e72bce039e734896aa0ac9ade21090dc`
        getTopCompanyData(companyUrl)
    }
});

getData(DEFAULT_URL);
getTopCompanyData(TOP_COMPANY_URL);
