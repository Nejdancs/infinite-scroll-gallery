// import InfiniteScroll from 'infinite-scroll/dist/infinite-scroll.pkgd.min.js';

const formRef = document.querySelector('.input-group');
const galleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSubmit);
let userInput;

function onSubmit(e) {
  e.preventDefault();
  userInput = e.target.search.value;
  galleryRef.innerHTML = '';
  infScroll.pageIndex = 1;

  infScroll
    .loadNextPage()
    .then(function (loaded) {
      // next page has been loaded
      let { body } = loaded;

      infScroll.statusElement.style.display = 'block';

      if (body.total === 0 && body.hits.length === 0) {
        infScroll.statusEventElements.error.style.display = 'block';
        return;
      }

      if (body.hits.length < 9) {
        infScroll.statusEventElements.last.style.display = 'block';
        return;
      }
    })
    .catch(er => console.log(er));
}

let infScroll = new InfiniteScroll(galleryRef, {
  // options
  path: function () {
    return `https://pixabay.com/api/?key=27888557-96adad5e55b58177e65876141&q=${userInput}&page=${this.pageIndex}&per_page=9`;
  },
  // load response as JSON
  responseBody: 'json',
  history: false,
  checkLastPage: true,
  scrollThreshold: 200,
  status: '.page-load-status',
});

infScroll.on('load', onLoad);

function onLoad(body) {
  if (body.total === 0 && body.hits.length === 0) {
    return;
  }

  const markup = body.hits
    .map(
      image => `<li class="item post"><img src="${image.webformatURL}"></li>`
    )
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markup);
}
