import axios from 'axios';
import { Pokemon, PokemonApiResponse, PokemonType, TypeEffectiveness, Types, TypeSlot } from '../models';
import effectivenessMatrix from '../models/effectiveness-matrix.model';
import { pokemonNames } from './pokemon-names';

const initialState: Pokemon = {
  id: -1,
  name: '',
  height: -1,
  weight: -1,
  sprite: '',
  image: '',
  typeSlots: [],
  attackEffectiveness: {
    quad: [],
    double: [],
    regular: [],
    half: [],
    quarter: [],
    zero: [],
  },
  defenseEffectiveness: {
    quad: [],
    double: [],
    regular: [],
    half: [],
    quarter: [],
    zero: [],
  },
};

function buildUrl(path: string, version: string = 'v2') {
  const baseUrl = 'https://pokeapi.co/api';
  return `${baseUrl}/${version}/${path}`;
}

function getTypeEffectivenessKey(effectiveness: number): keyof TypeEffectiveness {
  switch (effectiveness) {
    case 4:
      return 'quad';
    case 2:
      return 'double';
    case 1:
      return 'regular';
    case 0.5:
      return 'half';
    case 0.25:
      return 'quarter';
    default:
      return 'zero';
  }
}

function getTypeEffectivenessFrom(primaryType: number[], secondaryType: number[]): TypeEffectiveness {
  return primaryType.reduce((acc, curr, index) => {
    const type = Types[index];
    const effectiveness = curr * secondaryType[index];
    const key = getTypeEffectivenessKey(effectiveness);

    return {
      ...acc,
      [key]: [
        ...acc[key],
        type,
      ],
    };
  }, { ...initialState.defenseEffectiveness });
}

function getAtkEffectiveness(pokemonTypes: PokemonType[]) {
  const [primaryTypeIndex, secondaryTypeIndex] = pokemonTypes.map(type => Types.findIndex(it => it === type.name));

  const primaryType = effectivenessMatrix.getAtkEffectiveness(primaryTypeIndex);
  const secondaryType = effectivenessMatrix.getAtkEffectiveness(secondaryTypeIndex);

  return getTypeEffectivenessFrom(primaryType, secondaryType);
}

function getDefEffectiveness(pokemonTypes: PokemonType[]) {
  const [primaryTypeIndex, secondaryTypeIndex] = pokemonTypes.map(type => Types.findIndex(it => it === type.name));

  const primaryType = effectivenessMatrix.getDefEffectiveness(primaryTypeIndex);
  const secondaryType = effectivenessMatrix.getDefEffectiveness(secondaryTypeIndex);

  return getTypeEffectivenessFrom(primaryType, secondaryType);
}

function createPokemon(data: PokemonApiResponse): Pokemon {
  const pokemon: Pokemon = {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    sprite: data.sprites.front_default,
    image: `https://img.pokemondb.net/artwork/${data.name}.jpg`,
    typeSlots: data.types,
    attackEffectiveness: initialState.attackEffectiveness,
    defenseEffectiveness: initialState.defenseEffectiveness,
  };

  const types = data.types.map((typeSlot: TypeSlot) => typeSlot.type);

  pokemon.attackEffectiveness = getAtkEffectiveness(types);
  pokemon.defenseEffectiveness = getDefEffectiveness(types);

  return pokemon;
}

export async function getPokemonByName(name: string): Promise<Pokemon | null> {
  if (!name) {
    return null;
  }

  const url = buildUrl(`pokemon/${name.toLowerCase()}`);
  const response = await axios.get<PokemonApiResponse>(url);

  return createPokemon(response.data);
}

export function getPokemonSuggestionsByName(name: string): string[] {
  if (!name) return [];

  const firstLetter = name[0];
  const list = pokemonNames[firstLetter] || [];
  return list.filter(item => new RegExp(name, 'g').test(item));
}
