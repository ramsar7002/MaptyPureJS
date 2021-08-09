export class Workout {
  date = new Date();
  id = (new Date() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; //in km;
    this.duration = duration; //in min;
  }
}
