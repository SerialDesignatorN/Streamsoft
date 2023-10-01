const CanvasRenderer = document.getElementById('canvas-renderer');

function RenderNewOverlay(data, redrawRate) {
    const CanvasCTX = CanvasRenderer.getContext('2d');
    data.forEach((element) => {
        if (element.type === "rectangle") {
          setInterval(() => {
            DrawRect({top: element.posy, left: element.posx, width: element.sizex, height: element.sizey, fill: element.color, round: 15});
          }, redrawRate * 6)
        } else if (element.type === "text") {
          CanvasCTX.font = `${element.fontWeight} ${element.fontSize}pt ${element.fontFamily}`;
          CanvasCTX.fillStyle = element.color;
          CanvasCTX.fillText(element.text, element.posx, element.posy); // Use element.text
          console.log('Text drawn')
        } else if (element.type === "image") {
          const img = new Image();
          img.src = element.content;
          img.onload = () => {
            CanvasCTX.drawImage(img, element.posx, element.posy, element.sizex, element.sizey);
          };
        }
    });
}
function DrawRect({top: y, left: x, width: w, height: h, fill, round: r}) {
    [x, y, w, h, r] = [x, y, w, h, r].map(v => v * this.rate);

    CanvasCTX.save();
    CanvasCTX.fillStyle = fill;
    if(r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      CanvasCTX.beginPath();
      CanvasCTX.moveTo(x + r, y);
      CanvasCTX.arcTo(x + w, y, x + w, y + h, r);
      CanvasCTX.arcTo(x + w, y + h, x, y + h, r);
      CanvasCTX.arcTo(x, y + h, x, y, r);
      CanvasCTX.arcTo(x, y, x + w, y, r);
      CanvasCTX.closePath();
      CanvasCTX.fill();
    } else {
      CanvasCTX.fillRect(x, y, w, h);
    }
    CanvasCTX.restore();
    console.log('Drew called')
    return Promise.resolve(this);
  }






