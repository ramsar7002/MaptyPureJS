export class Cycling extends workout {
  constructor(type, distance, duration, coords, elevationGain, speed) {
    super(type, distance, duration, coords);
    this.elevationGain = elevationGain;
    this.speed = speed;
  }
}
