const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

let id = '';
const urlParams = new URLSearchParams(location.search);
for(const [key, value]of urlParams){
    id = value;
}

let id_query = `/movie/${id}?language=en-US&append_to_response=videos&`;
let final_url = BASEURL+id_query+APIKEY;

apiRequestCall(final_url);

function apiRequestCall(url){
    const xhr = new XMLHttpRequest();
    xhr.open('get',url);
    xhr.send();
    xhr.onload = function(){
        document.getElementById('movie-display').innerHTML='';
        var res=xhr.response;
        var convartedJson = JSON.parse(res);
        populateMoviesPage(convartedJson);
    }
    xhr.onerror =function(){
        window.alert('cannot get')
    }
}

function populateMoviesPage(myJson){
    var finalMovieTrailerArray = myJson.videos.results.filter(filterCriteria);

    document.body.style.backgroundImage = `url(${IMAGEURL+myJson.backdrop_path}), linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0) 250%)`;
    var eachMovieDiv = document.createElement('div');
    eachMovieDiv.classList.add('each-movie-page');

    var youtubeURL;
    if(finalMovieTrailerArray.length==0){
        if(myJson.videos.results.length ==0){
            youtubeURL='';
        }else{
            youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
        }
    }else{
        youtubeURL = `https://www.youtube.com/embed/${finalMovieTrailerArray[0].key}`;
    }

    eachMovieDiv.innerHTML = `
        <div class="movie-poster">
            <img src=${IMAGEURL+myJson.poster_path} alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">
                ${myJson.title}
            </div>

            <div class="tagline">${myJson.tagline}</div>

            <div style="display: flex;"> 
                <div class="movie-duration">
                    <b><i class="fas fa-clock"></i></b> ${myJson.runtime}
                </div>
                <div class="release-date">
                    <b>Raleased</b>: ${myJson.release_date}
                </div>
            </div>

            <div class="rating">
                <b>IMDb Rating</b>: ${myJson.vote_average}
            </div>

            <div class="trailer-div" id="trailer-div-btn">
                <i class="fab fa-youtube"></i>
            </div>

            <div id="trailer-video-div">
                <button id="remove-video-player"><i class="fas fa-times"></i></button>
                <br>
                <span><iframe width="560" height="315" src=${youtubeURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></span>
                
            </div>
    
            <div class="plot">
                ${myJson.overview}
            </div>
        </div>
    `;

    document.getElementById('movie-display').appendChild(eachMovieDiv);

    var trailerVideoDiv = document.getElementById('trailer-video-div');
    document.getElementById('trailer-div-btn').addEventListener('click', function(){
        trailerVideoDiv.style.display = 'block';
    });

    document.getElementById('remove-video-player').addEventListener('click', function(){
        stopThis();
        trailerVideoDiv.style.display = 'none';
    })

    function stopThis(){
        var iframe =document.getElementsByTagName("iframe")[0];
        var url = iframe.getAttribute('src');
        iframe.setAttribute('src', '');
        iframe.setAttribute('src', url);
    }

}

function filterCriteria(obj){
    var eachVideoTitle = obj.name 
    var regex = /Official Trailer/i;
    if(eachVideoTitle.match(regex)){
        return obj;
    }
}