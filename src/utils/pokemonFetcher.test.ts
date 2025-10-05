/**
 * Unit tests for Pokemon fetching utilities
 *
 * These tests validate the parallel loading logic without React rendering complexity.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPokemonListWithDetails, createFetchTimingTracker } from "./pokemonFetcher";

describe("Pokemon Fetcher - Parallel Loading Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Parallel Loading Performance
   * Verifies that all Pokemon details are fetched simultaneously, not sequentially
   */
  it("should fetch Pokemon details in parallel, not sequentially", async () => {
    const mockFetch = global.fetch as any;
    const tracker = createFetchTimingTracker();

    // Mock the list endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 1000,
        results: Array.from({ length: 100 }, (_, i) => ({
          name: `pokemon-${i}`,
          url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
        })),
      }),
    });

    // Mock detail endpoints and track timing
    for (let i = 0; i < 10; i++) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          tracker.recordCall(); // Record when fetch is called
          return {
            id: i + 1,
            name: `pokemon-${i}`,
            sprites: { front_default: `https://example.com/image-${i}.png` },
            types: [],
            abilities: [],
            stats: [],
            species: { name: `pokemon-${i}`, url: `species-${i}` },
          };
        },
      });
    }

    const result = await fetchPokemonListWithDetails({ requestTimeout: 100, count: 10 });

    // ASSERTION 1: Should return 10 Pokemon
    expect(result).toHaveLength(10);

    // ASSERTION 2: All fetches should happen in parallel (within 100ms)
    const timing = tracker.getTiming();
    expect(timing.isParallel).toBe(true);
    expect(timing.timeDiff).toBeLessThan(150);

    // ASSERTION 3: Should call fetch 11 times (1 list + 10 details)
    expect(mockFetch).toHaveBeenCalledTimes(11);
  });

  /**
   * TEST 2: Graceful Error Handling
   * Verifies that individual Pokemon failures don't block others
   */
  it("should handle individual Pokemon fetch failures gracefully", async () => {
    const mockFetch = global.fetch as any;

    // Mock list endpoint with 3 Pokemon
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 3,
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
          { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
      }),
    });

    // Mock detail calls - some succeed, one fails
    // Note: Pokemon are randomly selected, so we mock all 3
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 25,
        name: "pikachu",
        sprites: { front_default: "pikachu.png" },
        types: [],
        abilities: [],
        stats: [],
        species: { name: "pikachu", url: "species-25" },
      }),
    });

    // This one FAILS
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: "bulbasaur",
        sprites: { front_default: "bulbasaur.png" },
        types: [],
        abilities: [],
        stats: [],
        species: { name: "bulbasaur", url: "species-1" },
      }),
    });

    const result = await fetchPokemonListWithDetails({ requestTimeout: 100, count: 3 });

    // ASSERTION: Should return all 3 Pokemon
    expect(result).toHaveLength(3);

    // ASSERTION: At least one Pokemon should have failed (null image)
    const failedPokemon = result.filter((p) => p.image === null);
    expect(failedPokemon.length).toBeGreaterThanOrEqual(1);

    // ASSERTION: At least two Pokemon should have succeeded
    const successfulPokemon = result.filter((p) => p.image !== null);
    expect(successfulPokemon.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * TEST 3: Request Timeout Handling
   * Verifies that AbortController timeout works correctly
   */
  it("should handle request timeouts", async () => {
    const mockFetch = global.fetch as any;

    // Mock list endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 2,
        results: [
          { name: "fast-pokemon", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "slow-pokemon", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }),
    });

    // Mock both detail calls
    // One fast, one times out
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: "fast-pokemon",
        sprites: { front_default: "fast.png" },
        types: [],
        abilities: [],
        stats: [],
        species: { name: "fast-pokemon", url: "species-1" },
      }),
    });

    // Slow Pokemon - simulates timeout
    mockFetch.mockImplementationOnce(async (url: string, options: any) => {
      return new Promise((resolve, reject) => {
        if (options?.signal) {
          options.signal.addEventListener("abort", () => {
            reject(new Error("AbortError"));
          });
        }
        // Never resolves, will be aborted by timeout
      });
    });

    const result = await fetchPokemonListWithDetails({ requestTimeout: 50, count: 2 });

    // ASSERTION: Should return both Pokemon
    expect(result).toHaveLength(2);

    // ASSERTION: At least one should have timed out (null image)
    const timedOutPokemon = result.filter((p) => p.image === null);
    expect(timedOutPokemon.length).toBeGreaterThanOrEqual(1);

    // ASSERTION: At least one should have succeeded
    const successfulPokemon = result.filter((p) => p.image !== null);
    expect(successfulPokemon.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 4: Data Structure Validation
   * Verifies that returned data has correct structure
   */
  it("should return correctly structured Pokemon data", async () => {
    const mockFetch = global.fetch as any;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 1,
        results: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }],
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 25,
        name: "pikachu",
        sprites: { front_default: "https://example.com/pikachu.png" },
        types: [{ slot: 1, type: { name: "electric", url: "type-url" } }],
        abilities: [],
        stats: [],
        species: { name: "pikachu", url: "species-url" },
      }),
    });

    const result = await fetchPokemonListWithDetails({ requestTimeout: 100, count: 1 });

    // ASSERTION: Should return array
    expect(Array.isArray(result)).toBe(true);

    // ASSERTION: Each Pokemon should have correct structure
    const pokemon = result[0];
    expect(pokemon).toHaveProperty("name");
    expect(pokemon).toHaveProperty("url");
    expect(pokemon).toHaveProperty("image");
    expect(pokemon).toHaveProperty("isLoading");

    // ASSERTION: Data should be correct
    expect(pokemon.name).toBe("pikachu");
    expect(pokemon.image).toBe("https://example.com/pikachu.png");
    expect(pokemon.isLoading).toBe(false);
  });

  /**
   * TEST 5: Timing Tracker Utility
   * Tests the helper function for tracking parallel execution
   */
  it("should correctly identify parallel vs sequential execution", () => {
    const tracker = createFetchTimingTracker();

    // Simulate parallel calls (all within 50ms)
    const startTime = Date.now();
    tracker.recordCall();
    tracker.recordCall();
    tracker.recordCall();

    const timing = tracker.getTiming();

    expect(timing.callCount).toBe(3);
    expect(timing.timeDiff).toBeLessThan(100);
    expect(timing.isParallel).toBe(true);
  });
});
