/* =============================================================
   8.5 ESTATE PROPERTIES — Core interactions
   ============================================================= */
(function(){
  "use strict";
  const $  = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* tiny safe storage wrapper (degrades if storage is blocked) */
  const store = {
    get(k,f){ try{ return JSON.parse(localStorage.getItem(k)) ?? f; }catch{ return f; } },
    set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }
  };

  /* ---------------- Navigation ---------------- */
  const nav = $(".nav");
  const onScroll = ()=>{ if(nav) nav.classList.toggle("scrolled", scrollY > 40); };
  onScroll(); addEventListener("scroll", onScroll, {passive:true});

  const burger = $(".burger"), drawer = $(".drawer");
  if(burger && drawer){
    const toggle = o => { burger.classList.toggle("open",o); drawer.classList.toggle("open",o);
      document.body.style.overflow = o ? "hidden" : ""; };
    burger.addEventListener("click", ()=> toggle(!drawer.classList.contains("open")));
    $$("a", drawer).forEach(a=> a.addEventListener("click", ()=> toggle(false)));
  }

  /* highlight current page in nav */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav__links a, .drawer a").forEach(a=>{
    if(a.getAttribute("href") === here) a.classList.add("active");
  });

  /* ---------------- Floating contact widget ---------------- */
  const fab = $(".fab");
  if(fab){
    const t = $(".fab__toggle", fab);
    t.addEventListener("click", ()=> fab.classList.toggle("open"));
    document.addEventListener("click", e=>{ if(!fab.contains(e.target)) fab.classList.remove("open"); });
  }

  /* ---------------- AOS ---------------- */
  if(window.AOS){
    AOS.init({ duration:850, easing:"ease-out-cubic", once:true, offset:80, disable:reduce });
  }

  /* ---------------- GSAP hero + scroll reveals ---------------- */
  if(window.gsap && !reduce){
    if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const lines = $$(".reveal-line > span");
    if(lines.length){
      gsap.set(lines, {yPercent:120});
      gsap.to(lines, {yPercent:0, duration:1.1, ease:"power3.out", stagger:.12, delay:.25});
    }
    gsap.utils.toArray(".gsap-fade").forEach(el=>{
      gsap.from(el,{ y:40, opacity:0, duration:1, ease:"power2.out",
        scrollTrigger:{ trigger:el, start:"top 85%" }});
    });
    /* subtle parallax on hero media */
    const media = $(".hero__media");
    if(media && window.ScrollTrigger){
      gsap.to(media,{ yPercent:18, ease:"none",
        scrollTrigger:{ trigger:".hero", start:"top top", end:"bottom top", scrub:true }});
    }
  }

  /* ---------------- Animated counters ---------------- */
  const counters = $$("[data-count]");
  if(counters.length){
    const run = el=>{
      const target = +el.dataset.count, dur = 1800, t0 = performance.now();
      const suffix = el.dataset.suffix || "";
      const step = now=>{
        const p = Math.min((now-t0)/dur,1);
        const eased = 1 - Math.pow(1-p,3);
        el.textContent = Math.round(target*eased).toLocaleString() + suffix;
        if(p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ run(en.target); io.unobserve(en.target); }});
    },{threshold:.4});
    counters.forEach(c=> io.observe(c));
  }

  /* ---------------- Swiper sliders ---------------- */
  if(window.Swiper){
    if($(".testi-swiper")) new Swiper(".testi-swiper",{
      loop:true, speed:700, autoplay:{delay:6000,disableOnInteraction:false},
      pagination:{ el:".testi-swiper .swiper-pagination", clickable:true },
      navigation:{ nextEl:".testi-next", prevEl:".testi-prev" }
    });
    if($(".latest-swiper")) new Swiper(".latest-swiper",{
      loop:true, speed:600, spaceBetween:30, slidesPerView:1,
      autoplay:{delay:4500,disableOnInteraction:false},
      pagination:{ el:".latest-swiper .swiper-pagination", clickable:true },
      breakpoints:{ 700:{slidesPerView:2}, 1100:{slidesPerView:3} }
    });
    if($(".gallery-swiper")) new Swiper(".gallery-swiper",{
      loop:true, speed:600, navigation:{nextEl:".g-next",prevEl:".g-prev"},
      pagination:{ el:".gallery-swiper .swiper-pagination", type:"fraction" }
    });
  }

  /* ---------------- Wishlist (♥) ---------------- */
  function favSet(){ return new Set(store.get("wishlist", [])); }
  window.bindFavs = function(){
    const favs = favSet();
    $$(".pcard__fav").forEach(btn=>{
      const id = +btn.dataset.fav;
      btn.classList.toggle("active", favs.has(id));
      btn.querySelector("i").className = favs.has(id) ? "fa-solid fa-heart" : "fa-regular fa-heart";
      btn.onclick = e=>{
        e.preventDefault(); e.stopPropagation();
        const s = favSet();
        s.has(id) ? s.delete(id) : s.add(id);
        store.set("wishlist", [...s]);
        const on = s.has(id);
        btn.classList.toggle("active", on);
        btn.querySelector("i").className = on ? "fa-solid fa-heart" : "fa-regular fa-heart";
        toast(on ? "Saved to your wishlist" : "Removed from wishlist");
        updateFavCount();
      };
    });
  };
  function updateFavCount(){
    const n = favSet().size, b = $("[data-fav-count]");
    if(b){ b.textContent = n; b.style.display = n ? "grid" : "none"; }
  }
  bindFavs(); updateFavCount();

  /* ---------------- Toast ---------------- */
  let toastEl;
  function toast(msg){
    if(!toastEl){ toastEl = document.createElement("div"); toastEl.className="toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(()=> toastEl.classList.remove("show"), 2600);
  }
  window.toast = toast;

  /* ---------------- Hero search → routes to sale.html ---------------- */
  const searchForm = $("#heroSearch");
  if(searchForm){
    searchForm.addEventListener("submit", e=>{
      e.preventDefault();
      const q = new URLSearchParams();
      $$("[name]", searchForm).forEach(f=>{ if(f.value) q.set(f.name, f.value); });
      const dest = ($("#heroSearch [name=status]")?.value === "rent") ? "rent.html" : "sale.html";
      location.href = dest + "?" + q.toString();
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  $$(".faq__q").forEach(q=>{
    q.addEventListener("click", ()=>{
      const item = q.closest(".faq__item");
      const open = item.classList.contains("open");
      $$(".faq__item").forEach(i=>{ i.classList.remove("open"); $(".faq__a",i).style.maxHeight=null; });
      if(!open){ item.classList.add("open"); $(".faq__a",item).style.maxHeight = $(".faq__a",item).scrollHeight+"px"; }
    });
  });

  /* ---------------- Recently viewed (records on property page) ---------------- */
  window.recordView = function(id){
    let v = store.get("recent", []).filter(x=>x!==id);
    v.unshift(id); v = v.slice(0,6); store.set("recent", v);
  };
  window.getRecent = ()=> store.get("recent", []);

  /* footer year */
  const y = $("#year"); if(y) y.textContent = new Date().getFullYear();
})();
