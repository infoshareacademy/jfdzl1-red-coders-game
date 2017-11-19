$('.popuptext').hide();
$(".help").on('click', function () {
    $('.popuptext').show();
});
$('.popuptext').on('mouseleave', function () {
    $(this).hide();
});
