import { Workout } from './Workout.js';

export class Running extends Workout {
  constructor(coords, distance, duration, cadence, name) {
    super(coords, distance, duration, name);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
