var storageString = localStorage.getItem('MovieArray');
var myListArray = JSON.parse(storageString);

const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

myListArray.forEach(async id =>{
    let id_query = `/movie/${id}?language=en-US&`;
    let final_url = BASEURL+id_query+APIKEY;
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
                    <img id="movieimg" src=${IMAGEURL+jsonResp.poster_path} alt="Thumbnail">
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