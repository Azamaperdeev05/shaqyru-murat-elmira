let sattizhauap, sattitilek, tilek_kaldir;
if (document.getElementById('satti_zhauap')) {
    sattizhauap = bodymovin.loadAnimation({
        container: document.getElementById('satti_zhauap'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: window.ANIM_SATTI_ZHAUAP || undefined,
        path: window.ANIM_SATTI_ZHAUAP ? undefined : 'images/main/json/satti_zhauap.json'
    });
}
if (document.getElementById('satti_tilek')) {
    sattitilek = bodymovin.loadAnimation({
        container: document.getElementById('satti_tilek'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: window.ANIM_SATTI_TILEK || undefined,
        path: window.ANIM_SATTI_TILEK ? undefined : 'images/main/json/satti_tilek.json'
    });
}
if (document.getElementById('tilek_kaldir')) {
    tilek_kaldir = bodymovin.loadAnimation({
        container: document.getElementById('tilek_kaldir'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: window.ANIM_TILEK_KALDIR || undefined,
        path: window.ANIM_TILEK_KALDIR ? undefined : 'images/main/json/tilek_kaldir.json'
    });
}

window.addEventListener('load', function () {
  var preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
});

$('#sattizhauap').on('hidden.bs.modal', function () {
    if (sattizhauap) sattizhauap.stop();
});
$('#sattitilek').on('hidden.bs.modal', function () {
    if (sattitilek) sattitilek.stop();
});

var zhauap_berdi = $("input[name='zhauap_berdi']").val();

// Check localStorage for saved response
var savedAnswer = localStorage.getItem('shaqyru_guest_answer');
if (savedAnswer) {
    try {
        var ansObj = JSON.parse(savedAnswer);
        $(".otvetname").html(ansObj.name);
        $(".otvetzhauap").html(ansObj.zhauaptext);
        $(".opros").hide();
        $(".otvetnaopros").show();
    } catch(e) {}
} else if(zhauap_berdi == 1) {
    $(".opros").hide();
    $(".otvetnaopros").show();
}

var konakid = $("input[name='konakid']").val() || localStorage.getItem('shaqyru_konak_id');

$(".zayotrp").click(function() {
    var storedName = localStorage.getItem('shaqyru_guest_name');
    if(!storedName && (konakid == 0 || konakid === '' || konakid === null || konakid === undefined)) 
        $('#nameengiz').modal('show');
    else 
        otpravka($("#form-1"));
});

$('.play-game-btn').click(function () {
    if (window.KONAK_ID == 0 || window.KONAK_ID === '' || window.KONAK_ID === null) {
        $('#nameengiz2').modal('show');
    } else {
        $('#games').modal('show');
    }
});

$(".oprosozgertu").click(function() {
    $('.otvetnaopros').hide();
    $('.opros').show();
    konakid = $("input[name='konakid']").val() || localStorage.getItem('shaqyru_konak_id');
});
$(".tilek_kaldir").click(function() {
    $('#tilekengiz').modal('show');
});

$(".nameengiz-content").children("button").click(function () {
    otpravka2($("#form-1"), $(".nameengiz-content"));
});
$(".tilekengiz-content").children("button").click(function () {
    tilekotpravka($("#form-1"), $(".tilekengiz-content"));
});

function getZhauapText(val) {
    switch(String(val)) {
        case '1': return 'Өкінішке орай, келе алмаймын';
        case '2': return 'Иә, жалғыз өзім барамын!';
        case '3': return 'Жұбайыммен бірге барамын';
        default: return 'Жауап қабылданды';
    }
}

function otpravka(divid) {
    var zhauap = $("input[name='zhauap']:checked").val();
    var zhauaptext = getZhauapText(zhauap);
    var name = localStorage.getItem('shaqyru_guest_name') || 'Құрметті қонақ';

    function completeSuccess(guestName) {
        $("#sattizhauap").modal('show');
        if (sattizhauap) sattizhauap.play();
        $(".otvetname").html(guestName);
        $(".otvetzhauap").html(zhauaptext);
        $(".opros").hide();
        $(".otvetnaopros").show();
        localStorage.setItem('shaqyru_guest_answer', JSON.stringify({ name: guestName, zhauap: zhauap, zhauaptext: zhauaptext }));
    }

    $.ajax({
        method: "POST",
        url: "zayavka2.php",
        data: {'rejim': 2, 'zhauap': zhauap, 'shaqyruid': $.trim(divid.children("input[name='shaqyruid']").val()), 'konakid': $.trim(divid.children("input[name='konakid']").val()) }
    })
    .done(function (msg) {
        completeSuccess(msg || name);
    })
    .fail(function () {
        completeSuccess(name);
    });
}

function namekate2($text) {
    $('.namekate2').text($text);
    $('.namekate2').show();
}
function tilekkate($text) {
    $('.tilekkate').text($text);
    $('.tilekkate').show();
}
function namekate($text) {
    $('.namekate').text($text);
    $('.namekate').show();
}

function otpravka2(divid, divid2) {
    var oshibka = 0;
    var nameval = $.trim(divid2.children("input[name='name']").val());
    if (nameval == '') {
        namekate2('Есім жазылмады');
        oshibka = 1;
    } else if(nameval.length < 2) {
        namekate2('Есім 2 символдан кем болмауы қажет');
        oshibka = 1;
    } else if(nameval.length > 40) {
        namekate2('Есім 40 символдан аспауы қажет');
        oshibka = 1;
    }

    if (oshibka == 0) {
        divid2.children("input[name='name']").css('border', '1px solid #BABAB9');
        var zhauap = $("input[name='zhauap']:checked").val();
        var zhauaptext = getZhauapText(zhauap);

        function handleComplete(guestId) {
            $("#nameengiz").modal('hide');
            $("#sattizhauap").modal('show');
            if (sattizhauap) sattizhauap.play();
            divid2.children("input[name='name']").val("");
            $(".otvetname").html(nameval);
            $(".otvetzhauap").html(zhauaptext);
            $(".opros").hide();
            $(".otvetnaopros").show();
            window.KONAK_ID = guestId;
            $("input[name='konakid']").val(guestId);
            localStorage.setItem('shaqyru_konak_id', guestId);
            localStorage.setItem('shaqyru_guest_name', nameval);
            localStorage.setItem('shaqyru_guest_answer', JSON.stringify({ name: nameval, zhauap: zhauap, zhauaptext: zhauaptext }));
        }

        $.ajax({
            method: "POST",
            url: "zayavka2.php",
            data: {'rejim': 1, 'zhauap': zhauap, 'shaqyruid': $.trim(divid.children("input[name='shaqyruid']").val()), 'konakid': $.trim(divid.children("input[name='konakid']").val()), 'name': nameval }
        })
        .done(function (msg) {
            handleComplete(msg || '1');
        })
        .fail(function () {
            handleComplete('1');
        });
    } else {
        divid2.children("input[name='name']").css('border', '1px solid red');
    }
}

function tilekotpravka(divid, divid2) {
    var oshibka = 0;
    var nameval = $.trim(divid2.children("input[name='name']").val());
    var tilekval = $.trim(divid2.children("textarea[name='tilek']").val());

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, function (m) {
            return {
                '&': "&amp;",
                '<': "&lt;",
                '>': "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[m];
        });
    }

    nameval = escapeHtml(nameval);
    tilekval = escapeHtml(tilekval);

    if (nameval == '') {
        namekate('Есім жазылмады');
        divid2.children("input[name='name']").css('border', '1px solid red');
        oshibka = 1;
    } else if(nameval.length < 2) {
        namekate('Есім 2 символдан кем болмауы қажет');
        divid2.children("input[name='name']").css('border', '1px solid red');
        oshibka = 1;
    } else if(nameval.length > 40) {
        namekate('Есім 40 символдан аспауы қажет');
        divid2.children("input[name='name']").css('border', '1px solid red');
        oshibka = 1;
    } else {
        divid2.children("input[name='name']").css('border', '1px solid #BABAB9');
        $('.namekate').hide();
    }

    if (tilekval == '') {
        tilekkate('Тілек жазылмады');
        divid2.children("textarea[name='tilek']").css('border', '1px solid red');
        oshibka = 1;
    } else if(tilekval.length < 5) {
        tilekkate('Тілек кемінде 5 символдан тұруы қажет');
        divid2.children("textarea[name='tilek']").css('border', '1px solid red');
        oshibka = 1;
    } else if(tilekval.length > 700) {
        tilekkate('Тілек 700 символдан аспауы қажет');
        divid2.children("textarea[name='tilek']").css('border', '1px solid red');
        oshibka = 1;
    } else {
        divid2.children("textarea[name='tilek']").css('border', '1px solid #BABAB9');
        $('.tilekkate').hide();
    }

    if (oshibka == 0) {
        var submitBtn = divid2.children("button");
        submitBtn.prop('disabled', true).text('Жіберілуде...');

        function handleWishDone() {
            submitBtn.prop('disabled', false).text('Тілекті жіберу');
            $("#tilekengiz").modal('hide');
            $("#sattitilek").modal('show');
            divid2.children("input[name='name']").val("");
            divid2.children("textarea[name='tilek']").val("");
            if (typeof sattitilek !== 'undefined' && sattitilek && sattitilek.play) {
                sattitilek.play();
            }
        }

        if (window.sendWishToFirebase) {
            window.sendWishToFirebase(nameval, tilekval)
                .then(function() {
                    handleWishDone();
                })
                .catch(function(err) {
                    console.error("Firebase send wish error:", err);
                    handleWishDone();
                });
        } else {
            handleWishDone();
        }
    }
}

/* ------- AUDIO START ------------ */
var audio = new Audio();

function soundonClick(audio_src) {
    $('.sound-on').hide();
    $('.sound-off').show();
    audio.src = audio_src;
    audio.volume = 1.0;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(function(error) {
            console.log("Audio play error: ", error);
        });
    }
}

function soundoffClick() {
    $('.sound-off').hide();
    $('.sound-on').show();
    audio.pause();
}

audio.addEventListener("ended", function() {
    $('.sound-off').hide();
    $('.sound-on').show();
    audio.pause();
});
/* ------- AUDIO END ------------ */

/* ------- ANIMATION ONJAK SOLJAK START ------------ */
document.addEventListener("DOMContentLoaded", function () {
  const allAnimated = document.querySelectorAll('.onjak, .soljak');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });

  allAnimated.forEach(el => observer.observe(el));
});
/* ------- ANIMATION ONJAK SOLJAK END ------------ */

/* ---- ASTINA TUS START ------*/
window.addEventListener('scroll', function handleScroll() {
    const soundBarer = document.querySelector('.sound-barer');
    const container = document.querySelector('.downcontainer');
    if (container) {
      container.classList.add('hide');
      window.removeEventListener('scroll', handleScroll);
    }
    if (soundBarer) soundBarer.classList.add('active');
});
/* ---- ASTINA TUS END ------*/
