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

let map;
let mapE;
const loc = navigator.geolocation?.getCurrentPosition(
  function (posistion) {
    const { latitude, longitude } = posistion.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    map = L.map('map').setView(coords, 17);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    L.marker(coords).addTo(map).bindPopup('Current location').openPopup();

    map.on('click', function (mapEvent) {
      mapE = mapEvent;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  },
  function () {
    alert(`Couldn't get your location`);
  }
);

form.addEventListener('submit', e => {
  e.preventDefault();
  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);
  const cedence = Number(inputCadence.value);

  const { lat, lng } = mapE.latlng;
  const coords = [lat, lng];

  if (type && distance && duration && cedence) {
    L.marker(coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
    //delete all fields text
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';

    form.classList.add('hidden');
  } else alert('Please enter all fields');
});
