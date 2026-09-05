const PLANTS = [
  { id: "tomato", name: "Tomato", category: "Vegetables", icon: "T", color: "#d95d48", water: "a deep drink", waterEvery: 3, days: 75, sun: "6–8 hours of sun", tip: "Water at the soil, not over the leaves. Tie new growth loosely as it gets taller.", companions: "Basil and marigold are useful nearby." },
  { id: "lettuce", name: "Lettuce", category: "Vegetables", icon: "L", color: "#72a95b", water: "an extra soak", waterEvery: 2, days: 45, sun: "morning sun and afternoon shade", tip: "Keep the soil gently moist. Harvest outer leaves first so the plant keeps producing.", companions: "Carrots are a helpful neighbor; give dill some space." },
  { id: "carrot", name: "Carrot", category: "Vegetables", icon: "C", color: "#e88642", water: "a light drink", waterEvery: 4, days: 70, sun: "6+ hours of sun", tip: "Thin crowded seedlings and keep the top inch of soil from drying out.", companions: "Carrots and lettuce can share space; avoid planting beside dill." },
  { id: "cucumber", name: "Cucumber", category: "Vegetables", icon: "C", color: "#4f9b58", water: "a deep drink", waterEvery: 2, days: 60, sun: "6–8 hours of sun", tip: "Give vines support and water consistently at the soil to avoid bitter fruit.", companions: "Beans and dill are useful nearby." },
  { id: "bell-pepper", name: "Bell pepper", category: "Vegetables", icon: "P", color: "#d66a48", water: "a steady drink", waterEvery: 3, days: 80, sun: "6–8 hours of sun", tip: "Keep moisture consistent while fruit is forming and protect it from cold nights.", companions: "Basil and marigold are good nearby." },
  { id: "chili-pepper", name: "Chili pepper", category: "Vegetables", icon: "C", color: "#bf4d3f", water: "a steady drink", waterEvery: 3, days: 85, sun: "6–8 hours of sun", tip: "Let the surface dry slightly between watering and give it plenty of warmth.", companions: "Basil and oregano are useful nearby." },
  { id: "green-bean", name: "Green bean", category: "Vegetables", icon: "B", color: "#6c9b4a", water: "a moderate drink", waterEvery: 3, days: 55, sun: "6+ hours of sun", tip: "Pick pods often to keep new beans coming. Support climbing varieties.", companions: "Carrots and marigolds are friendly neighbors." },
  { id: "pea", name: "Pea", category: "Vegetables", icon: "P", color: "#7aa94d", water: "a moderate drink", waterEvery: 3, days: 60, sun: "6 hours of sun", tip: "Give vines a trellis early and keep the soil evenly moist while pods fill.", companions: "Radishes and carrots work well nearby." },
  { id: "zucchini", name: "Zucchini", category: "Vegetables", icon: "Z", color: "#5c8e48", water: "a deep drink", waterEvery: 2, days: 50, sun: "6–8 hours of sun", tip: "Water at the base and check under large leaves for hiding fruit.", companions: "Nasturtiums can help attract pollinators nearby." },
  { id: "spinach", name: "Spinach", category: "Vegetables", icon: "S", color: "#4c8b64", water: "an extra soak", waterEvery: 2, days: 42, sun: "morning sun and afternoon shade", tip: "Spinach likes cool, evenly moist soil. Pick the outside leaves first.", companions: "Plant near lettuce for similar watering needs." },
  { id: "kale", name: "Kale", category: "Vegetables", icon: "K", color: "#3f7b55", water: "a steady drink", waterEvery: 3, days: 60, sun: "6 hours of sun", tip: "Harvest lower leaves first and check the undersides for caterpillars.", companions: "Dill and marigolds can attract helpful insects." },
  { id: "broccoli", name: "Broccoli", category: "Vegetables", icon: "B", color: "#5e8b55", water: "a deep drink", waterEvery: 3, days: 70, sun: "6 hours of sun", tip: "Keep roots cool and moist. Harvest the central head before yellow flowers open.", companions: "Celery and dill are useful nearby." },
  { id: "cabbage", name: "Cabbage", category: "Vegetables", icon: "C", color: "#779b69", water: "a steady drink", waterEvery: 3, days: 75, sun: "6 hours of sun", tip: "Water at the soil and check tight leaf folds for caterpillars.", companions: "Thyme and rosemary can help nearby." },
  { id: "beet", name: "Beet", category: "Vegetables", icon: "B", color: "#914a61", water: "a moderate drink", waterEvery: 4, days: 60, sun: "6+ hours of sun", tip: "Thin seedlings so roots can swell and eat the leafy tops too.", companions: "Lettuce and onions are good neighbors." },
  { id: "radish", name: "Radish", category: "Vegetables", icon: "R", color: "#d76b67", water: "a light drink", waterEvery: 3, days: 28, sun: "4–6 hours of sun", tip: "Harvest promptly when shoulders show; hot, dry soil makes radishes sharp.", companions: "Peas and lettuce are useful nearby." },
  { id: "onion", name: "Onion", category: "Vegetables", icon: "O", color: "#b98568", water: "a light drink", waterEvery: 5, days: 100, sun: "6+ hours of sun", tip: "Keep shallow roots evenly moist while bulbs swell, then let them dry before harvest.", companions: "Carrots and beets are good neighbors." },
  { id: "garlic", name: "Garlic", category: "Vegetables", icon: "G", color: "#bca486", water: "a light drink", waterEvery: 7, days: 240, sun: "6+ hours of sun", tip: "Water while growing, then stop as leaves yellow and bulbs approach harvest.", companions: "Garlic is a helpful neighbor for many vegetables." },
  { id: "potato", name: "Potato", category: "Vegetables", icon: "P", color: "#a77b50", water: "a deep drink", waterEvery: 4, days: 90, sun: "6+ hours of sun", tip: "Keep tubers covered and soil evenly moist, especially when flowering.", companions: "Avoid planting beside tomatoes." },
  { id: "sweet-potato", name: "Sweet potato", category: "Vegetables", icon: "S", color: "#b46e4d", water: "a deep drink", waterEvery: 4, days: 100, sun: "6–8 hours of sun", tip: "Give vines warmth and room to spread. Let soil dry slightly between drinks.", companions: "Beans and herbs can share nearby space." },
  { id: "corn", name: "Sweet corn", category: "Vegetables", icon: "C", color: "#d6ae45", water: "a deep drink", waterEvery: 2, days: 80, sun: "8+ hours of sun", tip: "Water deeply when tassels and ears form. Plant in a block for pollination.", companions: "Beans and squash are traditional neighbors." },
  { id: "eggplant", name: "Eggplant", category: "Vegetables", icon: "E", color: "#765a83", water: "a steady drink", waterEvery: 3, days: 80, sun: "6–8 hours of sun", tip: "Keep it warm, stake heavy branches, and harvest fruit while glossy.", companions: "Basil and marigold are useful nearby." },
  { id: "swiss-chard", name: "Swiss chard", category: "Vegetables", icon: "C", color: "#c65d68", water: "a steady drink", waterEvery: 3, days: 55, sun: "morning sun and afternoon shade", tip: "Harvest outer stems and keep soil moist for a steady supply of leaves.", companions: "Beets and onions are helpful neighbors." },
  { id: "basil", name: "Basil", category: "Herbs", icon: "B", color: "#367651", water: "a drink at the roots", waterEvery: 3, days: 55, sun: "6–8 hours of sun", tip: "Pinch just above a pair of leaves to make your basil bushier.", companions: "Basil is a helpful companion for tomatoes." },
  { id: "dill", name: "Dill", category: "Herbs", icon: "D", color: "#829c48", water: "a light drink", waterEvery: 4, days: 60, sun: "6 hours of sun", tip: "Let the soil dry slightly between drinks. Stake it if your spot is windy.", companions: "Give dill and carrots a little distance." },
  { id: "rosemary", name: "Rosemary", category: "Herbs", icon: "R", color: "#627d68", water: "no extra water", waterEvery: 7, days: 90, sun: "6–8 hours of sun", tip: "Let the soil dry well before watering again. Good airflow keeps it happy.", companions: "Rosemary prefers not to be beside thirsty greens." },
  { id: "mint", name: "Mint", category: "Herbs", icon: "M", color: "#62a178", water: "a steady drink", waterEvery: 3, days: 60, sun: "morning sun or partial shade", tip: "Keep mint in a container if you want to control its spreading roots.", companions: "Mint is best kept in its own pot." },
  { id: "parsley", name: "Parsley", category: "Herbs", icon: "P", color: "#4d8b54", water: "a moderate drink", waterEvery: 3, days: 70, sun: "morning sun and afternoon shade", tip: "Harvest outer stems first and keep the root zone from drying out.", companions: "Asparagus and tomatoes are useful nearby." },
  { id: "cilantro", name: "Cilantro", category: "Herbs", icon: "C", color: "#729b55", water: "a moderate drink", waterEvery: 3, days: 45, sun: "morning sun and afternoon shade", tip: "Sow small batches often because cilantro bolts quickly in heat.", companions: "Spinach and lettuce provide helpful shade." },
  { id: "thyme", name: "Thyme", category: "Herbs", icon: "T", color: "#7f8c59", water: "a light drink", waterEvery: 7, days: 90, sun: "6–8 hours of sun", tip: "Let the soil dry well and trim lightly to encourage fresh growth.", companions: "Thyme is a good edge plant for vegetables." },
  { id: "oregano", name: "Oregano", category: "Herbs", icon: "O", color: "#6d8451", water: "a light drink", waterEvery: 7, days: 90, sun: "6–8 hours of sun", tip: "Harvest sprigs before flowering and let soil dry between watering.", companions: "Oregano is useful near peppers and tomatoes." },
  { id: "sage", name: "Sage", category: "Herbs", icon: "S", color: "#82917d", water: "a light drink", waterEvery: 7, days: 90, sun: "6–8 hours of sun", tip: "Give sage excellent drainage and avoid keeping its leaves wet.", companions: "Sage prefers dry-soil neighbors." },
  { id: "chives", name: "Chives", category: "Herbs", icon: "C", color: "#769a65", water: "a moderate drink", waterEvery: 4, days: 60, sun: "6+ hours of sun", tip: "Cut leaves back to the soil after flowering for fresh new growth.", companions: "Chives are useful near carrots and tomatoes." },
  { id: "lavender", name: "Lavender", category: "Herbs", icon: "L", color: "#8b75a8", water: "a light drink", waterEvery: 7, days: 120, sun: "6–8 hours of sun", tip: "Prioritize drainage and airflow. Trim after flowering without cutting old wood.", companions: "Lavender attracts pollinators around the garden." },
  { id: "marigold", name: "Marigold", category: "Flowers", icon: "M", color: "#e9a83e", water: "a light drink", waterEvery: 4, days: 50, sun: "6+ hours of sun", tip: "Remove faded flowers to keep new blooms coming.", companions: "Marigolds are a cheerful neighbor for tomatoes." },
  { id: "sunflower", name: "Sunflower", category: "Flowers", icon: "S", color: "#e6b447", water: "a deep drink", waterEvery: 3, days: 80, sun: "8+ hours of sun", tip: "Give tall varieties support and water deeply while stems are growing.", companions: "Sunflowers attract pollinators and birds." },
  { id: "zinnia", name: "Zinnia", category: "Flowers", icon: "Z", color: "#d7657c", water: "a moderate drink", waterEvery: 4, days: 70, sun: "6–8 hours of sun", tip: "Deadhead regularly and water at the soil to keep blooms healthy.", companions: "Zinnias are excellent pollinator plants." },
  { id: "nasturtium", name: "Nasturtium", category: "Flowers", icon: "N", color: "#e27b43", water: "a light drink", waterEvery: 5, days: 55, sun: "4–6 hours of sun", tip: "Lean soil encourages flowers. Use leaves and flowers as an edible garnish.", companions: "Nasturtiums can draw pests away from vegetables." },
  { id: "cosmos", name: "Cosmos", category: "Flowers", icon: "C", color: "#d47ca0", water: "a light drink", waterEvery: 5, days: 75, sun: "6+ hours of sun", tip: "Do not overfeed or overwater. Cut flowers often to keep blooms coming.", companions: "Cosmos attract bees and hoverflies." },
  { id: "calendula", name: "Calendula", category: "Flowers", icon: "C", color: "#e49a46", water: "a moderate drink", waterEvery: 4, days: 60, sun: "4–6 hours of sun", tip: "Remove fading blooms and collect petals for a bright edible garnish.", companions: "Calendula attracts helpful insects." },
  { id: "pansy", name: "Pansy", category: "Flowers", icon: "P", color: "#73669c", water: "a steady drink", waterEvery: 3, days: 60, sun: "morning sun and afternoon shade", tip: "Keep cool roots moist and remove tired flowers regularly.", companions: "Pansies work well around leafy greens." },
  { id: "petunia", name: "Petunia", category: "Flowers", icon: "P", color: "#a469a0", water: "a steady drink", waterEvery: 3, days: 70, sun: "6+ hours of sun", tip: "Containers dry quickly. Feed lightly and remove faded blooms.", companions: "Petunias attract pollinators to containers." },
  { id: "monstera", name: "Monstera", category: "Houseplants", icon: "M", color: "#4c8d62", water: "a moderate drink", waterEvery: 10, days: 180, sun: "bright, indirect light", tip: "Let the top few centimeters of soil dry before watering and give it a support pole.", companions: "Keep leaves away from cold drafts and strong midday sun." },
  { id: "pothos", name: "Pothos", category: "Houseplants", icon: "P", color: "#7b9a55", water: "a moderate drink", waterEvery: 10, days: 180, sun: "bright, indirect light", tip: "Let the soil dry partly between watering. Trim vines above a leaf node to shape it.", companions: "Pothos tolerates a wide range of indoor spots." },
  { id: "snake-plant", name: "Snake plant", category: "Houseplants", icon: "S", color: "#557c58", water: "a light drink", waterEvery: 21, days: 240, sun: "low to bright indirect light", tip: "Underwatering is safer than overwatering. Let the pot dry almost completely.", companions: "Use a fast-draining soil mix." },
  { id: "spider-plant", name: "Spider plant", category: "Houseplants", icon: "S", color: "#70945c", water: "a moderate drink", waterEvery: 10, days: 180, sun: "bright, indirect light", tip: "Water when the top layer is dry and rotate the pot for even growth.", companions: "Spider plants are forgiving and beginner-friendly." },
  { id: "peace-lily", name: "Peace lily", category: "Houseplants", icon: "P", color: "#628b71", water: "a steady drink", waterEvery: 7, days: 180, sun: "medium to bright indirect light", tip: "A slight droop is a sign to check the soil. Keep it away from harsh direct sun.", companions: "Keep soil moist but never waterlogged." },
  { id: "aloe", name: "Aloe vera", category: "Houseplants", icon: "A", color: "#65956c", water: "a light drink", waterEvery: 21, days: 240, sun: "bright light", tip: "Let the pot dry completely between watering and use a drainage hole.", companions: "Aloe prefers dry-soil companions." },
  { id: "jade", name: "Jade plant", category: "Houseplants", icon: "J", color: "#4f8c67", water: "a light drink", waterEvery: 21, days: 240, sun: "bright light", tip: "Water deeply only after the soil dries. Avoid leaving the pot in standing water.", companions: "Give jade strong light and good airflow." },
];

