const gameArea = document.getElementById("gameArea");
const world = document.getElementById("world");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const hintBtn = document.getElementById("hintBtn");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const targetTitle = document.getElementById("targetTitle");
const playerTitleDisplay = document.getElementById("playerTitleDisplay");
const pokedexBtn = document.getElementById("pokedexBtn");
const achievementsBtn = document.getElementById("achievementsBtn");
const statsBtn = document.getElementById("statsBtn");
const resetSaveBtn = document.getElementById("resetSaveBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

let seconds = 0;
let timer;
let level = 1;
let score = 0;
let gameActive = true;
let currentTarget = null;
let currentTargetData = null;
let currentGroup = [];

let worldX = 0;
let worldY = 0;
let scale = 1;
let isDragging = false;

let startTouchX = 0;
let startTouchY = 0;
let startWorldX = 0;
let startWorldY = 0;

let startDistance = 0;
let startScale = 1;

let clusters = [];
let targetClusterIndex = 0;
let hintUsesThisLevel = 0;
let currentGroupName = "purple";
let hintStage = 0;
let magnifyingGlassSpawned = false;
let pokeballSpawned = false;
let repeatEncounter = false;
let infoMenuOpen = false;

const minScale = 0.35;
const maxScale = 1.4;

const SAVE_KEY = "pokefind_save_v2_gen1_3";

let unlockedDex = {};
let foundCounts = {};
let shinyDex = {};
let shinyFoundCounts = {};
let unlockedAchievements = {};
let highestLevelReached = 1;
let totalPokemonFound = 0;
let totalHintsUsed = 0;
let levelsSkipped = 0;
let fastestFindTime = null;
let totalPlaySeconds = 0;
let legendaryHuntsCompleted = 0;
let bossTargets = [];
let bossFoundCount = 0;
let bossFoundNames = [];
let bossTokens = 0;
let bossesDefeated = 0;
let bossShopUpgrades = {};
let ownedCosmetics = { themes: ["default"], borders: ["purple"], titles: ["rookie"] };
let selectedCosmetics = { theme: "default", border: "purple", title: "rookie" };
let claimedAchievementRewards = {};

let bossChestRewards = {
    luckyCharm: false,
    eliteScanner: false,
    greatBallPlus: false,
    shinyRadar: false
};


let pokemonManifest = [];
let pokemonGroups = {};
let pokemonByDex = {};
let allDexPokemon = [];

const colourGroups = ["black", "blue", "brown", "green", "grey", "pink", "purple", "red", "white", "yellow"];
const SHINY_ODDS = 100;
const SKIP_LEVEL_COST = 2500;

const BOARD_THEME_BACKGROUNDS = {
    purple: "linear-gradient(135deg, #241934, #463064)",
    blue: "linear-gradient(135deg, #123653, #1d7195)",
    green: "linear-gradient(135deg, #173d28, #347b44)",
    red: "linear-gradient(135deg, #4b1414, #8f2d2d)",
    yellow: "linear-gradient(135deg, #5b4510, #92701d)",
    brown: "linear-gradient(135deg, #3d2719, #6f4a2c)",
    pink: "linear-gradient(135deg, #4d2443, #8c4b79)",
    grey: "linear-gradient(135deg, #30343d, #5b6170)",
    gray: "linear-gradient(135deg, #30343d, #5b6170)",
    white: "linear-gradient(135deg, #4a4d59, #858998)",
    black: "linear-gradient(135deg, #09090d, #252532)",
    legendary: "linear-gradient(135deg, #3d2a10, #8a641d)"
};


const kantoBossLines = [
    ["Abra","Kadabra","Alakazam"],
    ["Gastly","Haunter","Gengar"],
    ["Machop","Machoke","Machamp"],
    ["Bellsprout","Weepinbell","Victreebel"],
    ["Dratini","Dragonair","Dragonite"],
    ["Geodude","Graveler","Golem"],
    ["Oddish","Gloom","Vileplume"],
    ["Poliwag","Poliwhirl","Poliwrath"],
    ["Bulbasaur","Ivysaur","Venusaur"],
    ["Charmander","Charmeleon","Charizard"],
    ["Squirtle","Wartortle","Blastoise"],
    ["Pidgey","Pidgeotto","Pidgeot"],
    ["Caterpie","Metapod","Butterfree"],
    ["Weedle","Kakuna","Beedrill"]
];

const johtoBossLines = [
    ["Chikorita","Bayleef","Meganium"],
    ["Cyndaquil","Quilava","Typhlosion"],
    ["Totodile","Croconaw","Feraligatr"],
    ["Hoppip","Skiploom","Jumpluff"],
    ["Mareep","Flaaffy","Ampharos"],
    ["Larvitar","Pupitar","Tyranitar"]
];

const hoennBossLines = [
    ["Treecko","Grovyle","Sceptile"],
    ["Torchic","Combusken","Blaziken"],
    ["Mudkip","Marshtomp","Swampert"],
    ["Ralts","Kirlia","Gardevoir"],
    ["Aron","Lairon","Aggron"],
    ["Beldum","Metang","Metagross"],
    ["Trapinch","Vibrava","Flygon"],
    ["Bagon","Shelgon","Salamence"]
];

const achievements = [
    { id: "first_find", name: "First Find", description: "Find your first Pokémon." },
    { id: "level_10", name: "Double Digits", description: "Reach Level 10." },
    { id: "level_25", name: "Serious Searcher", description: "Reach Level 25." },
    { id: "level_50", name: "PokéFind Master", description: "Reach Level 50." },
    { id: "score_1000", name: "Point Collector", description: "Reach 1,000 score." },
    { id: "score_5000", name: "Score Hunter", description: "Reach 5,000 score." },
    { id: "legendary_found", name: "Legendary Hunter", description: "Complete a Legendary Hunt." },
    { id: "first_shiny", name: "Shiny!", description: "Find your first shiny Pokémon." },
    { id: "shiny_10", name: "Sparkle Collector", description: "Find 10 shiny Pokémon." },
    { id: "no_hint_find", name: "Sharp Eyes", description: "Find a target without using a hint." },
    { id: "dex_25", name: "Growing Pokédex", description: "Unlock 25 Pokémon." },
    { id: "dex_50", name: "Pokédex Collector", description: "Unlock 50 Pokémon." },
    { id: "kanto_complete", name: "Kanto Complete", description: "Unlock all 151 Kanto Pokémon and open Johto." },
    { id: "johto_complete", name: "Johto Complete", description: "Unlock all 100 Johto Pokémon and open Hoenn." },
    { id: "hoenn_complete", name: "Hoenn Complete", description: "Unlock all 135 Hoenn Pokémon." },
    { id: "first_boss", name: "First Boss", description: "Defeat your first boss." },
    { id: "boss_5", name: "Boss Hunter", description: "Defeat 5 bosses." },
    { id: "boss_10", name: "Boss Veteran", description: "Defeat 10 bosses." },
    { id: "boss_25", name: "Boss Master", description: "Defeat 25 bosses." }
];


const achievementRewards = {
    first_find: { tokens: 2, title: "poke_hunter" },
    level_10: { tokens: 3 },
    level_25: { tokens: 5, title: "serious_searcher" },
    level_50: { tokens: 10, title: "pokefind_master" },
    score_1000: { tokens: 3 },
    score_5000: { tokens: 8 },
    legendary_found: { tokens: 5, title: "legendary_hunter" },
    first_shiny: { tokens: 5, title: "shiny_finder" },
    shiny_10: { tokens: 15, title: "sparkle_collector" },
    no_hint_find: { tokens: 3, title: "sharp_eyes_title" },
    dex_25: { tokens: 5 },
    dex_50: { tokens: 10, title: "dex_collector" },
    kanto_complete: { tokens: 25, title: "kanto_champion" },
    johto_complete: { tokens: 50, title: "johto_champion" },
    hoenn_complete: { tokens: 100, title: "hoenn_champion" },
    first_boss: { tokens: 5, title: "boss_rookie" },
    boss_5: { tokens: 10, title: "boss_hunter" },
    boss_10: { tokens: 20, title: "boss_veteran" },
    boss_25: { tokens: 50, title: "boss_master" }
};

const bonusItems = [
    { symbol: "★", name: "Star", points: 50 },
    { symbol: "◆", name: "Gem", points: 100 },
    { symbol: "♛", name: "Crown", points: 250 }
];

const cosmeticThemes = [
    { id: "default", name: "Default Theme", cost: 0, icon: "🎮" },
    { id: "forest", name: "Forest Theme", cost: 3, icon: "🌲" },
    { id: "ocean", name: "Ocean Theme", cost: 3, icon: "🌊" },
    { id: "cave", name: "Cave Theme", cost: 5, icon: "🪨" },
    { id: "volcano", name: "Volcano Theme", cost: 5, icon: "🌋" },
    { id: "night", name: "Night Theme", cost: 7, icon: "🌙" },
    { id: "golden", name: "Golden Theme", cost: 10, icon: "👑" }
];

const cosmeticBorders = [
    { id: "purple", name: "Purple Border", cost: 0, icon: "🟣" },
    { id: "gold", name: "Gold Border", cost: 5, icon: "🟡" },
    { id: "emerald", name: "Emerald Border", cost: 5, icon: "🟢" },
    { id: "ruby", name: "Ruby Border", cost: 5, icon: "🔴" },
    { id: "sapphire", name: "Sapphire Border", cost: 5, icon: "🔵" }
];

const cosmeticTitles = [
    { id: "rookie", name: "Rookie Trainer", cost: 0, icon: "🎒" },
    { id: "poke_hunter", name: "Poké Hunter", cost: 3, icon: "🔎" },
    { id: "shiny_seeker", name: "Shiny Seeker", cost: 5, icon: "✨" },
    { id: "boss_slayer", name: "Boss Slayer", cost: 10, icon: "👑" },
    { id: "serious_searcher", name: "Serious Searcher", cost: 0, icon: "🧭", achievement: "level_25" },
    { id: "pokefind_master", name: "PokéFind Master", cost: 0, icon: "🌟", achievement: "level_50" },
    { id: "legendary_hunter", name: "Legendary Hunter", cost: 0, icon: "⚡", achievement: "legendary_found" },
    { id: "shiny_finder", name: "Shiny Finder", cost: 0, icon: "✨", achievement: "first_shiny" },
    { id: "sparkle_collector", name: "Sparkle Collector", cost: 0, icon: "💫", achievement: "shiny_10" },
    { id: "sharp_eyes_title", name: "Sharp Eyes", cost: 0, icon: "👀", achievement: "no_hint_find" },
    { id: "dex_collector", name: "Dex Collector", cost: 0, icon: "📘", achievement: "dex_50" },
    { id: "boss_rookie", name: "Boss Rookie", cost: 0, icon: "👑", achievement: "first_boss" },
    { id: "boss_hunter", name: "Boss Hunter", cost: 0, icon: "👑", achievement: "boss_5" },
    { id: "boss_veteran", name: "Boss Veteran", cost: 0, icon: "⚔️", achievement: "boss_10" },
    { id: "boss_master", name: "Boss Master", cost: 0, icon: "🏆", achievement: "boss_25" },
    { id: "kanto_champion", name: "Kanto Champion", cost: 0, icon: "🏆", achievement: "kanto_complete" },
    { id: "johto_champion", name: "Johto Champion", cost: 0, icon: "🏆", achievement: "johto_complete" },
    { id: "hoenn_champion", name: "Hoenn Champion", cost: 0, icon: "🏆", achievement: "hoenn_complete" }
];


function getGenerationFromDex(dex) {
    if (dex <= 151) return 1;
    if (dex <= 251) return 2;
    return 3;
}

function getPokemonId(pokemonData) {
    return "dex-" + pokemonData.dex;
}

function titleCaseFromSlug(slug) {
    return slug
        .replace(/-shiny$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .replace("Ho Oh", "Ho-Oh")
        .replace("Mr Mime", "Mr. Mime")
        .replace("Nidoran F", "Nidoran♀")
        .replace("Nidoran M", "Nidoran♂");
}

function getBaseSlug(filename) {
    return filename.replace(".png", "").replace(/-shiny$/, "");
}

function getDisplayName(item) {
    const slug = getBaseSlug(item.filename || item.name || "");
    return titleCaseFromSlug(slug);
}

async function loadPokemonManifest() {
    const response = await fetch("pokemon-manifest.json");

    if (!response.ok) {
        throw new Error("Could not load pokemon-manifest.json");
    }

    pokemonManifest = await response.json();
    buildPokemonDataFromManifest();
}

function buildPokemonDataFromManifest() {
    const shinyByDexAndSlug = {};
    const normalItems = pokemonManifest.filter(item => !item.shiny);

    pokemonManifest
        .filter(item => item.shiny)
        .forEach(item => {
            const slug = getBaseSlug(item.filename);
            const normalSlug = slug.replace(/-shiny$/, "");
            shinyByDexAndSlug[item.dex + "|" + normalSlug] = "sprites/" + item.file;
        });

    pokemonGroups = {};
    colourGroups.forEach(colour => {
        pokemonGroups[colour] = [];
    });

    pokemonByDex = {};

    normalItems.forEach(item => {
        const slug = getBaseSlug(item.filename);
        const generation = getGenerationFromDex(item.dex);

        const pokemon = {
            dex: item.dex,
            id: slug,
            name: getDisplayName(item),
            normal: "sprites/" + item.file,
            shiny: shinyByDexAndSlug[item.dex + "|" + slug] || "",
            group: item.colour,
            generation,
            legendary: !!item.legendary
        };

        if (!pokemonGroups[pokemon.group]) {
            pokemonGroups[pokemon.group] = [];
        }

        pokemonGroups[pokemon.group].push(pokemon);

        if (!pokemonByDex[pokemon.dex]) {
            pokemonByDex[pokemon.dex] = pokemon;
        }
    });

    allDexPokemon = Object.values(pokemonByDex).sort((a, b) => a.dex - b.dex);

    Object.keys(pokemonGroups).forEach(groupName => {
        pokemonGroups[groupName].sort((a, b) => {
            if (a.generation !== b.generation) return a.generation - b.generation;
            return a.dex - b.dex || a.name.localeCompare(b.name);
        });
    });
}

function getAllPokemonList() {
    return allDexPokemon;
}

function loadGameSave() {
    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) return;

    try {
        const save = JSON.parse(raw);

        level = save.level || 1;
        score = save.score || 0;
        unlockedDex = save.unlockedDex || {};
        foundCounts = save.foundCounts || {};
        shinyDex = save.shinyDex || {};
        shinyFoundCounts = save.shinyFoundCounts || {};
        unlockedAchievements = save.unlockedAchievements || {};
        totalPlaySeconds = save.totalPlaySeconds || 0;
        legendaryHuntsCompleted = save.legendaryHuntsCompleted || 0;
        highestLevelReached = save.highestLevelReached || 1;
        totalPokemonFound = save.totalPokemonFound || 0;
        totalHintsUsed = save.totalHintsUsed || 0;
        levelsSkipped = save.levelsSkipped || 0;
        fastestFindTime = save.fastestFindTime ?? null;
        bossTokens = save.bossTokens || 0;
        bossesDefeated = save.bossesDefeated || 0;
        bossShopUpgrades = save.bossShopUpgrades || {};
        ownedCosmetics = save.ownedCosmetics || { themes: ["default"], borders: ["purple"], titles: ["rookie"] };
        selectedCosmetics = save.selectedCosmetics || { theme: "default", border: "purple", title: "rookie" };
        claimedAchievementRewards = save.claimedAchievementRewards || {};
        bossChestRewards = save.bossChestRewards || bossChestRewards;
    } catch (error) {
        console.log("Save could not be loaded", error);
    }
}

function saveGame() {
    const save = {
        level,
        score,
        unlockedDex,
        foundCounts,
        shinyDex,
        shinyFoundCounts,
        unlockedAchievements,
        totalPlaySeconds,
        legendaryHuntsCompleted,
        highestLevelReached,
        totalPokemonFound,
        totalHintsUsed,
        levelsSkipped,
        fastestFindTime,
        bossTokens,
        bossesDefeated,
        bossShopUpgrades,
        ownedCosmetics,
        selectedCosmetics,
        claimedAchievementRewards,
        bossChestRewards
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function unlockPokemon(pokemonData, wasShiny) {
    const id = getPokemonId(pokemonData);

    unlockedDex[id] = true;
    foundCounts[id] = (foundCounts[id] || 0) + 1;

    if (wasShiny) {
        shinyDex[id] = true;
        shinyFoundCounts[id] = (shinyFoundCounts[id] || 0) + 1;
        unlockAchievement("first_shiny");

        if (getShinyDexCount() >= 10) {
            unlockAchievement("shiny_10");
        }
    }

    checkAchievements();
    unlockAchievementCosmetics();
    checkGenerationUnlocks();
    saveGame();
}

function isPokemonUnlocked(pokemon) {
    return !!unlockedDex[getPokemonId(pokemon)];
}

function getPokemonFoundCount(pokemon) {
    return foundCounts[getPokemonId(pokemon)] || 0;
}

function isPokemonShinyUnlocked(pokemon) {
    return !!shinyDex[getPokemonId(pokemon)];
}

function getPokemonShinyFoundCount(pokemon) {
    return shinyFoundCounts[getPokemonId(pokemon)] || 0;
}

function getShinyDexCount() {
    return getAllPokemonList().filter(pokemon => isPokemonShinyUnlocked(pokemon)).length;
}

function getTotalShinyFinds() {
    return Object.values(shinyFoundCounts).reduce((total, count) => total + count, 0);
}

function getPokemonByGeneration(generation) {
    return getAllPokemonList().filter(pokemon => pokemon.generation === generation);
}

function getDexCount() {
    return getAllPokemonList().filter(pokemon => isPokemonUnlocked(pokemon)).length;
}

function getGenerationDexCount(generation) {
    return getPokemonByGeneration(generation).filter(pokemon => isPokemonUnlocked(pokemon)).length;
}

function getKantoDexCount() {
    return getGenerationDexCount(1);
}

function getJohtoDexCount() {
    return getGenerationDexCount(2);
}

function getHoennDexCount() {
    return getGenerationDexCount(3);
}

function isJohtoUnlocked() {
    return getKantoDexCount() >= 151;
}

function isHoennUnlocked() {
    return isJohtoUnlocked() && getJohtoDexCount() >= 100;
}

function isGenerationUnlocked(generation) {
    if (generation === 1) return true;
    if (generation === 2) return isJohtoUnlocked();
    if (generation === 3) return isHoennUnlocked();
    return false;
}

function getEligiblePokemon(groupName, includeLegendary) {
    return (pokemonGroups[groupName] || []).filter(pokemon => {
        if (!isGenerationUnlocked(pokemon.generation)) return false;
        if (pokemon.legendary && !includeLegendary) return false;
        return true;
    });
}

function getEligibleLegendaries() {
    return getAllGameplayPokemon().filter(pokemon => pokemon.legendary && isGenerationUnlocked(pokemon.generation));
}

function getAllGameplayPokemon() {
    return Object.values(pokemonGroups).flat();
}

function isBossLevel() {
    return level > 0 && level % 25 === 0;
}

function isSpecialLegendLevel() {
    return level % 5 === 0 && !isBossLevel();
}


function showAchievementPopup(achievement, reward) {
    const oldPopup = document.getElementById("achievementPopup");
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement("div");
    popup.id = "achievementPopup";
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "18%";
    popup.style.transform = "translateX(-50%) scale(0.92)";
    popup.style.zIndex = "5000";
    popup.style.width = "min(88vw, 420px)";
    popup.style.padding = "18px";
    popup.style.border = "3px solid #ffd86b";
    popup.style.borderRadius = "18px";
    popup.style.background = "linear-gradient(180deg, rgba(44,25,65,.98), rgba(20,10,32,.98))";
    popup.style.boxShadow = "0 0 30px rgba(255,216,107,.85), 0 0 55px rgba(214,166,255,.45)";
    popup.style.color = "#fff";
    popup.style.textAlign = "center";
    popup.style.fontWeight = "800";
    popup.style.opacity = "0";
    popup.style.transition = "opacity .25s ease, transform .25s ease";

    const rewardParts = [];
    if (reward && reward.tokens) {
        rewardParts.push("+" + reward.tokens + " Boss Token" + (reward.tokens === 1 ? "" : "s"));
    }
    if (reward && reward.title) {
        const rewardTitle = cosmeticTitles.find(title => title.id === reward.title);
        rewardParts.push((rewardTitle ? rewardTitle.icon + " " + rewardTitle.name : "New Title"));
    }

    popup.innerHTML =
        "<div style='font-size:30px;margin-bottom:6px;'>🏆 ACHIEVEMENT UNLOCKED!</div>" +
        "<div style='font-size:25px;color:#ffd86b;margin-bottom:6px;'>" + achievement.name + "</div>" +
        "<div style='font-size:16px;margin-bottom:12px;'>" + achievement.description + "</div>" +
        (rewardParts.length ? "<div style='font-size:18px;color:#d6a6ff;'>🎁 " + rewardParts.join(" • ") + "</div>" : "");

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateX(-50%) scale(1)";
    }, 20);

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translateX(-50%) scale(0.92)";
        setTimeout(() => popup.remove(), 300);
    }, 3300);
}

