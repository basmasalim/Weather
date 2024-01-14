// Today Box
let todayName = document.getElementById("todayName");
let todayDate = document.getElementById("todayDate");
let todayCity = document.getElementById("todayCity");
let todayDegree = document.getElementById("todayDegree");
let todayDescription = document.getElementById("todayDescription");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let compass = document.getElementById("compass");

// Nextday Box
let nextdayName = document.querySelectorAll(".nextdayName");
let nextdayIcon = document.querySelectorAll(".nextdayIcon");
let maxDegree = document.querySelectorAll(".maxDegree");
let minDegree = document.querySelectorAll(".minDegree");
let nextdayDescription = document.querySelectorAll(".nextdayDescription");

// Search Bar
let search = document.getElementById("search");
let apiKey = "7c3d7e8f1d994c4391a82851241301";
let currentCity = "London";
let apiResponse, finalresponseData;

// Months Name Array
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Days Names Array
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Fetching the API
async function getWeather() {
  try {
    // Use template literals for better readability
    apiResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${currentCity}&days=3`
    );
    finalresponseData = await apiResponse.json();
    console.log(finalresponseData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // You might want to handle the error here, e.g., display an error message to the user
  }
  getTodayWeather();
  getNextTwoDayWeather(); // Fix the function name typo
}

// Call the function to fetch weather data
getWeather();

// Displaying Today's Weather
function getTodayWeather() {
  let currentDate = new Date();
  todayName.innerHTML = days[currentDate.getDay()];
  todayDate.innerHTML = `${currentDate.getDate()} ${
    months[currentDate.getMonth()]
  }`;

  // Check if finalresponseData and finalresponseData.location are defined
  if (finalresponseData && finalresponseData.location) {
    todayCity.innerHTML = finalresponseData.location.name || "N/A";
  } else {
    console.error("Error: Unable to get location data");
    todayCity.innerHTML = "N/A";
    return; // Stop further execution of the function
  }

  // Check if finalresponseData and finalresponseData.current are defined
  if (finalresponseData && finalresponseData.current) {
    todayDegree.innerHTML = finalresponseData.current.temp_c || "N/A";
    todayDescription.innerHTML = finalresponseData.current.condition
      ? finalresponseData.current.condition.text || "N/A"
      : "N/A";
    humidity.innerHTML = finalresponseData.current.humidity || "N/A";
    wind.innerHTML = finalresponseData.current.wind_kph || "N/A";
    compass.innerHTML = finalresponseData.current.wind_dir || "N/A";
  } else {
    console.error("Error: Unable to get current weather data");
    todayDegree.innerHTML = "N/A";
    todayDescription.innerHTML = "N/A";
    humidity.innerHTML = "N/A";
    wind.innerHTML = "N/A";
    compass.innerHTML = "N/A";
  }
}

// Displaying Next two days weather
function getNextTwoDayWeather() {
  // Check if forecast and forecastday arrays are defined
  if (
    !finalresponseData ||
    !finalresponseData.forecast ||
    !finalresponseData.forecast.forecastday
  ) {
    console.error("Error: Unable to get forecast data");
    return;
  }

  // Fix the function name typo
  for (let i = 0; i < 2; i++) {
    // Check if forecastday array elements are defined
    if (
      !finalresponseData.forecast.forecastday[i] ||
      !finalresponseData.forecast.forecastday[i + 1]
    ) {
      console.error(`Error: Unable to get forecast data for day ${i + 1}`);
      continue; // Skip to the next iteration if data is unavailable
    }

    let nextDayDate = new Date(
      finalresponseData.forecast.forecastday[i + 1].date
    );
    nextdayName[i].innerHTML = days[nextDayDate.getDay()];

    // Check if day condition icon is available
    if (finalresponseData.forecast.forecastday[i].day.condition) {
      nextdayIcon[i].setAttribute(
        "src",
        `https:${
          finalresponseData.forecast.forecastday[i].day.condition.icon || ""
        }`
      );
    } else {
      console.error(`Error: Unable to get condition icon for day ${i + 1}`);
    }

    maxDegree[i].innerHTML =
      finalresponseData.forecast.forecastday[i].day.maxtemp_c || "N/A";
    minDegree[i].innerHTML =
      finalresponseData.forecast.forecastday[i].day.mintemp_c || "N/A";

    // Check if day condition text is available
    nextdayDescription[i].innerHTML = finalresponseData.forecast.forecastday[i]
      .day.condition
      ? finalresponseData.forecast.forecastday[i].day.condition.text || "N/A"
      : "N/A";
  }
}

// Search
search.addEventListener("keyup", function () {
  currentCity = search.value.trim();
  if (currentCity.length > 0) {
    console.log(currentCity);
    getWeather();
  }
});
