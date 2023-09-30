const CanvasRenderer = document.getElementById('canvas-renderer');

function RenderNewOverlay(data) {
    const CanvasCTX = CanvasRenderer.getContext('2d');
    CanvasCTX.clearRect(0, 0, CanvasRenderer.width, CanvasRenderer.height)
    data.forEach((element) => {
        if (element.type === "rectangle") {
          CanvasCTX.fillStyle = element.color;
          CanvasCTX.fillRect(element.posx, element.posy, element.sizex, element.sizey);
          console.log('Rectangle drawn')
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






