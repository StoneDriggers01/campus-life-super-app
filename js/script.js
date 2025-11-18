
console.log("script.js loaded");
const gifContainer = document.querySelector("#gif-container");
const fetchButton = document.querySelector("#fetch-gif-btn");
const searchInput = document.querySelector("#search-input");
fetchButton.addEventListener("click", async function () {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    alert("Please enter a search term!");
    return;
  }
  const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=YhfM3v3TpTURAzFwANhlAly9pdkKW7ca&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const images = data.data.map(gif => gif.images.original.url);
    gifContainer.innerHTML = "";
    for (let url of images) {
      gifContainer.innerHTML += `<img src="${url}" class="col-3 mb-3 img-fluid">`;
    }
    console.log(`Search term: ${searchTerm}`);
    console.log(images);
  } catch (error) {
    console.error("Error fetching GIFs:", error);
  }
});