function showRetroRewardPopup(count) {
    if (!count) return;

    const oldPopup = document.getElementById("achievementPopup");
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement("div");
    popup.id = "achievementPopup";
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "18%";
    popup.style.transform = "translateX(-50%) scale(0.92)";
    popup.style.zIndex = "5000";
    popup.style.width = "min(88vw, 420px)";
    popup.style.padding = "18px";
    popup.style.border = "3px solid #ffd86b";
    popup.style.borderRadius = "18px";
    popup.style.background = "linear-gradient(180deg, rgba(44,25,65,.98), rgba(20,10,32,.98))";
    popup.style.boxShadow = "0 0 30px rgba(255,216,107,.85), 0 0 55px rgba(214,166,255,.45)";
    popup.style.color = "#fff";
    popup.style.textAlign = "center";
    popup.style.fontWeight = "800";
    popup.style.opacity = "0";
    popup.style.transition = "opacity .25s ease, transform .25s ease";

    popup.innerHTML =
        "<div style='font-size:30px;margin-bottom:6px;'>🎁 ACHIEVEMENT REWARDS!</div>" +
        "<div style='font-size:22px;color:#ffd86b;margin-bottom:8px;'>" + count + " reward" + (count === 1 ? "" : "s") + " claimed</div>" +
        "<div style='font-size:16px;color:#d6a6ff;'>Retroactive rewards have been added to your save.</div>";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateX(-50%) scale(1)";
    }, 20);

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translateX(-50%) scale(0.92)";
        setTimeout(() => popup.remove(), 300);
    }, 3300);
}

