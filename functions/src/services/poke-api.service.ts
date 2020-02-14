import axios from 'axios';
import { createPokemon, Pokemon, PokemonApiResponse } from '../models';
import { pokemonNames } from './pokemon-names';

function buildUrl(path: string, version: string = 'v2') {
    const baseUrl = 'https://pokeapi.co/api';
    return `${baseUrl}/${version}/${path}`;
}

export async function getPokemonByName(name: string): Promise<Pokemon | null> {
    if (!name) {
        return null;
    }

    const url = buildUrl(`pokemon/${name.toLowerCase()}`);
    const response = await axios.get<PokemonApiResponse>(url);
    const pokemon = await createPokemon(response.data);
    return pokemon;
}

export function getPokemonSuggestionsByName(name: string): string[] {
    if (!name) return [];

    const firstLetter = name[0];
    const suggestionMap = pokemonNames;
    const list = suggestionMap[firstLetter] || [];
    return list.filter(item => new RegExp(name, 'g').test(item));
}
