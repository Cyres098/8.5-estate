/* =============================================================
   8.5 ESTATE PROPERTIES — Listing page controller (sale / rent)
   Reads ?status, ?type, ?location, ?beds, ?max from the URL,
   wires the filter sidebar, sorting and grid/list view.
   ============================================================= */
(function(){
  const root = document.querySelector("[data-listing]");
  if(!root) return;
  const mode = root.dataset.listing;               // "sale" | "rent" | "all"
  const params = new URLSearchParams(location.search);

  const state = {
    status:   mode === "all" ? (params.get("status")||"") : mode,
    type:     params.get("type")     || "",
    location: params.get("location") || "",
    beds:     +params.get("beds")    || 0,
    max:      +params.get("max")     || 0,
    minBaths: 0,
    sort:     "featured",
    view:     "grid"
  };

  const f = id => document.getElementById(id);
  const mount = "#listingGrid";

  /* populate location options from data */
  const locSel = f("fLocation");
  if(locSel){
    [...new Set(PROPERTIES.map(p=>p.location))].sort().forEach(loc=>{
      const o=document.createElement("option"); o.value=loc; o.textContent=loc; locSel.appendChild(o);
    });
  }

  /* reflect incoming params into controls */
  if(f("fType"))     f("fType").value     = state.type;
  if(locSel)         locSel.value          = state.location;
  if(f("fSort"))     f("fSort").value      = state.sort;
  syncBedChips();

  function syncBedChips(){
    document.querySelectorAll("[data-beds]").forEach(c=>
      c.classList.toggle("active", +c.dataset.beds === state.beds));
  }

  function maxPriceCeiling(){
    const pool = PROPERTIES.filter(p=> state.status ? p.status===state.status : true);
    return Math.max(...pool.map(p=>p.price), 0);
  }

  /* price range slider */
  const range = f("fPrice"), rangeVal = f("fPriceVal");
  if(range){
    const ceil = maxPriceCeiling();
    range.max = ceil; range.value = state.max || ceil;
    state.max = +range.value;
    rangeVal.textContent = fmt(range.value);
    range.addEventListener("input", ()=>{ state.max=+range.value; rangeVal.textContent=fmt(range.value); apply(); });
  }
  function fmt(v){ return (state.status==="rent" ? "$"+(+v).toLocaleString()+" / mo" : "$"+(+v).toLocaleString()); }

  /* bind controls */
  f("fType")     && f("fType").addEventListener("change", e=>{ state.type=e.target.value; apply(); });
  locSel         && locSel.addEventListener("change",     e=>{ state.location=e.target.value; apply(); });
  f("fSort")     && f("fSort").addEventListener("change", e=>{ state.sort=e.target.value; apply(); });
  document.querySelectorAll("[data-beds]").forEach(c=>
    c.addEventListener("click", ()=>{ state.beds = +c.dataset.beds===state.beds ? 0 : +c.dataset.beds; syncBedChips(); apply(); }));
  document.querySelectorAll("[data-baths]").forEach(c=>
    c.addEventListener("click", ()=>{
      state.minBaths = +c.dataset.baths===state.minBaths ? 0 : +c.dataset.baths;
      document.querySelectorAll("[data-baths]").forEach(x=>x.classList.toggle("active",+x.dataset.baths===state.minBaths));
      apply();
    }));
  f("fReset") && f("fReset").addEventListener("click", ()=>{
    Object.assign(state,{type:"",location:"",beds:0,max:maxPriceCeiling(),minBaths:0});
    if(f("fType")) f("fType").value=""; if(locSel) locSel.value="";
    if(range){ range.value=state.max; rangeVal.textContent=fmt(state.max); }
    syncBedChips();
    document.querySelectorAll("[data-baths]").forEach(x=>x.classList.remove("active"));
    apply();
  });

  /* view toggle */
  document.querySelectorAll("[data-view]").forEach(b=>
    b.addEventListener("click", ()=>{
      state.view=b.dataset.view;
      document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x===b));
      document.querySelector(mount).classList.toggle("list-view", state.view==="list");
    }));

  function apply(){
    let list = PROPERTIES.filter(p=>{
      if(state.status   && p.status   !== state.status)   return false;
      if(state.type     && p.type     !== state.type)     return false;
      if(state.location && p.location !== state.location) return false;
      if(state.beds     && p.beds      < state.beds)      return false;
      if(state.minBaths && p.baths     < state.minBaths)  return false;
      if(state.max      && p.price      > state.max)      return false;
      return true;
    });
    switch(state.sort){
      case "low":   list.sort((a,b)=>a.price-b.price); break;
      case "high":  list.sort((a,b)=>b.price-a.price); break;
      case "area":  list.sort((a,b)=>b.area-a.area);   break;
      default:      list.sort((a,b)=> (b.featured-a.featured) || (b.price-a.price));
    }
    const c = document.getElementById("resultCount");
    if(c) c.textContent = list.length;
    renderCards(list, mount);
  }

  apply();
})();
