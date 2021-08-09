export class workout {
  constructor(type, distance, duration, coords) {
    this.type = type;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.date = new Date();
  }
}
