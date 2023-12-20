let video = document.querySelector("video");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recordBtnCont = document.querySelector(".record-btn-container");
let captureBtnCont = document.querySelector(".capture-btn-container");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
let chunks = [];

let constraints = {
    video: true,
    audio: true
}



navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) =>{
        chunks = [];
    })
    recorder.addEventListener("dataavailable",(e) =>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e) =>{
        //conversion of media chunks data to video
        let blob = new Blob(chunks, {type: "video/mp4"});

        if(db){
            let videoID = shortid();
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id : `vid-${videoID}`,
                blobData : blob
            }
            videoStore.add(videoEntry);
        }

        //let videoURL = URL.createObjectURL(blob);
        //let a = document.createElement("a");
        //a.href = videoURL;
        //a.download = "stream.mp4";
        //a.click();
    })
})

recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;
    
    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})

captureBtnCont.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();

    if(db){
        let imageID = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id : `img-${imageID}`,
            URL : imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)

    //let imageURL = canvas.toDataURL();
    //let a = document.createElement("a");
    //a.href = imageURL;
    //a.download = "image.jpg";
    //a.click();
})

let timerID;
let timer = document.querySelector(".timer");
let counter = 0;//Represents total seconds
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){

        let totSeconds = counter;

        let hours = Number.parseInt(totSeconds / 3600);
        totSeconds = totSeconds % 3600;
        let minutes = Number.parseInt( totSeconds / 60);
        totSeconds = totSeconds % 60;
        let seconds = totSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        
        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}


function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })    
})

