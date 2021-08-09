import { Workout } from './Workout.js';

export class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain, name) {
    super(coords, distance, duration, name);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);

    return this.speed;
  }
}
