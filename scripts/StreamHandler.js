const { desktopCapturer } = require('@electron/remote');
const UIDefinedCharacterCut = 20;
const UIStreamsContainer = document.getElementById('ui-media-selector');
const modalBackdrop = document.getElementById('ui-selector-backdrop');
const modalCancelBtn = document.getElementById('ui-cancel-selection');

let selectedSource = null; // Initialize selectedSource as null

let isCapturing = false; // Track if capture is ongoing

const StartCapture = async () => {
  if (!selectedSource) {
    console.error('Screen source not selected');
    return;
  }

  modalBackdrop.style.display = 'none';
  isCapturing = true;

  const VideoRenderer = document.createElement('video');
  VideoRenderer.srcObject = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: selectedSource.id,
        minWidth: 960,
        maxWidth: 2560,
        minHeight: 480,
        maxHeight: 1440
      }
    }
  });

  VideoRenderer.play();

  const CanvasRenderer = document.getElementById('canvas-renderer');
  const CanvasCTX = CanvasRenderer.getContext('2d');

  setInterval(() => {
    CanvasCTX.drawImage(VideoRenderer, 0, 0, CanvasRenderer.width, CanvasRenderer.height);
  }, 1000 / 60);
};

modalCancelBtn.onclick = () => {
  modalBackdrop.style.display = 'none';
  selectedSource = null; // Reset selectedSource when cancelling selection
};

UIStreamsContainer.addEventListener('click', async (event) => {
  if (isCapturing) {
    return; // Return early if capture is ongoing
  }

  const sourceElement = event.target.closest('.ui-source-creator');
  if (sourceElement) {
    selectedSource = await desktopCapturer.getSourceById(sourceElement.id); // Set selectedSource based on the ID
    modalBackdrop.style.display = 'none';
    StartCapture(); // Start capturing with the selected source
  }
});

const updateStreamSelector = async () => {
  UIStreamsContainer.innerHTML = '';

  const AppSources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

  AppSources.forEach(UISource => {
    const UISourceCreator = document.createElement('div');
    UISourceCreator.className = 'ui-source-creator';
    UISourceCreator.id = UISource.id; // Set the ID of the source element
    UISourceCreator.innerHTML = `
    <img src="${UISource.thumbnail.toDataURL()}" class="ui-preview-image">
    <p>${UISource.name.slice(0, UIDefinedCharacterCut) + (UISource.name.length > UIDefinedCharacterCut ? '...' : '')}</p>
    `;
    UIStreamsContainer.appendChild(UISourceCreator);

    UISourceCreator.addEventListener('dblclick', async () => {
      if (isCapturing) {
        return; // Return early if capture is ongoing
      }

      selectedSource = await desktopCapturer.getSourceById(UISourceCreator.id); // Set selectedSource based on the ID
      modalBackdrop.style.display = 'none';
      StartCapture(); // Start capturing with the selected source
    });
  });
};

document.getElementById('ui-start-capture').addEventListener('click', () => {
  if (!isCapturing) {
    modalBackdrop.style.display = 'flex';
    updateStreamSelector(); // Update the stream selector when the capture button is clicked
  }
});
