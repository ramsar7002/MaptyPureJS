import { Workout } from './Workout.js';
import { Cycling } from './Cycling.js';
import { Running } from './Running.js';

// prettier-ignore

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapE;
  #workouts = [];
  constructor(workouts, map) {
    this._getPosition();
    this.workouts = workouts;
    this.#map = '';
    this.#mapE = '';

    form.addEventListener('submit', e => {
      this._newWorkout(e);
    });

    inputType.addEventListener('change', e => {
      this._toggleElavationField(e);
    });
  }
  _getPosition() {
    const loc = navigator.geolocation?.getCurrentPosition(
      position => this._loadMap(position),
      function () {
        alert(`Couldn't get your location`);
      }
    );
  }

  _loadMap(position) {
    console.log(position);
    const { latitude, longitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 17);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.#map);

    L.marker(coords).addTo(this.#map).bindPopup('Current location').openPopup();

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapEvent) {
    this.#mapE = mapEvent;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElavationField(e) {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    //Add a new marker to the map
    const showPinOnMap = () => {
      L.marker(coords)
        .addTo(this.#map)
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
      inputElevation.value = '';

      form.classList.add('hidden');
    };

    e.preventDefault();
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);

    const { lat, lng } = this.#mapE.latlng;
    const coords = [lat, lng];
    let workout;

    if (typeof type && validInputs(distance, duration)) {
      if (type === 'running') {
        const cedence = Number(inputCadence.value);
        if (cedence) {
          workout = new Running(coords, distance, duration, cedence);

          showPinOnMap();
        } else return alert('Please enter cedence');
      } else {
        const elevation = Number(inputElevation.value);
        console.log(elevation);
        if (elevation) {
          workout = new Cycling(coords, distance, duration, elevation);
          showPinOnMap();
        } else return alert('Please enter elevation');
      }
      if (workout) this.#workouts.push(workout);
      console.log(this.#workouts);
    } else return alert('Please enter all fields');
  }
}

export default App;
