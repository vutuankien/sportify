const albumAPI = "http://localhost:3000/albums";
const songsAPI = "http://localhost:3000/songs";
const topSongsAPI = "http://localhost:3000/top-songs";
const artistAPI =  "http://localhost:3000/artists";



const audio = document.querySelector('#audio');
const currentSongName = document.getElementById('currentSongName')
const currentArtistName = document.getElementById('currentArtistName')
const currentArtistImage = document.getElementById('currentArtistImage')
const songPlay = document.querySelector('.song_playing');
const songPlayIcon = songPlay.querySelector('i');
const detailsImage = document.getElementById('detailsImage')
const detailsSong = document.getElementById('detailsSong')
const detailsArtist = document.getElementById('detailsArtist')
const detailsDes = document.getElementById('detailsDes')
const lastSec = document.querySelector('#last_sec');
const firstSec = document.querySelector('#first_sec');
const progress   = document.querySelector('#progress');
const volumn = document.querySelector('#volumn');
const nextBtn = document.querySelector('#nextSong');
const preBtn = document.querySelector('#preSong');
const reloadBtn = document.querySelector('#reload');
const randomBtn = document.querySelector('#randomSong');
var currentIndex = 0;
var isPlaying = false;



function app() {
    callApi(renderAlbum, albumAPI);
    callApi(renderSong, songsAPI);
    callApi(renderTopSong, topSongsAPI);
    audio.addEventListener('timeupdate',updateTime);
    
}
app()

function callApi(callback, api) {
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(callback);

}

function renderAlbum(albums) {
    var html = albums.map(album => {
        return `
        <div class="items group mt-3 flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700 hover:transiton hover:duration-200 hover:ease-in-out cursor-pointer">
                        <img src="${album.image}"
                            alt="" class="w-10 h-10 rounded-full">
    
                        <div>
                            <p class="text-lg capitalize group-hover:text-white hover:transiton hover:duration-200 hover:ease-in-out">${album.title}</p>
                            <p class="text-xs capitalize text-gray-400 group-hover:text-white hover:transiton hover:duration-200 hover:ease-in-out">${album.artist}</p>
                        </div>
                    </div>
        `
    })

    document.getElementById("albums").innerHTML = html.join("");
}


function renderSong(songs) {
    var html = songs.map(song => {
        return `<div class="flex justify-between p-2 items-center hover:bg-slate-900 rounded-2xl hover:transition hover:duration-300 hover:ease-in-out cursor-pointer">
                        <div class="flex gap-2 items-center">
                            <img src="${song.image}" alt="" class="w-10 h-10 rounded-xl">
                            <div>
                                <p class="text-lg text-white font-semibold">${song.title}</p>
                                <p class="text-sm text-gray-400">${song.artist}</p>
                            </div>
                        </div>
                        <div class='play-song-${song.id}'>
                            <button class="p-2 rounded-full w-10 h-10 bg-green-500 play-song" onclick = "playSong('${songsAPI}',${song.id})"><i class="fa-solid fa-play"></i></button>
                        </div>
                    </div>`
    })
    document.getElementById("songs").innerHTML = html.join("");
}
function renderTopSong(songs) {
    var html = songs.map(song => {
        return `<div class="w-1/4 rounded-lg hover:bg-gray-900 p-2" onclick = "playSong('${topSongsAPI}',${song.id})">
                        <img src="${song.image}" alt="" class="w-full rounded-md  cursor-pointer" style="height: 150px;">
                        <p class="text-md text-white mt-1 capitalize text-ellipsis w-full whitespace-nowrap overflow-hidden cursor-pointer">${song.title}</p>
                        <p class="text-sm cursor-pointer text-gray-400 text-ellipsis w-full whitespace-nowrap overflow-hidden">${song.artist}</p>
                    </div>`
    })
    document.getElementById("top-songs").innerHTML = html.join("");
}


let currentPlayingId = null;

