/**
 * Type definitions for Pokemon API responses and application data structures
 *
 * These types provide type safety and better IDE support throughout the application.
 * They replace the use of 'any' types and make the codebase more maintainable.
 */

/**
 * Basic Pokemon information from the list endpoint
 */
export interface PokemonListItem {
  name: string;
  url: string;
}

/**
 * Pokemon with image data for list display
 * This is the enhanced version after fetching sprite details
 */
export interface PokemonWithImage {
  name: string;
  url: string;
  image: string | null;
  isLoading?: boolean; // For skeleton state tracking
}

/**
 * Sprite URLs from Pokemon API
 */
export interface PokemonSprites {
  front_default: string | null;
  front_shiny?: string | null;
  back_default?: string | null;
  back_shiny?: string | null;
}

/**
 * Pokemon type information
 */
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

/**
 * Pokemon ability information
 */
export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

/**
 * Pokemon stat information
 */
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

/**
 * Species reference
 */
export interface PokemonSpecies {
  name: string;
  url: string;
}

/**
 * Full Pokemon details from the detail endpoint
 */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: PokemonSpecies;
  base_experience?: number;
}

/**
 * Pokemon with additional description from species endpoint
 * This is used for the details view
 */
export interface PokemonWithDescription extends Pokemon {
  description: string;
}

/**
 * API response from the Pokemon list endpoint
 */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

/**
 * Flavor text entry from species endpoint
 */
export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

/**
 * Species data response
 */
export interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
  name: string;
  order: number;
  // ... other species fields as needed
}

