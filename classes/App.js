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
let type;

class App {
  #map;
  #mapE;
  #workouts = [];
  constructor(workouts, map) {
    this._getPosition();
    this.workouts = workouts;
    this.#map = '';
    this.#mapE = '';

    //Get data from local storage
    this._getLocalStorage();
    form.addEventListener('submit', e => {
      this._newWorkout(e);
    });

    inputType.addEventListener('change', e => {
      this._toggleElavationField(e);
    });

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapEvent) {
    this.#mapE = mapEvent;
    form.style.display = 'grid';
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    form.style.display = 'none';
    form.classList.add('hidden');
  }

  _toggleElavationField(e) {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _renderWorkoutMarker = workout => {
    const description = `${workout.name === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${
      workout.name[0].toUpperCase() + workout.name.slice(1)
    } on ${months[workout.date.getMonth()]} ${workout.date.getDay()}`;
    L.marker(workout.coords)
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
      .setPopupContent(description)
      .openPopup();
    //delete all fields text
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';

    this._hideForm();
  };

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    //Add a new marker to the map

    e.preventDefault();
    type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);

    const { lat, lng } = this.#mapE.latlng;
    const coords = [lat, lng];
    let workout;

    if (typeof type && validInputs(distance, duration)) {
      if (type === 'running') {
        const cedence = Number(inputCadence.value);
        if (cedence) {
          workout = new Running(coords, distance, duration, cedence, type);

          this._renderWorkoutMarker(workout);
          this._renderWorkout(workout);
        } else return alert('Please enter cedence');
      } else {
        const elevation = Number(inputElevation.value);
        console.log(elevation);
        if (elevation) {
          workout = new Cycling(coords, distance, duration, elevation, type);
          this._renderWorkoutMarker(workout);
          this._renderWorkout(workout);
        } else return alert('Please enter elevation');
      }
      if (workout) this.#workouts.push(workout);

      this._setLocalStorage();
    } else return alert('Please enter all fields');
  }

  _renderWorkout(workout) {
    if (typeof workout.date === 'string') {
      workout.date = new Date(workout.date);
    }
    const description = `${
      workout.name[0].toUpperCase() + workout.name.slice(1)
    } on ${months[workout.date.getMonth()]} ${workout.date.getDay()}`;
    const html = `<li class="workout workout--${workout.name}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.name === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${
      workout.name === 'running'
        ? workout.pace.toFixed(2)
        : workout.speed.toFixed(2)
    }</span>
    <span class="workout__unit">${
      workout.name === 'running' ? 'MIN/KM' : 'KM/H'
    }</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">${
      workout.name === 'running' ? '🦶🏼' : '⛰'
    }</span>
    <span class="workout__value">223</span>
    <span class="workout__unit">m</span>
    </div>`;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === Number(workoutEl.dataset.id)
    );
    this.#map.setView(workout.coords, 17, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
}

export default App;
