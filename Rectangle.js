export default class Rectangle {
  constructor(point, width, height) {
    this.point = point;
    this.width = width;
    this.height = height;
  }
  setParams(point, width, height) {
    this.point = point;
    this.width = width;
    this.height = height;
  }
  draw(context, color, lineWidth) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.strokeRect(this.point.x, this.point.y, this.width, this.height);
  }
}
