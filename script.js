const body = document.querySelector('body');
const back = document.querySelector('#back');

// Pokemon Image API
const pkmnContainer = document.createElement('div');
pkmnContainer.className = 'pkmnContainer';
body.append(pkmnContainer);

async function getPokemon() {
  pkmnContainer.innerHTML = '';

  let firstIndex = 1;
  let lastIndex = 30;

  while (firstIndex <= lastIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${firstIndex}`);
    const pokemon = await res.json();
    const sprite = pokemon.sprites.other['official-artwork'].front_default;

    const allSprites = document.createElement('div');
    allSprites.className = 'allSprites';
    allSprites.innerHTML = `<img class="sprite" src="${sprite}">
                            <p class="pkmnId">${pokemon.id}.</p>
                            <p class="pkmnName">${pokemon.name}</p>`;
    pkmnContainer.append(allSprites);

    allSprites.addEventListener('click', () => {
      pokemonName = pokemon.name;
      getPokemonCard(pokemonName);
    });

    firstIndex++;
  }
}

getPokemon();

// List of pokemon TCG
async function getPokemonCard(pokemonName) {
  const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`);
  const pokemonTcg = await res.json();
  const pokemonCard = pokemonTcg.data;

  pkmnContainer.innerHTML = '';

  pokemonCard.forEach((card, index) => {
    const cards = document.createElement('div');
    cards.className = 'cards';
    cards.innerHTML = `<img id="${index}" src="${card.images.small}">
                       <p>Avg Price : $${card.cardmarket.prices.averageSellPrice}`;
    pkmnContainer.append(cards);

    cards.addEventListener('click', () => {
      const cardId = pokemonTcg.data[index];
      getCardDetails(cardId);
    });
  });
}

back.addEventListener('click', () => {
  getPokemon();
});

// Individual Card
function getCardDetails(card) {
  pkmnContainer.innerHTML = '';
  console.log(card);

  const cardDetails = document.createElement('div');
  cardDetails.className = 'cardDetails';
  cardDetails.innerHTML = `<img class="card" src=${card.images.large}>
                           <div>
                              <p>${card.name}</p>
                              <p>${
                                card.evolvesFrom !== undefined
                                  ? 'Evolves from: ' + card.evolvesFrom
                                  : ''
                              }</p>
                              <p>Set: ${card.set.name}</p>
                              <p>Release: ${card.set.releaseDate}</p>
                              <p>series: ${card.set.series}</p>
                              <p>Arist: ${card.artist}</p>
                              <div>
                                <p>Listings</p>
                                <p>Average sell ${card.cardmarket.prices.averageSellPrice}</p>
                                <p>Price Trend ${card.cardmarket.prices.trendPrice}</p>
                                <p></p>
                                <p>${card.flavorText !== undefined ? card.flavorText : ''}</p>
                              </div>
                           </div>`;
  pkmnContainer.append(cardDetails);
}

// Search Pokemon Card
const search = document.querySelector('form');

search.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = document.querySelector('input[type="text"]').value;
  getPokemonCard(searchValue);

  // Clear the input field after submission
  document.querySelector('input[type="text"]').value = '';
});

// TEMP
// getPokemonCard('charizard');

// async function tempCard() {
//   const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:charizard`);
//   const pokemonTcg = await res.json();
//   const bulbasaurCard = pokemonTcg.data[6];
//   getCardDetails(bulbasaurCard);
// }

// tempCard();
