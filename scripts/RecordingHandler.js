const { CanvasCapture } = require('canvas-capture')
const HandlerDate = new Date()
const NodeFS = require('fs')
const NodePath = require('path')

let isRecording = false
CanvasCapture.init(
    document.getElementById('canvas-renderer'),
    {
        verbose: true
    }
)
document.getElementById('ui-record-stream').onclick = () => {
    if (isRecording != false) {
        isRecording = false
        try {
            CanvasCapture.stopRecord()
            document.getElementById('ui-record-status').innerText = 'camera'
        } catch (e) {
            console.error(`Failed to stop recording. Err: ${e}`)
        }
    } else {
        CanvasCapture.beginVideoRecord({
            format:  CanvasCapture.MP4,
            name: `StreamsoftCapture-${HandlerDate.getFullYear()}-${HandlerDate.getMonth()}-${HandlerDate.getDay}-at-${HandlerDate.getHours}-${HandlerDate.getMinutes()}`,
            onExportProgress: (HandlerExportProgress) => {
                console.log(`EXPORT: export_status=${HandlerExportProgress}`)
            },
            onExport: async (HandlerBlob, HandlerFileName) => {
                const HandlerExportResponse = await fetch(HandlerBlob)
                const HandlerBuffer = await HandlerExportResponse.buffer()
                const VideoFolder = NodePath.join(process.env.USERPROFILE, 'Videos');
                const HandlerFilePath = NodePath.join(VideoFolder.HandlerFileName)
                NodeFS.writeFile(HandlerFilePath, HandlerBuffer, () => {
                    console.log(`Attempted to save ${HandlerFileName} on ${HandlerFilePath}`)
                })
            },
            onExportFinish: () => {
                console.log('Finished exporting capture')
            }
        })
        isRecording = true
        console.log('Set isRecording to true')
        console.log(`Status of recording in MP4: ${CanvasCapture.browserSupportsMP4()}`)
        try {
            CanvasCapture.recordFrame()
            document.getElementById('ui-record-status').innerText = 'square'
            console.log('Attempted to start recording')
        } 
        catch (e) {
            console.error(`Failed to record. Err: ${e}`)
        }
    }
}