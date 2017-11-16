// Music module - Autoplay
var music = document.getElementById('background_audio');

document.getElementById('mute').addEventListener('click', function (e) {
    e = e || window.event;
    music.muted = !music.muted;
    e.preventDefault();
}, false);

// Music module - toggle icon
$('.music-on').click(function() {
    $(this).toggleClass('music-off');
});

// Add class to logo by hover
$('.logo img').hover(
    function () {
        $(this).addClass('shake-effect');
    },
    function () {
        $(this).removeClass('shake-effect');
    }
);

// Add class to redcoders logo by hover
$('.author img').hover(
    function () {
        $(this).addClass('shake-effect');
    },
    function () {
        $(this).removeClass('shake-effect');
    }
);