function playSong(api, id) {
    const playBtn = document.querySelector('.play-song-' + id); // Chọn nút được nhấn
    const icon = playBtn.querySelector('i');
    currentIndex  = id;
    const allPlayButtons = document.querySelectorAll('.play-song i');
    allPlayButtons.forEach(btn => {
        btn.classList.remove('fa-pause');
        btn.classList.add('fa-play');
    });

    if (currentPlayingId !== id) {
        fetch(`${api}/${id}`)
            .then(response => response.json())
            .then(song => {
                console.log(api, song.id);
                currentArtistImage.src = song.image;
                currentArtistName.innerText = song.artist;
                currentSongName.innerText = song.title;
                audio.src = song.path;

                // Thiết lập sự kiện lắng nghe khi metadata audio được tải
                audio.addEventListener('loadedmetadata', () => {
                    const duration = formatDuration(audio.duration);
                    lastSec.innerText = duration
                    console.log('Audio Duration:', duration);
                });

                audio.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                songPlayIcon.classList.remove('fa-play');
                songPlayIcon.classList.add('fa-pause');
                isPlaying = true;
                currentPlayingId = id;
                fetchArtistDetails(song.artistId).then(artistDetails => {
                    detailsImage.src = artistDetails[0].image;
                    detailsSong.innerText = artistDetails[0].title;
                    detailsArtist.innerText = artistDetails[0].name;
                    detailsDes.innerText = artistDetails[0].description;
                });
            });
    } else {
        if (isPlaying) {
            audio.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            songPlayIcon.classList.remove('fa-pause');
            songPlayIcon.classList.add('fa-play');
            isPlaying = false;
        } else {
            audio.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            songPlayIcon.classList.remove('fa-play');
            songPlayIcon.classList.add('fa-pause');
            isPlaying = true;
        }
    }
}

function changeState() {
    if (!audio.paused) {
        
        audio.pause();
        songPlayIcon.classList.remove('fa-pause');
        songPlayIcon.classList.add('fa-play');
        console.log(songPlayIcon);
    } else {

        audio.play();
        console.log(songPlayIcon);
        songPlayIcon.classList.remove('fa-play');
        songPlayIcon.classList.add('fa-pause');
    }
}

songPlay.addEventListener("click",changeState)
function changeVolumn(){
    audio.volume  = volumn.value/100;
    console.log(volumn.value/100);
}

async function fetchArtistDetails(artistId){
    const response = await fetch(`${artistAPI}?artistId=${artistId}`);
    const artists = await response.json();
    console.log(artists);
    return artists;
}



function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
function updateTime() {
    if (audio.duration) {
        const timePercent = Math.floor((audio.currentTime / audio.duration) * 100);
        document.querySelector("#progress").value = timePercent;
        const currentTime = audio.currentTime;
        const formattedTime = formatDuration(currentTime);
        firstSec.innerText = formattedTime;
    }
}

function skiptime(e){
    const skiptime =  audio.duration / 100 * e.target.value;
    console.log(skiptime);
    audio.currentTime = skiptime;
}

progress.oninput = function(e){
    const skiptime =  audio.duration / 100 * e.target.value;
    console.log(e.target.value);
    audio.currentTime = skiptime;

    if(e.target.value === 100){
        audio.play()
    }
    
}

audio.addEventListener('ended', () => {
    audio.currentTime = 0; 
    audio.play(); 
    progress.value = 0
});

volumn.addEventListener('input',(e)=>{
    if(e.target.value > 80){
        alert("Bạn đang sử dụng âm thanh có hại cho tai")
    }
})


nextBtn.addEventListener('click', () => {
    console.log('Next button clicked');
    fetch(songsAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function(songs) {
            const currentSongIndex = songs.findIndex(song => song.id === currentPlayingId);
            var nextSongIndex = currentSongIndex + 1; 
            if(nextSongIndex === songs.length){
                nextSongIndex = 0;
            }
            console.log("nextSongIndex",nextSongIndex);
            console.log("song length",songs.length);
            const nextSongId = songs[nextSongIndex].id;
            playSong(songsAPI, nextSongId); // Phát bài hát tiếp theo
        });
});

preBtn.addEventListener('click',()=>{
    console.log("click pre song");
    fetch(songsAPI)
        .then(response => {return response.json();})
        .then(songs => {
            const currentSongIndex = songs.findIndex(song => song.id === currentPlayingId)
            var preSongIndex  = currentSongIndex - 1;
            if(preSongIndex < 0){
                preSongIndex = songs.length - 1;
            }
            const preSongId = songs[preSongIndex].id;
            playSong(songsAPI, preSongId)
        })
})

reloadBtn.addEventListener('click',() => {
    audio.currentTime = 0;
    progress.value  = 0;
    audio.play()
})

randomBtn.addEventListener('click',()=>{
    fetch(songsAPI)
        .then(response => {return response.json();})
        .then(songs => {
            const randomIndex = Math.floor(Math.random() * songs.length);
            console.log(randomIndex);
            const randomSongId = songs[randomIndex].id;
            playSong(songsAPI, randomSongId)
            console.log(randomSongId);
        })
})

window.onload = app;