function unlockAchievement(id) {
    if (unlockedAchievements[id]) return;

    unlockedAchievements[id] = true;

    const achievement = achievements.find(item => item.id === id);
    const reward = achievementRewards[id];

    awardAchievementReward(id, true);

    if (achievement) {
        showAchievementPopup(achievement, reward);
        message.innerText = "🏆 Achievement unlocked: " + achievement.name + "!";
    }

    saveGame();
}

function checkAchievements() {
    if (getDexCount() >= 1) unlockAchievement("first_find");
    if (getDexCount() >= 25) unlockAchievement("dex_25");
    if (getDexCount() >= 50) unlockAchievement("dex_50");
    if (getShinyDexCount() >= 10) unlockAchievement("shiny_10");

    if (level >= 10) unlockAchievement("level_10");
    if (level >= 25) unlockAchievement("level_25");
    if (level >= 50) unlockAchievement("level_50");

    if (score >= 1000) unlockAchievement("score_1000");
    if (score >= 5000) unlockAchievement("score_5000");

    if (getKantoDexCount() >= 151) unlockAchievement("kanto_complete");
    if (getJohtoDexCount() >= 100) unlockAchievement("johto_complete");
    if (getHoennDexCount() >= 135) unlockAchievement("hoenn_complete");
    if (bossesDefeated >= 1) unlockAchievement("first_boss");
    if (bossesDefeated >= 5) unlockAchievement("boss_5");
    if (bossesDefeated >= 10) unlockAchievement("boss_10");
    if (bossesDefeated >= 25) unlockAchievement("boss_25");
}

function showModal(title, html) {
    modalTitle.innerText = title;
    modalContent.innerHTML = html;
    modalOverlay.classList.remove("hidden");
}

function closeModal() {
    modalOverlay.classList.add("hidden");
}

function showPokedex() {
    const allPokemon = getAllPokemonList();
    const unlocked = getDexCount();
    const kantoCount = getKantoDexCount();
    const johtoCount = getJohtoDexCount();
    const hoennCount = getHoennDexCount();
    const johtoUnlocked = isJohtoUnlocked();
    const hoennUnlocked = isHoennUnlocked();

    let html = "";
    html += '<div class="statLine">Total Unlocked: ' + unlocked + " / 386</div>";
    html += '<div class="statLine">Shiny Unlocked: ' + getShinyDexCount() + " / 386</div>";
    html += '<div class="statLine">Kanto: ' + kantoCount + " / 151</div>";
    html += '<div class="statLine">Johto: ' + (johtoUnlocked ? johtoCount : "Locked") + " / 100</div>";
    html += '<div class="statLine">Hoenn: ' + (hoennUnlocked ? hoennCount : "Locked") + " / 135</div>";
    html += '<div class="statLine">' + getUnlockMessage() + "</div>";
    html += '<div class="dexGrid">';

    allPokemon.forEach(pokemon => {
        const isUnlocked = isPokemonUnlocked(pokemon);
        const count = getPokemonFoundCount(pokemon);
        const shinyCount = getPokemonShinyFoundCount(pokemon);
        const shinyUnlocked = isPokemonShinyUnlocked(pokemon);
        const lockedByGeneration = !isGenerationUnlocked(pokemon.generation);

        html += '<div class="dexEntry ' + (isUnlocked ? "" : "locked") + '">';
        html += '<img src="' + (shinyUnlocked && pokemon.shiny ? pokemon.shiny : pokemon.normal) + '" alt="' + pokemon.name + '">';
        html += '<div class="dexName">#' + String(pokemon.dex).padStart(3, "0") + " " + (isUnlocked ? pokemon.name : (lockedByGeneration ? "Gen Locked" : "???")) + '</div>';
        html += '<div class="dexName">Gen ' + pokemon.generation + " • " + pokemon.group + (pokemon.legendary ? " • Legendary" : "") + '</div>';
        html += '<div class="dexName">Found: ' + count + '</div>';
        html += '<div class="dexName shinyDexLine">' + (shinyUnlocked ? "✨ Shiny found: " + shinyCount : "☆ Shiny not found") + '</div>';
        html += '</div>';
    });

    html += '</div>';

    showModal("Pokédex", html);
}

function getUnlockMessage() {
    if (!isJohtoUnlocked()) {
        return "Complete Kanto to unlock Johto.";
    }

    if (!isHoennUnlocked()) {
        return "Johto unlocked! Complete Johto to unlock Hoenn.";
    }

    return "Hoenn unlocked! All Gen 1-3 Pokémon are available.";
}


