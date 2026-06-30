import "./PokemonCard.css";

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
}

function PokemonCard({ id, name, image }: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>ID: {id}</p>
    </div>
  );
}

export default PokemonCard;