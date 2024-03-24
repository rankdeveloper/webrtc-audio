
var mediaStream;
var audioTracks;
let count = 0;
let interval;

let startBtn = document.getElementById('start')
let btnMuteUnmute = document.getElementById('btnMuteUnmute')
let btnStartRecording = document.getElementById('startRecording')
let btnStopRecording = document.getElementById('stopRecording')
let btnPause = document.getElementById('pause')
let btnResume = document.getElementById('resume')
let downloadbtn = document.getElementById('download')

async function startCall() {
    downloadbtn.style.display = 'none'
    startBtn.style.display = 'none'
    btnMuteUnmute.style.display = "block"
    btnStartRecording.style.display = "block"
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    }

    catch (e) {
        alert(e)
        console.log("Error occured : ", e)
    }

    document.getElementById('audioCtr').srcObject = mediaStream
    console.log("mediaStream : ", mediaStream)
    audioTracks = mediaStream.getAudioTracks()[0]
    console.log("audioTracks", mediaStream.getAudioTracks()[0])
    // audioTracks.
    audioTracks.onmute = function (e) {
        console.log(e);
    }
    audioTracks.onunmute = function (e) {
        console.log(e);
    }

    mediaStream.getAudioTracks().forEach(track => {
        console.log("All tracks : ", track);
    })



}

function muteUnmute() {
    console.log("audio tracks", audioTracks)

    alert('mute unmute btn clicked')
    let btnMuteUnmute = document.getElementById('btnMuteUnmute')


    if (audioTracks.enabled === false) {
        audioTracks.enabled = true
        btnMuteUnmute.innerText = "Mute"
    }

    else {
        audioTracks.enabled = false
        btnMuteUnmute.innerText = "Unmute"
    }

}

var mediaRecorder;
var chunks = []
function startRecording() {
    btnStartRecording.style.display = "none"
    btnStopRecording.style.display = "block"
    btnMuteUnmute.style.display = "block"
    btnPause.style.display = "block"
    btnResume.style.display = "block"
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' })
    mediaRecorder.ondataavailable = (e) => {
        console.log(e.data.size)
        console.log(e.data)

        if (e.data.size > 0) {
            chunks.push(e.data)
        }
    }
    setListeners()
    mediaRecorder.start(1000)

    interval = setInterval(timer, 1000)

}

function timer() {
    count++;
    document.getElementById('count').innerText = count;

}
const stopRecording = async () => {
    startBtn.style.display = 'block'
    btnMuteUnmute.style.display = "none"
    btnPause.style.display = "none"
    btnResume.style.display = 'none'
    btnStopRecording.style.display = 'none'

    if (!mediaRecorder) return;
    clearInterval(interval)
    mediaRecorder.stop();
};

const setListeners = () => {
    // mediaRecorder.ondataavailable = handleOnDataAvailable;
    mediaRecorder.onstop = handleOnStop;
};

const handleOnStop = () => {
    saveFile();

    // destroyListeners();
    // mediaRecorder = undefined;
};

const destroyListeners = () => {
    // mediaRecorder.ondataavailable = undefined;
    // mediaRecorder.onstop = undefined;
};

const saveFile = () => {
    const blob = new Blob(chunks);

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.style = 'display: none';
    link.href = blobUrl;
    link.download = 'recorded_file.webm';

    document.body.appendChild(link);
    link.click()


    // downloadbtn.style.display='block'
    // // downloadbtn.attr({ href: blobUrl, download: 'test.weba' });
    // downloadbtn.href=blobUrl
    // downloadbtn.download='recordedFile.webm'
    // downloadbtn.style.display='block'
    // link.click();
    // downloadbtn.click()
    // document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
    chunks = [];

    audioTracks.stop()
};



function pause() {
    document.getElementById('pause').addEventListener('click', () => {
        mediaRecorder.pause();
        console.log("pause : ", mediaRecorder.pause())

    })
}
function resume() {
    document.getElementById('resume').addEventListener('click', () => {
        mediaRecorder.resume();
        console.log("resume : ", mediaRecorder.resume())

    })
}
