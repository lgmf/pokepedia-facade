import effectivenessMatrix from './effectiveness-matrix.model';

import { PokemonApiResponse } from "./pokemon-api-response.model";
import { PokemonType } from "./pokemon-type";
import { Types } from "./pokemon-types.model";
import { TypeEffectiveness } from "./type-effectiveness.model";
import { TypeSlot } from "./type-slot.model";

interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprite: string;
    typeSlots: TypeSlot[];
    attackEffectiveness: TypeEffectiveness;
    defenseEffectiveness: TypeEffectiveness;
}

const initialState: Pokemon = {
    id: -1,
    name: '',
    height: -1,
    weight: -1,
    sprite: '',
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

export async function createPokemon(data: PokemonApiResponse): Promise<Pokemon> {
    const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        sprite: data.sprites.front_default,
        typeSlots: data.types,
        attackEffectiveness: initialState.attackEffectiveness,
        defenseEffectiveness: initialState.defenseEffectiveness,
    };

    const types = data.types.map(typeSlot => typeSlot.type);
    pokemon.attackEffectiveness = getAtkEffectiveness(types);
    pokemon.defenseEffectiveness = getDefEffectiveness(types);

    return pokemon;
}

export default Pokemon;