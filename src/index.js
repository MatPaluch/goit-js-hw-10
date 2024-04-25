import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

axios.defaults.headers.common['x-api-key'] =
  'live_CwaIIxBdqKE3kTBR5jpoCFIvIMed5Q5zMwjbk887cxWMpmm5TAi6AO9GfG0bW3IL';

const breedOptions = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const pLoader = document.querySelector('.loader');
const pError = document.querySelector('.error');

catInfo.style.display = 'flex';
catInfo.style.paddingTop = '20px';
catInfo.style.alignItems = 'flex-start';

breedOptions.setAttribute('hidden', '');
pError.setAttribute('hidden', '');

fetchBreeds()
  .then(response => response.text())
  .then(result => {
    breedOptions.removeAttribute('hidden');
    pLoader.setAttribute('hidden', '');

    const arrayCats = JSON.parse(result);

    arrayCats.map(obj => {
      const option = document.createElement('option');
      option.value = obj.id;
      option.textContent = obj.name;
      breedOptions.insertAdjacentElement('beforeend', option);
    });
  })
  .catch(error => {
    pLoader.setAttribute('hidden', '');
    pError.removeAttribute('hidden');
    console.log(error);
  });

breedOptions.addEventListener('change', ev => {
  catInfo.innerHTML = '<br>';
  pLoader.removeAttribute('hidden');

  fetchCatByBreed(ev.target.value)
    .then(response => response.text())
    .then(data => {
      pLoader.setAttribute('hidden', '');
      const catData = JSON.parse(data);

      const catImg = document.createElement('img');
      catImg.src = catData[0].url;
      catImg.width = '320';

      catInfo.insertAdjacentElement('beforeend', catImg);

      const textCat = document.createElement('div');
      textCat.style.paddingLeft = '20px';
      catInfo.insertAdjacentElement('beforeend', textCat);

      const catBreed = catData[0].breeds[0];

      const headerBreed = document.createElement('h2');
      headerBreed.textContent = catBreed.name;
      headerBreed.style.fontFamily = 'Pacifico';
      textCat.insertAdjacentElement('beforeend', headerBreed);

      const descBreed = document.createElement('p');
      descBreed.textContent = catBreed.description;
      textCat.insertAdjacentElement('beforeend', descBreed);

      const temperament = document.createElement('p');
      temperament.innerHTML = `<b>Temperament: </b>${catBreed.temperament}.`;
      textCat.insertAdjacentElement('beforeend', temperament);

      console.log(catBreed);
    });
});
