let redrawRate = 60;
let idealFrameRate = 45;
let maxFrameRate = 120;
let fileFormat = 'StreamsoftCapture-[yyyy]-[mm]-[dd]-At-[hh]-[mm]-[ss]';

document.getElementById('ui-save-and-reconfigure').onclick = () => {
    document.getElementById('canvas-renderer').width = document.getElementById('width').value
    document.getElementById('canvas-renderer').height = document.getElementById('height').value
    redrawRate = parseInt(document.getElementById('redraw-rate').value)
    idealFrameRate = parseInt(document.getElementById('ideal-frame').value)
    maxFrameRate = parseInt(document.getElementById('max-frame').value)
    fileFormat = document.getElementById('file-format').value
    document.getElementById('ui-settings-backdrop').style.display = 'none'
    CallToast('Config saved for this session', 'success')
}
const GetFileFormat = () => {
    const DateFormat = new Date()
    const FilePlaceholders = {
        "[yyyy]": DateFormat.getFullYear(),
        "[mm]": String(DateFormat.getMonth() + 1).padStart(2, "0"),
        "[dd]": String(DateFormat.getDate()).padStart(2, "0"),
        "[hh]": String(DateFormat.getHours()).padStart(2, "0"),
        "[mm]": String(DateFormat.getMinutes()).padStart(2, "0"),
        "[ss]": String(DateFormat.getSeconds()).padStart(2, "0")
    }
    const FormatRegex = /\[yyyy\]|\[mm\]|\[dd\]|\[hh\]|\[mm\]|\[ss\]/g;

    return fileFormat.replace(FormatRegex, FormatMatch => FilePlaceholders[FormatMatch] || FormatMatch) + '.mp4'
}
const GetRedrawRate = () => { return redrawRate;}
const GetIdealFrameRate = () => { return idealFrameRate; }
const GetMaxFramerate = () => { return maxFrameRate; }