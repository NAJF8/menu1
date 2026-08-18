// === 1. إخفاء شاشة البداية (Splash Screen) ===
setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) {
        splash.style.transition = "opacity 0.5s ease";
        splash.style.opacity = "0";
        setTimeout(() => { splash.style.display = "none"; }, 500);
    }
}, 2000); // الشاشة تختفي تلقائياً بعد ثانيتين

// إخفاء احتياطي: إذا ضغط المستخدم على الشاشة تختفي الشاشة الخضراء فوراً
window.addEventListener("click", () => {
    const splash = document.getElementById("splashScreen");
    if (splash && splash.style.display !== "none") {
        splash.style.display = "none";
    }
});
// ==============================================


// === 2. دوال الحفظ والاسترجاع ===
const load = (k, fallback) => { try { const v=localStorage.getItem("coffee101_"+k); return v?JSON.parse(v):fallback } catch(e){return fallback} };
const save = (k,v) => localStorage.setItem("coffee101_"+k,JSON.stringify(v));

// === 3. منتجات افتراضية متنوعة لتشغيل جميع الأقسام ===
const defaultProducts = [
    { id: 1, name: "اسبريسو", price: 3500, category: "قهوة ساخنة", description: "قهوة مركزة وغنية", image: "https://images.unsplash.com/photo-1510115565531-df2400b1a03e?w=500&q=80", popular: true },
    { id: 2, name: "ايس لاتيه", price: 4500, category: "مشروبات باردة", description: "حليب بارد مع قهوة وثلج", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80", offer: true, oldPrice: 5500, discount: true },
    { id: 3, name: "كابتشينو", price: 4000, category: "قهوة ساخنة", description: "رغوة غنية مع قهوة", image: "https://images.unsplash.com/photo-1534687941688-1b22e1189c47?w=500&q=80" },
    { id: 4, name: "موهيتو فراولة", price: 3000, category: "مشروبات باردة", description: "منعش ولذيذ", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80", popular: true },
    { id: 5, name: "ماتشا لاتيه", price: 5000, category: "مشروبات باردة", description: "ماتشا ياباني فاخر", image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80", comingSoon: true },
    { id: 6, name: "كيكة العسل", price: 4500, category: "حلويات", description: "كيكة روسية طبقات", image: "https://images.unsplash.com/photo-1571115177098-24c42de1bd15?w=500&q=80", popular: true }
];

let products = load("products", defaultProducts);
let categoriesDB = load("categoriesDB", [{id:"c1", name: "قهوة ساخنة", active: true}, {id:"c2", name: "مشروبات باردة", active: true}, {id:"c3", name: "حلويات", active: true}]);
let ordersOpen = load("ordersOpen", true);
let bookings = load("bookings", []); 

// === 4. مكافآت افتراضية ليتم عرضها عند الوصول لـ 10 قلوب ===
const defaultRewards = [
    { id: "r1", name: "قهوة مجانية ☕", hearts: 10 },
    { id: "r2", name: "حلوى مجانية 🍰", hearts: 15 }
];
let rewardsDB = load("rewardsDB", defaultRewards);

let defaultSettings = { 
    shopName: "101 COFFEE", whatsapp: "9647800000000", roomWhatsapp: "", instagram: "101coffee", mapUrl: "", address: "النجف الأشرف", 
    roomPrice: 10000, enablePopular: true, enableOffers: true, enableLoyalty: true 
};
let settings = load("settings", defaultSettings);
let cart = load("cart", []);
const deliveryAreas = [{name:"النجف المركز",price:2000}, {name:"الكوفة",price:3000}];

// === 5. دوال مساعدة ===
const money = n => new Intl.NumberFormat("ar-IQ").format(n) + " د.ع";
const esc = s => String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const imgHTML = (p,cls="") => p.image ? `<img class="${cls}" src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none';this.parentElement.classList.add('placeholder')">` : `<span class="placeholder">☕</span>`;
const badge = p => p.discount||p.offer?"خصم 🏷️":p.newItem?"جديد 🆕":p.popular?"الأكثر طلباً 🔥":p.featured?"مميز ⭐":"";

function renderHome(){
  document.querySelectorAll('.shop-name-txt').forEach(e => e.textContent = settings.shopName);
  
  const insta = document.getElementById('footer-insta');
  if(insta && settings.instagram) { 
      let cleanInsta = settings.instagram.replace('@','').trim();
      insta.href = `https://instagram.com/${cleanInsta}`; 
      insta.textContent = `Instagram: @${cleanInsta}`; 
      insta.style.display = 'block';
  } else if(insta) { insta.style.display = 'none'; }
  
  const phone = document.getElementById('footer-phone');
  if(phone && settings.whatsapp) {
      phone.href = `tel:${settings.whatsapp}`;
      phone.textContent = `الرقم: ${settings.whatsapp}`;
      phone.style.display = 'block';
  } else if(phone) { phone.style.display = 'none'; }

  const mapLink = document.getElementById('footer-map');
  if(mapLink && settings.mapUrl) {
      mapLink.href = settings.mapUrl;
      mapLink.textContent = "الموقع على الخريطة 📍";
      mapLink.style.display = 'block';
  } else if(mapLink) { mapLink.style.display = 'none'; }
  
  const nav=document.getElementById("categoryNav"); 
  if(nav) {
      const activeCats = categoriesDB.filter(c => c.active);
      nav.innerHTML = `<button class="category-btn active" data-cat="all">الكل</button>` + activeCats.map(c=>`<button class="category-btn" data-cat="${esc(c.name)}">${esc(c.name)}</button>`).join("");
      nav.onclick = e => {
        const b=e.target.closest("[data-cat]"); if(!b)return;
        document.querySelectorAll(".category-btn").forEach(x=>x.classList.remove("active"));
        b.classList.add("active"); renderCatalog(b.dataset.cat);
        document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
      };
  }
  
  renderDynamicSections();
  renderCatalog("all"); 
  renderCart(); 
  renderLoyaltyCard();
}

function card(p){
  const old = p.discount&&p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : "";
  return `<article class="product-card" data-id="${p.id}">
    <div class="product-img">${imgHTML(p)}${badge(p)?`<span class="badge">${badge(p)}</span>`:""}</div>
    <div class="product-info"><h3>${esc(p.name)}</h3><p>${esc(p.description||"")}</p>
      <div class="price-row">
        <div class="price">${old}<strong>${p.comingSoon ? "" : money(p.price)}</strong></div>
        ${p.comingSoon ? `<span style="font-weight:bold; font-size:13px; color:#445842;">قريباً ✨</span>` : `<button class="add-btn" data-add="${p.id}">+</button>`}
      </div>
    </div>
  </article>`;
}

function renderDynamicSections() {
    const soonArea = document.getElementById("comingSoonArea");
    if(soonArea) {
        const soonList = products.filter(p => p.comingSoon);
        soonArea.innerHTML = soonList.length ? `<div class="feature-section"><span class="eyebrow">COMING SOON</span><h2>قريباً ✨</h2><div class="feature-products">${soonList.map(card).join("")}</div></div>` : "";
    }
    const popArea = document.getElementById("popularArea");
    if(popArea && settings.enablePopular) {
        const popList = products.filter(p => p.popular && !p.comingSoon).slice(0,4);
        popArea.innerHTML = popList.length ? `<div class="feature-section"><span class="eyebrow">TOP RATED</span><h2>الأكثر طلباً 🔥</h2><div class="feature-products">${popList.map(card).join("")}</div></div>` : "";
    } else if(popArea) popArea.innerHTML = "";
    
    const offersArea = document.getElementById("offersArea");
    if(offersArea && settings.enableOffers) {
        const offersList = products.filter(p => (p.offer || p.discount) && !p.comingSoon).slice(0,4);
        offersArea.innerHTML = offersList.length ? `<div class="feature-section"><span class="eyebrow">SPECIAL OFFERS</span><h2>العروض والخصومات 🎁</h2><div class="feature-products">${offersList.map(card).join("")}</div></div>` : "";
    } else if(offersArea) offersArea.innerHTML = "";
}

function renderCatalog(cat="all"){
  const grid = document.getElementById("productsGrid"); if(!grid)return;
  const list = products.filter(p=> !p.hidden && !p.comingSoon && (cat==="all"||p.category===cat));
  grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty-state" style="grid-column:1/-1">لا توجد منتجات حالياً.</div>`;
  grid.onclick = e => {
    const add=e.target.closest("[data-add]"), item=e.target.closest(".product-card");
    if(add){ addToCart(+add.dataset.add) } else if(item){ openProduct(+item.dataset.id) }
  };
}

let currentHearts = load("userHearts", 0); 
function renderLoyaltyCard() {
    const container = document.getElementById('loyaltySection');
    if(!container) return;
    if(!settings.enableLoyalty) { container.style.display = 'none'; return; }
    container.style.display = 'block';

    const maxHearts = 10;
    let heartsHtml = '';
    for(let i=1; i<=maxHearts; i++) {
        heartsHtml += `<span class="heart ${i <= currentHearts ? 'filled' : ''}">❤</span>`;
    }
    document.getElementById('heartsVisual').innerHTML = heartsHtml;
    document.getElementById('heartsCount').textContent = currentHearts;

    const msg = document.getElementById('loyaltyMessage');
    const rewardsDiv = document.getElementById('availableRewards');
    rewardsDiv.innerHTML = '';

    if(currentHearts === 0) {
        msg.textContent = "اجمع 10 قلوب لتحصل على مكافأتك!";
    } else if(currentHearts < maxHearts) {
        msg.textContent = `باقي لك ${maxHearts - currentHearts} قلوب وتستلم مكافأة!`;
    } else {
        msg.textContent = "مبروك! 🎉 اختر مكافأتك من القائمة عبر الضغط عليها:";
    }

    let available = rewardsDB.filter(r => currentHearts >= r.hearts);
    if(available.length > 0) {
        rewardsDiv.innerHTML = available.map(r => `
            <div class="reward-item" onclick="redeemReward(${r.hearts}, '${esc(r.name)}')" style="cursor:pointer; padding: 12px; background: #f8f9fa; border: 2px solid var(--teal); border-radius: 8px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
                <span style="font-weight: bold;">🎁 ${esc(r.name)}</span>
                <span style="color:var(--teal); font-size: 0.9em;">(يخصم ${r.hearts} قلوب)</span>
            </div>
        `).join('');
    }
}

window.redeemReward = function(cost, name) {
    if(confirm(`هل أنت متأكد من استبدال ${cost} قلوب للحصول على: ${name}؟`)) {
        changeHearts(-cost);
        alert(`تم اختيار المكافأة بنجاح: ${name} 🎉\nيرجى إخبار الموظف لإضافتها لطلبك.`);
    }
}

window.changeHearts = function(val) {
    currentHearts += val;
    if(currentHearts < 0) currentHearts = 0;
    if(currentHearts > 20) currentHearts = 20;
    save("userHearts", currentHearts);
    renderLoyaltyCard();
}

function openProduct(id){
  const p = products.find(x=>x.id===id); if(!p || p.comingSoon) return;
  const modal=document.getElementById("productModal"), detail=document.getElementById("productDetail");
  detail.innerHTML=`<div class="product-detail"><div class="detail-img">${imgHTML(p)}</div><div><span class="eyebrow">${esc(p.category)}</span><h2>${esc(p.name)}</h2><p>${esc(p.description||"طعم لذيذ ومحضر بعناية.")}</p><div class="price">${p.discount&&p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}<strong>${money(p.price)}</strong></div><div class="qty"><button id="detailMinus">−</button><strong id="detailQty">1</strong><button id="detailPlus">+</button></div><button class="primary-btn full" id="detailAdd">أضف للسلة 🛒</button></div></div>`;
  let qty=1; document.getElementById("detailMinus").onclick=()=>{qty=Math.max(1,qty-1);document.getElementById("detailQty").textContent=qty}; document.getElementById("detailPlus").onclick=()=>{qty++;document.getElementById("detailQty").textContent=qty}; document.getElementById("detailAdd").onclick=()=>{addToCart(id,qty);modal.classList.remove("open")}; modal.classList.add("open");
}

function addToCart(id,qty=1){
  const row=cart.find(x=>x.id===id); row?row.qty+=qty:cart.push({id,qty}); save("cart",cart); renderCart();
}
function renderCart(){
  const el=document.getElementById("cartItems"), count=document.getElementById("cartCount"), total=document.getElementById("cartTotal");if(!el)return;
  let totalVal=0,countVal=0;
  el.innerHTML=cart.length?cart.map(r=>{const p=products.find(x=>x.id===r.id);if(!p)return"";const line=p.price*r.qty;totalVal+=line;countVal+=r.qty;return `<div class="cart-row"><div class="cart-thumb">${imgHTML(p)}</div><div><h4>${esc(p.name)}</h4><small>${money(line)}</small><div class="mini-qty"><button data-minus="${p.id}">−</button><b>${r.qty}</b><button data-plus="${p.id}">+</button></div></div><button class="delete-btn" data-del="${p.id}">×</button></div>`}).join(""):`<div class="empty-state">السلة فارغة ☕</div>`;
  if(count) count.textContent=countVal; if(total) total.textContent=money(totalVal);
  el.onclick=e=>{const m=e.target.closest("[data-minus]"),pl=e.target.closest("[data-plus]"),d=e.target.closest("[data-del]");if(m)changeCart(+m.dataset.minus,-1);if(pl)changeCart(+pl.dataset.plus,1);if(d)removeCart(+d.dataset.del)};
}
function changeCart(id,n){const r=cart.find(x=>x.id===id);if(!r)return;r.qty+=n;if(r.qty<1)cart=cart.filter(x=>x.id!==id);save("cart",cart);renderCart()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);save("cart",cart);renderCart()}
function openCart(){document.getElementById("cartDrawer")?.classList.add("open");document.getElementById("drawerBackdrop")?.classList.add("open")}
function closeCart(){document.getElementById("cartDrawer")?.classList.remove("open");document.getElementById("drawerBackdrop")?.classList.remove("open")}

function showCheckout(){
  if(!cart.length) return alert("السلة فارغة.");
  if(!ordersOpen) return alert("الطلبات متوقفة حاليًا، يرجى المحاولة لاحقًا.");
  document.getElementById("checkoutModal").classList.add("open"); 
  document.getElementById("areaSelect").innerHTML = deliveryAreas.map(a=>`<option value="${a.name}">${a.name} — ${money(a.price)}</option>`).join("");
  updateCheckoutSummary();
}
function updateCheckoutSummary(){
  const el=document.getElementById("checkoutSummary");if(!el)return;
  let subtotal=cart.reduce((s,r)=>{const p=products.find(x=>x.id===r.id);return s+(p?p.price*r.qty:0)},0);
  const type = document.querySelector('input[name="type"]:checked')?.value;
  let delivery = (type==="delivery") ? Number(deliveryAreas.find(a=>a.name===document.getElementById("areaSelect")?.value)?.price||0) : 0;
  el.innerHTML=`<div class="summary-line"><span>مجموع المنتجات</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>التوصيل</span><strong>${money(delivery)}</strong></div><hr><div class="summary-line"><span>المجموع النهائي</span><strong>${money(subtotal+delivery)}</strong></div>`;
}

// === 6. إعداد الأحداث عند تحميل الصفحة ===
document.addEventListener("DOMContentLoaded", () => {
  renderHome(); 
  
  document.getElementById("cartBtn")?.addEventListener("click",openCart);
  document.getElementById("closeCart")?.addEventListener("click",closeCart);
  document.getElementById("drawerBackdrop")?.addEventListener("click",closeCart);
  document.getElementById("menuBtn")?.addEventListener("click",()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"}));
  document.getElementById("checkoutBtn")?.addEventListener("click",showCheckout);
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest(".modal-backdrop").classList.remove("open")));
  
  document.querySelectorAll('input[name="type"]').forEach(r=>r.addEventListener("change",()=>{
    const val = r.value;
    document.getElementById("deliveryFields")?.classList.toggle("hidden", val !== "delivery");
    document.getElementById("carFields")?.classList.toggle("hidden", val !== "car");
    updateCheckoutSummary();
  }));
  document.getElementById("areaSelect")?.addEventListener("change",updateCheckoutSummary);
  
  document.getElementById("checkoutForm")?.addEventListener("submit",e=>{
    e.preventDefault(); if(!ordersOpen) return alert("الطلبات متوقفة حاليًا.");
    const f=new FormData(e.target), type=f.get("type");
    let subtotal=cart.reduce((s,r)=>{const p=products.find(x=>x.id===r.id);return s+(p?p.price*r.qty:0)},0);
    let delivery=type==="delivery"?Number(deliveryAreas.find(a=>a.name===f.get("area"))?.price||0):0;
    
    let msg=`السلام عليكم 🌹\n\nطلب جديد من ${settings.shopName}:\n\n`;
    cart.forEach(r=>{const p=products.find(x=>x.id===r.id);if(p)msg+=`☕ ${p.name} × ${r.qty}\n${money(p.price*r.qty)}\n\n`});
    msg+=`💰 المنتجات: ${money(subtotal)}\n🚚 التوصيل: ${money(delivery)}\n💵 المجموع: ${money(subtotal+delivery)}\n\n`;
    msg+=`👤 الاسم: ${f.get("name")}\n📱 الهاتف: ${f.get("phone")}\n`;
    if (type === "delivery") msg += `📦 طلب: توصيل 🛵\n📍 المنطقة: ${f.get("area")}\n🏠 العنوان: ${f.get("address")}\n📌 نقطة دالة: ${f.get("landmark")}\n`;
    else if (type === "car") msg += `📦 طلب: سيارة 🚗\n🚙 السيارة: ${f.get("carDetails")}\n`;
    else msg += `📦 طلب: استلام من المحل 🚶‍♂️\n`;
    
    if(settings.enableLoyalty && currentHearts > 0) msg += `\n❤️ نقاط العميل بالبطاقة: ${currentHearts} قلوب\n`;

    msg+=`📝 الملاحظات: ${f.get("notes")||"-"}\n\nشكراً 🤎`;
    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`,"_blank");
  });

  document.getElementById("bookingForm")?.addEventListener("submit", (e) => {
      e.preventDefault(); const f = new FormData(e.target);
      const name = f.get("bookingName"), phone = f.get("bookingPhone"), date = f.get("bookingDate"), time = f.get("bookingTime");
      let roomNum = settings.roomWhatsapp || settings.whatsapp; 
      let msg = `حجز غرفة اجتماعات 📅\n\nالاسم: ${name}\nالهاتف: ${phone}\nالتاريخ: ${date}\nالوقت: ${time}\nالسعر: ${money(settings.roomPrice)}\n\nملاحظات: ${f.get("bookingNotes") || "-"}`;
      window.open(`https://wa.me/${roomNum.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  });
});