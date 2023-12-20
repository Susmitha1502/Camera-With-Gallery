setTimeout(() => {
    if(db){
        //video and image retreival
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-container");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-container");
                mediaElem.setAttribute("id",videoObj.id);
                
                let url = URL.createObjectURL(videoObj.blobData);
                console.log(url);
                mediaElem.innerHTML = `
                    <div class="media">
                        <video autoplay loop src="${url}"></video>                   
                    </div>
                    <div class="delete action-btn">
                        <span class="material-icons">delete</span>
                    </div>
                    <div class="download action-btn">
                        <span class="material-icons">file_download</span>
                    </div>
                    `;

                    galleryCont.appendChild(mediaElem);

                    let deleteBtn = mediaElem.querySelector(".delete");
                    deleteBtn.addEventListener("click", deleteListener);
                    let downloadBtn = mediaElem.querySelector(".download");
                    downloadBtn.addEventListener("click", downloadListener);

            })
        }

        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-container");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-container");
                mediaElem.setAttribute("id",imageObj.id);
                let url = imageObj.URL;
                console.log(url);
                mediaElem.innerHTML = `
                    <div class="media">
                        <img src="${url}" alt="image is missing"/>
                    </div>
                    <div class="delete action-btn">
                        <span class="material-icons">delete</span>
                    </div>
                    <div class="download action-btn">
                        <span class="material-icons">file_download</span>
                    </div>
                    `;

                    galleryCont.appendChild(mediaElem);

                    let deleteBtn = mediaElem.querySelector(".delete");
                    deleteBtn.addEventListener("click", deleteListener);
                    let downloadBtn = mediaElem.querySelector(".download");
                    downloadBtn.addEventListener("click", downloadListener);

            })
        }

    }
    
}, 100)


//ui remove and then db remove
function deleteListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if(type === "img"){
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }
    e.target.parentElement.remove();
}


function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if(type === "img"){
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let a = document.createElement("a");
            a.href = imageResult.URL;
            a.download = "image.jpg";
            a.click();
        }
    }
}
