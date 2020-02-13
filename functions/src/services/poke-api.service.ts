import axios from 'axios';
import { PokemonApiResponse } from "../models/pokemon-api-response.model";
import Pokemon, { createPokemon } from "../models/pokemon.model";

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
