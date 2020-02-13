import { TypeSlot } from "./type-slot.model";

export interface PokemonApiResponse {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: TypeSlot[];
}