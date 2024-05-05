import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

axios.defaults.headers.common['x-api-key'] =
  'live_CwaIIxBdqKE3kTBR5jpoCFIvIMed5Q5zMwjbk887cxWMpmm5TAi6AO9GfG0bW3IL';

const breedOptions = document.querySelector('.breed-select');

const pLoader = document.querySelector('.loader');
const circleLoader = document.querySelector('.loader_circle');
const pError = document.querySelector('.error');

const catInfo = document.querySelector('.cat-info');

breedOptions.setAttribute('hidden', '');
pError.setAttribute('hidden', '');

fetchBreeds()
  .then(response => response.text())
  .then(result => {
    Notify.success('Cat breeds loaded! ✅');
    breedOptions.removeAttribute('hidden');
    pLoader.setAttribute('hidden', '');
    circleLoader.remove();

    const arrayCats = JSON.parse(result);

    const newArray = arrayCats.map(obj => {
      return { value: obj.id, text: obj.name };
    });

    new SlimSelect({
      select: '#single',
      data: newArray,
    });
  })
  .catch(error => {
    pLoader.setAttribute('hidden', '');
    circleLoader.classList.toggle('loader_circle');
    pError.removeAttribute('hidden');
    Notify.failure("We can't reach the server! ⛔");
    console.log(error);
  });

breedOptions.addEventListener('change', ev => {
  pLoader.after(circleLoader);
  catInfo.innerHTML = '';
  pLoader.removeAttribute('hidden');

  fetchCatByBreed(ev.target.value)
    .then(response => response.text())
    .then(data => {
      Notify.success('We found this cat! 😁');
      pLoader.setAttribute('hidden', '');
      circleLoader.remove();
      const catData = JSON.parse(data);

      const catImg = document.createElement('img');
      catImg.src = catData[0].url;
      catImg.width = '320';
      catImg.style.marginTop = '20px';

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
    })
    .catch(error => {
      pLoader.setAttribute('hidden', '');
      circleLoader.classList.remove('loader_circle');
      pError.removeAttribute('hidden');
      Notify.failure("We can't find this cat! ⛔");
      console.log(error);
    });
});
