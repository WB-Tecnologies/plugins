
var useragent=navigator.userAgent;useragent=useragent.toLowerCase();var mobile;if(useragent.indexOf('iphone')!=-1||useragent.indexOf('symbianos')!=-1||useragent.indexOf('ipad')!=-1||useragent.indexOf('ipod')!=-1||useragent.indexOf('android')!=-1||useragent.indexOf('blackberry')!=-1||useragent.indexOf('samsung')!=-1||useragent.indexOf('nokia')!=-1||useragent.indexOf('windows ce')!=-1||useragent.indexOf('sonyericsson')!=-1||useragent.indexOf('webos')!=-1||useragent.indexOf('wap')!=-1||useragent.indexOf('motor')!=-1||useragent.indexOf('symbian')!=-1)
{mobile=true;}
else{mobile=false;}
var zoomWrapId="ebola";var pictureW;var pictureH;var zoomId="zoom";var zoomRad=100;var x;var y;var bgx;var bgy;var zoomOffset;var zoomedAreaXoffset=20;var zoomedAreaYoffset=732;var zoomCoeff=1.947;var zoomSrc="url('/feature-img/ebola-virus/ebola-markup4.jpg')";var counturColor="red";var counturOpacity=0;var svgCountur="m 254.85535,1144.4772 -7.35535,0.4696 -8,-1.496 c -4.4,-0.8227 -12.23813,-2.6455 -17.41807,-4.0505 -5.17995,-1.405 -12.71614,-3.8646 -16.7471,-5.4659 -4.03096,-1.6013 -11.49283,-5.0012 -16.58192,-7.5555 -5.0891,-2.5542 -11.72791,-6.2225 -14.75291,-8.1517 -3.025,-1.9291 -8.70171,-5.9136 -12.61491,-8.8543 l -7.1149,-5.3467 -5.99939,-7.7631 c -3.29966,-4.2697 -8.92873,-12.2631 -12.50904,-17.7631 -3.58031,-5.5 -10.78333,-17.875 -16.00673,-27.5 -5.22339,-9.625 -13.14254,-24.7821 -17.5981,-33.6824 -4.455559,-8.9003 -10.854823,-22.62534 -14.220585,-30.50001 L 81.81678,972.5 l -6.341427,-19 -6.341427,-19 -4.056373,-16.5 c -2.231005,-9.075 -5.158868,-23.025 -6.506361,-31 -1.347494,-7.975 -3.226119,-21.025 -4.174721,-29 l -1.724733,-14.5 -0.0151,-14.5 -0.0151,-14.5 1.223989,-12.5 c 0.673194,-6.875 1.43742,-13.5125 1.69828,-14.75 l 0.47429,-2.25 122.408373,0 122.40838,0 0.32257,26.75 0.32257,26.75 4.74602,9.5 4.74602,9.5 9.25398,12.73721 c 5.08969,7.00546 14.05389,19.38046 19.92045,27.5 5.86656,8.11953 14.38457,20.58879 18.92892,27.70946 l 8.26244,12.94668 7.24153,14.05332 7.24152,14.05333 3.49082,10.09183 c 1.91995,5.5505 4.47733,14.5505 5.68308,20 l 2.19227,9.90817 0.0133,6.5 0.0133,6.5 -2.70546,11.9214 c -1.48801,6.5567 -4.05473,15.7817 -5.70382,20.5 -1.64909,4.7182 -4.90574,12.6286 -7.23701,17.5786 -2.33126,4.95 -6.56245,12.7406 -9.40264,17.3125 -2.8402,4.5718 -7.20232,10.9614 -9.69361,14.199 l -4.52961,5.8865 -9.23078,6.1887 -9.23078,6.1887 -11.83643,5.8376 -11.83642,5.8376 -12.25373,3.9865 -12.25372,3.9866 -12.5545,2.542 -12.5545,2.542 -7.35535,0.4695 z";function move(evt){if(mobile==false){x=evt.pageX;y=evt.pageY;}
else if(mobile==true){x=evt.clientX;y=evt.clientY;event.preventDefault();}
y=y-zoomOffset.top;x=x-zoomOffset.left;bgx=zoomCoeff*(x-zoomedAreaXoffset)-zoomRad;bgy=zoomCoeff*(y-zoomedAreaYoffset)-zoomRad;x=x-zoomRad;if(mobile==true){y=y-zoomRad-zoomRad-20}
else{y=y-zoomRad;}
$("#"+zoomId).css({"left":x+"px","top":y+"px","background-position":-bgx+"px -"+bgy+"px","visibility":"visible"});}
function start(evt){if(mobile==false){x=evt.pageX;y=evt.pageY;}
else if(mobile==true){x=evt.clientX;y=evt.clientY-zoomRad-20;}
y=y-zoomOffset.top;x=x-zoomOffset.left;$("#"+zoomId).show().css({"top":+x+"px","left":+y+"px"});}
function end(evt){$("#"+zoomId).css("visibility","hidden");}
$(document).ready(function(){$("#"+zoomWrapId).append('<div style="visibility:hidden" id="'+zoomId+'"><div></div></div>');$("#"+zoomId).css({"background-image":zoomSrc,"background-image":zoomSrc,"width":2*zoomRad+"px","height":2*zoomRad+"px","border-radius":zoomRad+"px","-webkit-border-radius":zoomRad+"px","-moz-border-radius":zoomRad+"px"});zoomOffset=$("#"+zoomWrapId).offset();pictureW=$("#"+zoomWrapId+" img").css("width");pictureH=$("#"+zoomWrapId+" img").css("height");var zoomLayout=Raphael(zoomWrapId,pictureW,pictureH);$("svg").css({"position":"absolute","top":"0","left":"20px"});zoomLayout.path(svgCountur).attr({"fill":counturColor,"fill-opacity":counturOpacity,"stroke-width":0,"stroke":"none"}).hover(start,end).mousemove(move).touchstart(start).touchmove(move).touchend(end);});