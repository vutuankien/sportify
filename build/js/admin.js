const albumAPI = "http://localhost:3000/albums";
const songsAPI = "http://localhost:3000/songs";
const topSongsAPI = "http://localhost:3000/top-songs";
const artistAPI = "http://localhost:3000/artists";

const songs = document.querySelector('#Songs');
const artists = document.querySelector('#artist');
const songDetails = document.querySelector('#songdetails');
const artistDetails = document.querySelector('#artistdetails');

//! song input fields
const song_id_input = document.querySelector('#song_id_input');
const song_song_id_input = document.querySelector('#song_song_id_input');
const song_artist_input = document.querySelector('#song_artist_input');
const song_title_input = document.querySelector('#song_title_input');
const song_artist_id_input = document.querySelector('#song_artist_id_input');
const song_path_input = document.querySelector('#song_path_input');
const song_image_path_input = document.querySelector('#song_image_path_input');

//! artist input fields

const artist_Id_input = document.querySelector('#artist_Id_input');
const artist_name_input = document.querySelector('#artist_name_input');
const artist_title_input = document.querySelector('#artist_title_input');
const artist_des = document.querySelector('#artist_des');
const artist_path = document.querySelector('#artist_path');


//TODO: create song to postman api
//TODO: create artist information to postman api
//TODO: delete song from postman api
//TODO:delete artist information from postman api
function changeSongs() {
    songs.style.display = 'block';
    artists.style.display = 'none';
}

function changeArtists() {
    songs.style.display = 'none';
    artists.style.display = 'block';
}
function changeSongsDetails() {
    songDetails.style.display = 'block';
    artistDetails.style.display = 'none';
}

function changeArtistsDetails() {
    songDetails.style.display = 'none';
    artistDetails.style.display = 'flex';
}


function callApi(callback, api) {
    fetch(api)
        .then(response => {
            return response.json()
        })
        .then(callback)
}

function renderSong(songs) {
    var html = songs.map(song => {
        return `<div class="flex mt-2 justify-between p-2 items-center bg-slate-600 hover:bg-slate-900 rounded-2xl hover:transition hover:duration-300 hover:ease-in-out cursor-pointer overflow-y-auto" id="song-id-${song.id}">
                    <div class="flex gap-2 items-center">
                        <img src="${song.image}" alt="" class="w-10 h-10 rounded-xl">
                        <div>
                            <p class="text-lg text-white font-semibold">${song.title}</p>
                            <p class="text-md text-gray-400">${song.artist}</p>
                        </div>
                    </div>
                    <div>
                        <button class="bg-red-700 p-2 rounded-xl text-white" onclick="deleteSong(${song.id})">Delete</button>
                        <button class="bg-blue-700 p-2 rounded-xl text-white">Select</button>
                    </div>
                </div>`
    })
    document.querySelector('#songdetails').innerHTML = html.join("");
}

function renderArtist(artists) {
    var html = artists.map(artist => {
        return `<div class="w-1/5 p-2 bg-slate-600 rounded-xl cursor-pointer hover:bg-slate-900 artist-id-${artist.artistId}">
                    <img src="${artist.image}" alt="" class="w-full rounded-xl" style="height: 160px;">
                    <h2 class="text-center text-xl mt-2 font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">${artist.name}</h2>
                    <p class="text-center text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">${artist.description}</p>
                    <div class = "mt-3 flex justify-center gap-2">
                        <button class="bg-red-700 p-2 text-xs rounded-md text-white" onclick = "deleteArtist(${artist.artistId})">Delete</button>
                        <button class="bg-blue-700 p-2 text-xs rounded-md text-white">Select</button>
                    </div>
                </div>`
    })
    document.querySelector('#artistdetails').innerHTML = html.join("");
}


function createTSongToPostMan(data, callback) {
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(songsAPI, options)
        .then(response => {
            return response.json();
        })
        .then(callback)
}

function createSong() {
    console.log("clicked");
    var data = {
        "id": song_id_input.value,
        "songID": song_song_id_input.value,
        "image": song_image_path_input.value,
        "title": song_title_input.value,
        "artistId": song_artist_id_input.value,
        "artist": song_artist_input.value,
        "path": song_path_input.value
    }
    //recopy
    artist_Id_input.value = song_artist_id_input.value
    artist_name_input.value = song_artist_input.value
    artist_title_input.value = song_title_input.value
    artist_path.value = song_image_path_input.value

    console.log(data);
    fetch(songsAPI)
        .then(response => response.json())
        .then(songs => {
            songs.forEach(song => {
                if ((song.id === song_id_input.value || (song.artistId === song_artist_id_input.value) || (song.songID === song_song_id_input.value))) {
                    alert("Song ID or Artist ID or songID already exists");
                    return;
                }

            })
        })
    if (song_id_input.value != song_song_id_input.value) {
        alert("Song ID and Song ID in the input fields must be the same");
        return;
    }
    if(song_id_input === undefined||
        song_song_id_input === undefined||
        song_artist_input === undefined||
        song_title_input === undefined||
        song_artist_id_input === undefined||
        song_image_path_input === undefined||
        song_path_input === undefined
    ){
        alert("All fields must be filled");
        return;
    }
    createTSongToPostMan(data, () => {
        callApi(renderSong, songsAPI)
    });
}

function deleteSong(id) {
    var deleteEl = document.querySelector('#song-id-' + id);
    console.log(deleteEl);
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(songsAPI + "/" + id, options)
        .then(response => {
            return response.json();
        })
        .then(function () {
            var deleteEl = document.querySelector('.song-id-' + id);
            if (deleteEl) {
                deleteEl.remove()
            }
        })
}



//Artist Handler
function createArtistToPostMan(data, callback) {
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(songsAPI, options)
        .then(response => {
            return response.json();
        })
        .then(callback)
}

function createArtist() {
    var data = {
        "artistId": artist_Id_input.value,
        "name": artist_name_input.value,
        "title": artist_title_input.value,
        "image": artist_path.value,
        "description": artist_des.value
    };

    if(artist_Id_input === undefined || 
        artist_name_input === undefined ||
        artist_title_input === undefined ||
        artist_path === undefined||
        artist_des === undefined
    ){
        alert("please fill an empty fields")
        return;
    }
    if(artist_Id_input.value != song_artist_id_input.value || 
        artist_name_input.value != song_artist_input.value ||
        artist_title_input.value!= song_title_input.value ||
        artist_path.value!= song_image_path_input.value
    ){
        alert("one of some input fields not match to the song input field, please check again !");
        return;
    }

    createArtistToPostMan(data, () => {
        callApi(renderArtist, artistAPI)
    });
}

function deleteArtist(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(artistAPI + "/" + id, options)
        .then(response => {
            return response.json();
        })
        .then(function () {
            var deleteEl = document.querySelector('.artist-id-' + id);
            if (deleteEl) {
                deleteEl.remove()
            }
        })
}
function app() {
    callApi(renderSong, songsAPI);
    callApi(renderArtist, artistAPI);
}

app()