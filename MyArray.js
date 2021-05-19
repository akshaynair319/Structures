export default class MyArray {
  constructor(startPoint, nums, cellSize, color, lineWidth, name) {
    this.startPoint = startPoint;
    this.nums = nums;
    this.cellSize = cellSize;
    this.color = color;
    this.lineWidth = lineWidth;
    this.name = name;
    this.sorted = false;
    this.positions = [[this.startPoint.x, this.startPoint.y]];
  }
  addPosition(newPoint) {
    this.positions.push([newPoint.x, newPoint.y]);
  }
  drawArray(context) {
    let arr = [];
    if (this.sorted) {
      arr = this.nums.sort((a, b) => {
        if (parseInt(a) < parseInt(b)) return -1;
        if (parseInt(a) > parseInt(b)) return 1;
        return 0;
      });
    } else {
      arr = this.nums;
    }
    let offsetX = 0;
    //adding name of array
    context.fillStyle = "black";
    context.font = `${this.cellSize / 2}px Arial`;
    context.fillText(this.name, this.startPoint.x, this.startPoint.y - 10);

    for (let i = 0; i < arr.length; i++) {
      context.lineWidth = this.lineWidth;
      context.strokeStyle = this.color;
      context.fillStyle = this.color;
      context.font = `${this.cellSize / 2}px Arial`;

      const currentCellSize =
        this.cellSize / 2 + context.measureText(arr[i]).width;

      const indexMid = (currentCellSize - context.measureText(i).width) / 2;
      //adding 0 based indexing
      context.fillText(
        i,
        this.startPoint.x + indexMid + offsetX,
        this.startPoint.y + 1.5 * this.cellSize
      );

      //adding value of nums[i]
      context.fillText(
        arr[i],
        this.startPoint.x + 0.25 * this.cellSize + offsetX,
        this.startPoint.y + 0.75 * this.cellSize
      );

      context.strokeRect(
        this.startPoint.x + offsetX,
        this.startPoint.y,
        currentCellSize,
        this.cellSize
      );
      offsetX += currentCellSize;
    }
    //adding a black circle on the left corner of array
    context.beginPath();
    context.fillStyle = "black";
    context.arc(this.startPoint.x, this.startPoint.y, 10, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
  undoLastAction() {
    if (this.positions.length === 1) {
      //delete this array
      return false;
    }
    this.positions.pop();
    this.startPoint.x = this.positions[this.positions.length - 1][0];
    this.startPoint.y = this.positions[this.positions.length - 1][1];

    return true;
  }
}