const DEFAULT = {
  version: 6,
  plants: [],
  customPlants: [],
  planted: "today",
  plantedAt: {},
  plantMeta: {},
  tasks: [],
  logs: [],
  location: null,
  locationResults: [],
  locationSearchStatus: "",
  locationQuery: "",
  weather: null,
  weatherStatus: "",
  theme: "system",
  screen: "home",
  catalogMode: "plants",
  selectedPlant: null,
  diagnosisPlant: null,
  helpMode: "",
};

let state = load();
const app = document.querySelector("#app");
let isOffline = typeof navigator !== "undefined" && !navigator.onLine;
const isPackagedAndroid = window.location.hostname === "appassets.androidplatform.net";
const isTauri = Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);
let databaseStatus = "connecting";
let databaseSyncTimer;
let locationSearchController;
let locationSearchRequest = 0;
let currentLocationRequest = 0;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
window.addEventListener("online", () => { isOffline = false; queueDatabaseSync(); render(); toast("You’re back online."); });
window.addEventListener("offline", () => { isOffline = true; render(); });
colorScheme.addEventListener?.("change", () => { if (state.theme === "system") render(); });

function load() {
  const stored = localStorage.getItem("homeyield-garden");
  if (!stored) return { ...DEFAULT };
  try {
    return normalizeState(JSON.parse(stored));
  } catch (error) {
    console.warn("HomeYield reset unreadable local garden data.", error);
    localStorage.removeItem("homeyield-garden");
    return { ...DEFAULT };
  }
}

function normalizeState(saved) {
  if (!saved || typeof saved !== "object" || !Array.isArray(saved.plants)) throw new Error("Unexpected data shape");
  const needsTaskMigration = saved.version < 2;
  const cachedWeather = saved.weather && Array.isArray(saved.weather.forecast) ? saved.weather : null;
  const migrated = { ...DEFAULT, ...saved, version: 6, theme: ["system", "light", "dark"].includes(saved.theme) ? saved.theme : "system", customPlants: Array.isArray(saved.customPlants) ? saved.customPlants : [], plantMeta: saved.plantMeta && typeof saved.plantMeta === "object" ? saved.plantMeta : {}, tasks: needsTaskMigration ? createTasks(saved.plants) : (Array.isArray(saved.tasks) ? saved.tasks : []), logs: Array.isArray(saved.logs) ? saved.logs : [], plantedAt: saved.plantedAt || {}, location: saved.location || null, locationResults: [], locationSearchStatus: "", locationQuery: "", weather: cachedWeather, weatherStatus: "" };
  if (!migrated.tasks.length && migrated.plants.length) migrated.tasks = createTasks(migrated.plants);
  if (migrated.screen === "garden" || migrated.screen === "harvest") migrated.screen = "home";
  return migrated;
}

