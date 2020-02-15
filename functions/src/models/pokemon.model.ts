import { TypeEffectiveness } from "./type-effectiveness.model";
import { TypeSlot } from "./type-slot.model";

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    image: string;
    sprite: string;
    typeSlots: TypeSlot[];
    attackEffectiveness: TypeEffectiveness;
    defenseEffectiveness: TypeEffectiveness;
}
