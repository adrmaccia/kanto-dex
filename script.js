const body = document.querySelector('body');
const back = document.querySelector('#back');

// Pokemon Image API
const content = document.createElement('div');
content.className = 'content';
body.append(content);

const pkmnContainer = document.createElement('div');
pkmnContainer.className = 'pkmnContainer';

const generationTitle = document.createElement('div');
generationTitle.className = 'generationTitle';
generationTitle.innerHTML = 'Generation 1';

async function getPokemon() {
  content.innerHTML = '';
  content.append(generationTitle, pkmnContainer);

  let firstIndex = 1;
  let lastIndex = 151;

  while (firstIndex <= lastIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${firstIndex}`);
    const pokemon = await res.json();
    const sprite = pokemon.sprites.other['official-artwork'].front_default;

    // removes first letter, slice index 1 onwards
    const upperCaseName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const pokemonId = pokemon.id < 10 ? `#00${pokemon.id}` : `#0${pokemon.id}`;

    const allSprites = document.createElement('div');
    allSprites.className = 'allSprites';
    allSprites.innerHTML = ` <img class="sprite" src="${sprite}">
                             <div class="spriteInfo">
                                <p class="pkmnId">${pokemonId}</p>
                                <p class="pkmnName">${upperCaseName}</p>
                             </div>`;
    pkmnContainer.append(allSprites);

    allSprites.addEventListener('click', () => {
      pokemonName = pokemon.name;
      getPokemonCard(pokemonName);
    });

    firstIndex++;
  }
}

getPokemon();

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-38.php

function decimalPlace(number) {
  const result = number - Math.floor(number) !== 0;

  if (result) {
    return number;
  } else {
    return number.toFixed(2);
  }
}

// List of pokemon TCG
async function getPokemonCard(pokemonName) {
  const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName} `);
  const pokemonTcg = await res.json();
  const pokemonCard = pokemonTcg.data;

  const upperCaseTitle = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  pkmnContainer.innerHTML = '';

  // last updated: ${card.cardmarket.updatedAt}

  pokemonCard.forEach((card, index) => {
    generationTitle.innerHTML = `Viewing ${upperCaseTitle}'s cards <span class="priceDesc">Price displayed is based on average sell price.</span>`;

    let cardPrice;

    if (card.cardmarket === undefined) {
      cardPrice = 'Unknown';
    } else {
      // check if the current price is higher than the expected price
      const currentPrice = card.cardmarket.prices.averageSellPrice;
      const expectedPrice = card.cardmarket.prices.trendPrice;

      const price = currentPrice > expectedPrice ? 'up' : 'down';

      cardPrice = `<div><span class="arrow ${price}"></span></div>
                   <div>Price: $${decimalPlace(currentPrice)}</div>`;

      const cards = document.createElement('div');
      cards.className = 'cards';
      cards.innerHTML = `<img id="${index}" src="${card.images.small}">
                       <div class="priceInfo">${cardPrice}</div>`;

      if (price === 'down') {
        cards.querySelector('.arrow').style.borderColor = 'red';
      }

      pkmnContainer.append(cards);
      cards.addEventListener('click', () => {
        const cardId = pokemonTcg.data[index];
        getCardDetails(cardId);
      });
    }
  });
}

// back.addEventListener('click', () => {
//   getPokemon();
// });

// Individual Card
function getCardDetails(card) {
  pkmnContainer.innerHTML = '';

  const pkmnCard = document.createElement('div');
  pkmnCard.className = 'pkmnCard';
  pkmnCard.innerHTML = `<img class="card" src=${card.images.large}>
                           <div class="cardDetails">
                              <p class="name">${card.name}</p>
                              <p>${
                                card.evolvesFrom !== undefined
                                  ? 'Evolves from: ' + card.evolvesFrom
                                  : ''
                              }</p>
                              <div class="details">
                                <div class="leftContainer">
                                  <p>Set</p>
                                  <p>Release</p>
                                  <p>Series</p>
                                  <p>Artist</p>
                                  <p>Listing Details</p>
                                  <p>Average Sell</p>
                                  <p>Price Trend</p>
                                </div>
                                <div class="rightContainer">
                                  <p>${card.set.name}</p>
                                  <p>${card.set.releaseDate}</p>
                                  <p>${card.set.series}</p>
                                  <p>${card.artist}</p>
                                  <br>
                                  <p>${card.cardmarket.prices.averageSellPrice}</p>
                                  <p>${card.cardmarket.prices.trendPrice}</p>
                                </div>
                              </div>
                              <div>
                                <p>${card.flavorText !== undefined ? card.flavorText : ''}</p>
                              </div>
                           </div>`;
  content.append(pkmnCard);
}

// Search Pokemon Card
const search = document.querySelector('form');

search.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = document.querySelector('input[type="text"]').value;
  getPokemonCard(searchValue);
  document.querySelector('input[type="text"]').value = '';
});

// const body = document.querySelector('body');
// const back = document.querySelector('#back');
// const content = document.createElement('div');
// content.className = 'content';
// body.append(content);

// // Individual Card
// function getCardDetails(card) {
//   content.innerHTML = '';
//   console.log(card);

//   const pkmnCard = document.createElement('div');
//   pkmnCard.className = 'pkmnCard';
//   pkmnCard.innerHTML = `<img class="card" src=${card.images.large}>
//                            <div class="cardDetails">
//                               <p class="name">${card.name}</p>
//                               <p>${
//                                 card.evolvesFrom !== undefined
//                                   ? 'Evolves from: ' + card.evolvesFrom
//                                   : ''
//                               }</p>
//                               <div class="details">
//                                 <div class="leftContainer">
//                                   <p>Set</p>
//                                   <p>Release</p>
//                                   <p>Series</p>
//                                   <p>Artist</p>
//                                   <p>Listing Details</p>
//                                   <p>Average Sell</p>
//                                   <p>Price Trend</p>
//                                 </div>
//                                 <div class="rightContainer">
//                                   <p>${card.set.name}</p>
//                                   <p>${card.set.releaseDate}</p>
//                                   <p>${card.set.series}</p>
//                                   <p>${card.artist}</p>
//                                   <br>
//                                   <p>${card.cardmarket.prices.averageSellPrice}</p>
//                                   <p>${card.cardmarket.prices.trendPrice}</p>
//                                 </div>
//                               </div>
//                               <div>
//                                 <p>${card.flavorText !== undefined ? card.flavorText : ''}</p>
//                               </div>
//                            </div>`;
//   content.append(pkmnCard);
// }

// // TEMP
// async function tempCard() {
//   const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:charizard`);
//   const pokemonTcg = await res.json();
//   const charizardCard = pokemonTcg.data[6];
//   getCardDetails(charizardCard);
// }

// tempCard();