function save() {
  localStorage.setItem("homeyield-garden", JSON.stringify(state));
  queueDatabaseSync();
}
function queueDatabaseSync() {
  if (isOffline || isPackagedAndroid || isTauri) {
    if (isTauri) window.clearTimeout(databaseSyncTimer);
    if (isTauri) databaseSyncTimer = window.setTimeout(() => { void saveToDatabase(); }, 250);
    return;
  }
  window.clearTimeout(databaseSyncTimer);
  databaseSyncTimer = window.setTimeout(() => { void saveToDatabase(); }, 250);
}
async function saveToDatabase() {
  try {
    if (isTauri) {
      await invokeNative("save_state", { stateJson: JSON.stringify(state) });
      databaseStatus = "ready";
      return;
    }
    const response = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state }),
    });
    if (!response.ok) throw new Error(`Database save failed with ${response.status}`);
    databaseStatus = "ready";
  } catch (error) {
    databaseStatus = "unavailable";
    console.warn("HomeYield could not save the local SQLite database.", error);
  }
}
async function invokeNative(command, args) {
  if (window.__TAURI__?.core?.invoke) return window.__TAURI__.core.invoke(command, args);
  if (window.__TAURI_INTERNALS__?.invoke) return window.__TAURI_INTERNALS__.invoke(command, args);
  throw new Error("Tauri native bridge is unavailable");
}
async function hydrateDatabase() {
  try {
    if (isTauri) {
      const stateJson = await invokeNative("load_state");
      if (stateJson) {
        state = normalizeState(JSON.parse(stateJson));
        localStorage.setItem("homeyield-garden", JSON.stringify(state));
      }
      databaseStatus = "ready";
      render();
      return;
    }
    const response = await fetch("/api/state");
    if (!response.ok) throw new Error(`Database load failed with ${response.status}`);
    const payload = await response.json();
    if (payload.state) {
      state = normalizeState(payload.state);
      localStorage.setItem("homeyield-garden", JSON.stringify(state));
    } else {
      queueDatabaseSync();
    }
    if (state.location?.city === "Garden location" && Number.isFinite(state.location.latitude) && Number.isFinite(state.location.longitude)) {
      try {
        const place = await reverseGeocode(state.location.latitude, state.location.longitude);
        state.location = { ...state.location, ...place };
        save();
      } catch (error) {
        console.warn("HomeYield could not name the saved garden location.", error);
      }
    }
    databaseStatus = "ready";
    render();
  } catch (error) {
    databaseStatus = "unavailable";
    console.warn("HomeYield could not load the local SQLite database.", error);
    render();
  }
}
function resolvedTheme() { return state.theme === "system" ? (colorScheme.matches ? "dark" : "light") : state.theme; }
function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#101815" : "#234b35");
}
function themeLabel() {
  return state.theme === "system" ? `System (${resolvedTheme()})` : state.theme === "dark" ? "Dark" : "Light";
}
function cycleTheme() {
  state.theme = ({ system: "dark", dark: "light", light: "system" })[state.theme] || "system";
  save(); applyTheme(); render(); toast(`Theme: ${themeLabel()}.`);
}
function themeControl() {
  return `<button class="theme-control" onclick="cycleTheme()" aria-label="Change theme">◐ <span>${themeLabel()}</span></button>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]); }
function plant(id) { return PLANTS.find((item) => item.id === id) || state.customPlants.find((item) => item.id === id); }
function customColor(index) { return ["#6f8f72", "#8770a3", "#d47b54", "#4c8290", "#a97845"][index % 5]; }
function waterGuidance(days) {
  if (days <= 2) return "an extra soak";
  if (days >= 7) return "a drink only when the soil is dry";
  return "a moderate drink";
}
function customPlant(name, waterEvery, sun) {
  const cleanName = name.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  return { id: `custom-${Date.now()}`, name: cleanName, icon: cleanName.charAt(0).toUpperCase(), color: customColor(state.customPlants.length), water: waterGuidance(waterEvery), waterEvery, days: 60, sun, tip: `Start by checking the soil before watering ${cleanName}. Keep a short note about how it responds to its light and water.`, companions: "There is no companion data for this plant yet. Focus on light, soil, water, and how the plant responds." };
}
function locationLabel(location) {
  const city = location?.city === "Gqeberha" ? "Gqeberha (Port Elizabeth)" : location?.city;
  return [city, location?.admin1, location?.country].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(", ");
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
function dateLabel(date) { return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function weatherLabel(code) {
  if (code === 0) return "Clear skies";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Light drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Changing skies";
}
function weatherButton() {
  if (!state.location) return `<button class="weather weather-empty" onclick="go('location')">Set garden location</button>`;
  const temperature = state.weather ? `${Math.round(state.weather.temperature)}°` : "Get weather";
  return `<button class="weather" onclick="go('location')" aria-label="Weather for ${escapeHtml(locationLabel(state.location))}">${temperature} · ${escapeHtml(state.location.city)}</button>`;
}
function weatherBriefing() {
  if (!state.location) return `<div class="weather-prompt"><div><div class="eyebrow">Local weather</div><strong>Add your garden city</strong><p>Weather-aware care starts with your location.</p></div><button class="secondary" onclick="go('location')">Set location</button></div>`;
  const city = escapeHtml(locationLabel(state.location));
  if (!state.weather) return `<div class="weather-prompt"><div><div class="eyebrow">${city}</div><strong>Weather is ready to connect.</strong><p>Get local conditions to make today’s care advice more useful.</p></div><button class="secondary" onclick="refreshWeather()">Get weather</button></div>`;
  const temperature = Math.round(state.weather.temperature);
  const leafyNames = state.plants.filter((id) => ["lettuce", "spinach"].includes(id)).map((id) => plant(id).name).join(" and ") || "your plants";
  const tomorrow = state.weather.forecast?.[1];
  const frostAhead = state.weather.forecast?.some((day) => day.low <= 2);
  const heatAhead = state.weather.forecast?.some((day) => day.high >= 30);
  let heading = `${weatherLabel(state.weather.code)} in ${city}.`;
  let advice = `Check the soil of ${leafyNames} before watering.`;
  if (temperature >= 28) { heading = `It is hot in ${city}.`; advice = `Give ${leafyNames} an extra soak and check containers later today.`; }
  if ((state.weather.precipitationProbability || 0) >= 60 || state.weather.precipitation >= 2) { heading = `Rain is likely in ${city}.`; advice = "Check the soil before watering; your plants may get a natural drink."; }
  if (temperature <= 5) { heading = `It is cold in ${city}.`; advice = "Check tender plants and avoid watering frozen soil."; }
  if (frostAhead && temperature > 5) advice += " Frost is possible soon, so protect tender plants tonight.";
  if (heatAhead && temperature < 28) advice += ` A warmer stretch arrives${tomorrow ? ` around ${dateLabel(tomorrow.date)}` : " soon"}.`;
  if (state.weather.windSpeed >= 35) advice += " Strong wind is expected; secure tall plants.";
  return `<div class="briefing"><div class="eyebrow">${weatherLabel(state.weather.code)} · ${city}</div><h2>${heading}</h2><p>${advice}</p><div class="briefing-meta">${temperature}°C · ${state.weather.precipitationProbability ?? 0}% rain chance · ${Math.round(state.weather.windSpeed)} km/h wind</div></div>`;
}
function daysSince(id) {
  const date = state.plantedAt[id];
  if (date) return Math.max(1, Math.floor((Date.now() - new Date(`${date}T12:00:00`).getTime()) / 86400000) + 1);
  return state.planted === "month" ? 31 : state.planted === "weekend" ? 7 : 1;
}
function go(screen) { state.screen = screen; save(); render(); }
function icon(item) {
  const seed = [...item.id].reduce((total, character) => total + character.charCodeAt(0), 0);
  const variant = seed % 6;
  const tilt = (seed % 17) - 8;
  const size = 0.88 + (seed % 12) / 100;
  const accent = variant % 2 ? "#f5bd4c" : "#d9ec9e";
  const details = Array.from({ length: 2 + (seed % 3) }, (_, index) => {
    const x = 14 + ((seed * (index + 3)) % 68);
    const y = 12 + ((seed * (index + 5)) % 20);
    const radius = 2 + ((seed + index) % 3);
    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${accent}" opacity=".85"/>`;
  }).join("");
  const motifs = [
    `<path d="M48 82V42M48 63C30 62 20 51 23 36c15-1 25 7 27 23m0 4c4-17 16-27 32-24 0 16-10 27-32 31" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="28" r="8" fill="${accent}"/><circle cx="70" cy="25" r="6" fill="${accent}"/>`,
    `<path d="M47 84c-2-23 1-44 11-62 16 5 26 18 25 33-1 20-17 31-36 29z" fill="white" opacity=".92"/><path d="M57 28c-4 22-7 39-9 56M57 48 37 35M54 60 34 55M59 43l19-14M54 70l21-6" fill="none" stroke="var(--plant)" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
    `<path d="M48 82V51" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/><path d="M48 53c-14-14-13-29-3-39 16 7 19 22 8 40zm3 0c8-20 22-28 37-24 0 18-13 29-37 29z" fill="white" opacity=".9"/><circle cx="31" cy="73" r="11" fill="${accent}"/><circle cx="68" cy="69" r="9" fill="${accent}"/>`,
    `<path d="M28 73h40l-5 13H33z" fill="${accent}"/><path d="M48 72V37M48 51C32 50 24 41 26 29c14 0 23 8 24 20m0 3c5-15 16-22 30-19 0 14-10 23-30 25z" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M47 84V39M47 61C27 60 17 47 21 31c16-1 27 8 29 25m-2 1c7-19 22-28 38-23 0 19-14 30-39 32z" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 25c8-9 16-10 23-4-4 11-13 14-23 4zM66 22c7-7 15-6 20 2-8 8-15 8-20-2z" fill="${accent}"/>`,
    `<path d="M48 84V45M48 57c-18-6-24-18-18-30 16 2 23 13 21 29m0 2c9-17 22-21 34-14-4 16-16 22-35 20z" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 84h47" stroke="${accent}" stroke-width="8" stroke-linecap="round"/><circle cx="77" cy="28" r="7" fill="${accent}"/>`
  ];
  return `<span class="plant-icon" style="--plant:${item.color}" aria-hidden="true"><svg class="plant-art-icon" data-plant="${item.id}" viewBox="0 0 96 96"><g transform="rotate(${tilt} 48 48) scale(${size}) translate(${(1 - size) * 6} ${(1 - size) * 6})">${motifs[variant]}${details}</g></svg></span>`;
}
function navArt(id) {
  const art = {
    home: `<path d="M10 43 32 24l22 19v27H39V54H25v16H10z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M8 43h48" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
    plants: `<path d="M30 52c-13-1-20-10-18-21 12-1 21 6 23 17 3-15 14-23 27-20 1 14-9 25-27 28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 76c-2-21-1-36 8-50" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
    diagnose: `<circle cx="29" cy="29" r="16" fill="none" stroke="currentColor" stroke-width="5"/><path d="m41 41 16 16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M23 29h12M29 23v12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
    progress: `<path d="M31 73V42M31 56C18 54 12 45 14 34c12 0 19 7 20 17m-1 4c4-14 14-21 26-19 1 13-8 21-25 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 78h40" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="47" cy="21" r="9" fill="currentColor" opacity=".3"/>`,
    theme: `<circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M32 14a18 18 0 0 1 0 36z" fill="currentColor" opacity=".5"/>`
  };
  return `<svg class="nav-art" viewBox="0 0 64 64" aria-hidden="true">${art[id] || art.home}</svg>`;
}
function gardenArt(type) {
  const art = {
    hero: `<svg class="garden-art garden-art-hero" viewBox="0 0 280 220" role="img" aria-label="Illustration of a thriving garden"><circle cx="213" cy="55" r="28" fill="#f5bd4c"/><path d="M22 182c29-24 56-28 87-11 27-25 63-27 96-7 22-12 45-10 63 4v34H22z" fill="#2b6744"/><path d="M65 174c8-65 21-98 47-120M118 178c2-54 14-87 43-108M176 180c-7-42-1-76 18-99" fill="none" stroke="#183f2b" stroke-width="7" stroke-linecap="round"/><path d="M109 76C74 75 62 53 66 32c31 1 48 17 43 44zm0 1c28-29 54-31 72-20-8 29-33 40-72 20zM153 95c-24-23-24-44-14-57 25 10 31 30 14 57zm-62 18c-31-5-47-22-45-42 28-2 46 11 45 42z" fill="#82c995"/><path d="M205 115c29-16 48-12 60 3-13 21-34 22-60-3zm-8 1c-12-28-6-47 10-57 18 19 14 39-10 57z" fill="#9ed5a4"/><path d="M37 192c39-11 83-10 124 0s81 11 112-1" fill="none" stroke="#d9ec9e" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`,
    empty: `<svg class="garden-art garden-art-empty" viewBox="0 0 180 150" role="img" aria-label="Illustration of a small sprout"><ellipse cx="90" cy="126" rx="54" ry="10" fill="#dbe7c9"/><path d="M90 119V74" fill="none" stroke="#31724d" stroke-width="7" stroke-linecap="round"/><path d="M89 86C54 86 42 64 48 43c29 1 45 15 41 43zm3-4c9-31 30-44 53-40 0 28-18 45-53 40z" fill="#72ad72"/><path d="M69 119c8-10 33-10 43 0" fill="none" stroke="#9c684b" stroke-width="7" stroke-linecap="round"/></svg>`,
    help: `<svg class="garden-art garden-art-help" viewBox="0 0 180 150" role="img" aria-label="Illustration of a leaf and magnifying glass"><circle cx="86" cy="73" r="48" fill="#e7f2d9"/><path d="M49 79c19-41 49-50 77-43-1 34-26 61-67 54" fill="#4f9964"/><path d="M54 82c25-20 46-31 68-39" fill="none" stroke="#d9ec9e" stroke-width="4" stroke-linecap="round"/><circle cx="126" cy="99" r="25" fill="none" stroke="#234b35" stroke-width="8"/><path d="M144 117l19 18" fill="none" stroke="#234b35" stroke-width="8" stroke-linecap="round"/></svg>`,
    progress: `<svg class="garden-art garden-art-progress" viewBox="0 0 200 150" role="img" aria-label="Illustration of a growing plant"><path d="M18 123h164" stroke="#9c684b" stroke-width="8" stroke-linecap="round"/><path d="M99 123V48" stroke="#31724d" stroke-width="7" stroke-linecap="round"/><path d="M98 72C65 72 51 51 58 31c29 0 44 14 40 41zm4 6c11-31 34-43 58-37-2 29-22 44-58 37z" fill="#72ad72"/><path d="M27 108c27-25 51-23 67-7M107 101c26-23 49-22 66-6" fill="none" stroke="#b5d88a" stroke-width="7" stroke-linecap="round"/><circle cx="31" cy="41" r="15" fill="#f5bd4c"/><path d="M31 17v-7M31 72v-7M7 41H0M62 41h-7" stroke="#e5a83d" stroke-width="4" stroke-linecap="round"/></svg>`
  };
  return art[type] || "";
}
function nav() {
  return `<nav class="nav" aria-label="Main navigation">${[["home", "Today"], ["plants", "My plants"], ["diagnose", "Plant help"], ["progress", "Progress"], ["theme", themeLabel()]].map(([id, label]) => id === "theme" ? `<button onclick="cycleTheme()" aria-label="Change theme">${navArt(id)}<span>${label}</span></button>` : `<button class="${state.screen === id || (id === "plants" && state.screen === "plant-detail") ? "active" : ""}" onclick="go('${id}')">${navArt(id)}<span>${label}</span></button>`).join("")}</nav>`;
}
function toast(message) {
  document.querySelector(".toast")?.remove();
  app.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${message}</div>`);
  setTimeout(() => document.querySelector(".toast")?.remove(), 2600);
}
function createTasks(ids) {
  return ids.slice(0, 4).map((id) => {
    const item = plant(id);
    if (!item) return null;
    return { id: `water-${id}`, plantId: id, type: "Care today", title: `Water ${item.name}`, text: `${item.name} needs ${item.water}.`, action: "water" };
  }).filter(Boolean);
}
function waterInterval(id) { return plant(id)?.waterEvery || 3; }
function dueTasks() { return state.tasks.filter((task) => !task.snoozedUntil || task.snoozedUntil <= todayKey()); }
function lastLog(id, action) { return state.logs.find((log) => log.plantId === id && (!action || log.action === action)); }
function isWaterDue(id) {
  const latest = lastLog(id, "water");
  if (!latest) return true;
  const elapsed = Math.floor((Date.now() - new Date(`${latest.date}T12:00:00`).getTime()) / 86400000);
  return elapsed >= waterInterval(id);
}
function ensureCareTasks() {
  let changed = false;
  state.plants.forEach((id) => {
    if (!isWaterDue(id) || state.tasks.some((task) => task.plantId === id && task.action === "water")) return;
    const item = plant(id);
    if (!item) return;
    state.tasks.push({ id: `water-${id}-${todayKey()}`, plantId: id, type: "Care today", title: `Water ${item.name}`, text: `${item.name} needs ${item.water}.`, action: "water" });
    changed = true;
  });
  if (changed) save();
}
function nextWaterText(id) {
  const latest = lastLog(id, "water");
  if (!latest) return "Watering not logged yet";
  const interval = waterInterval(id);
  const elapsed = Math.floor((Date.now() - new Date(`${latest.date}T12:00:00`).getTime()) / 86400000);
  if (elapsed >= interval) return "Watering is due";
  return `Water again in ${interval - elapsed} day${interval - elapsed === 1 ? "" : "s"}`;
}
function logAction(plantId, action) {
  state.logs.unshift({ id: `${Date.now()}-${plantId}`, plantId, action, date: todayKey() });
  if (action === "harvest") plantMeta(plantId).harvestCount += 1;
  if (action === "water") state.tasks = state.tasks.filter((task) => task.plantId !== plantId || task.action !== "water");
  save();
}
function actionLabel(action) { return action === "water" ? "Watered" : action === "check" ? "Checked" : action === "harvest" ? "Harvested" : "Noted"; }
function logQuickAction(id, action) {
  if (!plant(id)) return;
  logAction(id, action);
  render();
  toast(`${plant(id).name} marked as ${actionLabel(action).toLowerCase()}.`);
}
function plantMeta(id) {
  if (!state.plantMeta[id]) state.plantMeta[id] = { variety: "", place: "", notes: "", photo: "", harvestCount: 0 };
  return state.plantMeta[id];
}
function savePlantMeta(event, id) {
  event.preventDefault();
  const form = event.currentTarget;
  const meta = plantMeta(id);
  meta.variety = form.elements.variety.value.trim().slice(0, 80);
  meta.place = form.elements.place.value.trim().slice(0, 80);
  meta.notes = form.elements.notes.value.trim().slice(0, 500);
  save(); render(); toast("Plant record updated.");
}
function savePlantPhoto(event, id) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 1500000) { toast("Choose a photo smaller than 1.5 MB."); return; }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    plantMeta(id).photo = reader.result;
    save(); render(); toast("Plant photo saved.");
  });
  reader.addEventListener("error", () => toast("We couldn’t read that photo. Try another one."));
  reader.readAsDataURL(file);
}
function archivePlant(id) {
  const item = plant(id);
  if (!item || !window.confirm(`Archive ${item.name} from your active plant list?`)) return;
  state.plants = state.plants.filter((plantId) => plantId !== id);
  state.tasks = state.tasks.filter((task) => task.plantId !== id);
  state.selectedPlant = null;
  state.screen = "plants";
  save(); render(); toast(`${item.name} archived.`);
}
function offlineBanner() {
  if (isOffline) return `<div class="offline-banner" role="status">Offline mode · Your local records still work. Weather will refresh when you reconnect.</div>`;
  if (databaseStatus === "unavailable") return `<div class="offline-banner" role="status">SQLite storage is unavailable · Changes are safely cached in this browser for now.</div>`;
  return "";
}

function home() {
  const hasPlants = state.plants.length > 0;
  const loggedToday = state.logs.filter((log) => log.date === todayKey()).length;
  if (!hasPlants) {
    return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div>${weatherButton()}</header>
      <div class="hero"><div class="hero-copy"><div class="eyebrow">Your garden companion</div><h1>Know what to do next.</h1><p>HomeYield keeps a simple record of your real plants and turns care into clear, timely steps.</p><button class="primary" onclick="go('onboarding')">Start tracking my plants</button></div>${gardenArt("hero")}</div>
      <section class="section"><div class="eyebrow">A calmer way to grow</div><h2>Guidance, not a digital garden.</h2><p class="intro">Log what you planted, get practical reminders, and see how your plants are doing over time.</p></section></section>${nav()}`;
  }
  return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div>${weatherButton()}</header>
    ${weatherBriefing()}
    <div class="stats-row"><div><strong>${state.plants.length}</strong><span>plants tracked</span></div><div><strong>${loggedToday}</strong><span>actions today</span></div><div><strong>${state.logs.length}</strong><span>care logs</span></div></div>
    <section class="section"><div class="section-head"><div><div class="eyebrow">At a glance</div><h2>Your garden</h2></div><button class="text-button" onclick="go('plants')">View records</button></div>
      <div class="glance-list">${state.plants.map(glanceCard).join("")}</div>
      <p class="hint">Open a plant when you’re outside. HomeYield keeps the context quiet until you need it.</p>
    </section>
    </section>${nav()}`;
}

function glanceCard(id) {
  const item = plant(id);
  const latest = state.logs.find((log) => log.plantId === id);
  const status = latest ? `Last logged ${dateLabel(latest.date)}` : "No visit logged yet";
  const statusClass = latest ? "okay" : "attention";
  return `<article class="glance-card"><button class="glance-main" onclick="openPlant('${id}')">${icon(item)}<span><strong>${item.name}</strong><small>${status}</small></span><b class="${statusClass}">${statusClass === "okay" ? "✓" : "·"}</b></button><button class="quick-log" onclick="logQuickAction('${id}', 'water')" aria-label="Log ${item.name} as watered">Log watered</button></article>`;
}

function taskCard(task) {
  const item = plant(task.plantId);
  return `<article class="task-card" data-task="${task.id}"><div class="task-heading">${item ? icon(item) : ""}<div><div class="task-type">${task.type}</div><h3>${task.title}</h3></div></div><p>${task.text}</p><div class="task-actions"><button class="task-action" onclick="finishTask('${task.id}')">${task.action === "water" ? "I watered it" : "Done"}</button><button class="task-action snooze" onclick="snoozeTask('${task.id}')">Tomorrow</button></div></article>`;
}
function finishTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  if (task.plantId) logAction(task.plantId, task.action || "check");
  state.tasks = state.tasks.filter((item) => item.id !== id);
  save(); render(); toast("Logged. Nice work.");
}
function snoozeTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.snoozedUntil = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  save(); render(); toast("Moved to tomorrow.");
}

function weatherCard() {
  if (state.weatherStatus === "loading") return `<div class="weather-loading" role="status">Finding the latest weather for your garden…</div>`;
  if (!state.weather) return state.location ? `<div class="notice weather-error">We couldn’t load weather yet.<br><button class="secondary" onclick="refreshWeather()">Try again</button></div>` : "";
  const weather = state.weather;
  const forecast = (weather.forecast || []).map((day, index) => `<div class="forecast-day"><strong>${index === 0 ? "Today" : new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</strong><span>${weatherLabel(day.code)}</span><b>${Math.round(day.high)}° / ${Math.round(day.low)}°</b><small>${day.rainChance}% rain</small></div>`).join("");
  return `<div class="weather-detail"><div class="weather-current"><strong>${Math.round(weather.temperature)}°</strong><span>${weatherLabel(weather.code)}</span></div><div class="weather-metrics"><div><strong>Feels ${Math.round(weather.apparentTemperature)}°</strong><small>Feels like</small></div><div><strong>${weather.precipitationProbability ?? 0}%</strong><small>Rain chance</small></div><div><strong>${Math.round(weather.windSpeed)} km/h</strong><small>Wind</small></div></div><div class="forecast"><div class="eyebrow">Next 5 days</div>${forecast}</div><small class="weather-updated">Updated ${new Date(weather.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</small></div>`;
}
async function fetchWeather() {
  const { latitude, longitude } = state.location;
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code",
    forecast_days: "5",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error(`Weather request failed with ${response.status}`);
  const data = await response.json();
  if (!data.current || !data.daily) throw new Error("Weather response was incomplete");
  state.weather = {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    code: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    high: data.daily.temperature_2m_max?.[0],
    low: data.daily.temperature_2m_min?.[0],
    precipitationProbability: data.daily.precipitation_probability_max?.[0] ?? 0,
    forecast: (data.daily.time || []).map((date, index) => ({
      date,
      high: data.daily.temperature_2m_max?.[index],
      low: data.daily.temperature_2m_min?.[index],
      rainChance: data.daily.precipitation_probability_max?.[index] ?? 0,
      rain: data.daily.precipitation_sum?.[index] ?? 0,
      code: data.daily.weather_code?.[index],
    })),
    updatedAt: new Date().toISOString(),
  };
}
async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: latitude,
    lon: longitude,
    zoom: "10",
    addressdetails: "1",
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);
  if (!response.ok) throw new Error(`Reverse geocoding failed with ${response.status}`);
  const data = await response.json();
  const address = data.address || {};
  const city = address.city || address.town || address.village || address.municipality || address.locality;
  if (!city) throw new Error("Reverse geocoder returned no city");
  return { city, admin1: address.state || address.county || "", country: address.country || "" };
}
function locationResultLabel(result) {
  return [result.name, result.admin1, result.country].filter(Boolean).join(", ");
}
async function connectLocation(location) {
  locationSearchRequest += 1;
  currentLocationRequest += 1;
  locationSearchController?.abort();
  state.location = location;
  state.locationResults = [];
  state.locationSearchStatus = "";
  state.locationQuery = "";
  state.weather = null;
  state.weatherStatus = "loading";
  save(); render();
  try {
    await fetchWeather();
    state.weatherStatus = "";
    state.screen = "home";
    save(); render(); toast(`Weather connected for ${location.city}.`);
  } catch (error) {
    state.weatherStatus = "error";
    save(); render();
    console.warn("HomeYield could not connect weather for the selected city.", error);
    toast(`Location saved, but weather for ${location.city} is unavailable right now.`);
  }
}
async function searchLocations(event) {
  event.preventDefault();
  const input = event.currentTarget.elements.city;
  const city = input.value.trim().replace(/\s+/g, " ").slice(0, 80);
  if (!city) { toast("Enter a city or town first."); return; }
  const requestId = ++locationSearchRequest;
  currentLocationRequest += 1;
  locationSearchController?.abort();
  locationSearchController = new AbortController();
  state.locationQuery = city;
  state.locationSearchStatus = "loading";
  state.locationResults = [];
  render();
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=8&language=en&format=json`, { signal: locationSearchController.signal });
    if (!response.ok) throw new Error(`Location search failed with ${response.status}`);
    const data = await response.json();
    if (requestId !== locationSearchRequest) return;
    state.locationResults = (data.results || []).map((result) => ({
      city: result.name,
      country: result.country,
      admin1: result.admin1 || "",
      latitude: result.latitude,
      longitude: result.longitude,
    }));
    state.locationSearchStatus = state.locationResults.length ? "" : "empty";
    render();
  } catch (error) {
    if (error.name === "AbortError" || requestId !== locationSearchRequest) return;
    state.locationSearchStatus = "error";
    render();
    console.warn("HomeYield could not connect garden weather.", error);
    toast("We couldn’t search that city. Check the spelling and try again.");
  }
}
function chooseLocationResult(index) {
  const result = state.locationResults[index];
  if (!result) return;
  state.locationSearchStatus = "loading";
  render();
  void connectLocation(result);
}
async function refreshWeather() {
  if (!state.location) { go("location"); return; }
  state.weatherStatus = "loading"; save(); render();
  try {
    await fetchWeather();
    state.weatherStatus = "";
    save(); render(); toast("Local weather refreshed.");
  } catch (error) {
    state.weatherStatus = "error";
    save(); render();
    console.warn("HomeYield could not refresh garden weather.", error);
    toast("Weather is unavailable right now. Try again later.");
  }
}
function locationScreen() {
  const currentCity = state.location ? escapeHtml(locationLabel(state.location)) : "";
  const locationInput = escapeHtml(state.locationQuery || (state.location?.city === "Garden location" ? "" : state.location?.city || ""));
  const results = state.locationResults.map((result, index) => `<button class="location-result" onclick="chooseLocationResult(${index})"><strong>${escapeHtml(result.city)}</strong><span>${escapeHtml([result.admin1, result.country].filter(Boolean).join(", "))}</span></button>`).join("");
  const searchMessage = state.locationSearchStatus === "loading" ? `<div class="weather-loading" role="status">Finding matching cities…</div>` : state.locationSearchStatus === "empty" ? `<div class="notice location-message">No matching cities found. Try a nearby town or check the spelling.</div>` : state.locationSearchStatus === "error" ? `<div class="notice location-message">City search is unavailable. Try again or use your current location.</div>` : "";
  const locationMessage = state.weatherStatus === "error" && !state.location ? `<div class="notice location-message">We couldn’t read your device location. No previous city was kept. Search for your city instead.</div>` : "";
  return `<section class="screen"><header class="topbar"><button class="icon-button" onclick="go('home')" aria-label="Back to today">Back</button><div class="brand">Home<span>Yield</span></div></header>
    <div class="eyebrow">Garden location</div><h1>Pinpoint your garden.</h1><p class="intro">Use your current location, or search and choose the exact city. We use the selected coordinates for weather.</p>
    <button class="location-button" onclick="useCurrentLocation()" ${state.weatherStatus === "loading" ? "disabled" : ""}>◎ Use my current location</button>
    <form class="location-form" onsubmit="searchLocations(event)"><label for="garden-city">Search by city</label><div class="form-row"><input id="garden-city" name="city" maxlength="80" autocomplete="address-level2" value="${locationInput}" placeholder="e.g. Springfield" required><button class="primary" type="submit" ${state.locationSearchStatus === "loading" ? "disabled" : ""}>${state.locationSearchStatus === "loading" ? "Searching…" : "Find city"}</button></div><small class="location-helper">Choose from the matches below; don’t rely on the first result.</small></form>
    ${locationMessage}${searchMessage}${results ? `<div class="location-results"><div class="eyebrow">Choose the exact location</div>${results}</div>` : ""}
    ${state.location ? `<div class="location-current"><div><div class="eyebrow">Weather location</div><strong>${currentCity}</strong><small>Exact coordinates saved</small></div><button class="secondary" onclick="refreshWeather()" ${state.weatherStatus === "loading" ? "disabled" : ""}>Refresh</button></div>` : ""}
    ${weatherCard()}<p class="privacy-note">Your city is saved only on this device. Weather comes from Open-Meteo and is used for care guidance.</p>
  </section>${nav()}`;
}

