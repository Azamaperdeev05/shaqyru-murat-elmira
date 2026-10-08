// Firebase configuration for restoflow-saas-azamat
const firebaseConfig = {
  apiKey: "AIzaSyD3pODPnNSvm_x6Z6bEu3iCZzPGudqR6b8",
  authDomain: "restoflow-saas-azamat.firebaseapp.com",
  projectId: "restoflow-saas-azamat",
  storageBucket: "restoflow-saas-azamat.firebasestorage.app",
  messagingSenderId: "427871988292",
  appId: "1:427871988292:web:4b20685cd6d9b9bba8ea11"
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.sendWishToFirebase = function(name, text) {
  if (!db) {
    console.warn("Firestore not available");
    return Promise.reject(new Error("Firestore not available"));
  }
  var now = new Date();
  var dStr = String(now.getDate()).padStart(2, '0') + '.' + String(now.getMonth()+1).padStart(2, '0') + '.' + now.getFullYear();

  return db.collection('shaqyru_wishes').add({
    name: name,
    text: text,
    date: dStr,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

function initIndexWishes() {
  var carouselInner = document.getElementById('wishes-carousel-inner');
  var indicators = document.getElementById('wishes-carousel-indicators');
  if (!carouselInner || !db) return;

  db.collection('shaqyru_wishes')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snapshot) {
      var wishes = [];
      snapshot.forEach(function(doc) {
        wishes.push(doc.data());
      });

      if (wishes.length === 0) {
        if (indicators) indicators.innerHTML = '';
        carouselInner.innerHTML = '<div class="carousel-item active">' +
          '<div class="otzname text-center" style="font-size: 18px; color: #7d7d7d; font-style: italic; padding: 25px 15px; font-family: \'Forum\', serif;">' +
          'Әзірге тілектер жоқ.<br>Алғашқы болып ізгі тілегіңізді қалдырыңыз!' +
          '</div></div>';
        $('#carouselExampleIndicators2 .carousel-control-prev, #carouselExampleIndicators2 .carousel-control-next').hide();
      } else {
        var innerHtml = '';
        var indicatorsHtml = '';
        wishes.forEach(function(w, index) {
          var activeClass = index === 0 ? 'active' : '';
          indicatorsHtml += '<li class="sliderbut ' + activeClass + '" data-target="#carouselExampleIndicators2" data-slide-to="' + index + '"></li>';
          innerHtml += '<div class="carousel-item ' + activeClass + '">' +
            '<div class="otzname">' + escapeHtml(w.name) + ' <span>тілегі:</span></div>' +
            '<div class="otztext">' + escapeHtml(w.text) + '</div>' +
            '<div class="otzdate">' + escapeHtml(w.date || '') + '</div>' +
            '</div>';
        });
        if (indicators) indicators.innerHTML = indicatorsHtml;
        carouselInner.innerHTML = innerHtml;
        if (wishes.length > 1) {
          $('#carouselExampleIndicators2 .carousel-control-prev, #carouselExampleIndicators2 .carousel-control-next').show();
        } else {
          $('#carouselExampleIndicators2 .carousel-control-prev, #carouselExampleIndicators2 .carousel-control-next').hide();
        }
      }
      if ($('#carouselExampleIndicators2').data('bs.carousel')) {
        $('#carouselExampleIndicators2').carousel('dispose');
      }
      $('#carouselExampleIndicators2').carousel({ interval: 5000 });
    }, function(err) {
      console.error("Firestore listener error:", err);
    });
}

function initTilekterWishes() {
  var wishesContainer = document.getElementById('wishes-list');
  if (!wishesContainer || !db) return;

  db.collection('shaqyru_wishes')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snapshot) {
      var wishes = [];
      snapshot.forEach(function(doc) {
        wishes.push(doc.data());
      });

      if (wishes.length === 0) {
        wishesContainer.innerHTML = '<div class="text-center py-5" style="color: #7d7d7d; font-size: 19px; font-family: \'Forum\', serif; line-height: 1.6;">' +
          'Әзірге тілектер жоқ.<br>Алғашқы болып ізгі тілегіңізді қалдырыңыз!' +
          '</div>';
      } else {
        var html = '';
        wishes.forEach(function(w) {
          html += '<div class="tilekpol">' +
            '<div class="tpname">' + escapeHtml(w.name) + ' <span>тілегі:</span></div>' +
            '<div class="tptext">' + escapeHtml(w.text).replace(/\n/g, '<br/>') + '</div>' +
            '<div class="tpdate">' + escapeHtml(w.date || '') + '</div>' +
            '<div class="tplinia"></div>' +
            '</div><div class="vector8"></div>';
        });
        wishesContainer.innerHTML = html;
      }
    }, function(err) {
      console.error("Firestore listener error:", err);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  initIndexWishes();
  initTilekterWishes();
});
