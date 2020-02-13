import { https, Request, Response } from "firebase-functions";
import { getPokemonByName } from '../services/poke-api.service';
import { cors } from "../middleware/cors.middleware";

export const getPokemon = https.onRequest(async (req: Request, res: Response) => {
    const { name } = req.query;
    try {
        const pokemon = await getPokemonByName(name);
        cors(req, res);
        res.json(pokemon);
    } catch (error) {
        res.sendStatus(404);
    }
});