function showStats() {
    let html = "";
    html += "<div class='statLine'>Level: " + level + "</div>";
    html += "<div class='statLine'>Highest Level: " + highestLevelReached + "</div>";
    html += "<div class='statLine'>Score: " + score + "</div>";
    html += "<div class='statLine'>Pokédex: " + getDexCount() + " / 386</div>";
    html += "<div class='statLine'>Shinies: " + getShinyDexCount() + "</div>";
    html += "<div class='statLine'>Total Pokémon Found: " + totalPokemonFound + "</div>";
    html += "<div class='statLine'>Legendary Hunts Completed: " + legendaryHuntsCompleted + "</div>";
    html += "<div class='statLine'>Bosses Defeated: " + bossesDefeated + "</div>";
    html += "<div class='statLine'>Boss Tokens: " + bossTokens + "</div>";
    html += "<div class='statLine'>Boss Shop Upgrades: " + Object.keys(bossShopUpgrades).length + "</div>";
    html += "<div class='statLine'>Hints Used: " + totalHintsUsed + "</div>";
    html += "<div class='statLine'>Levels Skipped: " + levelsSkipped + "</div>";
    html += "<div class='statLine'>Fastest Find: " + (fastestFindTime ?? "-") + " secs</div>";
    html += "<div class='statLine'>Play Time: " + Math.floor(totalPlaySeconds/60) + " mins</div>";
    showModal("Statistics", html);
}

function checkGenerationUnlocks() {
    if (getKantoDexCount() === 151 && !sessionStorage.getItem("johto_msg")) {
        sessionStorage.setItem("johto_msg","1");
        setTimeout(()=>showModal("🎉 Johto Unlocked!","100 new Pokémon are now available."),500);
    }
    if (getJohtoDexCount() === 100 && isJohtoUnlocked() && !sessionStorage.getItem("hoenn_msg")) {
        sessionStorage.setItem("hoenn_msg","1");
        setTimeout(()=>showModal("🎉 Hoenn Unlocked!","135 new Pokémon are now available."),500);
    }
}


function showAchievements() {
    let html = "";

    achievements.forEach(achievement => {
        const unlocked = !!unlockedAchievements[achievement.id];

        html += '<div class="achievement ' + (unlocked ? "unlocked" : "") + '">';
        html += '<strong>' + (unlocked ? "🏆 " : "🔒 ") + achievement.name + '</strong>';
        html += '<br>' + achievement.description;
        const reward = achievementRewards[achievement.id];
        if (reward) {
            const rewardParts = [];
            if (reward.tokens) rewardParts.push("+" + reward.tokens + " Boss Token" + (reward.tokens === 1 ? "" : "s"));
            if (reward.title) {
                const rewardTitle = cosmeticTitles.find(title => title.id === reward.title);
                rewardParts.push("Title: " + (rewardTitle ? rewardTitle.name : "Unlocked Title"));
            }
            html += '<br><span class="shinyDexLine">Reward: ' + rewardParts.join(" + ") + '</span>';
            if (unlocked && claimedAchievementRewards[achievement.id]) {
                html += '<br>Reward Claimed ✓';
            }
        }
        html += '</div>';
    });

    showModal("Achievements", html);
}

function resetSave() {
    const confirmReset = confirm("Reset PokéFind save data? This will reset score, level, Pokédex, and achievements.");

    if (!confirmReset) return;

    localStorage.removeItem(SAVE_KEY);
    level = 1;
    score = 0;
    unlockedDex = {};
    foundCounts = {};
    shinyDex = {};
    shinyFoundCounts = {};
    unlockedAchievements = {};
    totalPlaySeconds = 0;
    legendaryHuntsCompleted = 0;
    highestLevelReached = 1;
    totalPokemonFound = 0;
    totalHintsUsed = 0;
    levelsSkipped = 0;
    fastestFindTime = null;
    bossTokens = 0;
    bossesDefeated = 0;
    bossShopUpgrades = {};
    ownedCosmetics = { themes: ["default"], borders: ["purple"], titles: ["rookie"] };
    selectedCosmetics = { theme: "default", border: "purple", title: "rookie" };
    applyCosmetics();
    saveGame();
    startGame();
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandom(array) {
    return array[randomNumber(0, array.length - 1)];
}


function hasBossUpgrade(id) {
    return !!bossShopUpgrades[id];
}

function getScoreMultiplier() {
    return hasBossUpgrade("master_finder") ? 1.25 : 1;
}

function getBonusItemMultiplier() {
    return hasBossUpgrade("treasure_hunter") ? 1.5 : 1;
}

function getCurrentShinyOdds() {
    if (repeatEncounter) {
        if (bossChestRewards.shinyRadar) return 3;
        return hasBossUpgrade("shiny_charm") ? 4 : 5;
    }

    return hasBossUpgrade("shiny_charm") ? 75 : SHINY_ODDS;
}

function getHintDiscountMultiplier() {
    return hasBossUpgrade("sharp_eyes") ? 0.9 : 1;
}

function buyBossUpgrade(id, cost) {
    if (hasBossUpgrade(id)) {
        message.innerText = "You already own that Boss Shop upgrade.";
        return;
    }

    if (bossTokens < cost) {
        message.innerText = "Not enough Boss Tokens.";
        return;
    }

    bossTokens -= cost;
    bossShopUpgrades[id] = true;
    saveGame();
    showBossShop();
    message.innerText = "Boss Shop upgrade purchased!";
}

function bossShopButtonHtml(id, name, cost, description) {
    const owned = hasBossUpgrade(id);
    const disabled = owned || bossTokens < cost;

    return "<div class='achievement " + (owned ? "unlocked" : "") + "'>" +
        "<strong>" + (owned ? "✅ " : "👑 ") + name + "</strong><br>" +
        description + "<br>" +
        "Cost: " + cost + " Boss Tokens<br>" +
        "<button " + (disabled ? "disabled" : "") + " onclick=\"buyBossUpgrade('" + id + "', " + cost + ")\">" +
        (owned ? "Owned" : "Buy") +
        "</button>" +
        "</div>";
}

function showBossShop() {
    normalizeCosmetics();

    let html = "";
    html += "<div class='statLine'>Boss Tokens: " + bossTokens + "</div>";
    html += "<div class='statLine'>Boss Shop Upgrades: " + Object.keys(bossShopUpgrades).length + "</div>";
    html += "<div class='statLine'>Current Title: " + getSelectedCosmeticTitle().name + "</div>";

    html += "<div class='cosmeticSectionTitle'>Power Upgrades</div>";
    html += bossShopButtonHtml("sharp_eyes", "Sharp Eyes", 3, "Hint costs are reduced by 10%.");
    html += bossShopButtonHtml("treasure_hunter", "Treasure Hunter", 5, "Bonus items are worth 50% more score.");
    html += bossShopButtonHtml("shiny_charm", "Shiny Charm", 10, "Improves shiny odds from 1/100 to 1/75.");
    html += bossShopButtonHtml("master_finder", "Master Finder", 20, "Target finds are worth 25% more score.");

    html += cosmeticSectionHtml("Themes", "themes", cosmeticThemes);
    html += cosmeticSectionHtml("Borders", "borders", cosmeticBorders);
    html += cosmeticSectionHtml("Titles", "titles", cosmeticTitles);

    showModal("Boss Shop", html);
}


function setupInfoMenu() {
    if (document.getElementById("infoMenuBtn")) return;

    const controls = achievementsBtn && achievementsBtn.parentElement;
    if (!controls) return;

    const infoWrapper = document.createElement("span");
    infoWrapper.id = "infoMenuWrapper";
    infoWrapper.style.position = "relative";
    infoWrapper.style.display = "inline-block";

    const infoBtn = document.createElement("button");
    infoBtn.id = "infoMenuBtn";
    infoBtn.innerText = "Info ▾";

    const infoPanel = document.createElement("div");
    infoPanel.id = "infoMenuPanel";
    infoPanel.style.display = "none";
    infoPanel.style.position = "absolute";
    infoPanel.style.left = "50%";
    infoPanel.style.transform = "translateX(-50%)";
    infoPanel.style.bottom = "calc(100% + 8px)";
    infoPanel.style.zIndex = "2000";
    infoPanel.style.padding = "8px";
    infoPanel.style.border = "2px solid #d6a6ff";
    infoPanel.style.borderRadius = "12px";
    infoPanel.style.background = "rgba(25, 14, 38, 0.98)";
    infoPanel.style.boxShadow = "0 0 14px rgba(214, 166, 255, 0.65)";
    infoPanel.style.minWidth = "150px";

    function makeMenuButton(label, action) {
        const button = document.createElement("button");
        button.innerText = label;
        button.style.display = "block";
        button.style.width = "100%";
        button.style.margin = "5px 0";
        button.addEventListener("click", () => {
            infoPanel.style.display = "none";
            infoMenuOpen = false;
            action();
        });
        return button;
    }

    infoPanel.appendChild(makeMenuButton("Pokédex", showPokedex));
    infoPanel.appendChild(makeMenuButton("Achievements", showAchievements));
    infoPanel.appendChild(makeMenuButton("Stats", showStats));
    infoPanel.appendChild(makeMenuButton("Reset Save", resetSave));

    infoBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        infoMenuOpen = !infoMenuOpen;
        infoPanel.style.display = infoMenuOpen ? "block" : "none";
        infoBtn.innerText = infoMenuOpen ? "Info ▴" : "Info ▾";
    });

    document.addEventListener("click", (event) => {
        if (!infoWrapper.contains(event.target)) {
            infoMenuOpen = false;
            infoPanel.style.display = "none";
            infoBtn.innerText = "Info ▾";
        }
    });

    infoWrapper.appendChild(infoBtn);
    infoWrapper.appendChild(infoPanel);

    controls.insertBefore(infoWrapper, pokedexBtn);

    pokedexBtn.style.display = "none";
    achievementsBtn.style.display = "none";
    statsBtn.style.display = "none";
    resetSaveBtn.style.display = "none";
}