function useCurrentLocation() {
  if (!navigator.geolocation) { toast("Your browser doesn’t support location. Enter a city instead."); return; }
  const requestId = ++currentLocationRequest;
  locationSearchRequest += 1;
  locationSearchController?.abort();
  state.location = null;
  state.weather = null;
  state.locationResults = [];
  state.locationQuery = "";
  state.weatherStatus = "loading"; save(); render();
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        if (requestId !== currentLocationRequest) return;
        const place = await reverseGeocode(coords.latitude, coords.longitude);
        if (requestId !== currentLocationRequest) return;
        await connectLocation({ ...place, latitude: coords.latitude, longitude: coords.longitude });
      } catch (error) {
        if (requestId !== currentLocationRequest) return;
        state.location = null;
        state.weather = null;
        state.weatherStatus = "error"; save(); render();
        console.warn("HomeYield could not connect weather for this location.", error);
        toast("We couldn’t load weather right now. Try again later.");
      }
    },
    (error) => {
      if (requestId !== currentLocationRequest) return;
      state.location = null;
      state.weather = null;
      state.weatherStatus = "error"; save(); render();
      console.warn("HomeYield could not access the garden location.", error);
      toast("Location wasn’t shared. Nothing changed; enter a city instead.");
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

function onboarding() {
  const chosen = state.onboardingPlants || [];
  const dates = [["today", "Planted today", "Starting fresh, right now."], ["weekend", "Planted last weekend", "About 3 to 9 days ago."], ["month", "Planted a month ago", "Already settling in."]];
  return `<section class="screen"><header class="topbar"><button class="icon-button" onclick="go('home')" aria-label="Go back">Back</button><div class="brand">Home<span>Yield</span></div></header><div class="stepper"><span class="active"></span><span class="${chosen.length ? "active" : ""}"></span></div>
    <div class="eyebrow">Step 1 of 2</div><h1>Which plants are you caring for?</h1><p class="intro">Tap a category or a plant. Every library plant includes a care starting point.</p><div class="category-chips">${catalogCategories()}</div><div class="catalog-toolbar"><input aria-label="Search plant library" placeholder="Search 48 plants" oninput="filterCatalog(event)"><span class="catalog-count">${PLANTS.length} plants</span></div><div class="plant-grid">${PLANTS.map((item) => `<button class="plant-card catalog-card ${chosen.includes(item.id) ? "selected" : ""}" data-category="${item.category}" data-search="${item.name} ${item.category}" onclick="togglePlant('${item.id}')">${icon(item)}<strong>${item.name}</strong><small>${item.category}</small></button>`).join("")}</div>
    ${customPlantForm("onboarding")}
    ${chosen.length ? `<div class="selected-plants"><span class="muted">Selected:</span>${chosen.map((id) => `<span class="selected-plant">${escapeHtml(plant(id)?.name || id)}</span>`).join("")}</div><section class="section"><div class="eyebrow">Step 2 of 2</div><h2>When did you plant them?</h2><p class="muted">Pick a quick estimate or choose the exact date.</p><div class="date-options">${dates.map(([id, label, detail]) => `<button class="date-option ${state.onboardingDate === id ? "selected" : ""}" onclick="chooseDate('${id}')">${label}<small>${detail}</small></button>`).join("")}</div><div class="exact-date ${state.onboardingDate === "exact" ? "selected" : ""}"><label for="exact-plant-date">Exact planting date</label><input id="exact-plant-date" type="date" max="${todayKey()}" value="${state.onboardingExactDate || ""}" onchange="chooseExactDate(event)"><small>Use the date on your note, receipt, or calendar.</small></div></section>` : ""}</section><div class="bottom-action"><button class="primary" ${!(chosen.length && state.onboardingDate && (state.onboardingDate !== "exact" || state.onboardingExactDate)) ? "disabled" : ""} onclick="finishOnboarding()">Start my care guide</button></div>`;
}
function togglePlant(id) { const plants = state.onboardingPlants || []; state.onboardingPlants = plants.includes(id) ? plants.filter((item) => item !== id) : [...plants, id]; save(); render(); }
function chooseDate(id) { state.onboardingDate = id; delete state.onboardingExactDate; save(); render(); }
function chooseExactDate(event) {
  const date = event.target.value;
  if (!date || date > todayKey()) { toast("Choose today or an earlier date."); return; }
  state.onboardingDate = "exact";
  state.onboardingExactDate = date;
  save(); render();
}
function customPlantForm(mode) {
  return `<section class="custom-plant-panel"><div class="eyebrow">Can’t see yours?</div><h2>Add any plant</h2><p class="muted">Start with the library first. Manual entry is here for genuinely uncommon plants.</p><button class="secondary library-button" type="button" onclick="browseCatalog('${mode}')">Browse full plant library</button><form onsubmit="addCustomPlant(event, '${mode}')"><label for="custom-plant-name">Plant name</label><div class="form-row"><input id="custom-plant-name" name="plantName" maxlength="40" autocomplete="off" placeholder="e.g. Rare cultivar" required><button class="secondary" type="submit">Add custom</button></div><div class="custom-options"><label>Watering rhythm<select name="waterEvery"><option value="2">Often · every 2 days</option><option value="3" selected>Moderate · every 3 days</option><option value="5">Light · every 5 days</option><option value="7">Dry between watering · weekly</option></select></label><label>Light to start<select name="sunPreference"><option>Bright, indirect light</option><option>Morning sun</option><option>Full sun</option><option>Shade</option></select></label></div></form></section>`;
}
function filterCatalog(event) {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".catalog-card").forEach((card) => {
    const matches = !query || card.dataset.search.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  document.querySelectorAll(".category-chip").forEach((chip) => chip.classList.toggle("selected", chip.dataset.categoryFilter === "All"));
  const count = document.querySelector(".catalog-count");
  if (count) count.textContent = `${visible} plant${visible === 1 ? "" : "s"}`;
}
function catalogCategories() {
  return ["All", ...new Set(PLANTS.map((item) => item.category))].map((category) => `<button class="category-chip ${category === "All" ? "selected" : ""}" data-category-filter="${category}" onclick="filterCatalogCategory('${category}')">${category}</button>`).join("");
}
function filterCatalogCategory(category) {
  const input = document.querySelector(".catalog-toolbar input");
  if (input) input.value = "";
  let visible = 0;
  document.querySelectorAll(".catalog-card").forEach((card) => {
    const matches = category === "All" || card.dataset.category === category;
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  document.querySelectorAll(".category-chip").forEach((chip) => chip.classList.toggle("selected", chip.dataset.categoryFilter === category));
  const count = document.querySelector(".catalog-count");
  if (count) count.textContent = `${visible} plant${visible === 1 ? "" : "s"}`;
}
function browseCatalog(mode) {
  state.catalogMode = mode;
  state.screen = "catalog";
  save(); render();
}
function addTrackedPlant(id) {
  const item = plant(id);
  if (!item) return;
  if (state.plants.includes(id)) { toast(`${item.name} is already being tracked.`); return; }
  state.plants.push(id);
  state.plantedAt[id] = todayKey();
  state.tasks.push(...createTasks([id]));
  save(); render(); toast(`${item.name} added to your care list.`);
}
function selectCatalogPlant(id) {
  const item = plant(id);
  if (!item) return;
  if (state.catalogMode === "onboarding") {
    const chosen = state.onboardingPlants || [];
    if (chosen.includes(id)) {
      state.onboardingPlants = chosen.filter((plantId) => plantId !== id);
      toast(`${item.name} removed from your selection.`);
    } else {
      state.onboardingPlants = [...chosen, id];
      toast(`${item.name} added to your selection.`);
    }
    save(); render();
    return;
  }
  addTrackedPlant(id);
}
function catalogCard(item) {
  const added = state.catalogMode === "onboarding" ? state.onboardingPlants?.includes(item.id) : state.plants.includes(item.id);
  const label = added ? (state.catalogMode === "onboarding" ? "Remove from selection" : "Already tracked") : state.catalogMode === "onboarding" ? "Select plant" : "Add to my plants";
  const disabled = added && state.catalogMode !== "onboarding" ? "disabled" : "";
  return `<article class="library-card catalog-card" data-category="${item.category}" data-search="${escapeHtml(`${item.name} ${item.category}`)}"><div class="library-card-top">${icon(item)}<div><div class="eyebrow">${item.category}</div><h2>${item.name}</h2></div></div><p>${item.tip}</p><div class="library-facts"><span>${item.water}</span><span>${item.sun}</span><span>${item.days} day timeline</span></div><button class="${added ? "secondary" : "primary"}" ${disabled} onclick="selectCatalogPlant('${item.id}')">${label}</button></article>`;
}
function catalog() {
  const mode = state.catalogMode || "plants";
  const back = mode === "onboarding" ? "onboarding" : "plants";
  return `<section class="screen"><header class="topbar"><button class="icon-button" onclick="go('${back}')" aria-label="Back">Back</button><div class="brand">Home<span>Yield</span></div></header><div class="eyebrow">HomeYield plant library</div><h1>Find your plant.</h1><p class="intro">Start with a category, or search by name. Add a detailed plant profile in one tap.</p><div class="category-chips">${catalogCategories()}</div><div class="catalog-toolbar"><input aria-label="Search full plant library" placeholder="Search vegetables, herbs, flowers..." oninput="filterCatalog(event)"><span class="catalog-count">${PLANTS.length} plants</span></div><div class="library-list">${PLANTS.map(catalogCard).join("")}</div><div class="notice">Can’t find it? <button class="text-button" onclick="go('${back}')">Use custom entry</button></div></section>${nav()}`;
}
function addCustomPlant(event, mode) {
  event.preventDefault();
  const input = event.currentTarget.elements.plantName;
  const name = input.value.trim().replace(/[<>]/g, "").replace(/\s+/g, " ").slice(0, 40);
  const waterEvery = Number(event.currentTarget.elements.waterEvery.value) || 3;
  const sunPreference = event.currentTarget.elements.sunPreference.value;
  if (!name) { toast("Enter a plant name first."); return; }
  const existing = state.plants.map((id) => plant(id)?.name.toLowerCase()).includes(name.toLowerCase());
  if (existing) { toast(`${name} is already being tracked.`); return; }
  const item = customPlant(name, waterEvery, sunPreference);
  state.customPlants.push(item);
  if (mode === "onboarding") {
    state.onboardingPlants = [...(state.onboardingPlants || []), item.id];
  } else {
    state.plants.push(item.id);
    state.plantedAt[item.id] = todayKey();
    state.tasks.push(...createTasks([item.id]));
  }
  save(); render(); toast(`${name} added to your care list.`);
}
function finishOnboarding() {
  if (!state.onboardingPlants?.length || !state.onboardingDate || (state.onboardingDate === "exact" && !state.onboardingExactDate)) return;
  state.plants = state.onboardingPlants;
  state.planted = state.onboardingDate;
  const days = state.onboardingDate === "month" ? 31 : state.onboardingDate === "weekend" ? 7 : 0;
  const plantedDate = state.onboardingDate === "exact" ? state.onboardingExactDate : new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  state.plantedAt = Object.fromEntries(state.plants.map((id) => [id, plantedDate]));
  state.tasks = createTasks(state.plants);
  state.logs = [];
  delete state.onboardingPlants; delete state.onboardingDate; delete state.onboardingExactDate;
  state.screen = "home"; save(); render(); toast("Your care guide is ready.");
}

function plantMiniCard(id) {
  const item = plant(id);
  return `<article class="plant-mini"><button class="plant-mini-main" onclick="openPlant('${id}')">${icon(item)}<span><strong>${item.name}</strong><small>${nextWaterText(id)}</small></span></button><button class="quick-log" onclick="logQuickAction('${id}', 'water')" aria-label="Log ${item.name} as watered">+ Water</button></article>`;
}
function plants() {
  if (!state.plants.length) return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div></header><div class="empty-page">${gardenArt("empty")}<h1>Start with your real plants.</h1><p class="intro">Add what you are caring for and HomeYield will guide the next step.</p><button class="primary" onclick="go('onboarding')">Add plants</button></div></section>${nav()}`;
  const recent = state.logs.slice(0, 5);
  return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div><span class="pill">${state.plants.length} tracked</span></header><div class="eyebrow">Your care record</div><h1>My plants.</h1><p class="intro">A quick record of what is happening in the garden you actually have.</p><div class="plant-record-list">${state.plants.map(plantRecord).join("")}</div>${customPlantForm("plants")}
    <section class="section"><div class="section-head"><div><div class="eyebrow">What you have done</div><h2>Recent activity</h2></div></div>${recent.length ? `<div class="activity-list">${recent.map(activity).join("")}</div>` : `<div class="empty">Your first watering or check will appear here.</div>`}</section></section>${nav()}`;
}
function plantRecord(id) {
  const item = plant(id); const meta = plantMeta(id); const age = daysSince(id);
  return `<article class="plant-record"><button class="plant-record-main" onclick="openPlant('${id}')">${icon(item)}<span><strong>${item.name}</strong><small>${age} day${age === 1 ? "" : "s"} in your care${meta.place ? ` · ${escapeHtml(meta.place)}` : ""}</small><em>${nextWaterText(id)}</em></span><b aria-hidden="true">›</b></button><div class="record-actions"><button class="task-action" onclick="logQuickAction('${id}', 'water')">Log watered</button><button class="task-action snooze" onclick="logQuickAction('${id}', 'check')">Log checked</button></div></article>`;
}
function activity(log) {
  const item = plant(log.plantId);
  if (!item) return "";
  return `<div class="activity"><span class="activity-mark">${log.action === "water" ? "W" : "✓"}</span><span><strong>${item.name} ${actionLabel(log.action).toLowerCase()}</strong><small>${dateLabel(log.date)}</small></span></div>`;
}
function openPlant(id) { state.selectedPlant = id; state.screen = "plant-detail"; save(); render(); }
function plantDetail() {
  const item = plant(state.selectedPlant || state.plants[0]);
  if (!item) return plants();
  const watered = lastLog(item.id, "water");
  const meta = plantMeta(item.id);
  const photo = meta.photo ? `<img class="plant-photo" src="${escapeHtml(meta.photo)}" alt="Photo of ${escapeHtml(item.name)}">` : `<div class="photo-placeholder">Add a photo from your garden</div>`;
  return `<section class="screen"><header class="topbar"><button class="icon-button" onclick="go('plants')" aria-label="Back to my plants">Back</button><div class="brand">Home<span>Yield</span></div></header><div class="plant-detail-head">${icon(item)}<div><div class="eyebrow">Care guide</div><h1>${item.name}</h1><p class="muted">${item.sun}</p></div></div>
    <div class="care-card"><div class="eyebrow">Right now</div><h2>${nextWaterText(item.id)}</h2><p>${item.tip}</p><div class="task-actions"><button class="primary" onclick="logQuickAction('${item.id}', 'water')">Log watered</button><button class="secondary" onclick="logQuickAction('${item.id}', 'check')">Log a check</button><button class="secondary" onclick="logQuickAction('${item.id}', 'harvest')">Log harvest</button></div></div>
    <section class="section record-detail"><div class="section-head"><div><div class="eyebrow">Your record</div><h2>Make it yours</h2></div></div>${photo}<label class="photo-upload">Choose a plant photo<input type="file" accept="image/*" onchange="savePlantPhoto(event, '${item.id}')"></label><form class="metadata-form" onsubmit="savePlantMeta(event, '${item.id}')"><label>Variety<input name="variety" maxlength="80" value="${escapeHtml(meta.variety || "")}" placeholder="e.g. San Marzano"></label><label>Where is it?<input name="place" maxlength="80" value="${escapeHtml(meta.place || "")}" placeholder="e.g. Back patio"></label><label>Notes<textarea name="notes" maxlength="500" placeholder="What did you notice?">${escapeHtml(meta.notes || "")}</textarea></label><button class="secondary" type="submit">Save record</button></form></section>
    <section class="section"><div class="eyebrow">Planting note</div><h2>Useful nearby advice</h2><p class="intro">${item.companions}</p></section>
    <section class="section"><div class="eyebrow">Your notes</div><h2>Care history</h2>${state.logs.filter((log) => log.plantId === item.id).slice(0, 8).map(activity).join("") || `<div class="empty">Nothing logged yet. Tap an action after your next visit.</div>`}</section><section class="section record-footer"><span>${meta.harvestCount || 0} harvest${meta.harvestCount === 1 ? "" : "s"} logged</span><button class="text-button danger-button" onclick="archivePlant('${item.id}')">Archive plant</button></section></section>${nav()}`;
}

function diagnose() {
  const selected = state.plants.length ? plant(state.diagnosisPlant || state.plants[0]) : null;
  return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div></header>  <div class="eyebrow">Plant help</div><h1>What do you need help with?</h1><p class="intro">Choose a simple path. You don’t need to know the gardening words first.</p>
  ${state.plants.length ? `<div class="diagnose-plant-picker"><span class="muted">I’m asking about</span><div class="picker-row">${state.plants.map((id) => { const item = plant(id); return `<button class="plant-chip ${selected?.id === id ? "selected" : ""}" onclick="chooseDiagnosisPlant('${id}')">${icon(item)}${item.name}</button>`; }).join("")}</div></div><div class="help-paths">${!state.helpMode ? `<button class="help-path-card" onclick="setHelpMode('care')"><span class="help-path-icon">✓</span><span><strong>What should I do today?</strong><small>Get the next care step for ${selected.name}.</small></span><b>›</b></button><button class="help-path-card" onclick="setHelpMode('symptoms')"><span class="help-path-icon">?</span><span><strong>My plant looks unhappy</strong><small>Choose the picture that looks most like it.</small></span><b>›</b></button><button class="help-path-card" onclick="setHelpMode('tips')"><span class="help-path-icon">i</span><span><strong>Give me plant tips</strong><small>See simple light, water, and growing advice.</small></span><b>›</b></button>` : helpModeContent(selected)}</div>` : `<div class="help-empty">${gardenArt("help")}<h2>Start with one real plant.</h2><p class="intro">Add a plant so HomeYield can give advice that belongs to your garden.</p><button class="primary" onclick="go('onboarding')">Add my first plant</button><button class="secondary" onclick="browseCatalog('plants')">Browse plant library</button></div>`}
  </section>${nav()}`;
}
function helpModeContent(item) {
  if (state.helpMode === "symptoms") return `<div class="help-mode-head"><button class="icon-button" onclick="resetHelp()" aria-label="Back to plant help">Back</button><strong>What do you see on ${item.name}?</strong></div><div class="diagnostic-choices"><button class="diagnosis-card" onclick="diagnosis('yellow')"><div class="symptom-image yellow"></div><div class="diagnosis-copy"><strong>Yellow leaves at the bottom</strong><span>The lower leaves fade first.</span></div></button><button class="diagnosis-card" onclick="diagnosis('spots')"><div class="symptom-image spots"></div><div class="diagnosis-copy"><strong>Brown spots on top</strong><span>Small marks spreading across leaves.</span></div></button></div>`;
  if (state.helpMode === "tips") return `<div class="help-mode-head"><button class="icon-button" onclick="resetHelp()" aria-label="Back to plant help">Back</button><strong>Simple tips for ${item.name}</strong></div><div class="care-help"><div class="care-help-row"><span>☀</span><div><strong>Light</strong><p>${item.sun}</p></div></div><div class="care-help-row"><span>↻</span><div><strong>Water</strong><p>${item.water}. ${nextWaterText(item.id)}.</p></div></div><div class="care-help-row"><span>✓</span><div><strong>Try this</strong><p>${item.tip}</p></div></div></div>`;
  return `<div class="help-mode-head"><button class="icon-button" onclick="resetHelp()" aria-label="Back to plant help">Back</button><strong>Today for ${item.name}</strong></div><div class="care-help"><div class="care-next"><div class="eyebrow">Next best step</div><h2>${nextWaterText(item.id)}</h2><p>${item.tip}</p><div class="task-actions"><button class="primary" onclick="logQuickAction('${item.id}', 'water')">Log watered</button><button class="secondary" onclick="logQuickAction('${item.id}', 'check')">Log checked</button></div></div><div class="care-help-row"><span>☀</span><div><strong>Light check</strong><p>${item.sun}</p></div></div></div>`;
}
function setHelpMode(mode) {
  state.helpMode = mode;
  state.diagnosisPlant = state.diagnosisPlant || state.plants[0];
  save(); render();
}
function resetHelp() { state.helpMode = ""; save(); render(); }
function chooseDiagnosisPlant(id) { state.diagnosisPlant = id; save(); render(); }
function diagnosis(type) {
  const yellow = type === "yellow"; const item = plant(state.diagnosisPlant);
  app.innerHTML = `<section class="screen"><header class="topbar"><button class="icon-button" onclick="go('diagnose')" aria-label="Choose another symptom">Back</button><div class="brand">Home<span>Yield</span></div></header><div class="result"><div class="eyebrow">${item ? `${item.name} · likely answer` : "Likely answer"}</div><h1>${yellow ? "A thirsty lower layer." : "Possible leaf spot."}</h1><p>${yellow ? "Older leaves often yellow when water is inconsistent. Give the soil a slow, deep soak and remove fully yellow leaves." : "Avoid splashing leaves when watering. Remove the most affected leaves and give your plant room for airflow."}</p><button class="primary" onclick="addDiagnosisTask('${type}')">Add a care task</button></div><section class="section"><h2>Keep watching</h2><p class="intro">If the change spreads quickly or affects new leaves, take a fresh photo and check again tomorrow.</p></section></section>${nav()}`;
}
function addDiagnosisTask(type) {
  const plantId = state.diagnosisPlant || state.plants[0]; const item = plant(plantId);
  if (!item) { go("onboarding"); toast("Add a plant first so we can save this advice."); return; }
  const task = type === "yellow" ? { id: `diagnosis-water-${plantId}`, plantId, type: "Plant check", title: `Give ${item?.name || "your plant"} a deep soak`, text: "Water slowly at the soil, then check the lower leaves tomorrow.", action: "water" } : { id: `diagnosis-airflow-${plantId}`, plantId, type: "Plant check", title: `Improve ${item?.name || "the plant"}'s airflow`, text: "Remove the most affected leaves and water at the soil.", action: "check" };
  if (!state.tasks.some((existing) => existing.id === task.id)) state.tasks.push(task);
  go("home"); toast("Care task added to today.");
}

function progress() {
  if (!state.plants.length) return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div></header><div class="empty-page">${gardenArt("progress")}<h1>Your progress starts with a plant.</h1><p class="intro">Track a plant to see its age, milestones, and harvest window.</p><button class="primary" onclick="go('onboarding')">Add plants</button></div></section>${nav()}`;
  return `<section class="screen"><header class="topbar"><div class="brand">Home<span>Yield</span></div></header><div class="eyebrow">Progress you can use</div><h1>How things are going.</h1><p class="intro">A simple estimate based on when you planted—not a digital garden to maintain.</p>${state.plants.map(growthCard).join("")}</section>${nav()}`;
}
function growthCard(id) {
  const item = plant(id); const meta = plantMeta(id); const plantedDays = daysSince(id); const progressValue = Math.min(100, Math.round(plantedDays / item.days * 100)); const ready = progressValue >= 100;
  const hot = state.weather?.forecast?.some((day) => day.high >= 30);
  const wet = state.weather?.forecast?.some((day) => day.rainChance >= 60);
  const weatherNote = hot ? "A hot stretch is coming; check soil moisture more often." : wet ? "Rain is coming; check the soil before watering." : "Keep following the care rhythm and log what you notice.";
  const stage = ready ? "Ready to harvest" : plantedDays > 25 ? "Established" : "Getting established";
  return `<article class="growth-card"><div class="growth-top">${icon(item)}<div><h2>${item.name}</h2><span>${stage} · ${Math.max(0, item.days - plantedDays)} days estimated</span></div><strong>${progressValue}%</strong></div><div class="progress"><span style="width:${progressValue}%"></span></div><p>${ready ? "Pick when it looks and tastes its best." : plantedDays > 25 ? "Keep watching for flowers or a harvestable size." : "Small, consistent care matters most right now."}</p><div class="growth-meta"><span>${nextWaterText(id)}</span><span>${meta.harvestCount || 0} harvested</span></div><p class="weather-note">${weatherNote}</p><button class="task-action" onclick="logQuickAction('${id}', 'harvest')">Log harvest</button></article>`;
}

function render() { applyTheme(); app.innerHTML = `${offlineBanner()}${state.screen === "onboarding" ? themeControl() : ""}${({ home, onboarding, plants, catalog, "plant-detail": plantDetail, diagnose, progress, location: locationScreen }[state.screen] || home)()}`; attachSwipes(); }
function attachSwipes() {
  document.querySelectorAll(".task-card").forEach((card) => {
    let start;
    card.addEventListener("pointerdown", (event) => { start = event.clientX; });
    card.addEventListener("pointerup", (event) => { if (start === undefined) return; const move = event.clientX - start; const id = card.dataset.task; if (move > 80) finishTask(id); if (move < -80) snoozeTask(id); start = undefined; });
  });
}
render();
if (isPackagedAndroid) {
  databaseStatus = "device";
  render();
} else if (isTauri) {
  void hydrateDatabase();
} else {
  void hydrateDatabase();
}
