export class Workout {
  date = new Date();
  id = Date.now();
  constructor(coords, distance, duration, name) {
    this.coords = coords;
    this.distance = distance; //in km;
    this.duration = duration; //in min;
    this.name = name;
  }
}
