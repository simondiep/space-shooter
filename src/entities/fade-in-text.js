import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js";

export class FadeInText {
  constructor(text) {
    this.text = text;
    this.tickCount = 0;
    this.totalTickCount = 100;
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 3;
    this.textColor = "#dbfaff";
    this.fontSize = 36;
    this.doneRendering = false;
  }

  render(context) {
    if (this.tickCount > this.totalTickCount) {
      this.doneRendering = true;
      return;
    }
    this.tickCount++;
    context.save();
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.fillStyle = this.textColor;
    context.font = `bold ${this.fontSize}px Arial`;

    const textWidth = context.measureText(this.text).width;
    const textHeight = 24;
    const x = this.x - textWidth / 2;
    const y = this.y + textHeight / 2;

    context.strokeText(this.text, x, y);
    context.fillText(this.text, x, y);
    context.restore();
  }

  isDoneRendering() {
    return this.doneRendering;
  }
}
