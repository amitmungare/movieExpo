var storageString = localStorage.getItem('MovieArray');
var myListArray = JSON.parse(storageString);

const TMDB_API_KEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

myListArray.forEach(async id =>{
    let id_query = `/movie/${id}?language=en-US&`;
    let final_url = TMDB_BASE_URL+id_query+TMDB_API_KEY;
    await apiFunctionCall(final_url, id);
});

function apiFunctionCall(final_url, id){
    const xhr = new XMLHttpRequest();
    xhr.open('get',final_url);
    xhr.send();
    xhr.onload = function(){
        var resp = xhr.response;
        var jsonResp = JSON.parse(resp);
        renderListItems(jsonResp, id);
    }
}

function renderListItems(jsonResp, id){
    var eachListItem = document.createElement('div');
    eachListItem.classList.add('list-item');
    eachListItem.innerHTML = `
    
        <div class="movie-details">

            <div class="thumbnail">
                <a href="moviePage.html?id=${id}">
                    <img id="movieimg" src=${TMDB_IMAGE_BASE_URL+jsonResp.poster_path} alt="Thumbnail">
                <a/>
            </div>
            <div id="details">
                <div class="title">
                <a href="moviePage.html?id=${id}"> ${jsonResp.title} </a> 
                </div>
            
                <div class="remove-movie" id='${id}' onclick="deleteItemFromList(${id})">
                <i id="removeicon" class="far fa-trash-alt"></i>
                </div>
            </div>
        </div>
    
    `; 
    document.getElementById('list-container').appendChild(eachListItem);
}

document.getElementById('clear-whole-list').addEventListener('click', function(){
    if(window.confirm("clear fav list")){
        localStorage.clear();
        window.location.reload();
    }
});

async function deleteItemFromList(id){
    if(window.confirm('Delete this movie from fav list?')){
        var tempArr = await JSON.parse(localStorage.getItem('MovieArray'));
        var index = await tempArr.indexOf(id.toString());
        await tempArr.splice(index, 1);
        await localStorage.setItem('MovieArray', JSON.stringify(tempArr));
        await window.location.reload();
    }
}