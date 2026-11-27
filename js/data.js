/* =========================================================
   SITE DATA — this is the ONLY file you need to edit
   for content, prices and contacts.
   Everything here is a placeholder.
   ========================================================= */

const I18N = {
  en: {
    chooseLanguage: "Choose your language",
    english: "English",
    //russian: "Russian",
    //chinese: "Simplified Chinese",
    //chooseContact: "How would you like to contact us?",
    whatsapp: "WhatsApp",
    continue: "Continue",
    heroKicker: "24/7 alcohol delivery in",
    heroTitle1: "Drinks you love,",
    heroTitle2: "delivered",
    heroAccent: "day & night",
    heroText: "Beer & Booze , Wine and all , nicotine products and mixers delivered straight to your door",
    home: "Home",
    shop: "Shop",
    cart: "Cart",
    goToShop: "Go to shop",
    howItWorks: "How it works",
    shopByCategory: "Shop by category",
    viewAll: "View all →",
    viewAllNoArrow: "View all",
    faq: "FAQ",
    whyOrder: "Why order from us",
    quality: "Quality",
    speed: "Speed",
    convenience: "Convenience",
    whatYouGet: "What you get",
    roundTheClock: "Round-the-clock delivery.",
    freeDelivery: "Free delivery.",
    largeSelection: "Large selection.",
    flexibleTerms: "Flexible terms.",
    easyPayment: "Easy payment.",
    deliverAcross: "We deliver across",
    questions: "Questions",
    shopTitle: "Shop",
    searchPlaceholder: "Search drinks…",
    sortDefault: "Sort: default",
    priceLowHigh: "Price: low → high",
    priceHighLow: "Price: high → low",
    nameAZ: "Name A–Z",
    all: "All",
    thaiProducts: "🇹🇭 Thai products",
    nonThaiProducts: "🌍 Non-Thai products",
    noMatches: "No drinks match your search.",
    pack: "Pack",
    ml: "ml",
    add: "Add +",
    added: "Added ✓",
    yourOrder: "Your order",
    cartEmpty: "Your cart is empty.",
    browseShop: "Browse the shop →",
    freeDeliveryMsg: "🎉 You get free delivery!",
    addMoreForFree: "Add more for free delivery",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    total: "Total",
    cash: "Cash",
    card: "Card",
    name: "Name",
    phone: "Phone",
    deliveryAddress: "Delivery address",
    placeOrder: "Place order",
    orderSent: "Order sent!",
    checkChat: "Check the chat window that just opened.",
    footerShop: "Shop",
    footerInfo: "Info",
    footerHours: "Hours",
    privacyPolicy: "Privacy policy",
    hours24_7: "24/7 But mostly at night",
    deliveryTime: "Delivery 30 min – 1.3 hour",
  },
};

const PREFS_KEY_LANG = "sipcity_lang";

function getLang() {
  try { return localStorage.getItem(PREFS_KEY_LANG) || ""; } catch { return ""; }
}
function setLang(l) {
  try { localStorage.setItem(PREFS_KEY_LANG, l); } catch {}
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N.en[key] || key);
}

const CONFIG = {
  BRAND: "SipCity",                 // placeholder brand name
  CITY: "Chiang Mai",               // placeholder city
  CURRENCY: "฿",

  FREE_DELIVERY_MIN: 2499,          // free delivery over this total
  DELIVERY_FEE: 300,                // flat fee below the threshold

  /* ---------- CONTACT PLACEHOLDERS — replace with your own ----------
     Nothing real is wired in. Change these 4 values only.           */
  PHONE_DISPLAY: "+66 84 054 3254",          // shown in header / footer
  PHONE_TEL: "+66840543254",                 // used for tel: links
  WHATSAPP_URL: "https://wa.me/66840543254", // all WhatsApp buttons + order form
};

/* ---------- shop categories ----------
   alcohol: true → category shows the Thai / Non-Thai subcategory
   filter on the shop page (Mixers & Nicotine don't need it).      */
