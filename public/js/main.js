var lst = 0; // Last ScrollTop Position
var loadimages = true; // LazyLoad
var hto = 0; // Header Time Out
var ww = 0; // Window Width
var wh = 0; // Window Height
var popuptimer = 0; // Popup Timer


jQuery(document).ready(function($){
	ww = $(window).width();
	wh = $(window).height();

	$('a[data-onclick]').each(function(){
		$(this).attr('onclick', $(this).data('onclick'));
	});
	$('#popupss').click(function(e){
		e.stopPropagation();
	});
	$('[data-popup="txtcontent"]').on('click',function(e){
		e.preventDefault();
		clearTimeout(popuptimer);
		$('#overlay > div').hide();
		//$('#txtcontent').show();
		$('#overlay').removeClass('active-form').addClass('active active-copycontent');
		$('#txtcontent').addClass('active').show();
    });

	$('[data-popup="form"]').on('click',function(e){
		e.preventDefault();
		clearTimeout(popuptimer);
		$('#overlay > div').hide();
		var popup = $(this).attr('rel');
		
		$('#overlay').removeClass('active active-copycontent').find('[rel="'+popup+'"]').show();
		popuptimer = setTimeout(function(){
			$('#overlay > div').scrollTop(0);
			$('#overlay').addClass('active active-form').find('[rel="'+popup+'"]').scrollTop(0).addClass('active').show();
		},10);
	});	

	$('#overlay > div').on('click',function(e){
		e.stopPropagation();
	});
	
	$('#overlay, #overlay .close, #overlay h2').on('click',function(e){
		var viewport = $("meta[name='viewport']");
		var original = viewport.attr("content");
		var force_scale = original + ", maximum-scale=1";
		viewport.attr("content", force_scale);
		$('#overlay, #overlay > div').removeClass('active');
		$('html,body').css({overflow:'auto'});
		popuptimer = setTimeout(function(){
			$('#overlay > div').hide();
			viewport.attr("content", original);
        },750);
	});
	
	
$(".menuIcon").click(function() {
  $(".sideMenu").slideToggle( "slow" );
  $(".menuIcon").toggleClass( "activeM" );
});


});

var postForm = function() {
	if($("#name").val() === "") {
		alert("Please enter full name!");
		$("#name").focus();
		return false;
	}
	if($("#email").val() === "") {
		alert("Please enter valid email address!");
		$("#email").focus();
		return false;
	}
	if($("#phone").val() === "") {
		alert("Please enter valid phone number!");
		$("#phone").focus();
		return false;
	}
	if($("#message").val() === "") {
		alert("Please enter Additional Comments!");
		$("#message").focus();
		return false;
	}
	
	$.post( "/admin/contactForm.php", { method:"postForm", name: $("#name").val(), email: $("#email").val(), phone: $("#phone").val(), message:$("#message").val() })
  	.done(function( data ) {
		alert(data);
		$(".popDesignInner .close").click();
  	});
}



window.addEventListener('load', function(){
	if ('serviceWorker' in navigator) {
		//navigator.serviceWorker.register('/gameApp/sw.js');
		navigator.serviceWorker.register('/sw.js');
	}
	
//page refresh
$('#pageReload').click(function() {
    location.reload();
});

//Full Screen Code
$('#btnFullScreen').on('click',function() {
	if(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement) { //in fullscreen, so exit it
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	} else { //not fullscreen, so enter it
		if(document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if(document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen();
		} else if(document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if(document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
	}
});

})