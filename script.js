const body = document.querySelector('body');
const back = document.querySelector('#back');

// Pokemon Image API
const pkmnContainer = document.createElement('div');
pkmnContainer.className = 'pkmnContainer';
body.append(pkmnContainer);

async function getPokemon() {
  pkmnContainer.innerHTML = '';

  let firstIndex = 1;
  let lastIndex = 6;

  while (firstIndex <= lastIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${firstIndex}`);
    const pokemon = await res.json();
    const sprite = pokemon.sprites.other['official-artwork'].front_default;

    const allSprites = document.createElement('div');
    allSprites.className = 'allSprites';
    allSprites.innerHTML = `<img class="sprite" src="${sprite}">
                     <p class="pkmnName">${pokemon.id}.${pokemon.name}</p>`;
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
  // console.log(pokemonTcg.data[0]);

  pkmnContainer.innerHTML = '';

  pokemonCard.forEach((card, index) => {
    const cards = document.createElement('div');
    cards.className = 'cards';
    cards.innerHTML = `<img id="${index}" src="${card.images.small}">`;
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

  const cardDetails = document.createElement('div');
  cardDetails.className = 'cardDetails';
  cardDetails.innerHTML = `<img class="card" src=${card.images.large}>`;
  pkmnContainer.append(cardDetails);
}
