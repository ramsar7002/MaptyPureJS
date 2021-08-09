export class Running extends workout {
  constructor(type, distance, duration, coords, cedence, pace) {
    super(type, distance, duration, coords);
    this.cedence = cedence;
    this.pace = pace;
  }
}
