const body = document.querySelector('body');

const pokemonContainer = document.createElement('div');
pokemonContainer.className = 'pokemonContainer';
body.append(pokemonContainer);

async function getPokemon() {
  let maxPokemon = 1;

  while (maxPokemon <= 5) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${maxPokemon}`);
    const pokemon = await res.json();
    const pkmnImage = pokemon.sprites.other['official-artwork'].front_default;

    const pokemonImage = document.createElement('div');
    pokemonImage.className = 'pokemonImage';

    pokemonImage.innerHTML = `<img class="pokemonIcon" src="${pkmnImage}">              
                              <p class="pokemonName">${pokemon.id}.${pokemon.name}</p>`;

    pokemonContainer.append(pokemonImage);

    maxPokemon++;
  }
}

getPokemon();

const tcgContainer = document.createElement('div');
tcgContainer.className = 'tcgContainer';
body.append(tcgContainer);

async function getPokemonCard() {
  const res = await fetch('https://api.pokemontcg.io/v2/cards?q=name:bulbasaur');
  const pokemonCard = await res.json();
  const pkmnCard = pokemonCard.data;

  pkmnCard.forEach((card) => {
    const tcgDiv = document.createElement('div');
    tcgDiv.className = 'tcgDiv';
    tcgDiv.innerHTML = `<img class="pokemonTcg" src="${card.images.small}">`;
    tcgContainer.append(tcgDiv);
  });
}

getPokemonCard();
