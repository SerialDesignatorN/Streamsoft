const CanvasHandler = document.getElementById('canvas-renderer')
const NodeFS = require('fs')
const NodePath = require('path')
const DateTest = new Date()
const VideoPath = NodePath.join(process.env.USERPROFILE, 'Videos')
const FfmpegModule = require('ffmpeg.js/ffmpeg-mp4.js')
const ffmpeg = require('ffmpeg.js')
let isRecording = false
// `StreamsoftCapture-${DateTest.getFullYear()}-${DateTest.getMonth()}-${DateTest.getDay()}-At-${DateTest.getHours()}-${DateTest.getMinutes()}-${DateTest.getSeconds()}.mp4`

const CanvasStream = CanvasHandler.captureStream(60)
const RecorderMedia = new MediaRecorder(CanvasStream, { mimeType: 'video/webm;codecs=h264' })
var TemporaryFrames = []
console.log(`Recorder mimetype: ${RecorderMedia.mimeType}`)
RecorderMedia.ondataavailable = (e) => {
    if (e.data) TemporaryFrames.push(e.data)
}

RecorderMedia.onstop = () => {
    var FileBlob = new Blob(TemporaryFrames, { type: 'video/webm;codecs=h264' })

    var BlobReader = new FileReader()
    BlobReader.onload = (e) => {
        var HandlerMP4 = ffmpeg({
            MEMFS: [{name: 'streamsoft-recording-dump.webm', data: e.target.result}],
            arguments: ['-i', 'streamsoft-recording-dump.webm', '-vcodec', 'copy', '-qscale', '0', 'streamsoft-mp4-dump.mp4'],
            stdin: function() {}
        })
        console.log(HandlerMP4.MEMFS)
        try {
            var MP4Blob = new Blob([HandlerMP4.MEMFS[0].data], { type: 'video/mp4'})
        } catch (e) {
            console.error(`Failed to create blob. Error: ${e}`)
            CallToast(e, 'error')
        }
        NodeFS.writeFile(NodePath.join(VideoPath, `StreamsoftCapture-${DateTest.getFullYear()}-${DateTest.getMonth()}-${DateTest.getDay()}-At-${DateTest.getHours()}-${DateTest.getMinutes()}-${DateTest.getSeconds()}.mp4`), MP4Blob)
        console.log('Finished saving MP4')
    }
    BlobReader.readAsArrayBuffer(FileBlob)
}
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
