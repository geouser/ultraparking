// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

     /*---------------------------
                                  Fullpage
    ---------------------------*/
    if ( exist('#fullpage') ) {
        $('#fullpage').fullpage({
            lockAnchors: false,
            sectionSelector: '.fp-section',
            slideSelector: '.fp-slide',
            responsiveWidth: 1200,
            anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
            menu: '#myMenu',
            css3: true,
            scrollingSpeed: 1000
        });    
    }


    if (window.params.isMobile) {
        $(document).click(function(event){
            if ($(event.target).closest('header').is(".mainHeader")) {console.log('mainHeader')
                $(".mainHeader").addClass('opened');
            } else {
                $(".mainHeader").removeClass('opened');
            }
        });
    } else {
        $(".mainHeader").hover(function(){
            $(this).addClass('opened');
            }, function(){
            $(this).removeClass('opened');
        });
    }

    $('.scroll-down').click(function(){
        $.fn.fullpage.moveSectionDown();
    });
    $('.scroll-up').click(function(){
        $.fn.fullpage.moveSectionUp();
    });

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.mainNav a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });




    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({});


    $('.input-group--select').click(function(){
        $(this).toggleClass('open');
        $(this).find('ul').toggleClass('open');
    });

    $('.select-list li').click(function(){
        var value = $(this).text();
        $(this).parent().siblings('input').val(value);
        $(this).parent().siblings('span').text(value);
    });

    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }

    $('.form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });


    if (exist('.datepicker')) {
        $(".datepicker").datepicker();
    }



    /*Google map init*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long+0.002);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);
        if ( $(window).width() <= 1000 ) {
            mapCenterCoord = new google.maps.LatLng(lat, long);
            mapMarkerCoord = new google.maps.LatLng(lat, long);
        }
        $(window).resize(function(event) {
            if ( $(window).width() <= 1000 ) {
                mapCenterCoord = new google.maps.LatLng(lat, long);
                mapMarkerCoord = new google.maps.LatLng(lat, long);
            } else {
                mapCenterCoord = new google.maps.LatLng(lat, long+0.002);
                mapMarkerCoord = new google.maps.LatLng(lat, long);
            }
        });

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 17,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Чисто Строй"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file