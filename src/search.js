const AV_API_KEY = '0L9AHU6XBQO2490G';
const searchStocksBtn = document.getElementById('searchStocksBtn');
const stockSearchCmp = document.getElementById('stockSearch');
const stockSearchResultsCmp = document.getElementById('stockSearchResults');
const resetStocksBtn = document.getElementById('resetStocksSearch');
const searchResultsListCmp = document.getElementById('searchResults');

let isLoading = false;

function searchByStockName(query) {
  return fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${AV_API_KEY}`)
    .then(r => r.json())
    .then(data => {
      return data['bestMatches'].map(r => ({symbol: r['1. symbol'], name: r['2. name']}));
    });
}

function reset() {
  searchResultsListCmp.innerHTML = '';
}

function createSpinner() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  return wrapper;
};

function handleSearchStocksClick(e) {
  isLoading = true;
  const spinnerCmp = createSpinner();
  searchStocksBtn.setAttribute('disabled', true);
  stockSearchResultsCmp.appendChild(spinnerCmp);

  reset();

  searchByStockName(stockSearchCmp.value).then((data) => {
    data.forEach((st) => {
      const el = document.createElement('li');
      el.innerHTML = `
        <div>${st.name}</div>
      `;
      searchResultsListCmp.appendChild(el);
    });

    searchStocksBtn.removeAttribute('disabled');
    stockSearchResultsCmp.removeChild(spinnerCmp);
    isLoading = false;
  });
}

searchStocksBtn.addEventListener('click', handleSearchStocksClick);
stockSearchCmp.addEventListener('keyup', (e) => {
  if (!isLoading && e.key === 'Enter') {
    handleSearchStocksClick();
  }
});