const CATEGORIES = [
  { id: "beer",       name: "Beer",             icon: "🍺", alcohol: true },
  { id: "spirits",    name: "Spirits",          icon: "🥃", alcohol: true },
  { id: "sake-soju",  name: "Sake & Soju",      icon: "🍶", alcohol: true },
  { id: "wine",       name: "Wine & Champagne", icon: "🍷", alcohol: true },
  { id: "mixers",     name: "Mixers & Snacks",  icon: "🥜" },
  { id: "nicotine",   name: "Nicotine",         icon: "💨" },
];

/* ---------- products (placeholder catalog) ----------
   Simple product:
     { id, name, cat, volume: "330 ml", price: 79, origin: "thai", img? }
   Variant product (two selectors on the card — pack, then ml):
     { id, name, cat, origin, img?,
       variants: [
         { pack: "Can",    sizes: [ { ml: "330 ml", price: 80 }, … ] },
         { pack: "Bottle", sizes: [ { ml: "630 ml", price: 120 }, … ] },
       ] }
   origin: ONLY alcohol products — "thai" (Thai product) or
           "intl" (non-Thai / imported). Drives the Thai /
           Non-Thai subcategory filter. Mixers & Nicotine: no field.
   img:  OPTIONAL — path to a product photo, e.g. "img/beer.jpg"
         Recommended: square-ish, ~600×600 px (jpg/png/webp/svg).
         Put files in the img/ folder. If omitted (or the file is
         missing), the category emoji is shown instead.            */
