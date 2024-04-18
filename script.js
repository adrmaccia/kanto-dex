const pokemonSpriteApi = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonTcgList = 'https://api.pokemontcg.io/v2/cards?q=name:';

const body = document.querySelector('body');
const home = document.querySelector('.home');
const logo = document.querySelector('.logo');

const mainContent = document.createElement('div');
mainContent.className = 'mainContent';
body.append(mainContent);

const pkmnContainer = document.createElement('div');
pkmnContainer.className = 'pkmnContainer';

const generationTitle = document.createElement('div');
generationTitle.className = 'generationTitle';

// Get Pokemon sprites from API
async function getPokemonSprite() {
  pkmnContainer.innerHTML = '';

  let firstIndex = 1;
  let lastIndex = 151;

  mainContent.append(generationTitle, pkmnContainer);
  generationTitle.innerHTML = 'Generation 1';

  while (firstIndex <= lastIndex) {
    const res = await fetch(`${pokemonSpriteApi}${firstIndex}`);
    const pokemon = await res.json();
    const sprite = pokemon.sprites.other['official-artwork'].front_default;

    const pokemonId = pokemon.id < 10 ? `#00${pokemon.id}` : `#0${pokemon.id}`;

    const allSprites = document.createElement('div');
    allSprites.className = 'allSprites';
    allSprites.innerHTML = ` <img class="sprite" src="${sprite}">
                             <div class="spriteInfo">
                                <p class="pkmnId">${pokemonId}</p>
                                <p class="pkmnName">${upperCaseName(pokemon)}</p>
                             </div>`;
    pkmnContainer.append(allSprites);

    onSpriteClick(allSprites);

    firstIndex++;
  }
}

getPokemonSprite();

// Return clicked Pokemon TCG list
function onSpriteClick(pokemon) {
  pokemon.addEventListener('click', () => {
    pokemonName = pokemon.querySelector('.pkmnName').textContent;
    getPokemonCardList(pokemonName);
  });
}

// List of pokemon TCG
async function getPokemonCardList(pokemonName) {
  const res = await fetch(`${pokemonTcgList}${pokemonName} `);
  const pokemonTcg = await res.json();
  const pokemonCardList = pokemonTcg.data;

  pkmnContainer.innerHTML = '';

  pokemonCardList.forEach((card, index) => {
    generationTitle.innerHTML = `Viewing ${upperCaseName(card)}'s cards`;

    if (card.cardmarket !== undefined) {
      const currentPrice = card.cardmarket.prices.averageSellPrice;
      const expectedPrice = card.cardmarket.prices.trendPrice;

      const price = currentPrice > expectedPrice ? 'up' : 'down';

      let cardPrice = `<div><span class="arrow ${price}"></span></div>
                       <div>Price: $${decimalPlace(currentPrice)}</div>`;

      const cards = document.createElement('div');
      cards.className = 'cards';
      cards.innerHTML = `<img src="${card.images.small}">
                         <div class="priceInfo">${cardPrice}</div>`;

      if (price === 'down') {
        cards.querySelector('.arrow').style.borderColor = 'red';
      }

      pkmnContainer.append(cards);

      // adds event listner to each card, returns obj of clicked index
      onCardClick(cards, pokemonCardList[index]);
    }
  });
}

function onCardClick(card, cardObject) {
  card.addEventListener('click', () => {
    console.log(cardObject);
    getCardDetails(cardObject);
  });
}

// Individual Card
function getCardDetails(card) {
  pkmnContainer.innerHTML = '';

  generationTitle.innerHTML = `${card.name} ${card.set.ptcgoCode !== undefined ? `(${card.set.ptcgoCode})` : ''}`;

  const pkmnCard = document.createElement('div');
  pkmnCard.className = 'pkmnCard';
  pkmnCard.innerHTML = `<div>
                          <img class="card" src=${card.images.large}>
                        </div>
                        <div class="cardDetails">
                          <div class="details">
                            <div class="productDetails">
                              <h4>Product Details</h4>
                                <p class="detailText"><span>Set:</span> ${card.set.name}</p>
                                <p class="detailText"><span>Series:</span> ${card.set.series}</p>
                                <p class="detailText"><span>Release:</span> ${card.set.releaseDate}</p>
                                <p class="detailText"><span>Artist:</span> ${card.artist}</p>
                              <div class="evolutions">
                                <h4>Evolutions</h4>
                                <p class="detailText">${card.evolvesFrom !== undefined ? '<span>Evolves from:</span> ' + card.evolvesFrom : `${card.name} has no previous evolution.`}</p>
                                <p class="detailText">${card.evolvesTo !== undefined ? '<span>Evolves to:</span> ' + card.evolvesTo : `${card.name} does not evolve further.`}</p>
                              </div>
                            </div>
                            <div class="priceTable">
                              <h4>Listing History</h4>
                              <div id="priceValues">
                                <span>Price Trend</span><span>$${card.cardmarket.prices.trendPrice}</span>
                              </div>
                              <div id="priceValues">
                                <span>Average Sell Price</span><span>$${card.cardmarket.prices.averageSellPrice}</span>
                              </div>
                              <div id="priceValues">
                                <span>1 Day Average Price</span><span>$${card.cardmarket.prices.avg1}</span>
                                </div>
                              <div id="priceValues">
                                <span>7 Day Average Price</span><span>$${card.cardmarket.prices.avg7}</span>
                              </div>
                              <div id="priceValues">
                                <span>30 Day Average Price</span><span>$${card.cardmarket.prices.avg30}</span>
                              </div>
                            </div>
                          </div>
                          <div class="flavorText">
                            <p>${card.flavorText !== undefined ? card.flavorText : ''}</p>
                          </div>
                        </div>`;
  pkmnContainer.append(pkmnCard);
}

// Search Pokemon Card
const search = document.querySelector('form');

search.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = document.querySelector('input[type="text"]').value;
  getPokemonCardList(searchValue);
  document.querySelector('input[type="text"]').value = '';
});

function upperCaseName(pokemon) {
  return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
}

logo.addEventListener('click', () => {
  getPokemonSprite();
});

home.addEventListener('click', () => {
  getPokemonSprite();
});

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-38.php
function decimalPlace(number) {
  const result = number - Math.floor(number) !== 0;

  if (result) {
    return number;
  } else {
    return number.toFixed(2);
  }
}
