const userTab = document.querySelector("[user-container]");
const searchTab = document.querySelector("[search-container]");
const maincontainer = document.querySelector(".weather-container");

const userContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-locationContainer");
const searchForm = document.querySelector(".search-form");
const loadingSrn = document.querySelector(".loading-conrainer");
const info = document.querySelector(".parameter-container");
const grantButtonAccess = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

const API_KEY = "86800953ee8ab259a49b58c35323dbb5";

let currentTab = userTab;
currentTab.classList.add("currentTab");
getFromSessionStorage();

function switchTab(clickTab) { 

    notFound.classList.remove("active");

    if(currentTab != clickTab) {

        currentTab.classList.remove("currentTab");
        currentTab = clickTab;
        currentTab.classList.add("currentTab");


        if(!searchForm.classList.contains("active")) {
            console.log("Weatthe....");
            searchForm.classList.add("active");
            userContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            
        }

        else{
            console.log("Weatthe11....");
            searchForm.classList.remove("active");
            userContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-Coordinates");

    console.log(localCoordinates);
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }

    else{
        let coordinates =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingSrn.classList.add("active");

    try{
        console.log("fetchUserWeatherInfo1")
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingSrn.classList.remove("active");
        userContainer.classList.add("active");
        randerWeatherInfo(data);
    }

    catch(err) {
        userContainer.classList.remove('active');

        notFound.classList.add('active');

        errorImage.style.display = 'none';

        errorText.innerText = `Error: ${err?.message}`;

        errorBtn.style.display = 'block';

        errorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function randerWeatherInfo(data) {

    const cityName = document.querySelector("[city-name]");
    const countryFlag = document.querySelector("[country-Flag]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    console.log("Cityy...");
    cityName.innerText = data?.name;

    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

    desc.innerText = data?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

    temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;

    windSpeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;

    humidity.innerText = `${data?.main?.humidity.toFixed(2)} %`;

    cloudiness.innerText = `${data?.clouds?.all.toFixed(2)} %`;

    const city = data?.name;

    console.log(city);

}

grantButtonAccess.addEventListener("click", getLocation);

function getLocation(){

    if(navigator.geolocation) {
        console.log("getLocation,,,")
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantButtonAccess.style.display = 'none';
    }
}

function showPosition(position) {

    const userContainer = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-Coordinates", JSON.stringify(userContainer));

    fetchUserWeatherInfo(userContainer);
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName1 = searchInput.value;

    console.log("Search/.....");
    if(cityName1 === "") {
        console.log("city is not found");
        return;
    }
    console.log(cityName1);
    fetchSearchWeatherInfo(cityName1);
    cityName1 = "";
});

async function fetchSearchWeatherInfo(city) {
    loadingSrn.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");
    
    console.log(city);
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (!data.sys) {
            throw data;
        }

        loadingSrn.classList.remove("active");
        userContainer.classList.add("active");

        randerWeatherInfo(data);
    }

    catch(err) {
        loadingSrn.classList.remove("active");
        userContainer.classList.remove("active");
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }
}
