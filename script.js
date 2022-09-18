const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;

// const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// const TMDB_BEST_R_RATED = '/discover/movie/?certification_country=US&certification=R&sort_by=popularity.desc&';


const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

var movieContainer = document.getElementById('movie-container');
var webLogo = document.getElementById('logo');
var bestMoviesOfYearDropDownMenu = document.getElementById('best-of-year');
var pageHeading = document.getElementById('page-heading');
var myListBtn = document.getElementById('my-list');

var searchInput = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.wrapper');
var resultsDiv = document.querySelector('.results');

var prevBtn = document.getElementById('prev-page');
var nextBtn = document.getElementById('next-page');
let pageNo = 1;

for(let year=2022; year>=2000; year--){
    var option = document.createElement('option');
    option.text = year;
    option.value = year;
    // bestMoviesOfYearDropDownMenu.add(option);
}

apiRequestCall(HOMEURL);

function apiRequestCall(url){
    const xhr = new XMLHttpRequest();
    xhr.open('get',url);
    xhr.send();
    xhr.onload = function(){
        movieContainer.innerHTML="";
        var res = xhr.response;
        var conJson = JSON.parse(res);
        var moviesObjArray = conJson.results;
        moviesObjArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
        console.log(addMovieToListButtonArray);
    }
}

function moviesElement(movie){
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${IMAGEURL+movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
            <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addingMovieToList(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    movieContainer.appendChild(movieElement);
}

webLogo.addEventListener('click', function(){
    pageHeading.innerHTML = 'best popular movies';
    apiRequestCall(HOMEURL);
});

var myMovieList=[];
var oldArray=[];

function addingMovieToList(buttonID){
    document.getElementById(buttonID).innerHTML = '<i class="fas fa-check"></i>';
    if(!myMovieList.includes(buttonID.toString())){
        myMovieList.push(buttonID.toString());
    }
    console.log(myMovieList);

    oldArray = JSON.parse(localStorage.getItem('MovieArray'));
    if(oldArray==null){
        localStorage.setItem('MovieArray', JSON.stringify(myMovieList));
    }else{
        myMovieList.forEach(item=>{
            if(!oldArray.includes(item)){
                oldArray.push(item);
            }
        })
        localStorage.setItem('MovieArray', JSON.stringify(oldArray));
    }
    console.log(oldArray);
}

searchInput.addEventListener('keyup', function(){
    var searchedInput = searchInput.value;

    var urlForThisInput = `https://api.themoviedb.org/3/search/movie?query=${searchedInput}&${APIKEY}`;
    if(searchedInput.length !=0){
        apiRequestCall(urlForThisInput);
    }else{
        window.location.reload();
    }
})

prevBtn.disabled = true;
function disablePvreBtn(){
    if(pageNo ==1){
        prevBtn.disabled=true;
    }else{
        prevBtn.disabled=false;
    }
}

nextBtn.addEventListener('click',()=>{
    pageNo++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNo}&with_watch_monetization_types=flatrate`;
    apiRequestCall(tempURL);
    disablePvreBtn();
});

prevBtn.addEventListener('click',()=>{
    if(pageNo==1){
        return;
    }
    pageNo--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNo}&with_watch_monetization_types=flatrate`;
    apiRequestCall(tempURL);
    disablePvreBtn();
})