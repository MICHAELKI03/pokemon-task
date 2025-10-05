import styled from "styled-components";
import type { PokemonWithDescription } from "../types/pokemon";

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 400px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

const ErrorText = styled.div`
  color: #e53e3e;
  margin-bottom: 16px;
`;

const RetryButton = styled.button`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

const DetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const PokemonName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
  text-transform: capitalize;
`;

const PokemonId = styled.div`
  color: #999;
  font-size: 14px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #667eea;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Types = styled.div`
  display: flex;
  gap: 8px;
`;

const TypeBadge = styled.span<{ type: string }>`
  padding: 6px 16px;
  border-radius: 20px;
  background: ${(props) => getTypeColor(props.type)};
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
`;

const Stats = styled.div`
  display: grid;
  gap: 12px;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatName = styled.div`
  width: 120px;
  font-weight: 600;
  color: #666;
  text-transform: capitalize;
`;

const StatBarContainer = styled.div`
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const StatBar = styled.div<{ value: number }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${(props) => (props.value / 255) * 100}%;
  transition: width 0.3s ease;
`;

const StatValue = styled.div`
  width: 40px;
  text-align: right;
  font-weight: 600;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const Abilities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AbilityBadge = styled.span`
  padding: 6px 12px;
  background: #f0f4ff;
  border: 1px solid #667eea;
  border-radius: 6px;
  color: #667eea;
  font-size: 14px;
  text-transform: capitalize;
`;

const PhysicalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const PhysicalStat = styled.div`
  text-align: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const PhysicalStatLabel = styled.div`
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
`;

const PhysicalStatValue = styled.div`
  color: #333;
  font-size: 20px;
  font-weight: 700;
`;

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  return colors[type] || "#777";
}

interface PokemonDetailsProps {
  pokemon: PokemonWithDescription | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function PokemonDetails({ pokemon, loading, error, onRetry }: PokemonDetailsProps) {
  if (loading) {
    return (
      <Container>
        <Title>Pokémon Details</Title>
        <LoadingText>Loading details...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Pokémon Details</Title>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={onRetry}>Retry</RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!pokemon) {
    return (
      <Container>
        <Title>Pokémon Details</Title>
        <EmptyState>👆 Select a Pokémon from the list to view details</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Pokémon Details</Title>
      <DetailsContent>
        <Header>
          <PokemonImage src={pokemon.sprites.front_default || ""} alt={`${pokemon.name} sprite`} />
          <HeaderInfo>
            <PokemonName>{pokemon.name}</PokemonName>
            <PokemonId>#{pokemon.id.toString().padStart(3, "0")}</PokemonId>
          </HeaderInfo>
        </Header>

        <Section>
          <SectionTitle>Description</SectionTitle>
          <Description>{pokemon.description}</Description>
        </Section>

        <Section>
          <SectionTitle>Types</SectionTitle>
          <Types>
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name}>
                {t.type.name}
              </TypeBadge>
            ))}
          </Types>
        </Section>

        <Section>
          <SectionTitle>Abilities</SectionTitle>
          <Abilities>
            {pokemon.abilities.map((a) => (
              <AbilityBadge key={a.ability.name}>{a.ability.name.replace("-", " ")}</AbilityBadge>
            ))}
          </Abilities>
        </Section>

        <Section>
          <SectionTitle>Physical Stats</SectionTitle>
          <PhysicalStats>
            <PhysicalStat>
              <PhysicalStatLabel>Height</PhysicalStatLabel>
              <PhysicalStatValue>{pokemon.height}</PhysicalStatValue>
            </PhysicalStat>
            <PhysicalStat>
              <PhysicalStatLabel>Weight</PhysicalStatLabel>
              <PhysicalStatValue>{pokemon.weight}</PhysicalStatValue>
            </PhysicalStat>
          </PhysicalStats>
        </Section>

        <Section>
          <SectionTitle>Base Stats</SectionTitle>
          <Stats>
            {pokemon.stats.map((stat) => (
              <StatRow key={stat.stat.name}>
                <StatName>{stat.stat.name.replace("-", " ")}</StatName>
                <StatBarContainer>
                  <StatBar value={stat.base_stat} />
                </StatBarContainer>
                <StatValue>{stat.base_stat}</StatValue>
              </StatRow>
            ))}
          </Stats>
        </Section>
      </DetailsContent>
    </Container>
  );
}
