export function mapLabelsToFilters(labels = []) {
  const genres = new Set();
  const tags = new Set();

  for (const item of labels) {
    const label = String(item.label || "").toLowerCase();

    if (label.includes("action")) genres.add("Action");
    if (label.includes("adventure")) genres.add("Adventure");
    if (label.includes("fantasy")) genres.add("Fantasy");
    if (label.includes("dark fantasy")) tags.add("Dark Fantasy");
    if (label.includes("supernatural")) genres.add("Supernatural");
    if (label.includes("psychological")) genres.add("Psychological");
    if (label.includes("mystery")) genres.add("Mystery");
    if (label.includes("horror")) genres.add("Horror");
    if (label.includes("drama")) genres.add("Drama");
    if (label.includes("romance")) genres.add("Romance");
    if (label.includes("school")) genres.add("School");
    if (label.includes("sports")) genres.add("Sports");
    if (label.includes("military")) tags.add("Military");
    if (label.includes("survival")) tags.add("Survival");
    if (label.includes("post-apocalyptic")) tags.add("Post-Apocalyptic");
    if (label.includes("mecha")) tags.add("Mecha");
    if (label.includes("super power")) tags.add("Super Power");
    if (label.includes("shounen")) tags.add("Shounen");
    if (label.includes("seinen")) tags.add("Seinen");
    if (label.includes("space western")) tags.add("Space");
    if (label.includes("cyberpunk")) tags.add("Cyberpunk");
    if (label.includes("crime")) tags.add("Crime");
    if (label.includes("detective")) tags.add("Detective");
    if (label.includes("samurai")) tags.add("Samurai");
    if (label.includes("martial arts")) tags.add("Martial Arts");
  }

  return {
    genres: [...genres],
    tags: [...tags],
  };
}