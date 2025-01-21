const imagesWrapper = document.querySelector(".images")
const loadMore = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")

const apiKey = "g6Ji6TCbZSWDUbKcvmWlAnathWHcy0q1jGNQbzNEYGsxcVrCn2X7OQs6";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card"><img src="${img.src.large2x}" alt="">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button><i class="uil uil-import"></i></button>
                </div>
            </li>`
    )
}
const getImages = (apiURL) => {
    loadMore.innerHTML = "Loading...";
    loadMore.classList.add("disabled");
    fetch(apiURL, {
        headers: {
            Authorization: apiKey
        }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos)
        loadMore.innerHTML = "Load More";
        loadMore.classList.remove("disabled")
    }).catch(() => alert("Failed to load images"))
}
const loadMoreImages = () => {
    currentPage++;
    let apiURL = (`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
    getImages(apiURL)
}
const loadSearchImages = (e) => {
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMore.addEventListener("click", loadMoreImages)

searchInput.addEventListener("keyup", loadSearchImages)

