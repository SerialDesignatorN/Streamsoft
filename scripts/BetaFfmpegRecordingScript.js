const CanvasHandler = document.getElementById('canvas-renderer')
const fs = require('fs')
const path = require('path')
const ElectronApp = require('@electron/remote').app
const DateTest = new Date()
const VideoPath = path.join(process.env.USERPROFILE, 'Videos')
const ffmpeg = require('ffmpeg.js/ffmpeg-mp4.js')
const FFMpegTest = require('@ffmpeg/ffmpeg')
const { stdout } = require('process')
const { app } = require('electron')
let isRecording = false
/* '-i', 'streamsoft-recording-dump.webm',
'-c:v', 'copy', '-c:a', 'copy', '-strict', 'experimental',
'-f', 'mp4',
'streamsoft-mp4-dump.mp4'*/
const FileFormat = `StreamsoftCapture-${DateTest.getFullYear()}-${DateTest.getMonth()}-${DateTest.getDay()}-At-${DateTest.getHours()}-${DateTest.getMinutes()}-${DateTest.getSeconds()}.mp4`

const CanvasStream = CanvasHandler.captureStream(60)
const RecorderMedia = new MediaRecorder(CanvasStream, { mimeType: 'video/webm;codecs=h264' })
var TemporaryFrames = []
console.log(`Recorder mimetype: ${RecorderMedia.mimeType}`)
RecorderMedia.ondataavailable = (e) => {
    if (e.data) TemporaryFrames.push(e.data)
}

RecorderMedia.onstop = async () => {
    document.getElementById('ui-export-onprogress').style.display = 'flex';
    const FileBlob = new Blob(TemporaryFrames, { type: 'video/webm;codecs=h264' });
  
    const BlobReader = new FileReader();
    BlobReader.readAsArrayBuffer(FileBlob);
    await new Promise((resolve) => (BlobReader.onload = resolve));
  
    const HandlerData = new Uint8Array(BlobReader.result);
    const HandlerUInt8ArrayData = new Uint8Array(HandlerData);
  
    const outputFilePath = path.join(ElectronApp.getPath('videos'), 'Streamsoft Captures', FileFormat);
  
    // Convert webm Uint8Array to mp4 using ffmpeg-mp4.js with arguments
    const args = [
      '-i', 'streamsoft-webm-dump.webm',
      '-c:v', 'copy', '-c:a', 'copy', '-strict', 'experimental',
      '-f', 'mp4',
      'output.mp4' // Output file name within ffmpeg
    ];
  
    let result = {}; // Initialize the result object
  
    try {
      result.ffmpeg = ffmpeg({
        MEMFS: [{ name: 'streamsoft-webm-dump.webm', data: HandlerUInt8ArrayData }],
        arguments: args,
        print: function(data) {
          // You can choose to handle any print output from ffmpeg here if needed
          console.log(data);
        },
        onExit: function(code) {
          result.code = code; // Save the exit code
        }
      });
  
      await result.ffmpeg; // Wait for the ffmpeg process to finish
  
      if (result.code === 0) {
        // Read the converted mp4 data
        const mp4Blob = new Blob([result.ffmpeg.MEMFS[0].data], { type: 'video/mp4' });
  
        // Save the mp4 file to the user's disk
        if (!fs.existsSync(path.dirname(outputFilePath))) {
          fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
        }
  
        const writeStream = fs.createWriteStream(outputFilePath);
        const reader = mp4Blob.stream().getReader();
  
        await new Promise((resolve) => {
          reader.read().then(function process(result) {
            if (result.done) {
              writeStream.end();
              resolve();
              return;
            }
  
            writeStream.write(result.value);
            return reader.read().then(process);
          });
        });
  
        document.getElementById('ui-export-onprogress').style.display = 'none';
        CallToast(`Success. Your video is saved on ${outputFilePath}`, 'success');
      } else {
        console.error('Error converting webm to mp4: ffmpeg exited with code', result.code);
        document.getElementById('ui-export-onprogress').style.display = 'none';
        CallToast('Error converting webm to mp4. Please check the console for more details.', 'error');
      }
    } catch (error) {
      console.error('Error running ffmpeg:', error);
      document.getElementById('ui-export-onprogress').style.display = 'none';
      CallToast('Error running ffmpeg. Please check the console for more details.', 'error');
    }
  };
document.getElementById('ui-record-stream').onclick = () => {
    if (isRecording != false) {
        isRecording = false
        try {
            RecorderMedia.stop()
            document.getElementById('ui-record-status').innerText = 'camera'
        } catch (e) {
            console.error(`Failed to stop recording. Err: ${e}`)
        }
    } else {
        isRecording = true
        console.log('Set isRecording to true')
        try {
            RecorderMedia.start(100)
            document.getElementById('ui-record-status').innerText = 'square'
            console.log('Attempted to start recording')
        } 
        catch (e) {
            console.error(`Failed to record. Err: ${e}`)
        }
    }
}
