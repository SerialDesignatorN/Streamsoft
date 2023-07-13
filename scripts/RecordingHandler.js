const { CanvasCapture } = require('canvas-capture')
const HandlerDate = new Date()

let isRecording = false

CanvasCapture.init(
    document.getElementById('canvas-renderer'),
    {
        verbose: true
    }
)
CanvasCapture.beginVideoRecord({
    format: CanvasCapture.WEBM,
    name: `StreamsoftCapture-${HandlerDate.getFullYear()}-${HandlerDate.getMonth()}-${HandlerDate.getDay}-at-${HandlerDate.getHours}-${HandlerDate.getMinutes()}`
})
document.getElementById('ui-record-stream').onclick = () => {
    if (!isRecording) {
        isRecording = false
        try {
            CanvasCapture.stopRecord()
        } catch (e) {
            console.error(`Failed to stop recording. Err: ${e}`)
        }
    } else {
        isRecording = true
        console.log('Set isRecording to true')
        console.log(`Status of recording in MP4: ${CanvasCapture.browserSupportsMP4()}`)
        try {
            CanvasCapture.recordFrame()
            console.log('Attempted to start recording')
        } 
        catch (e) {
            console.error(`Failed to record. Err: ${e}`)
        }
    }
}