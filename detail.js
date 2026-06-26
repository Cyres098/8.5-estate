/* =============================================================
   8.5 ESTATE PROPERTIES — Property detail controller
   ============================================================= */
(function(){
  const root = document.querySelector("[data-detail]");
  if(!root) return;
  const id = +new URLSearchParams(location.search).get("id") || 1;
  const p  = PROPERTIES.find(x=>x.id===id) || PROPERTIES[0];
  const agent = AGENTS.default;

  if(window.recordView) recordView(p.id);

  const set = (sel,html)=>{ const el=document.querySelector(sel); if(el) el.innerHTML=html; };
  const txt = (sel,v)=>{ const el=document.querySelector(sel); if(el) el.textContent=v; };

  document.title = `${p.title} — 8.5 Estate Properties`;
  txt("#dTitle", p.title);
  txt("#dLoc", p.location);
  set("#dTag", p.status==="rent"
     ? '<span class="tag tag--rent">For Rent</span>'
     : '<span class="tag tag--sale">For Sale</span>');
  set("#dPrice", p.status==="rent"
     ? `${"$"+p.price.toLocaleString()} <small style="font-size:.9rem;color:rgba(255,255,255,.6)">/ month</small>`
     : "$"+p.price.toLocaleString());
  txt("#dDesc", p.desc + " The residence has been finished to an exacting standard throughout, with imported fittings, integrated smart-home controls and 24-hour security. Viewings are arranged strictly by private appointment.");

  /* gallery */
  const main = p.img[0];
  set("#dGallery", `
    <a href="${p.img[0]}" data-lightbox="g" data-title="${p.title}">
      <img src="${p.img[0]}" alt="${p.title}" onerror="imgFallback(this)"></a>
    <div class="detail-gallery__side">
      <a href="${p.img[1]||main}" data-lightbox="g"><img src="${p.img[1]||main}" alt="${p.title} interior" onerror="imgFallback(this)"></a>
      <a href="${p.img[2]||main}" data-lightbox="g"><img src="${p.img[2]||main}" alt="${p.title} interior" onerror="imgFallback(this)"></a>
    </div>`);

  /* spec boxes */
  const specs = p.type==="Commercial"
    ? [["fa-building","Type",p.type],["fa-restroom",p.baths,"Restrooms"],["fa-square-parking",p.garage,"Parking"],["fa-vector-square",p.area+" m²","Floor area"]]
    : [["fa-bed",p.beds,"Bedrooms"],["fa-bath",p.baths,"Bathrooms"],["fa-car",p.garage,"Garage"],["fa-vector-square",p.area+" m²","Floor area"]];
  set("#dSpecs", specs.map(s=>`
     <div class="spec-box"><i class="fa-solid ${s[0]}"></i><b>${s[1]}</b><span>${s[2]}</span></div>`).join(""));

  /* amenities */
  const am = ["Private swimming pool","24/7 security & CCTV","Standby generator","Fitted modern kitchen",
              "Air conditioning","Landscaped gardens","Staff quarters","Borehole & water reserve",
              "High-speed fibre ready","Smart-home system","Secured parking","Walk-in wardrobes"];
  set("#dAmenities", am.map(a=>`<li><i class="fa-solid fa-check"></i>${a}</li>`).join(""));

  /* agent */
  txt("#aName", agent.name); txt("#aRole", agent.role);
  const ap = document.querySelector("#aPhoto"); if(ap){ ap.src=agent.photo; ap.onerror=()=>imgFallback(ap); }

  /* map (no-key embed centred on the property location) */
  const map = document.querySelector("#dMap");
  if(map) map.src = "https://www.google.com/maps?q=" + encodeURIComponent(p.location + ", Ghana") + "&output=embed";

  /* prefill inquiry */
  const subj = document.querySelector("#inqSubject");
  if(subj) subj.value = `Enquiry — ${p.title} (Ref #${p.id})`;
  const pid = document.querySelector("#inqPropId"); if(pid) pid.value = p.id;

  /* ---------- Mortgage calculator ---------- */
  const calcPrice = document.querySelector("#mPrice");
  if(calcPrice){
    calcPrice.value = p.status==="rent" ? 250000 : p.price;
    const run = ()=>{
      const price = +document.querySelector("#mPrice").value || 0;
      const downPct = +document.querySelector("#mDown").value || 0;
      const rate = (+document.querySelector("#mRate").value || 0)/100/12;
      const months = (+document.querySelector("#mYears").value || 1)*12;
      const loan = price * (1 - downPct/100);
      const m = rate>0 ? loan*rate/(1-Math.pow(1+rate,-months)) : loan/months;
      document.querySelector("#mDownVal").textContent = downPct+"%";
      document.querySelector("#mResult").textContent =
        "$" + (isFinite(m)?Math.round(m):0).toLocaleString();
    };
    ["#mPrice","#mDown","#mRate","#mYears"].forEach(s=>{
      document.querySelector(s).addEventListener("input", run);
    });
    run();
  }

  /* ---------- More from us ---------- */
  const more = PROPERTIES.filter(x=>x.id!==p.id && x.status===p.status).slice(0,3);
  renderCards(more, "#dMore");

  /* ---------- Inquiry form (AJAX → php/inquiry.php) ---------- */
  const inq = document.querySelector("#inquiryForm");
  if(inq){
    const box = document.createElement("div");
    box.id = "inqMsg";
    inq.parentNode.insertBefore(box, inq);
    inq.addEventListener("submit", function(e){
      e.preventDefault();
      const btn = inq.querySelector("button[type=submit]"); const old = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      fetch(inq.action, { method:"POST", body:new FormData(inq), headers:{"X-Requested-With":"fetch"} })
        .then(r=>r.json()).then(d=>{
          box.innerHTML = '<div class="alert '+(d.ok?"alert--ok":"alert--err")+'">'+d.message+'</div>';
          if(d.ok){ inq.reset(); const pid=document.querySelector("#inqPropId"); if(pid) pid.value=p.id;
            const subj=document.querySelector("#inqSubject"); if(subj) subj.value=`Enquiry — ${p.title} (Ref #${p.id})`;
            if(window.toast) window.toast("Enquiry sent — we'll be in touch shortly."); }
        })
        .catch(()=>{ box.innerHTML='<div class="alert alert--err">Network error. Please call or WhatsApp us instead.</div>'; })
        .finally(()=>{ btn.disabled=false; btn.innerHTML=old; box.scrollIntoView({behavior:"smooth",block:"center"}); });
    });
  }
})();
