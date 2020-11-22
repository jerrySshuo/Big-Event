$(function () {
    $('#gotoRegi').on('click', function () {
        $('.regiBox').show();
        $('.loginBox').hide();
    });

    $('#gotoLogin').on('click', function () {
        $('.regiBox').hide();
        $('.loginBox').show();
    })
})