function setupBossShopButton() {
    if (document.getElementById("bossShopBtn")) return;

    const bossShopBtn = document.createElement("button");
    bossShopBtn.id = "bossShopBtn";
    bossShopBtn.innerText = "Boss Shop";
    bossShopBtn.addEventListener("click", () => {
        showBossShop();
    });

    const controls = achievementsBtn && achievementsBtn.parentElement;
    if (controls) {
        controls.insertBefore(bossShopBtn, resetSaveBtn);
    }
}



function normalizeCosmetics() {
    if (!ownedCosmetics || typeof ownedCosmetics !== "object") {
        ownedCosmetics = { themes: ["default"], borders: ["purple"], titles: ["rookie"] };
    }

    if (!Array.isArray(ownedCosmetics.themes)) ownedCosmetics.themes = ["default"];
    if (!Array.isArray(ownedCosmetics.borders)) ownedCosmetics.borders = ["purple"];
    if (!Array.isArray(ownedCosmetics.titles)) ownedCosmetics.titles = ["rookie"];

    if (!ownedCosmetics.themes.includes("default")) ownedCosmetics.themes.push("default");
    if (!ownedCosmetics.borders.includes("purple")) ownedCosmetics.borders.push("purple");
    if (!ownedCosmetics.titles.includes("rookie")) ownedCosmetics.titles.push("rookie");

    if (!selectedCosmetics || typeof selectedCosmetics !== "object") {
        selectedCosmetics = { theme: "default", border: "purple", title: "rookie" };
    }

    unlockAchievementCosmetics();

    if (!ownedCosmetics.themes.includes(selectedCosmetics.theme)) selectedCosmetics.theme = "default";
    if (!ownedCosmetics.borders.includes(selectedCosmetics.border)) selectedCosmetics.border = "purple";
    if (!ownedCosmetics.titles.includes(selectedCosmetics.title)) selectedCosmetics.title = "rookie";
}


function unlockTitleReward(titleId) {
    if (!titleId) return;

    if (!ownedCosmetics || typeof ownedCosmetics !== "object") {
        ownedCosmetics = { themes: ["default"], borders: ["purple"], titles: ["rookie"] };
    }

    if (!Array.isArray(ownedCosmetics.titles)) {
        ownedCosmetics.titles = ["rookie"];
    }

    if (!ownedCosmetics.titles.includes(titleId)) {
        ownedCosmetics.titles.push(titleId);
    }
}

function awardAchievementReward(id, silent = false) {
    if (!unlockedAchievements[id] || claimedAchievementRewards[id]) return false;

    const reward = achievementRewards[id];
    if (!reward) return false;

    claimedAchievementRewards[id] = true;

    if (reward.tokens) {
        bossTokens += reward.tokens;
    }

    if (reward.title) {
        unlockTitleReward(reward.title);
    }

    if (!silent) {
        const achievement = achievements.find(item => item.id === id);
        if (achievement) {
            showAchievementPopup(achievement, reward);
        }
    }

    return true;
}

function awardUnlockedAchievementRewards(silent = true) {
    let awarded = 0;

    Object.keys(achievementRewards).forEach(id => {
        if (awardAchievementReward(id, silent)) {
            awarded++;
        }
    });

    if (awarded > 0) {
        unlockAchievementCosmetics();
        saveGame();

        if (!silent) {
            message.innerText = "🏆 Achievement rewards claimed: " + awarded;
        }
    }

    return awarded;
}

function unlockAchievementCosmetics() {
    if (unlockedAchievements.kanto_complete && !ownedCosmetics.titles.includes("kanto_champion")) {
        ownedCosmetics.titles.push("kanto_champion");
    }
    if (unlockedAchievements.johto_complete && !ownedCosmetics.titles.includes("johto_champion")) {
        ownedCosmetics.titles.push("johto_champion");
    }
    if (unlockedAchievements.hoenn_complete && !ownedCosmetics.titles.includes("hoenn_champion")) {
        ownedCosmetics.titles.push("hoenn_champion");
    }
    if (unlockedAchievements.level_25) unlockTitleReward("serious_searcher");
    if (unlockedAchievements.level_50) unlockTitleReward("pokefind_master");
    if (unlockedAchievements.legendary_found) unlockTitleReward("legendary_hunter");
    if (unlockedAchievements.first_shiny) unlockTitleReward("shiny_finder");
    if (unlockedAchievements.shiny_10) unlockTitleReward("sparkle_collector");
    if (unlockedAchievements.no_hint_find) unlockTitleReward("sharp_eyes_title");
    if (unlockedAchievements.dex_50) unlockTitleReward("dex_collector");
    if (unlockedAchievements.first_boss) unlockTitleReward("boss_rookie");
    if (unlockedAchievements.boss_5) unlockTitleReward("boss_hunter");
    if (unlockedAchievements.boss_10) unlockTitleReward("boss_veteran");
    if (unlockedAchievements.boss_25) unlockTitleReward("boss_master");

}

function getSelectedCosmeticTitle() {
    normalizeCosmetics();
    return cosmeticTitles.find(title => title.id === selectedCosmetics.title) || cosmeticTitles[0];
}

function applyCosmetics() {
    normalizeCosmetics();

    document.body.classList.remove(...cosmeticThemes.map(theme => "cosmetic-theme-" + theme.id));
    document.body.classList.remove(...cosmeticBorders.map(border => "cosmetic-border-" + border.id));

    if (selectedCosmetics.theme !== "default") {
        document.body.classList.add("cosmetic-theme-" + selectedCosmetics.theme);
    }

    document.body.classList.add("cosmetic-border-" + selectedCosmetics.border);

    const title = getSelectedCosmeticTitle();
    if (playerTitleDisplay) {
        playerTitleDisplay.innerText = title.icon + " " + title.name;
    }
}

function ownsCosmetic(type, id) {
    normalizeCosmetics();
    return ownedCosmetics[type].includes(id);
}

function buyCosmetic(type, id, cost) {
    normalizeCosmetics();

    if (ownsCosmetic(type, id)) {
        equipCosmetic(type, id);
        return;
    }

    if (bossTokens < cost) {
        message.innerText = "Not enough Boss Tokens.";
        return;
    }

    bossTokens -= cost;
    ownedCosmetics[type].push(id);
    equipCosmetic(type, id);
    message.innerText = "Cosmetic purchased and equipped!";
}

function equipCosmetic(type, id) {
    normalizeCosmetics();

    if (!ownsCosmetic(type, id)) {
        message.innerText = "You do not own that cosmetic yet.";
        return;
    }

    if (type === "themes") selectedCosmetics.theme = id;
    if (type === "borders") selectedCosmetics.border = id;
    if (type === "titles") selectedCosmetics.title = id;

    applyCosmetics();
    saveGame();
    showBossShop();
}

function cosmeticShopItemHtml(type, item) {
    normalizeCosmetics();

    const owned = ownsCosmetic(type, item.id);
    const selected =
        (type === "themes" && selectedCosmetics.theme === item.id) ||
        (type === "borders" && selectedCosmetics.border === item.id) ||
        (type === "titles" && selectedCosmetics.title === item.id);

    const lockedByAchievement = item.achievement && !unlockedAchievements[item.achievement];

    let html = "<div class='achievement " + (owned ? "unlocked" : "") + "'>";
    html += "<strong>" + item.icon + " " + item.name + "</strong><br>";

    if (lockedByAchievement) {
        html += "Unlock through achievement.<br>";
        html += "<button disabled>Locked</button>";
    } else if (selected) {
        html += "<span class='cosmeticEquipped'>Equipped ✓</span>";
    } else if (owned) {
        html += "<button onclick=\"equipCosmetic('" + type + "', '" + item.id + "')\">Equip</button>";
    } else {
        html += "Cost: " + item.cost + " Boss Tokens<br>";
        html += "<button " + (bossTokens < item.cost ? "disabled" : "") + " onclick=\"buyCosmetic('" + type + "', '" + item.id + "', " + item.cost + ")\">Buy</button>";
    }

    html += "</div>";
    return html;
}

function cosmeticSectionHtml(title, type, items) {
    let html = "<div class='cosmeticSectionTitle'>" + title + "</div>";
    items.forEach(item => {
        html += cosmeticShopItemHtml(type, item);
    });
    return html;
}

