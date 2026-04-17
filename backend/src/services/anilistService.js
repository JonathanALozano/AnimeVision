import axios from "axios";

const ANILIST_URL = process.env.ANILIST_URL || "https://graphql.anilist.co";

function normalizeTitle(titleObj) {
  return titleObj?.english || titleObj?.romaji || titleObj?.native || "Sin título";
}

function scoreAnime(anime, targetGenres = [], targetTags = []) {
  const animeGenres = anime.genres || [];
  const animeTags = (anime.tags || []).map((t) => t.name);

  const genreMatches = animeGenres.filter((g) => targetGenres.includes(g)).length;
  const tagMatches = animeTags.filter((t) => targetTags.includes(t)).length;

  const baseScore = anime.averageScore || 0;
  const popularityBoost = Math.min((anime.popularity || 0) / 20000, 10);
  const recencyBoost = anime.seasonYear ? Math.max(0, (anime.seasonYear - 2012) * 0.4) : 0;

  return (
    baseScore +
    popularityBoost +
    recencyBoost +
    genreMatches * 5 +
    tagMatches * 4
  );
}

async function queryAniList({ genres = [], tags = [], perPage = 24 }) {
  const query = `
    query ($genreIn: [String], $tagIn: [String], $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(
          type: ANIME
          genre_in: $genreIn
          tag_in: $tagIn
          sort: [SCORE_DESC, POPULARITY_DESC]
          isAdult: false
        ) {
          id
          title {
            romaji
            english
            native
          }
          genres
          averageScore
          popularity
          seasonYear
          format
          description(asHtml: false)
          coverImage {
            large
            extraLarge
          }
          tags {
            name
          }
        }
      }
    }
  `;

  const variables = {
    genreIn: genres.length ? genres : null,
    tagIn: tags.length ? tags : null,
    perPage,
  };

  const response = await axios.post(
    ANILIST_URL,
    { query, variables },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data?.data?.Page?.media || [];
}

function cleanAndRank(media, genres, tags) {
  return media
    .filter((anime) => ["TV", "ONA", "MOVIE"].includes(anime.format))
    .filter((anime) => (anime.averageScore || 0) >= 65)
    .filter((anime) => (anime.seasonYear || 0) >= 1998)
    .map((anime) => ({
      ...anime,
      finalScore: scoreAnime(anime, genres, tags),
      displayTitle: normalizeTitle(anime.title),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

function dedupeById(animeList) {
  const seen = new Set();
  return animeList.filter((anime) => {
    if (seen.has(anime.id)) return false;
    seen.add(anime.id);
    return true;
  });
}

function fallbackFromBestLabel(bestLabel = "", visualStyle = "") {
  const label = bestLabel.toLowerCase();
  const style = visualStyle.toLowerCase();

  if (label.includes("psychological") || style === "dark") {
    return {
      genres: ["Psychological", "Mystery"],
      tags: ["Thriller", "Mind Games"],
    };
  }

  if (label.includes("cyberpunk") || label.includes("sci-fi") || style === "futuristic") {
    return {
      genres: ["Sci-Fi", "Action"],
      tags: ["Cyberpunk", "Space"],
    };
  }

  if (label.includes("seinen") || style === "noir") {
    return {
      genres: ["Drama", "Psychological"],
      tags: ["Crime", "Seinen"],
    };
  }

  if (label.includes("supernatural") || style === "colorful") {
    return {
      genres: ["Action", "Supernatural"],
      tags: ["Shounen", "Super Power"],
    };
  }

  return {
    genres: ["Drama", "Action"],
    tags: [],
  };
}

export async function fetchAniListRecommendations({
  genres = [],
  tags = [],
  bestLabel = "",
  visualStyle = "",
}) {
  let combined = [];

  // 1) géneros + tags
  if (genres.length || tags.length) {
    const first = await queryAniList({ genres, tags });
    combined.push(...cleanAndRank(first, genres, tags));
  }

  // 2) solo géneros
  if (combined.length < 8 && genres.length) {
    const second = await queryAniList({ genres, tags: [] });
    combined.push(...cleanAndRank(second, genres, []));
  }

  // 3) solo top 1 o 2 tags
  if (combined.length < 8 && tags.length) {
    const topTags = tags.slice(0, 2);
    const third = await queryAniList({ genres: [], tags: topTags });
    combined.push(...cleanAndRank(third, [], topTags));
  }

  // 4) fallback por mejor etiqueta / estilo visual
  if (combined.length < 8) {
    const fallback = fallbackFromBestLabel(bestLabel, visualStyle);
    const fourth = await queryAniList({
      genres: fallback.genres,
      tags: fallback.tags,
    });
    combined.push(...cleanAndRank(fourth, fallback.genres, fallback.tags));
  }

  return dedupeById(combined).slice(0, 10);
}