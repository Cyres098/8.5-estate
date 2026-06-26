/* =============================================================
   8.5 ESTATE PROPERTIES — Property data + render helpers
   In production these records are served from MySQL via
   php/properties_api.php. This file is the front-end fallback /
   demo dataset so the site is fully browsable without a server.
   ============================================================= */

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* graceful fallback if an Unsplash id ever fails */
const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
       <stop offset='0' stop-color='#1B1B1B'/><stop offset='1' stop-color='#3a3128'/></linearGradient></defs>
       <rect width='800' height='600' fill='url(#g)'/>
       <text x='50%' y='50%' fill='#B08D57' font-family='Georgia' font-size='38'
       text-anchor='middle' dominant-baseline='middle'>8.5 Estate</text></svg>`
  );
function imgFallback(el){ el.onerror=null; el.src=FALLBACK; }

const PROPERTIES = [
  { id:1, title:"The Cantonments Villa", type:"House", status:"sale", featured:true,
    location:"Cantonments, Accra", price:1850000, beds:5, baths:6, area:740, garage:3,
    img:[IMG("1613490493576-7fde63acd811"),IMG("1600607687939-ce8a6c25118c"),IMG("1600566753086-00f18fb6b3ea"),IMG("1600210492486-724fe5c67fb0")],
    desc:"A contemporary masterpiece set behind private gates in Cantonments — floor-to-ceiling glazing, a double-height atrium, infinity pool and staff quarters, moments from the diplomatic quarter." },

  { id:2, title:"Trasacco Sky Residence", type:"Apartment", status:"sale", featured:true,
    location:"Trasacco Valley, East Legon", price:1250000, beds:4, baths:4, area:410, garage:2,
    img:[IMG("1600585154340-be6161a56a0c"),IMG("1600047509807-ba8f99d2cdde"),IMG("1505691938895-1758d7feb511"),IMG("1600566753190-17f0baa2a6c3")],
    desc:"A full-floor residence within Ghana's most prestigious gated community. Private elevator access, a wraparound terrace and uninterrupted skyline views." },

  { id:3, title:"Airport Residential Penthouse", type:"Apartment", status:"sale", featured:true,
    location:"Airport Residential, Accra", price:980000, beds:3, baths:4, area:330, garage:2,
    img:[IMG("1600121848594-d8644e57abab"),IMG("1600210492486-724fe5c67fb0"),IMG("1502672260266-1c1ef2d93688"),IMG("1505691938895-1758d7feb511")],
    desc:"A duplex penthouse crowning a boutique tower — chef's kitchen, private roof garden and concierge service in the heart of Airport Residential." },

  { id:4, title:"Labone Garden House", type:"House", status:"sale", featured:false,
    location:"Labone, Accra", price:720000, beds:4, baths:4, area:520, garage:2,
    img:[IMG("1600585152220-90363fe7e115"),IMG("1600047509807-ba8f99d2cdde"),IMG("1600566753086-00f18fb6b3ea")],
    desc:"A serene family home wrapped in mature gardens, with a sun-lit living pavilion opening onto a landscaped courtyard and pool." },

  { id:5, title:"Ridge Executive Townhouse", type:"House", status:"sale", featured:false,
    location:"Ridge, Accra", price:640000, beds:4, baths:3, area:380, garage:2,
    img:[IMG("1564013799919-ab600027ffc6"),IMG("1600210492486-724fe5c67fb0"),IMG("1600566753190-17f0baa2a6c3")],
    desc:"Refined townhouse living minutes from the central business district — double-volume reception, fitted kitchen and a private rooftop lounge." },

  { id:6, title:"Aburi Hillside Retreat", type:"House", status:"sale", featured:true,
    location:"Aburi, Eastern Region", price:560000, beds:5, baths:4, area:680, garage:3,
    img:[IMG("1512917774080-9991f1c4c750"),IMG("1600607687939-ce8a6c25118c"),IMG("1600047509807-ba8f99d2cdde")],
    desc:"A tranquil estate above the Aburi hills with panoramic valley views, an infinity edge pool and an outdoor entertainment terrace." },

  { id:7, title:"Cantonments Cluster Apartment", type:"Apartment", status:"rent", featured:false,
    location:"Cantonments, Accra", price:4500, beds:3, baths:3, area:260, garage:1,
    img:[IMG("1502672260266-1c1ef2d93688"),IMG("1505691938895-1758d7feb511"),IMG("1600566753190-17f0baa2a6c3")],
    desc:"A fully serviced three-bedroom apartment with backup power, gym and pool — leased furnished or unfurnished, ideal for expatriate executives." },

  { id:8, title:"East Legon Family Home", type:"House", status:"rent", featured:true,
    location:"East Legon, Accra", price:6500, beds:5, baths:5, area:560, garage:3,
    img:[IMG("1600585154340-be6161a56a0c"),IMG("1600210492486-724fe5c67fb0"),IMG("1600566753086-00f18fb6b3ea")],
    desc:"A gated five-bedroom residence with private pool, generator and staff quarters in the sought-after American House neighbourhood." },

  { id:9, title:"Airport City Office Floor", type:"Commercial", status:"rent", featured:false,
    location:"Airport City, Accra", price:9800, beds:0, baths:4, area:620, garage:8,
    img:[IMG("1497366216548-37526070297c"),IMG("1486406146926-c627a92ad1ab"),IMG("1431576901776-e539bd916ba2")],
    desc:"Grade-A open-plan office floor in a landmark Airport City tower — raised flooring, central air, fibre and secured parking." },

  { id:10, title:"Osu Commercial Building", type:"Commercial", status:"sale", featured:false,
    location:"Osu, Accra", price:2400000, beds:0, baths:6, area:1100, garage:12,
    img:[IMG("1486406146926-c627a92ad1ab"),IMG("1497366216548-37526070297c"),IMG("1431576901776-e539bd916ba2")],
    desc:"A prominent mixed-use commercial building on Oxford Street with ground-floor retail and four upper office floors — strong rental yield." },

  { id:11, title:"Tema Community 25 Apartment", type:"Apartment", status:"rent", featured:false,
    location:"Tema, Greater Accra", price:3200, beds:2, baths:2, area:165, garage:1,
    img:[IMG("1545324418-cc1a3fa10c00"),IMG("1502672260266-1c1ef2d93688"),IMG("1600566753190-17f0baa2a6c3")],
    desc:"A bright two-bedroom apartment in a managed development with 24/7 security, swimming pool and reliable power." },

  { id:12, title:"East Legon Hills Mansion", type:"House", status:"sale", featured:false,
    location:"East Legon Hills, Accra", price:890000, beds:6, baths:6, area:820, garage:4,
    img:[IMG("1600585152220-90363fe7e115"),IMG("1600607687939-ce8a6c25118c"),IMG("1600047509807-ba8f99d2cdde")],
    desc:"An expansive six-bedroom mansion on a generous plot with cinema room, gym, pool and landscaped grounds." }
];

const AGENTS = {
  default:{ name:"Ama Boateng", role:"Senior Property Consultant",
    photo:IMG("1573496359142-b8d87734a5a2",300), phone:"+233545854423" }
};

/* ---------- formatting ---------- */
function money(v, status){
  const s = "$" + v.toLocaleString("en-US");
  return status === "rent" ? s : s;
}
function priceLabel(p){
  return p.status === "rent"
    ? `${money(p.price)} <small>/ month</small>`
    : `${money(p.price)}`;
}
function tagFor(p){
  if(p.status==="sold")  return `<span class="tag tag--sold">Sold</span>`;
  if(p.status==="rent")  return `<span class="tag tag--rent">For Rent</span>`;
  return `<span class="tag tag--sale">For Sale</span>`;
}

/* ---------- card markup ---------- */
function cardHTML(p){
  const specs = p.type==="Commercial"
    ? `<span><i class="fa-regular fa-building"></i> ${p.type}</span>
       <span><i class="fa-solid fa-restroom"></i> ${p.baths}</span>
       <span><i class="fa-solid fa-vector-square"></i> ${p.area} m²</span>`
    : `<span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span>
       <span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span>
       <span><i class="fa-solid fa-vector-square"></i> ${p.area} m²</span>`;
  return `
  <article class="pcard" data-aos="fade-up">
    <div class="pcard__media">
      <img src="${p.img[0]}" alt="${p.title} in ${p.location}" loading="lazy" onerror="imgFallback(this)">
      <div class="pcard__tags">${tagFor(p)}${p.featured?'<span class="tag tag--featured">Featured</span>':''}</div>
      <button class="pcard__fav" aria-label="Save to wishlist" data-fav="${p.id}"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="pcard__body">
      <span class="pcard__loc"><i class="fa-solid fa-location-dot"></i> ${p.location}</span>
      <h3 class="pcard__title">${p.title}</h3>
      <div class="pcard__price">${priceLabel(p)}</div>
      <div class="pcard__specs">${specs}</div>
      <a class="pcard__link" href="property.html?id=${p.id}" aria-label="View ${p.title}"></a>
    </div>
  </article>`;
}

function renderCards(list, mount){
  const el = typeof mount==="string" ? document.querySelector(mount) : mount;
  if(!el) return;
  if(!list.length){
    el.innerHTML = `<div class="empty"><i class="fa-regular fa-folder-open"></i>
      <p>No properties match your filters. Try widening your search.</p></div>`;
    return;
  }
  el.innerHTML = list.map(cardHTML).join("");
  if(window.bindFavs) window.bindFavs();
  if(window.AOS) AOS.refreshHard();
}