function getCurrentHintCost() {
    const baseCosts = [50, 150, 300, 750];
    const levelScaling = [2, 3, 4, 5];
    const index = Math.min(hintStage, baseCosts.length - 1);

    return Math.ceil((baseCosts[index] + (level * levelScaling[index])) * getHintDiscountMultiplier());
}

function getCurrentHintName() {
    const names = ["Quadrant Hint", "Shiny Hint", "Camera Hint", "Decoy Removal"];
    return names[Math.min(hintStage, names.length - 1)];
}

function updateHintButton() {
    hintBtn.innerText = getCurrentHintName() + " (-" + getCurrentHintCost() + ")";
}

function clearWorld() {
    world.innerHTML = "";
}

function applyTransform() {
    const scaledWidth = world.clientWidth * scale;
    const scaledHeight = world.clientHeight * scale;

    const minX = gameArea.clientWidth - scaledWidth;
    const minY = gameArea.clientHeight - scaledHeight;

    if (scaledWidth <= gameArea.clientWidth) {
        worldX = (gameArea.clientWidth - scaledWidth) / 2;
    } else {
        if (worldX > 0) worldX = 0;
        if (worldX < minX) worldX = minX;
    }

    if (scaledHeight <= gameArea.clientHeight) {
        worldY = (gameArea.clientHeight - scaledHeight) / 2;
    } else {
        if (worldY > 0) worldY = 0;
        if (worldY < minY) worldY = minY;
    }

    world.style.transformOrigin = "0 0";
    world.style.transform =
        "translate(" + worldX + "px, " + worldY + "px) scale(" + scale + ")";
}

function resetWorldPosition() {
    scale = 0.75;
    worldX = 0;
    worldY = 0;
    applyTransform();
}

function createClusters() {
    clusters = [];

    const numberOfClusters = isSpecialLegendLevel()
        ? Math.min(3 + Math.floor(level / 10), 6)
        : Math.min(4 + Math.floor(level / 3), 10);

    for (let i = 0; i < numberOfClusters; i++) {
        clusters.push({
            x: randomNumber(250, world.clientWidth - 250),
            y: randomNumber(250, world.clientHeight - 250),
            radius: isSpecialLegendLevel() ? randomNumber(150, 280) : randomNumber(95, 190),
            strength: randomNumber(65, 100)
        });
    }

    targetClusterIndex = randomNumber(0, clusters.length - 1);

    drawClusterMarkers();
}

function drawClusterMarkers() {
    clusters.forEach(cluster => {
        const marker = document.createElement("div");
        marker.classList.add("clusterMarker");

        marker.style.left = (cluster.x - cluster.radius) + "px";
        marker.style.top = (cluster.y - cluster.radius) + "px";
        marker.style.width = (cluster.radius * 2) + "px";
        marker.style.height = (cluster.radius * 2) + "px";

        world.appendChild(marker);
    });
}

function placeElement(element, size, isTarget) {
    if (clusters.length === 0) {
        createClusters();
    }

    let cluster;

    if (isTarget) {
        cluster = clusters[targetClusterIndex];
    } else {
        const roll = randomNumber(1, 100);

        if (roll <= 88) {
            cluster = chooseRandom(clusters);
        } else {
            const x = randomNumber(0, world.clientWidth - size);
            const y = randomNumber(30, world.clientHeight - size);

            element.style.left = x + "px";
            element.style.top = y + "px";
            return;
        }
    }

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.sqrt(Math.random()) * cluster.radius;

    let x = cluster.x + Math.cos(angle) * distance;
    let y = cluster.y + Math.sin(angle) * distance;

    x += randomNumber(-18, 18);
    y += randomNumber(-18, 18);

    x = Math.max(0, Math.min(x, world.clientWidth - size));
    y = Math.max(30, Math.min(y, world.clientHeight - size));

    element.style.left = x + "px";
    element.style.top = y + "px";
}

function applyTheme(groupName) {
    world.classList.remove(
        "theme-purple",
        "theme-blue",
        "theme-green",
        "theme-red",
        "theme-yellow",
        "theme-brown",
        "theme-pink",
        "theme-grey",
        "theme-gray",
        "theme-white",
        "theme-black",
        "theme-legendary"
    );

    const safeGroup = groupName || "purple";
    world.classList.add("theme-" + safeGroup);
    world.dataset.boardTheme = safeGroup;

    // Permanent fix: force the play board colour from the Pokémon group.
    // This prevents cosmetic UI themes from leaving the board stuck purple.
    if (BOARD_THEME_BACKGROUNDS[safeGroup]) {
        world.style.background = BOARD_THEME_BACKGROUNDS[safeGroup];
    }
}


function getPokemonByName(name) {
    return getAllGameplayPokemon().find(pokemon => pokemon.name === name);
}

function getBossLineForCurrentLevel() {
    if (!isBossLevel()) return [];

    let sourcePool = kantoBossLines;

    if (isHoennUnlocked()) {
        sourcePool = hoennBossLines;
    } else if (isJohtoUnlocked()) {
        sourcePool = johtoBossLines;
    }

    const availableLines = sourcePool
        .map(line => line.map(name => getPokemonByName(name)).filter(Boolean))
        .filter(line => line.length >= 3);

    if (availableLines.length === 0) return [];

    const bossNumber = Math.floor(level / 25) - 1;
    return availableLines[bossNumber % availableLines.length];
}

function buildBossDecoyPool(targets) {
    const targetNames = targets.map(pokemon => pokemon.name);
    const targetGroups = [...new Set(targets.map(pokemon => pokemon.group))];

    const pool = [];

    targetGroups.forEach(groupName => {
        getEligiblePokemon(groupName, false).forEach(pokemon => {
            if (!targetNames.includes(pokemon.name)) {
                pool.push(pokemon);
            }
        });
    });

    if (pool.length === 0) {
        return getAllGameplayPokemon().filter(pokemon => {
            return !targetNames.includes(pokemon.name) &&
                isGenerationUnlocked(pokemon.generation) &&
                !pokemon.legendary;
        });
    }

    return pool;
}

function getNextBossTargetName() {
    const remaining = Array.from(world.querySelectorAll(".character.target:not(.bossFound)"));

    if (remaining.length === 0) {
        return "";
    }

    return remaining[0].dataset.pokemonName || "";
}

function getBossLineText() {
    return bossTargets.map(pokemon => {
        return bossFoundNames.includes(pokemon.name)
            ? pokemon.name + " ✓"
            : pokemon.name;
    }).join(" | ");
}

function updateBossDisplay() {
    targetTitle.innerText = "Boss: " + getBossLineText();
}

function updateCurrentBossHintTarget() {
    const remaining = Array.from(world.querySelectorAll(".character.target:not(.bossFound)"));

    if (remaining.length === 0) {
        currentTarget = null;
        currentTargetData = null;
        return;
    }

    currentTarget = remaining[0];
    const name = currentTarget.dataset.pokemonName;
    currentTargetData = bossTargets.find(pokemon => pokemon.name === name) || bossTargets[0];
}


function getRepeatEncounterChance() {
    return bossChestRewards.luckyCharm ? 0.15 : 0.10;
}

function showBossChest() {
    const rewards = [];

    if (!bossChestRewards.luckyCharm) rewards.push(["🍀 Lucky Charm","Repeat encounters become 15%", "luckyCharm"]);
    if (!bossChestRewards.eliteScanner) rewards.push(["🔍 Elite Scanner","Magnifying Glass appears after 90s", "eliteScanner"]);
    if (!bossChestRewards.greatBallPlus) rewards.push(["🔴 Great Ball+","Removes 75% of decoys", "greatBallPlus"]);
    if (!bossChestRewards.shinyRadar) rewards.push(["📡 Shiny Radar","Repeat encounters are 1/3 shiny odds", "shinyRadar"]);

    if (rewards.length === 0) {
        const tokens = Math.floor(Math.random() * 5) + 1;
        bossTokens += tokens;
        saveGame();
        message.innerText = "🎁 Boss Chest: +" + tokens + " Boss Tokens!";
        setTimeout(() => startGame(), 1200);
        return;
    }

    let html = "<div class='statLine'>Choose a Boss Reward</div>";

    rewards.forEach(r => {
        html += "<div class='achievement unlocked'>";
        html += "<strong>" + r[0] + "</strong><br>" + r[1] + "<br>";
        html += "<button onclick=\"claimBossChestReward('" + r[2] + "')\">Choose</button>";
        html += "</div>";
    });

    showModal("🎁 Boss Chest", html);
}

function claimBossChestReward(id) {
    bossChestRewards[id] = true;
    closeModal();
    saveGame();
    message.innerText = "🎁 Boss reward unlocked!";
    setTimeout(() => startGame(), 800);
}

function completeBossLevel() {
    gameActive = false;
    clearInterval(timer);

    let bossBonus = 2000 + (bossTargets.length * 250);
    bossBonus = Math.round(bossBonus * getScoreMultiplier());
    score += bossBonus;
    bossTokens++;
    bossesDefeated++;
    checkAchievements();
    scoreDisplay.innerText = "Score: " + score;
    message.innerText = "👑 Boss defeated! +" + bossBonus + " points | +1 Boss Token";

    setTimeout(() => {
        level++;
        if (level > highestLevelReached) highestLevelReached = level;
        saveGame();
        showBossChest();
    }, 1400);
}

