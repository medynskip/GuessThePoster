export class Gameboard {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.pointCanvas = document.createElement("canvas");
    this.ctxPointCanvas = this.pointCanvas.getContext("2d");

    this.pw =
      document.documentElement.clientWidth < 1200
        ? document.documentElement.clientWidth - 100
        : 1100;
    this.ph = Math.round(this.pw / 1.77);
    this.box = 0;
    this.drawing = false;
    this.image = new Image();
    this.scratch = new Image();
  }

  register(newGame) {
    this.scratch.src = "../images/scratch.jpg";
    this.scratch.onload = () => {
      this.canvas.width = this.pw;
      this.canvas.height = this.ph;
      this.pointCanvas.width = this.pw;
      this.pointCanvas.height = this.ph;
      this.box = Math.round(this.pw / 50);
      newGame();
    };
  }

  clearCanvases() {
    this.ctx.drawImage(this.scratch, 0, 0, this.pw, this.ph);
    this.ctxPointCanvas.clearRect(0, 0, this.pw, this.ph);
  }

  createFill() {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.pw;
    tempCanvas.height = this.ph;
    tempCtx.drawImage(this.image, 0, 0, this.pw, this.ph);
    this.ctx.fillStyle = this.ctx.createPattern(tempCanvas, "no-repeat");
    this.ctxPointCanvas.fillStyle = "red";
  }

  drawCanvas(x, y) {
    const contexts = [this.ctx, this.ctxPointCanvas];
    contexts.forEach((e) => {
      e.beginPath();
      e.arc(x + this.box / 2, y + this.box / 2, this.box, 0, 2 * Math.PI);
      e.fill();
    });
  }

  countPoints() {
    let revealed = 0;
    const colorData = this.ctxPointCanvas.getImageData(0, 0, this.pw, this.ph);
    for (let i = 0; i < colorData.data.length; i += 4) {
      colorData.data[i] > 0 ? (revealed += 1) : revealed;
    }
    //   scoreboard.updateCurrent(revealed / (ph * pw));
    return revealed / (this.ph * this.pw);
  }

  addMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle) {
    this.canvas.addEventListener("mousemove", mouseMoveHandle);
    this.canvas.addEventListener("mousedown", mouseDownHandle);
    this.canvas.addEventListener("mouseup", mouseUpHandle);
  }

  clearMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle) {
    this.canvas.removeEventListener("mousedown", mouseDownHandle);
    this.canvas.removeEventListener("mousemove", mouseMoveHandle);
    this.canvas.removeEventListener("mouseup", mouseUpHandle);
  }

  // mouseDownHandle(e) {
  //   this.draw = true;
  //   this.drawCanvas([this.ctx, this.ctxPointCanvas], e.offsetX, e.offsetY);
  //   // countPoints(ctxCalc);
  // };

  // mouseMoveHandle(e) {
  //   if (this.draw == true) {
  //     this.drawCanvas([this.ctx, this.ctxPointCanvas], e.offsetX, e.offsetY);
  //   }
  // };

  // mouseUpHandle(e) {
  //   this.draw = false;
  //   this.countPoints();
  // };
}
