import styled from "styled-components";
import { SkeletonCard } from "./SkeletonCard";
import type { PokemonWithImage, PokemonWithDescription } from "../types/pokemon";

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const RefreshButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #5568d3;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const PokemonCard = styled.div<{ selected: boolean }>`
  padding: 16px;
  border: 2px solid ${(props) => (props.selected ? "#667eea" : "#e0e0e0")};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  background: ${(props) => (props.selected ? "#f0f4ff" : "white")};

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const PokemonImage = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
`;

const PokemonName = styled.div`
  margin-top: 8px;
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 40px;
  color: #e53e3e;
`;

interface PokemonListProps {
  pokemon: PokemonWithImage[];
  loading: boolean;
  error: string | null;
  onSelect: (url: string) => void;
  onRefresh: () => void;
  selectedPokemon: PokemonWithDescription | null;
}

/**
 * PokemonList Component
 *
 * Displays a grid of Pokemon cards with support for:
 * - Loading states (skeleton cards for progressive loading)
 * - Error states with retry functionality
 * - Selection highlighting
 *
 * REFACTORING NOTE (Issue #2):
 * Now supports progressive loading with skeleton cards for better UX
 */
export function PokemonList({ pokemon, loading, error, onSelect, onRefresh, selectedPokemon }: PokemonListProps) {
  const isSelected = (poke: PokemonWithImage) => poke.url === selectedPokemon?.species?.url;

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Pokémon List</Title>
          <RefreshButton onClick={onRefresh} disabled>
            Refresh
          </RefreshButton>
        </Header>
        <LoadingText>Loading Pokémon...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Pokémon List</Title>
          <RefreshButton onClick={onRefresh}>Retry</RefreshButton>
        </Header>
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Pokémon List</Title>
        <RefreshButton onClick={onRefresh}>Refresh</RefreshButton>
      </Header>
      <Grid>
        {pokemon.map((poke) => {
          // Show skeleton card while individual Pokemon is loading
          if (poke.isLoading) {
            return <SkeletonCard key={poke.name} />;
          }

          return (
            <PokemonCard key={poke.name} selected={isSelected(poke)} onClick={() => onSelect(poke.url)}>
              {poke.image ? (
                <PokemonImage src={poke.image} alt={`${poke.name} sprite`} />
              ) : (
                <PokemonImage src="https://via.placeholder.com/96?text=?" alt="Pokemon sprite unavailable" />
              )}
              <PokemonName>{poke.name}</PokemonName>
            </PokemonCard>
          );
        })}
      </Grid>
    </Container>
  );
}
