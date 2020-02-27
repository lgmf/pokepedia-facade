import { https, Request, Response } from 'firebase-functions';
import { getPokemonByName, getPokemonSuggestionsByName } from '../services/poke-api.service';
import { cors } from '../middleware/cors.middleware';

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

export const getPokemonSuggestions = https.onRequest(async (req: Request, res: Response) => {
  const { search } = req.query;
  const start = 0;
  const maxSuggestions = 5;

  try {
    const allSuggestions = await getPokemonSuggestionsByName(search);
    const suggestions = allSuggestions.slice(start, maxSuggestions);
    cors(req, res);
    res.json(suggestions);
  } catch (error) {
    res.sendStatus(500).send(error);
  }
});
