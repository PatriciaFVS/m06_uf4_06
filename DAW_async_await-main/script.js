// Claus

let moviesResult = document.getElementById("moviesResult");
let total_pages = 0;
let current_page = 1;
let current_query = '';


const keys = {
    api_key: 'bf4293a50ccfded55c7df23a14a33044',
    session_id: '813f15cec80e8f43c586c766d77176a848f0983e',
    account_id: '21262292'
}



async function setFav(id, favBool) {
    moviesResult.innerHTML = "";
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjQyOTNhNTBjY2ZkZWQ1NWM3ZGYyM2ExNGEzMzA0NCIsInN1YiI6IjY2M2UyNjliZTBkNDdhNjc3YzMwZTAwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qmts2HGVsWdYwH9ha2uv9F2MU-D1eQs4l2YO6ZgkM3U'
        },
        body: JSON.stringify({
        media_type: 'movie',
        media_id: id,
        favorite: favBool
    })
    };
    

try {
    const response = await fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite?session_id=${keys.session_id}`, options);
    const result = await response.json();
    console.log(`${id} marked as ${favBool}`);
    await showFavs();
} catch (error) {
    console.error('Error setting favorite status:', error);
} 
      
}

async function showFavs() {
    moviesResult.innerHTML = "";
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjQyOTNhNTBjY2ZkZWQ1NWM3ZGYyM2ExNGEzMzA0NCIsInN1YiI6IjY2M2UyNjliZTBkNDdhNjc3YzMwZTAwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qmts2HGVsWdYwH9ha2uv9F2MU-D1eQs4l2YO6ZgkM3U'
        }
    };
    try {
        const response = await fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, options)
        const data = await response.json();
        data.results.forEach(movie => printMovie(movie, true, false));
    }
    catch (error) {
        console.error('Error al obtenir les pelicules preferides:', error);
    }

}

async function searchMovies(newQuery) {
    document.getElementById("loadingIndicator").style.display = "block";
    clearInput();
    removeActive();
    
    if (newQuery == null) {
        current_query = newQuery;
        current_page = 1;
        moviesResult.innerHTML = ""; 
    }
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjQyOTNhNTBjY2ZkZWQ1NWM3ZGYyM2ExNGEzMzA0NCIsInN1YiI6IjY2M2UyNjliZTBkNDdhNjc3YzMwZTAwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qmts2HGVsWdYwH9ha2uv9F2MU-D1eQs4l2YO6ZgkM3U'
        }
    };

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${newQuery}&include_adult=false&language=en-US&page=1`, options);
        const data = await response.json();
        moviesResult.innerHTML = "";
        for (const movie of data.results) {
            const favResponse = await fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?language=en-US&sort_by=created_at.asc`, options);
            const favData = await favResponse.json();
            const isFav = favData.results.some(favMovie => favMovie.id === movie.id);
            printMovie(movie, isFav, false);
        }
        document.getElementById("loadingIndicator").style.display = "none";
    } catch (error) {
        console.error('Error al buscar les pel·lícules:', error);
    }
}



/* FUNCIONS D'INTERACCIÓ AMB EL DOM */


// Click Favorites
document.getElementById("showFavs").addEventListener("click", function () {
    removeActive();
    this.classList.add("active");

    showFavs();
})

// Click Watchlist
document.getElementById("showWatch").addEventListener("click", function () {
    removeActive();
    this.classList.add("active");

    //showWatch();
})

/* Funcions per detectar la cerca d'una pel·lícula */
// Intro a l'input
document.getElementById("search").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMovies(this.value);
    }
});

// Click a la lupa
document.querySelector(".searchBar i").addEventListener("click", () => searchMovies(document.getElementById("search").value));

// Netejar l'input
document.getElementById("search").addEventListener('click', () => clearInput());

function clearInput() {
    document.getElementById("search").value = "";
}

// Elimina l'atribut active del menú
function removeActive() {
    document.querySelectorAll(".menu li a").forEach(el => el.classList.remove("active"));
}

/* Funció per printar les pel·lícules */
function printMovie(movie, fav, watch) {

    let favIcon = fav ? 'iconActive' : 'iconNoActive';
    let watchIcon = watch ? 'iconActive' : 'iconNoActive';

    moviesResult.innerHTML += `<div class="movie">
                                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
                                    <h3>${movie.original_title}</h3>
                                    <div class="buttons">
                                        <a id="fav" onClick="setFav(${movie.id}, ${!fav})"><i class="fa-solid fa-heart ${favIcon}"></i></a>
                                        <a id="watch" onClick="setWatch(${movie.id}, ${!watch})"><i class="fa-solid fa-eye ${watchIcon}"></i></a>
                                    </div>`;
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && current_page < total_pages) {
        current_page++;
        searchMovies(current_query);
    }
});