const headers = new Headers({
  'Content-Type': 'application/json',
  'x-api-key':
    'live_CwaIIxBdqKE3kTBR5jpoCFIvIMed5Q5zMwjbk887cxWMpmm5TAi6AO9GfG0bW3IL',
});

var requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow',
};

export function fetchBreeds() {
  return fetch('https://api.thecatapi.com/v1/breeds', requestOptions);
}

export function fetchCatByBreed(breedId) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
    requestOptions
  );
}
