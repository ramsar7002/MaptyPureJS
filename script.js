'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//Using the geolocation api to get the user location

const loc = navigator.geolocation?.getCurrentPosition(
  function (posistion) {
    const { latitude, longitude } = posistion.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
  },
  function () {
    alert(`Couldn't get your location`);
  }
);
