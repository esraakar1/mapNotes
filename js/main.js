import { personIcon } from "./constants.js";
import { getIcon, getStatus } from "./helpers.js";
import { ui } from "./ui.js";


// global değişkenler 
var map;
let clickedCords;
let layer;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// kullanıcının konum bilgisisne erişmek için izin isteyeceğiz eğer izizn verirse bu konum bilgisisne erişip ilgili konumu başlangıç noktası yapacağız 
 window.navigator.geolocation.getCurrentPosition(
    (e) => {
        loadMap([e.coords.latitude, e.coords.longitude], 'Mevcut Konum');
    },
 
    (e) => {
        loadMap([37.3720366, 36.1055022], 'Varsayılan Konum');
    }
 );

 function loadMap(currentPosition, msg) {
    // harita kurulumu 
       map = L.map('map', {zoomControl: false,
       }).setView(currentPosition, 10);
   // haritanın ekranda render edilmesini sağlar 
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 19,
       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   
   // ekrana basılacak işaretlerin listelenebileceği bir katman oluştur 
   layer = L.layerGroup().addTo(map);
   
   // zoom butonlarını ekranın sağ alt köşesine taşı 
   L.control
      .zoom({
       position: "bottomright",
   }).addTo(map);
   
   // imleç ekle 
   L.marker(currentPosition, {icon: personIcon}).addTo(map).bindPopup(msg);
   // haritaya tıklanma olayı gerceklesince  
   map.on("click", onMapClick);
   
   // haritadaya notları render et 
   renderMakers();
   renderNotes();
   }
  
  // ! harita tıklanma olaylarını izle ve tıklanılan noktanın kordinatlarına eriş
 function onMapClick(e) {
    // tıklanılma olayı
clickedCords = [e.latlng.lat, e.latlng.lng];

   ui.aside.classList.add("add");
}

// iptal butonuna tıklayınca aside ı tekrar eski haline ceviren fonksiyon 

ui.cancelBtn.addEventListener('click', () => {
   // aside a eklenen add clasını kaldır 
   ui.aside.classList.remove("add");            
});


// ! formun gönderilme olayını izle ve bir fonksiyon tetikle

ui.form.addEventListener('submit', (e) => {         
   // sayfa yenilemeyi engelle 
   e.preventDefault();

   const title = e.target[0].value;
   const date = e.target[1].value;
   const status = e.target[2].value;

   // bir not objesi oluşturmak 
   const newNote = {
       // 1970 ten itibaren gecen zamanın milisaniye cinsinden değerini aldık 
       id:  new Date().getTime(),
       title,
       date,
       status,
       coords: clickedCords,
   };

// notlar dizisine yeni notu ekle 
notes.unshift(newNote);


//    local storage a ilgili eleman ekle 
   localStorage.setItem('notes', JSON.stringify(notes));

   // aside ı eski haline cevir 
   ui.aside.classList.remove("add");

   // formun içeriğini temizle 
   e.target.reset();

   // notları render et 
   renderNotes();
   renderMakers();
});

function renderMakers() {
//    haritadaki diğer markerları temizle 
layer.clearLayers();
   notes.map((note) => {
     const icon = getIcon(note.status);
       // her not için bir marker oluştur 
       L.marker(note.coords, { icon }).addTo(layer).bindPopup(note.title);
   });
}

// ! notları render eden fonksiyon 
   
function renderNotes() {
  const noteCards = notes.map((note) => { 

   // tarih verisini istenilen formatta düzenle   
   const date = new Date(note.date).toLocaleString('tr',
    {
       day: "2-digit",
       month: "long",
       year: "numeric",
    });
    const status = getStatus(note.status);
  return ` <li>
           <div>
               <p>${note.title}</p>
               <p>${date}</p>
               
               <p>${status}</p>
           </div>
           <div class="icons">
               <i data-id='${note.id}' class="bi bi-airplane-fill" id="fly"></i>
               <i data-id='${note.id}' class="bi bi-trash-fill" id="delete"></i>
           </div>
       </li>`
   })
   .join("");
   // oluşturulan kart elemanlarını html kısmına ekle 
   ui.ul.innerHTML = noteCards;

  // Delete Iconlarına tıklanınca silme işlemini gerçekleştir
 document.querySelectorAll("li #delete").forEach((btn) => {
   btn.addEventListener("click", () => {
     const id = btn.dataset.id;

     deleteNote(id);
   });
 });

 // Fly iconlarına tıklayınca o nota focusla
 document.querySelectorAll("li #fly").forEach((btn) => {
   btn.addEventListener("click", () => {
     const id = btn.dataset.id;
     flyToLocation(id);
   });
 });
}
function deleteNote(id) {
   // Kullanıcıdan silme işlemi için onay al
   const res = confirm("Not silme işlemini onaylıyor musunuz ?");
 
   if (res) {
     // `id`'si bilinen elemanı notes dizisinden kaldır
     notes = notes.filter((note) => note.id !== parseInt(id));
 
     // LocalStorage'ı güncelle
     localStorage.setItem("notes", JSON.stringify(notes));
 
     // Notları render et
     renderNotes();
 
     // Markerları render et
     renderMakers();
   }
 }

// ! Haritadaki ilgili nota hareket etmeyi sağlayan fonksiyon

function flyToLocation(id) {
   // id'si bilinen elemanı notes dizisi içerisinden bul
   const note = notes.find((note) => note.id === parseInt(id));
 
   
 
   // Bulunan notun kordinatlarına uç
   map.flyTo(note.coords, 12);

   console.log(flyTo);
 }
 
 // ! arrow iconuna tıklanınca çalışacak fonksiyon
 
 ui.arrow.addEventListener("click", () => {
   ui.aside.classList.toggle("hide");
 });

 
