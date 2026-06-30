import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10"
        );

        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 180px)",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          image={pokemon.sprites.front_default}
        />
      ))}
    </div>
  );
}

export default PokemonList;