const PRODUCTS = [
  // ADD YOUR PRODUCTS HERE — example:
  // { id: "id_beer_01", name: "Golden Lager", cat: "beer", volume: "330 ml", price: 79, origin: "thai" },
  //
  // id:     unique string — use a new one for every product
  // cat:    "beer" | "spirits" | "sake-soju" | "wine" | "mixers" | "nicotine"
  // origin: alcohol only — "thai" (Thai product) or "intl" (non-Thai)
  // img:    optional photo path, e.g. "img/beer.jpg" (put files in img/)

  // ---- Beer Corona Extra (imported) ----
  { id: "id_corona", name: "Beer Corona Extra", cat: "beer", origin: "intl", img: "img/corona.png",
    volume: "Bottle 330 ml", price: 130 },

  // ---- Beer San Miguel Light (imported) ----
  { id: "id_sanmig", name: "Beer San Miguel Light", cat: "beer", origin: "intl", img: "img/sanmig.jpg",
    volume: "Bottle 330 ml", price: 95 },

  // ---- Beer Heineken (imported) ----
  { id: "id_heineken", name: "Beer Heineken", cat: "beer", origin: "intl", img: "img/heineken.jpg",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 90 }, { ml: "620 ml", price: 140 } ] },
      { pack: "Can",    sizes: [ { ml: "490 ml", price: 130 } ] },
    ] },

  // ---- Beer Hoegaarden (imported) ----
  { id: "id_hoegaarden", name: "Beer Hoegaarden", cat: "beer", origin: "intl", img: "img/hoegaarden.png",
    variants: [
      { pack: "Can", sizes: [ { ml: "490 ml", price: 170 } ] },
    ] },

  // ---- Beer Singha ----
  { id: "id_singha", name: "Beer Singha", cat: "beer", origin: "thai", img: "img/singha.png",
    variants: [
      { pack: "Can",    sizes: [ { ml: "330 ml", price: 80 },  { ml: "490 ml", price: 120 } ] },
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 80 },  { ml: "630 ml", price: 130 } ] },
    ] },

  // ---- Chang Classic Beer ----
  { id: "id_chang", name: "Chang Classic Beer", cat: "beer", origin: "thai", img: "img/chang.png",
    variants: [
      { pack: "Can",    sizes: [ { ml: "320 ml", price: 70 },  { ml: "490 ml", price: 95 } ] },
      { pack: "Bottle", sizes: [ { ml: "320 ml", price: 70 },  { ml: "620 ml", price: 110 } ] },
    ] },

  // ---- Leo Beer ----
  { id: "id_leo", name: "Leo Beer", cat: "beer", origin: "thai", img: "img/leo.png",
    variants: [
      { pack: "Can",    sizes: [ { ml: "330 ml", price: 80 },  { ml: "490 ml", price: 95 } ] },
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 80 },  { ml: "630 ml", price: 110 } ] },
    ] },

  // ---- White Wine Jacob's Creek Chardonnay (imported) ----
  { id: "id_jacobscreek", name: "White Wine Jacob's Creek Chardonnay", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/jacobs.jpg",
    volume: "Bottle 750 ml", price: 900 },
  { id: "id_wine_brancott_sauvignon_blanc", name: "White Wine Brancott Estate Sauvignon Blanc", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_brancott_sauvignon_blanc.png",
    volume: "Bottle 750 ml", price: 1100 },
  { id: "id_wine_michel_lynch_sauvignon_blanc", name: "White Wine Michel Lynch Sauvignon Blanc", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_michel_lynch_sauvignon_blanc.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_wolf_blass_eaglehawk_chardonnay", name: "White Wine Wolf Blass Eaglehawk Chardonnay", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_wolf_blass_eaglehawk_chardonnay.png",
    volume: "Bottle 750 ml", price: 800 },
  { id: "id_wine_penfolds_koonunga_hill_chardonnay", name: "White Wine Penfolds Koonunga Hill Chardonnay", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_penfolds_koonunga_hill_chardonnay.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_yellow_tail_chardonnay", name: "White Wine Yellow Tail Chardonnay", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_yellow_tail_chardonnay.png",
    volume: "Bottle 750 ml", price: 1200 },
  { id: "id_wine_mussel_bay_marlborough_sauvignon_blanc", name: "White Wine Mussel Bay Marlborough Sauvignon Blanc", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_mussel_bay_marlborough_sauvignon_blanc.png",
    volume: "Bottle 750 ml", price: 1350 },
  { id: "id_wine_domaine_lafage_cote_floral", name: "White Wine Domaine Lafage Côté Floral", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_domaine_lafage_cote_floral.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_zonin_pinot_grigio_terre_siciliane", name: "White Wine Zonin Pinot Grigio Terre Siciliane IGT", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_zonin_pinot_grigio_terre_siciliane.png",
    volume: "Bottle 750 ml", price: 1200 },
  { id: "id_wine_matua_sauvignon_blanc", name: "White Wine Matua Sauvignon Blanc", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_matua_sauvignon_blanc.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_mouton_cadet_bordeaux", name: "White Wine Mouton Cadet Bordeaux", cat: "wine", subcat: "white-wine", origin: "intl", img: "img/wine_mouton_cadet_bordeaux.png",
    volume: "Bottle 750 ml", price: 1750 },
  // ---- Red Wine ----
  { id: "id_wine_jacobs_creek_cabernet", name: "Red Wine Jacob's Creek Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_jacobs_creek_cabernet.png",
    volume: "Bottle 750 ml", price: 900 },
  { id: "id_wine_penfolds_bin_2", name: "Red Wine Penfolds Bin 2 Shiraz Mataro", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_penfolds_bin_2.png",
    volume: "Bottle 750 ml", price: 2000 },
  { id: "id_wine_belleville_grenache_syrah_merlot", name: "Red Wine Belleville Grenache Syrah Merlot", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_belleville_grenache_syrah_merlot.png",
    volume: "Bottle 750 ml", price: 800 },
  { id: "id_wine_wolf_blass_eaglehawk_cabernet", name: "Red Wine Wolf Blass Eaglehawk Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_wolf_blass_eaglehawk_cabernet.png",
    volume: "Bottle 750 ml", price: 800 },
  { id: "id_wine_concha_y_toro_reservado_cabernet", name: "Red Wine Concha Y Toro Reservado Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_concha_y_toro_reservado_cabernet.png",
    volume: "Bottle 750 ml", price: 800 },
  { id: "id_wine_concha_y_toro_casillero_diablo", name: "Red Wine Concha Y Toro Casillero Del Diablo Reserva Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_concha_y_toro_casillero_diablo.png",
    volume: "Bottle 750 ml", price: 1000 },
  { id: "id_wine_penfolds_koonunga_hill_shiraz", name: "Red Wine Penfolds Koonunga Hill Shiraz", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_penfolds_koonunga_hill_shiraz.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_michel_lynch_bordeaux_rouge", name: "Red Wine Michel Lynch Bordeaux Rouge", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_michel_lynch_bordeaux_rouge.png",
    volume: "Bottle 750 ml", price: 1400 },
  { id: "id_wine_robert_mondavi_private_selection", name: "Red Wine Robert Mondavi Private Selection Vint Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_robert_mondavi_private_selection.png",
    volume: "Bottle 750 ml", price: 2000 },
  { id: "id_wine_jacobs_creek_double_barrel_shiraz", name: "Red Wine Jacob's Creek Double Barrel Shiraz", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_jacobs_creek_double_barrel_shiraz.png",
    volume: "Bottle 750 ml", price: 2000 },
  { id: "id_wine_yellow_tail_cabernet_sauvignon", name: "Red Wine Yellow Tail Cabernet Sauvignon", cat: "wine", subcat: "red-wine", origin: "intl", img: "img/wine_yellow_tail_cabernet_sauvignon.png",
    volume: "Bottle 750 ml", price: 1200 },
  // ---- Champagne / Sparkling Wine ----
  { id: "id_wine_jacobs_creek_sparkling", name: "Champagne Jacob's Creek Sparkling Chardonnay Pinot", cat: "wine", subcat: "champagne", origin: "intl", img: "img/wine_jacobs_creek_sparkling.png",
    volume: "Bottle 750 ml", price: 1200 },
  { id: "id_wine_veuve_clicquot", name: "Champagne Veuve Clicquot Brut", cat: "wine", subcat: "champagne", origin: "intl", img: "img/wine_veuve_clicquot.png",
    volume: "Bottle 750 ml", price: 4600 },
  { id: "id_wine_moet_rose_imperial", name: "Champagne Moet & Chandon Rose Imperial", cat: "wine", subcat: "champagne", origin: "intl", img: "img/champagne_moet_rose_imperial.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "200 ml", price: 1400 }, { ml: "750 ml", price: 5200 } ] },
    ] },
  { id: "id_wine_breton_fils_tradition", name: "Champagne Breton Fils Tradition Brut", cat: "wine", subcat: "champagne", origin: "intl", img: "img/champagne_breton_fils.png",
    volume: "Bottle 750 ml", price: 3000 },
  { id: "id_wine_cuve_brut_gift", name: "Champagne Cuvée Brut NV Gift Box", cat: "wine", subcat: "champagne", origin: "intl", img: "img/champagne_cuve_brut_gift.png",
    volume: "Bottle 750 ml", price: 4500 },
  { id: "id_wine_veuve_clicquot_rose", name: "Champagne Veuve Clicquot Rose", cat: "wine", subcat: "champagne", origin: "intl", img: "img/champagne_veuve_clicquot_rose.png",
    volume: "Bottle 750 ml", price: 4900 },

  // ---- Spirits (imported) ----
  { id: "id_whiskey_jameson", name: "Whiskey Jameson Irish", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_jameson.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 2200 }, { ml: "1000 ml", price: 2700 } ] },
    ] },
  { id: "id_vodka_absolut", name: "Vodka Absolut", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_absolut.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 1400 }, { ml: "1000 ml", price: 2000 } ] },
    ] },
  { id: "id_vodka_smirnoff", name: "Vodka Smirnoff", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_smirnoff.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "200 ml", price: 550 }, { ml: "700 ml", price: 1150 }, { ml: "1000 ml", price: 1700 } ] },
    ] },
  { id: "id_vodka_gilbeys", name: "Vodka Gilbey's", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_gilbeys.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 700 }, { ml: "1000 ml", price: 1000 } ] },
    ] },
  { id: "id_vodka_grey_goose", name: "Vodka Grey Goose", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_grey_goose.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "750 ml", price: 3900 }, { ml: "1750 ml", price: 8500 } ] },
    ] },
  { id: "id_vodka_phoenix", name: "Vodka Phoenix", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_phoenix.png",
    volume: "Bottle 700 ml", price: 900 },
  { id: "id_vodka_titos", name: "Vodka Tito's", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_titos.png",
    volume: "Bottle 750 ml", price: 1800 },
  { id: "id_vodka_belvedere", name: "Vodka Belvedere", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_belvedere.png",
    volume: "Bottle 700 ml", price: 4000 },
  { id: "id_vodka_absolut_lime", name: "Vodka Absolut Lime", cat: "spirits", subcat: "vodka", origin: "intl", img: "img/vodka_absolut_lime.png",
    volume: "Bottle 700 ml", price: 1600 },
  { id: "id_rum_captain_morgan", name: "Rum Captain Morgan", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_captain_morgan.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 400 }, { ml: "700 ml", price: 750 } ] },
    ] },
  { id: "id_rum_bacardi", name: "Rum Bacardi Carta Blanca", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_bacardi.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "750 ml", price: 1500 }, { ml: "1000 ml", price: 1900 } ] },
    ] },
  { id: "id_rum_captain_morgan_white", name: "Rum Captain Morgan White", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_captain_morgan_white.png",
    volume: "Bottle 700 ml", price: 1200 },
  { id: "id_rum_captain_morgan_dark", name: "Rum Captain Morgan Dark", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_captain_morgan_dark.png",
    volume: "Bottle 700 ml", price: 1450 },
  { id: "id_rum_sangsom", name: "Rum Sangsom", cat: "spirits", subcat: "rum", origin: "thai", img: "img/rum_sangsom.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "300 ml", price: 350 }, { ml: "700 ml", price: 550 }, { ml: "1000 ml", price: 900 } ] },
    ] },
  { id: "id_rum_havana_club_3", name: "Rum Havana Club 3", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_havana_club_3.png",
    volume: "Bottle 700 ml", price: 1500 },
  { id: "id_rum_malibu", name: "Rum Malibu Coconut", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_malibu.png",
    volume: "Bottle 700 ml", price: 1600 },
  { id: "id_rum_kraken", name: "Rum Kraken Black Spiced", cat: "spirits", subcat: "rum", origin: "intl", img: "img/rum_kraken.png",
    volume: "Bottle 700 ml", price: 3300 },
  { id: "id_whiskey_jack_daniels", name: "Whiskey Jack Daniel's No.7", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_jack_daniels.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "350 ml", price: 1300 }, { ml: "700 ml", price: 2400 }, { ml: "1000 ml", price: 3300 } ] },
    ] },
  { id: "id_whiskey_chivas_regal_12", name: "Whiskey Chivas Regal 12 Year Old", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_chivas_regal_12.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 2650 }, { ml: "1000 ml", price: 3350 } ] },
    ] },
  { id: "id_whiskey_glenfiddich_12", name: "Whiskey Glenfiddich 12 years old", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_glenfiddich_12.png",
    volume: "Bottle 700 ml", price: 4500 },
  { id: "id_whiskey_dewars_white_label", name: "Whiskey Dewar's White Label", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_dewars_white_label.png",
    volume: "Bottle 1000 ml", price: 1700 },
  { id: "id_whiskey_johnnie_walker_gold", name: "Whiskey Johnnie Walker Gold Label", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_johnnie_walker_gold.png",
    volume: "Bottle 700 ml", price: 4400 },
  { id: "id_whiskey_ballantines_finest", name: "Whiskey Ballantine's Finest", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_ballantines_finest.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 1300 }, { ml: "1000 ml", price: 1700 } ] },
    ] },
  { id: "id_whiskey_johnnie_walker_green", name: "Whiskey Johnnie Walker Green Label", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_johnnie_walker_green.png",
    volume: "Bottle 700 ml", price: 4800 },
  { id: "id_whiskey_monkey_shoulder", name: "Whiskey Monkey Shoulder Blended Malt Scotch", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_monkey_shoulder.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 3100 }, { ml: "1000 ml", price: 4100 } ] },
    ] },
  { id: "id_whiskey_johnnie_walker_red", name: "Whiskey Johnnie Walker Red Label", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_johnnie_walker_red.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "200 ml", price: 550 }, { ml: "700 ml", price: 1350 }, { ml: "1000 ml", price: 1700 } ] },
    ] },
  { id: "id_gin_gordons", name: "Gin Gordon's", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_gordons.png",
    volume: "Bottle 700 ml", price: 1700 },
  { id: "id_gin_bombay_sapphire", name: "Gin Bombay Sapphire", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_bombay_sapphire.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "200 ml", price: 800 }, { ml: "700 ml", price: 2300 }, { ml: "1000 ml", price: 3500 } ] },
    ] },
  { id: "id_gin_beefeater", name: "Gin Beefeater", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_beefeater.png",
    volume: "Bottle 750 ml", price: 1850 },
  { id: "id_gin_tanqueray", name: "Gin Tanqueray", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_tanqueray.png",
    volume: "Bottle 750 ml", price: 2200 },
  { id: "id_gin_hendricks", name: "Gin Hendrick's", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_hendricks.png",
    volume: "Bottle 700 ml", price: 4000 },
  { id: "id_gin_monkey_47", name: "Gin Monkey 47", cat: "spirits", subcat: "gin", origin: "intl", img: "img/gin_monkey_47.png",
    volume: "Bottle 500 ml", price: 4500 },
  { id: "id_tequila_patron_silver", name: "Tequila Patron Silver", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_patron_silver.png",
    volume: "Bottle 750 ml", price: 5000 },
  { id: "id_tequila_sierra_blanco", name: "Tequila Sierra Blanco", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_sierra_blanco.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 1800 }, { ml: "1000 ml", price: 2500 } ] },
    ] },
  { id: "id_tequila_patron_reposado", name: "Tequila Patron Reposado", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_patron_reposado.png",
    volume: "Bottle 750 ml", price: 7000 },
  { id: "id_tequila_patron_anejo", name: "Tequila Patron Anejo", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_patron_anejo.png",
    volume: "Bottle 750 ml", price: 7000 },
  { id: "id_tequila_don_julio_blanco", name: "Tequila Don Julio Blanco", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_don_julio_blanco.png",
    volume: "Bottle 700 ml", price: 5200 },
  { id: "id_liquor_jagermeister", name: "Liquor Jagermeister", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_jagermeister.png",
    volume: "Bottle 700 ml", price: 1900 },
  { id: "id_liquor_baileys", name: "Liquor Baileys Original Irish Cream", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_baileys.png",
    volume: "Bottle 700 ml", price: 2350 },
  // ---- Missing whiskey products ----
  { id: "id_whiskey_johnnie_walker_black", name: "Whiskey Johnnie Walker Black Label", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_johnnie_walker_black.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "350 ml", price: 1300 }, { ml: "700 ml", price: 2650 }, { ml: "1000 ml", price: 3350 } ] },
    ] },
  { id: "id_whiskey_jack_daniels_apple", name: "Whiskey Jack Daniel's Apple", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_jack_daniels_apple.png",
    volume: "Bottle 700 ml", price: 2400 },
  { id: "id_whiskey_jack_honey", name: "Whiskey Jack Honey", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_jack_honey.png",
    volume: "Bottle 700 ml", price: 2400 },
  { id: "id_whiskey_jack_daniels_tennessee_fire", name: "Whiskey Jack Daniel's Tennessee Fire", cat: "spirits", subcat: "whiskey", origin: "intl", img: "img/whiskey_jack_daniels_tennessee_fire.png",
    volume: "Bottle 700 ml", price: 2400 },
  // ---- Missing tequila products ----
  { id: "id_tequila_jose_cuervo_especial", name: "Tequila Jose Cuervo Especial", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_jose_cuervo_especial.png",
    volume: "Bottle 700 ml", price: 2500 },
  { id: "id_tequila_sierra_reposado", name: "Tequila Sierra Reposado", cat: "spirits", subcat: "tequila", origin: "intl", img: "img/tequila_sierra_reposado.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "700 ml", price: 1800 }, { ml: "1000 ml", price: 2500 } ] },
    ] },
  // ---- Missing liquor products ----
  { id: "id_liquor_ricard", name: "Liquor Ricard", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_ricard.png",
    volume: "Bottle 700 ml", price: 2100 },
  { id: "id_liquor_kahlua", name: "Liquor Kahlúa", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_kahlua.png",
    volume: "Bottle 700 ml", price: 2300 },
  { id: "id_liquor_tequila_rose", name: "Liquor Tequila Rose Strawberry Cream", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_tequila_rose.png",
    volume: "Bottle 700 ml", price: 2000 },
  { id: "id_liquor_disaronno", name: "Liquor Disaronno Originale", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_disaronno.png",
    volume: "Bottle 700 ml", price: 2250 },
  { id: "id_liquor_grand_marnier", name: "Liquor Grand Marnier Cordon Rouge", cat: "spirits", subcat: "liquor", origin: "intl", img: "img/liquor_grand_marnier.png",
    volume: "Bottle 700 ml", price: 3600 },
  // ---- Brandy (Thai) ----
  { id: "id_brandy_regency_vsop", name: "Brandy Regency VSOP", cat: "spirits", subcat: "brandy", origin: "thai", img: "img/brandy_regency.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "350 ml", price: 400 }, { ml: "500 ml", price: 600 } ] },
    ] },
  // ---- Brandy / Cognac (imported) ----
  { id: "id_brandy_hennessy_vsop", name: "Cognac Hennessy VSOP", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_hennessy_vsop.png",
    volume: "Bottle 700 ml", price: 6500 },
  { id: "id_brandy_martell_noblige", name: "Cognac Martell Noblige", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_martell_noblige.png",
    volume: "Bottle 700 ml", price: 6800 },
  { id: "id_brandy_hennessy_vs", name: "Cognac Hennessy VS", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_hennessy_vs.png",
    volume: "Bottle 700 ml", price: 3900 },
  { id: "id_brandy_martell_vs", name: "Cognac Martell VS", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_martell_vs.png",
    volume: "Bottle 700 ml", price: 3800 },
  { id: "id_brandy_remy_martin_vsop", name: "Cognac Rémy Martin VSOP", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_remy_martin_vsop.png",
    volume: "Bottle 700 ml", price: 6200 },
  { id: "id_brandy_remy_martin_1738", name: "Cognac Rémy Martin 1738 Accord Royal", cat: "spirits", subcat: "brandy", origin: "intl", img: "img/cognac_remy_martin_1738.png",
    volume: "Bottle 700 ml", price: 7100 },
  // ---- Soju (Geonbae flavors) ----
  { id: "id_soju_geonbae_classic", name: "Soju Geonbae Classic", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-classic.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_apple", name: "Soju Geonbae Apple", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-apple.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_lychee", name: "Soju Geonbae Lychee", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-lychee.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_peach", name: "Soju Geonbae Peach", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-peach.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_grapefruit", name: "Soju Geonbae Grapefruit", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-grapefruit.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_strawberry", name: "Soju Geonbae Strawberry", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-strawberry.png",
    volume: "Bottle 360 ml", price: 140 },
  { id: "id_soju_geonbae_black_grape", name: "Soju Geonbae Black Grape", cat: "sake-soju", origin: "intl", img: "img/soju-geonbae-black-grape.png",
    volume: "Bottle 360 ml", price: 140 },
  // ---- Rum Hong Thong ----
  { id: "id_rum_hong_thong", name: "Rum Hong Thong", cat: "spirits", subcat: "rum", origin: "thai", img: "img/rum-hong-thong.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "350 ml", price: 300 }, { ml: "700 ml", price: 530 }, { ml: "1000 ml", price: 800 } ] },
    ] },
  // ---- Beer Budweiser ----
  { id: "id_beer_budweiser_bottle", name: "Beer Budweiser Bottle", cat: "beer", origin: "intl", img: "img/beer-budweiser.webp",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 89 }, { ml: "620 ml", price: 145 } ] },
    ] },
  { id: "id_beer_budweiser_can", name: "Beer Budweiser Can", cat: "beer", origin: "intl", img: "img/beer-budweiser-can.webp",
    variants: [
      { pack: "Can", sizes: [ { ml: "330 ml", price: 89 }, { ml: "500 ml", price: 130 } ] },
    ] },
  // ---- Beer Asahi ----
  { id: "id_beer_asahi_bottle", name: "Beer Asahi Bottle", cat: "beer", origin: "intl", img: "img/beer-asahi.png",
    variants: [
      { pack: "Bottle", sizes: [ { ml: "330 ml", price: 100 }, { ml: "620 ml", price: 150 } ] },
    ] },
  { id: "id_beer_asahi_can", name: "Beer Asahi Can", cat: "beer", origin: "intl", img: "img/beer-asahi-can.png",
    variants: [
      { pack: "Can", sizes: [ { ml: "490 ml", price: 115 } ] },
    ] },
];
