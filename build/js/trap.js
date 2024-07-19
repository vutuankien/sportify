const albumsAPI = "http://localhost:3000/albums";
const trapAPI = "http://localhost:3000/traplist";
const video = document.querySelector('#chosen-video');
console.log(video);
function callAPI(callback, api) {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(callback);
}

function renderAlbum(albums) {
    var html = albums.map(album => {
        return `
        <a href = "${album.url}"> 
            <div class="items group mt-3 flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700 hover:transiton hover:duration-200 hover:ease-in-out cursor-pointer">
                        <img src="${album.image}"
                            alt="" class="w-10 h-10 rounded-full">
    
                        <div>
                            <p class="text-lg capitalize group-hover:text-white hover:transiton hover:duration-200 hover:ease-in-out">${album.title}</p>
                            <p class="text-xs capitalize text-gray-400 group-hover:text-white hover:transiton hover:duration-200 hover:ease-in-out">${album.artist}</p>
                        </div>
                    </div>
        </a>
        `
    })

    document.getElementById("albums").innerHTML = html.join("");
}

function renderVideo(videos) {
    var html = videos.map(function (video) {
        return `<div class="w-full flex gap-2 hover:bg-slate-700 p-2 mt-2 rounded-md cursor-pointer video-item video-item-${video.id}" onclick = "playVideo(${video.id})">
                        <img src="${video.image}" alt="" class="w-12 rounded-md">
                        <div>
                            <p class="text-sm cursor-pointer text-white text-ellipsis w-full whitespace-wrap overflow-hidden capitalize">${video.title}</p>
                        </div>
                    </div>`
    })
    document.getElementById("videos").innerHTML = html.join("");
}

function playVideo(videoId) {
    const videoChosen = document.querySelector('.video-item-' + videoId);
    const videos = document.querySelectorAll('.video-item')
    videos.forEach(video => {
        video.classList.remove('bg-slate-700')
    })
    console.log(videoId);
    fetch(`${trapAPI}/${videoId}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            video.src = data.url
            videoChosen.classList.toggle("bg-slate-700")
        })
}
function app() {
    callAPI(renderAlbum, albumsAPI)
    callAPI(renderVideo, trapAPI)
}

app()


console.log("fuck");