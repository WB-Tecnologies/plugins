/*
Dragger v1
WB--Tech.Lab plugins family (jQuery 1.7 depended)
Plugin #2 for dragging images version 1
Released under the MIT licence http://opensource.org/licenses/mit-license.php
Date of release 8.8.2012

*/

/*
MANUAL
To Initialize plugin 

$(".big").wbtDragOverflow({
  cursor: "grab",
  icon: true
});
// OR
$("p img").wbtDragOverflow({
  cursor: "arrow",
  icon: true
});

*/

(function($){
    $.fn.wbtDragOverflow = function(params){
		if ($(this).size() === 0) {
    		throw new Error('Draggable element not found');
		}
		var options = $.extend($.fn.wbtDragOverflow.options, params),
			els = $(this),
			isMobile,
			isMousePressed = false,
			dragStartX,
			dragStartY,
			dragEndX,
			dragEndY,
			posLeft = 0,
			posScrollTop,
			posScrollLeft,
			el,
			handle,
			useragent;


		function init(options){
			var	hasIcon = (options.icon === undefined) ? true : options.icon,
				cursorType = (options.cursor === undefined) ? "grab" : options.cursor;

			if(!els){
				return;
			}

			detectMobile();

			$.each(els, function(){
				el = $(this);

				if(el.width() < el.parent().width()){
					return true;
				}

				el.wrap("<div class=\"wbt-draggable_wrap\" style=\"height:" + el.height() + "px\"/>");
				el.addClass("wbt-draggable_el");

				handle = $("<div class=\"wbt-draggable_handle\" />").insertAfter(el);
				if(isMobile){
					handle[0].addEventListener("touchstart", onDragStart, false);
					handle[0].addEventListener("touchend", onDragEnd, false);
					handle[0].addEventListener("touchmove", onDragMove, false);
				} else {
					handle.on("mousedown", onDragStart);
					handle.on("mouseup", onDragEnd);
					handle.on("mousemove", onDragMove);
					handle.on("mouseleave", onDragEnd);
				}
				switch(cursorType){
					case "arrow":
						handle.addClass("wbt-draggable_cursor-arrow");
						break;
					case "grab":
						handle.addClass("wbt-draggable_cursor-grab");
						break;
				}

				if(hasIcon){
					el.after("<div class=\"wbt-draggable_icon\" />");
				}
			});

			if(hasIcon){
				$("body").on("mousedown", ".wbt-draggable_icon", function(e){e.preventDefault();});
			}
		}

		function detectMobile(){
			useragent = navigator.userAgent.toLowerCase();
			if (useragent.indexOf("iphone") != -1 || useragent.indexOf("symbianos") != -1 || useragent.indexOf("ipad") != -1 || useragent.indexOf("ipod") != -1 || useragent.indexOf("android") != -1 || useragent.indexOf("blackberry") != -1 || useragent.indexOf("samsung") != -1 || useragent.indexOf("nokia") != -1 || useragent.indexOf("windows ce") != -1 || useragent.indexOf("sonyericsson") != -1 || useragent.indexOf("webos") != -1 || useragent.indexOf("wap") != -1 || useragent.indexOf("motor") != -1 || useragent.indexOf("symbian") != -1 ){
				isMobile = true;
			}
			else {
				isMobile = false;
			}
		}

		function onDragStart(e){
			el = $(this).siblings(".wbt-draggable_el");
			posScrollTop = $(document).scrollTop();
			posScrollLeft = $(document).scrollLeft();
			if(isMobile){
				dragStartX = e.touches[0].pageX;
				dragStartY = e.touches[0].pageY;
			}
			else {
				e.preventDefault();
				isMousePressed = true;
				dragStartX = e.pageX;
				dragStartY = e.pageY;
				$(this).addClass("wbt-active");
			}
		}

		function onDragEnd(){
			el = $(this).siblings(".wbt-draggable_el");
			isMousePressed = false;
			posLeft = el.position().left;
			posScrollTop = $(document).scrollTop();
			posScrollLeft = $(document).scrollLeft();

			if(!isMobile){
				$(this).removeClass("wbt-active");
			}
		}

		function onDragMove(e){ // register global touch events?
			el = $(this).siblings(".wbt-draggable_el");

			if(isMobile){
				//$("#test").text(e.touches[0].pageX);
				if(e.touches.length == 1){
					e.preventDefault(); // prevents page scrolling, allows immidiate event firing
				} else {
					return;
				}
				dragEndX = e.touches[0].pageX;
				dragEndY = e.touches[0].pageY;
			} else {
				e.preventDefault();
				if(isMousePressed){
					dragEndX = e.pageX;
					dragEndY = e.pageY;
				} else {
					return false;
				}
			}

			dragChangeX = posLeft + (dragEndX - dragStartX);
			maxChangeX = el.parent().width() - el.width();
			if (dragChangeX > 0){
				dragChangeX = 0;
			}
			if (dragChangeX < maxChangeX){
				dragChangeX = maxChangeX;
			}

			el.css("left", dragChangeX);
			
			if(isMobile){
				dragChangeY = posScrollTop + (dragStartY - dragEndY);
				if (dragChangeY <= 0){
					dragChangeY = 1; // not 0 to avoid android 2.3 toolbar glitch
				}
				$(window).scrollTop(dragChangeY);
				posScrollTop = dragChangeY;
			}
		}

		init(options);
	}
	$.fn.wbtDragOverflow.options = {};
})(jQuery)