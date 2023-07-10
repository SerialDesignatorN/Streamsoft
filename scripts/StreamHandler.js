const { desktopCapturer } = require('@electron/remote');

const UIDefinedCharacterCut = 20;
const UIStreamsContainer = document.getElementById('ui-media-selector');
const modalBackdrop = document.getElementById('ui-selector-backdrop');
const modalCancelBtn = document.getElementById('ui-cancel-selection');

let selectedSource = null; // Initialize selectedSource as null
let isCapturing = false; // Track if capture is ongoing

const StartCapture = async (id) => {
  if (!selectedSource) {
    console.error('Screen source not selected');
    return;
  }

  modalBackdrop.style.display = 'none';
  isCapturing = true;

  try {
    const HandlerVideoStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
            chromeMediaSourceId: id,
            minWidth: 960,
            maxWidth: 2560,
            minHeight: 480,
            maxHeight: 1440
        }
      }
    });

    const VideoRenderer = document.createElement('video');
    VideoRenderer.srcObject = HandlerVideoStream;
    VideoRenderer.muted = true
    VideoRenderer.play();

    const CanvasRenderer = document.getElementById('canvas-renderer');
    const CanvasCTX = CanvasRenderer.getContext('2d');

    setInterval(() => {
      CanvasCTX.drawImage(VideoRenderer, 0, 0, CanvasRenderer.width, CanvasRenderer.height);
    }, 1000 / 60);
  } catch (error) {
    console.error('An error occurred while capturing the video stream:', error);
  }
};

modalCancelBtn.onclick = () => {
  modalBackdrop.style.display = 'none';
  selectedSource = null; // Reset selectedSource when cancelling selection
};

const updateStreamSelector = async () => {
  UIStreamsContainer.innerHTML = '';

  const AppSources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

  AppSources.forEach(UISource => {
    console.log(`UISource: name:${UISource.name},id:${UISource.id},displayId:${UISource.display_id}`)
    const UISourceCreator = document.createElement('div');
    UISourceCreator.className = 'ui-source-creator';
    UISourceCreator.id = UISource.id; // Set the ID of the source element
    UISourceCreator.innerHTML = `
    <img src="${UISource.thumbnail.toDataURL()}" class="ui-preview-image">
    <p>${UISource.name.slice(0, UIDefinedCharacterCut) + (UISource.name.length > UIDefinedCharacterCut ? '...' : '')}</p>
    `;
    UIStreamsContainer.appendChild(UISourceCreator);
    UISourceCreator.addEventListener('dblclick', async () => { 
      console.log(UISourceCreator.id)
      selectedSource = UISourceCreator.id
      modalBackdrop.style.display = 'none';
      StartCapture(selectedSource); // Start capturing with the selected source
    });
  });
};

document.getElementById('ui-start-capture').addEventListener('click', () => {
  modalBackdrop.style.display = 'flex';
  updateStreamSelector(); // Update the stream selector when the capture button is clicked
});
document.getElementById('ui-reload-selection').addEventListener('click', updateStreamSelector)
