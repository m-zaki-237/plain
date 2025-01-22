const imagesWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const preview = document.querySelector(".lightbox");
const previewImage = document.querySelector(".lightbox .preview .img img");
const photographerName = document.querySelector(".lightbox .photographer span");
const closePreviewBtn = document.querySelector(".lightbox .buttons .uil-times");
const downloadPreviewBtn = document.querySelector(".lightbox .buttons .uil-import");

const apiKey = "g6Ji6TCbZSWDUbKcvmWlAnathWHcy0q1jGNQbzNEYGsxcVrCn2X7OQs6";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;


const downloadImg = (imageUrl) => {
    fetch(imageUrl).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image"));
};


const showPreview = (imageUrl, photographer) => {
    previewImage.src = imageUrl;
    photographerName.textContent = photographer;
    preview.classList.add("show");

    downloadPreviewBtn.onclick = () => {
        downloadImg(imageUrl);
    };
};

const hidePreview = () => {
    preview.classList.remove("show");
};

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card">
            <img src="${img.src.large2x}" alt="">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onClick="event.stopPropagation(); downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join('');

    const cards = imagesWrapper.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            const img = images[index];
            showPreview(img.src.large2x, img.photographer);
        });
    });
};

const getImages = (apiURL) => {
    loadMore.innerHTML = "Loading...";
    loadMore.classList.add("disabled");
    fetch(apiURL, {
        headers: {
            Authorization: apiKey
        }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMore.innerHTML = "Load More";
        loadMore.classList.remove("disabled");
    }).catch(() => alert("Failed to load images"));
};

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
};

const loadSearchImages = (e) => {
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
};

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMore.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closePreviewBtn.addEventListener("click", hidePreview);