function startBossLevel() {
    bossTargets = getBossLineForCurrentLevel();
    bossFoundCount = 0;
    bossFoundNames = [];

    if (bossTargets.length === 0) return false;

    currentGroup = buildBossDecoyPool(bossTargets);
    currentGroupName = "legendary";
    applyTheme("legendary");

    updateBossDisplay();

    bossTargets.forEach(pokemon => {
        createPokemon(pokemon, true);
    });

    updateCurrentBossHintTarget();

    const numberOfDecoys = Math.floor(getDecoyCount() * 1.15);
    for (let i = 0; i < numberOfDecoys; i++) {
        createDecoy();
    }

    bonusItems.forEach(item => {
        createBonusItem(item);
    });

    message.innerText = "👑 BOSS LEVEL! " + getBossLineText();
    startTimer();

    return true;
}


function chooseTargetPokemon() {
    let groupName;
    let pool;

    if (isSpecialLegendLevel()) {
        const specials = getEligibleLegendaries();

        if (specials.length > 0) {
            const special = specials[Math.floor((level / 5 - 1) % specials.length)];
            currentGroup = specials;
            currentGroupName = "legendary";
            applyTheme("legendary");
            return special;
        }
    }

    const unlockedColours = colourGroups.filter(colour => getEligiblePokemon(colour, false).length > 0);
    groupName = unlockedColours[(level - 1) % unlockedColours.length];
    pool = getEligiblePokemon(groupName, false);

    currentGroup = pool;
    currentGroupName = groupName;
    applyTheme(groupName);

    const unseenPokemon = currentGroup.filter(pokemon => !isPokemonUnlocked(pokemon));
    const seenPokemon = currentGroup.filter(pokemon => isPokemonUnlocked(pokemon));

    if (unseenPokemon.length > 0) {
        if (Math.random() < (1 - getRepeatEncounterChance()) || seenPokemon.length === 0) {
            return chooseRandom(unseenPokemon);
        }

        return chooseRandom(seenPokemon);
    }

    return chooseRandom(currentGroup);
}

function chooseRandomDecoy(targetName) {
    const possibleDecoys = currentGroup.filter(pokemon => pokemon.name !== targetName);

    if (possibleDecoys.length === 0) {
        const backupPool = getAllGameplayPokemon().filter(pokemon => {
            return pokemon.name !== targetName && isGenerationUnlocked(pokemon.generation) && !pokemon.legendary;
        });

        return chooseRandom(backupPool);
    }

    return chooseRandom(possibleDecoys);
}

function createPokemon(pokemonData, isTarget) {
    const pokemon = document.createElement("div");
    pokemon.classList.add("character");
    pokemon.dataset.pokemonName = pokemonData.name;

    const isShinyEncounter = !!pokemonData.shiny && randomNumber(1, getCurrentShinyOdds()) === 1;
    const displaySprite = isShinyEncounter ? pokemonData.shiny : pokemonData.normal;

    if (isShinyEncounter) {
        pokemon.classList.add("shinyEncounter");
    }

    const maxSize = level < 8 ? 70 : level < 16 ? 62 : 56;
    const minSize = level < 8 ? 46 : level < 16 ? 40 : 34;

    const size = randomNumber(minSize, maxSize);
    pokemon.style.width = size + "px";
    pokemon.style.height = size + "px";

    const img = document.createElement("img");
    img.src = displaySprite;
    img.alt = pokemonData.name;

    pokemon.appendChild(img);

    pokemon.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!gameActive || isDragging) return;

        if (isTarget) {
            if (isBossLevel() && bossTargets.length > 0) {
                if (pokemon.classList.contains("bossFound")) return;

                pokemon.classList.add("bossFound");
                pokemon.style.opacity = "0.35";
                pokemon.style.pointerEvents = "none";

                bossFoundCount++;

                if (!bossFoundNames.includes(pokemonData.name)) {
                    bossFoundNames.push(pokemonData.name);
                }

                let bossTargetPoints = 500;
                if (isShinyEncounter) {
                    bossTargetPoints += 500;
                }

                bossTargetPoints = Math.round(bossTargetPoints * getScoreMultiplier());
                score += bossTargetPoints;
                scoreDisplay.innerText = "Score: " + score;

                unlockPokemon(pokemonData, isShinyEncounter);
                totalPokemonFound++;
                if (fastestFindTime === null || seconds < fastestFindTime) fastestFindTime = seconds;
                if (level > highestLevelReached) highestLevelReached = level;

                updateBossDisplay();

                if (bossFoundCount >= bossTargets.length) {
                    completeBossLevel();
                } else {
                    updateCurrentBossHintTarget();
                    message.innerText = "Boss target found! " + (bossTargets.length - bossFoundCount) + " remaining.";
                }

                return;
            }

            gameActive = false;
            clearInterval(timer);

            let pointsEarned = isSpecialLegendLevel() ? Math.max(650 - seconds, 300) : Math.max(150 - seconds, 20);

            if (isShinyEncounter) {
                pointsEarned += 500;
            }

            pointsEarned = Math.round(pointsEarned * getScoreMultiplier());
            score += pointsEarned;

            const foundPrefix = isSpecialLegendLevel() ? "Legendary found! " : "You found ";
            const shinyPrefix = isShinyEncounter ? "✨ Shiny " : "";
            message.innerText = foundPrefix + shinyPrefix + pokemonData.name + "! +" + pointsEarned + " points";
            scoreDisplay.innerText = "Score: " + score;

            unlockPokemon(pokemonData, isShinyEncounter);
            totalPokemonFound++;
            if (fastestFindTime === null || seconds < fastestFindTime) fastestFindTime = seconds;
            if (level > highestLevelReached) highestLevelReached = level;

            if (hintStage === 0) {
                unlockAchievement("no_hint_find");
            }

            if (pokemonData.legendary) {
                unlockAchievement("legendary_found");
                legendaryHuntsCompleted++;
            }

            checkAchievements();

            setTimeout(() => {
                level++;
                if (level > highestLevelReached) highestLevelReached = level;
                saveGame();
                startGame();
            }, 1300);
        } else {
            message.innerText = "Wrong Pokémon! Find " + currentTargetData.name + ".";
        }
    });

    placeElement(pokemon, size, isTarget);
    world.appendChild(pokemon);

    if (isTarget) {
        pokemon.classList.add("target");
        currentTarget = pokemon;
    }
}

function createTarget() {
    currentTargetData = chooseTargetPokemon();
    repeatEncounter = isPokemonUnlocked(currentTargetData);

    targetTitle.innerText = "Find: " + currentTargetData.name;

    createPokemon(currentTargetData, true);
}

function createDecoy() {
    const decoyData = chooseRandomDecoy(currentTargetData.name);
    createPokemon(decoyData, false);
}

function getDecoyRemovalAmount() {
    if (level < 20) return 10;
    if (level < 50) return 15;
    return 20;
}

function removeRandomDecoys() {
    const decoys = Array.from(world.querySelectorAll(".character:not(.target)"));

    if (decoys.length === 0) {
        message.innerText = "No decoys left to remove.";
        return;
    }

    const amount = Math.min(getDecoyRemovalAmount(), decoys.length);

    for (let i = decoys.length - 1; i > 0; i--) {
        const j = randomNumber(0, i);
        const temp = decoys[i];
        decoys[i] = decoys[j];
        decoys[j] = temp;
    }

    decoys.slice(0, amount).forEach(decoy => {
        decoy.remove();
    });

    message.innerText = "Decoy Removal: " + amount + " nearby distractions vanished.";
}



function bringItemToFront(element) {
    element.style.zIndex = "999";
}

function enlargeCurrentTarget() {
    if (!currentTarget) {
        message.innerText = "Magnifying Glass had no target to enlarge.";
        return;
    }

    const currentWidth = currentTarget.offsetWidth || 50;
    const currentHeight = currentTarget.offsetHeight || 50;

    currentTarget.style.width = Math.round(currentWidth * 1.5) + "px";
    currentTarget.style.height = Math.round(currentHeight * 1.5) + "px";
    currentTarget.style.zIndex = "500";

    message.innerText = "🔍 Magnifying Glass: target enlarged by 50%.";
}

function removePercentDecoys(percent) {
    const decoys = Array.from(world.querySelectorAll(".character:not(.target)"));

    if (decoys.length === 0) {
        message.innerText = "Pokéball found, but there were no decoys left.";
        return;
    }

    const amount = Math.max(1, Math.floor(decoys.length * percent));

    for (let i = decoys.length - 1; i > 0; i--) {
        const j = randomNumber(0, i);
        const temp = decoys[i];
        decoys[i] = decoys[j];
        decoys[j] = temp;
    }

    decoys.slice(0, amount).forEach(decoy => decoy.remove());

    message.innerText = "🔴 Great Ball: removed " + amount + " decoys.";
}

function createUtilityItem(symbol, name, onCollect) {
    const item = document.createElement("div");
    item.classList.add("bonus");
    item.innerText = symbol;
    item.title = name;

    item.style.fontSize = "102px";
    item.style.width = "114px";
    item.style.height = "114px";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";
    bringItemToFront(item);

    item.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!gameActive || isDragging) return;

        onCollect();
        item.remove();
    });

    placeElement(item, 114, false);
    bringItemToFront(item);
    world.appendChild(item);
}

