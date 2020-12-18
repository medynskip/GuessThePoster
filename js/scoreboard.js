export class Scoreboard {
  constructor() {
    this.current = 1000;
    this.total = 0;
    this.currentDisplay = document.getElementById("score-current");
    this.totalDisplay = document.getElementById("score-total");
    // this.currentDisplay = "";
    // this.totalDisplay = "";
  }

  //   register() {
  //     this.currentDisplay = document.getElementById("score-current");
  //     this.totalDisplay = document.getElementById("score-total");
  //   }

  updateTotal() {
    this.total += this.current;
    this.totalDisplay.innerText = this.total;
  }

  updateCurrent(revealed) {
    this.current = 1000 - Math.round(1000 * revealed);
    this.currentDisplay.innerText = this.current;
  }

  resetCurrent() {
    this.current = 1000;
    this.currentDisplay.innerText = this.current;
  }
  resetTotal() {
    this.current = 1000;
    this.currentDisplay.innerText = this.current;
    this.total = 0;
    this.totalDisplay.innerText = this.total;
  }

  //   resetCurrent() {

  //   }

  //   register();
}