function spawnMagnifyingGlassItem() {
    createUtilityItem("🔍", "Magnifying Glass", enlargeCurrentTarget);
    message.innerText = "🔍 A Magnifying Glass appeared in the crowd!";
}

function spawnPokeballItem() {
    const item = document.createElement("div");
    item.classList.add("bonus");
    item.innerText = "🔴";
    item.title = "Great Ball";

    item.style.fontSize = "300px";
    item.style.width = "342px";
    item.style.height = "342px";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";
    item.style.zIndex = "999";

    item.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!gameActive || isDragging) return;
        removePercentDecoys(bossChestRewards.greatBallPlus ? 0.75 : 0.50);
        item.remove();
    });

    placeElement(item, 342, false);
    world.appendChild(item);

    message.innerText = "🔴 A Giant Great Ball appeared! Removes 50% of decoys.";
}


function createBonusItem(item) {
    const bonus = document.createElement("div");
    bonus.classList.add("bonus");
    bonus.innerText = item.symbol;
    bringItemToFront(bonus);
    bonus.title = item.name;

    bonus.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!gameActive || isDragging) return;

        const bonusPoints = Math.round(item.points * getBonusItemMultiplier());
        score += bonusPoints;
        scoreDisplay.innerText = "Score: " + score;
        message.innerText = item.name + " found! +" + bonusPoints;

        checkAchievements();
        saveGame();

        bonus.remove();
    });

    placeElement(bonus, 30, false);
    bringItemToFront(bonus);
    world.appendChild(bonus);
}

function startTimer() {
    clearInterval(timer);

    seconds = 0;
    timerDisplay.innerText = "Time: 0";

    timer = setInterval(() => {
        seconds++;
        totalPlaySeconds++;
        timerDisplay.innerText = "Time: " + seconds;

        if (seconds >= (bossChestRewards.eliteScanner ? 90 : 120) && !magnifyingGlassSpawned) {
            magnifyingGlassSpawned = true;
            spawnMagnifyingGlassItem();
        }

        if (seconds >= 300 && !pokeballSpawned) {
            pokeballSpawned = true;
            spawnPokeballItem();
        }
    }, 1000);
}

function getDecoyCount() {
    if (isSpecialLegendLevel()) {
        return Math.min(28 + Math.floor(level * 6), 550);
    }

    if (level <= 50) {
        return 35 + (level * 16);
    }

    return Math.min(
        35 + (50 * 16) + Math.floor((level - 50) * 8),
        1200
    );
}

function startGame() {
    gameActive = true;
    currentTarget = null;
    currentTargetData = null;
    repeatEncounter = false;
    currentGroup = [];
    clusters = [];
    hintUsesThisLevel = 0;
    hintStage = 0;
    magnifyingGlassSpawned = false;
    pokeballSpawned = false;
    bossTargets = [];
    bossFoundCount = 0;
    bossFoundNames = [];

    clearWorld();
    resetWorldPosition();
    createClusters();

    levelDisplay.innerText = "Level: " + level;
    scoreDisplay.innerText = "Score: " + score;
    updateHintButton();

    if (isBossLevel() && startBossLevel()) {
        return;
    }

    createTarget();

    if (isSpecialLegendLevel()) {
        let legendStatus = "Kanto Legendary Hunt!";
        if (isHoennUnlocked()) legendStatus = "Hoenn Legendary Hunt!";
        else if (isJohtoUnlocked()) legendStatus = "Johto Legendary Hunt!";

        message.innerText = legendStatus + " Find " + currentTargetData.name + " for a huge reward!";
    } else if (repeatEncounter) {
        message.innerText = "⭐ Repeat! Shiny odds: 1/" + getCurrentShinyOdds();
    } else {
        message.innerText = "Search the crowded areas. Find " + currentTargetData.name + "!";
    }

    const numberOfDecoys = getDecoyCount();

    for (let i = 0; i < numberOfDecoys; i++) {
        createDecoy();
    }

    bonusItems.forEach(item => {
        createBonusItem(item);
    });

    startTimer();
}

function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

gameArea.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) {
        isDragging = false;

        startTouchX = event.touches[0].clientX;
        startTouchY = event.touches[0].clientY;
        startWorldX = worldX;
        startWorldY = worldY;
    }

    if (event.touches.length === 2) {
        isDragging = true;
        startDistance = getTouchDistance(event.touches);
        startScale = scale;
    }
});

gameArea.addEventListener("touchmove", (event) => {
    event.preventDefault();

    if (event.touches.length === 1) {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;

        const diffX = currentX - startTouchX;
        const diffY = currentY - startTouchY;

        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            isDragging = true;
        }

        worldX = startWorldX + diffX;
        worldY = startWorldY + diffY;

        applyTransform();
    }

    if (event.touches.length === 2) {
        const newDistance = getTouchDistance(event.touches);
        const zoomAmount = newDistance / startDistance;

        scale = startScale * zoomAmount;

        if (scale < minScale) scale = minScale;
        if (scale > maxScale) scale = maxScale;

        applyTransform();
    }
}, { passive: false });

gameArea.addEventListener("touchend", () => {
    setTimeout(() => {
        isDragging = false;
    }, 80);
});

hintBtn.addEventListener("click", () => {
    if (!gameActive || !currentTarget || !currentTargetData) return;

    const cost = getCurrentHintCost();

    if (score < cost) {
        message.innerText = "Not enough points! " + getCurrentHintName() + " costs " + cost + ".";
        return;
    }

    score -= cost;
    scoreDisplay.innerText = "Score: " + score;

    const targetX = currentTarget.offsetLeft + currentTarget.offsetWidth / 2;
    const targetY = currentTarget.offsetTop + currentTarget.offsetHeight / 2;

    if (hintStage === 0) {
        const horizontal = targetX < world.clientWidth / 2 ? "West" : "East";
        const vertical = targetY < world.clientHeight / 2 ? "North" : "South";
        message.innerText = "Quadrant Hint: Search the " + vertical + "-" + horizontal + " area.";
    } else if (hintStage === 1) {
        const img = currentTarget.querySelector("img");
        const originalSprite = img ? img.src : "";

        if (currentTargetData.shiny) {
            img.src = currentTargetData.shiny;
        }

        message.innerText = currentTargetData.name + " became shiny for 3 seconds.";

        setTimeout(() => {
            if (img && currentTargetData) {
                img.src = originalSprite || currentTargetData.normal;
            }
        }, 3000);
    } else if (hintStage === 2) {
        scale = Math.max(scale, 0.9);

        const randomOffsetX = randomNumber(-220, 220);
        const randomOffsetY = randomNumber(-220, 220);

        worldX = -(targetX * scale) + (gameArea.clientWidth / 2) + randomOffsetX;
        worldY = -(targetY * scale) + (gameArea.clientHeight / 2) + randomOffsetY;

        applyTransform();

        message.innerText = "Camera moved near the target area.";
    } else {
        removeRandomDecoys();
    }

    hintStage++;
    hintUsesThisLevel++;
    totalHintsUsed++;
    updateHintButton();
});

restartBtn.style.display = "";
restartBtn.innerText = "Skip Level (-2500)";

restartBtn.addEventListener("click", () => {
    if (!gameActive) return;

    if (isSpecialLegendLevel() || isBossLevel()) {
        message.innerText = isBossLevel() ? "You cannot skip Boss Levels." : "You cannot skip Legendary Hunts.";
        return;
    }

    if (score < SKIP_LEVEL_COST) {
        message.innerText = "You need " + SKIP_LEVEL_COST + " points to skip a level.";
        return;
    }

    clearInterval(timer);

    score -= SKIP_LEVEL_COST;
    scoreDisplay.innerText = "Score: " + score;

    levelsSkipped++;
    level++;
    if (level > highestLevelReached) highestLevelReached = level;
    saveGame();

    message.innerText = "Level skipped for " + SKIP_LEVEL_COST + " points.";
    setTimeout(() => startGame(), 300);
});

pokedexBtn.addEventListener("click", () => {
    showPokedex();
});

achievementsBtn.addEventListener("click", () => { showAchievements(); });
statsBtn.addEventListener("click", () => { showStats(); });

resetSaveBtn.addEventListener("click", () => {
    resetSave();
});

closeModalBtn.addEventListener("click", () => {
    closeModal();
});

modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

window.buyBossUpgrade = buyBossUpgrade;
window.buyCosmetic = buyCosmetic;
window.equipCosmetic = equipCosmetic;

async function initGame() {
    try {
        setupInfoMenu();
        setupBossShopButton();
        await loadPokemonManifest();
        loadGameSave();
        checkAchievements();
        const retroRewards = awardUnlockedAchievementRewards(true);
        applyCosmetics();
        startGame();
        if (retroRewards > 0) {
            setTimeout(() => showRetroRewardPopup(retroRewards), 600);
        }
    } catch (error) {
        console.error(error);
        message.innerText = "Could not load Pokémon data. Check pokemon-manifest.json is beside app.js.";
    }
}

initGame();
