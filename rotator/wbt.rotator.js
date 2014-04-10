// Generated by CoffeeScript 1.7.1

/*
wbt.rotator.js v1.0.3

Licensed under the MIT license.
http://opensource.org/licenses/mit-license.php

Dependencies: jQuery 1.7+

Basic usage:
$(".any-selector").wbtRotator({
frameSrc: "path/template/{{30}}.jpg"
});

For more instructions and examples, please visit http://wbtech.pro/blog/articles/rotator/

Copyright 2012, WBTech
http://wbtech.pro/
 */

(function() {
  (function($) {
    var WBTRotator;
    WBTRotator = function($el, params) {
      this.cfg = $.extend({}, WBTRotator.prototype.defaults, params);
      this.$el = $el.addClass("wbt-rotator");
      this.$frames = $();
      this.$frameCurrent = $();
      this.framePrevious = 0;
      this.frameCurrent = this.cfg.frameFirst;
      this.frameCount = 0;
      this.frameLoadedCount = 0;
      this.frameSize = {
        width: 0,
        height: 0
      };
      this.masks = [];
      this.paths = [];
      this.pathCount = 0;
      this.pathLoadedCount = 0;
      this.pathRoot = null;
      this.pointerPressed = false;
      this.pointerPosition = {
        x: 0,
        y: 0
      };
      if (!this.$el.length) {
        return $.wbtError("Specify non empty rotator placeholder.");
      }
      if (!this.cfg.frameSrc || this.cfg.frameSrc.length === 0) {
        return $.wbtError("Specify 'frameSrc' in $().wbtRotator() call.");
      }
      if (typeof this.cfg.frameSrc === "string") {
        this.getFrameSrc();
      }
      if (typeof this.cfg.pathSrc === "string") {
        this.getPathSrc();
      }
      this.frameCount = this.cfg.frameSrc.length;
      this.pathCount = this.cfg.pathSrc.length;
      if (this.cfg.showLoader) {
        this.$loader = $("<span>&#9654;</span>").attr({
          "class": "wbt-rotator-loader"
        }).appendTo(this.$el);
      }
      if (!this.cfg.frameCover) {
        this.cfg.frameCover = this.cfg.frameSrc[0];
      }
      this.loadCover();
      if (this.cfg.rotateManual) {
        if (this.cfg.cursor === "arrows") {
          if (this.cfg.invertAxes) {
            this.$el.addClass("wbt-rotator__vertical");
          } else {
            this.$el.addClass("wbt-rotator__horizontal");
          }
        } else {
          if (this.cfg.cursor === "grab") {
            this.$el.addClass("wbt-rotator__grab");
          }
        }
      }
      this.$el.on("click.wbt-rotator", $.proxy(this.loadImages, this));
      this.$mask = $("<div></div>").attr({
        "class": "wbt-rotator-mask"
      }).appendTo(this.$el);
      this.maskPaper = Snap();
      this.$mask.append(this.maskPaper.node);
      if (this.cfg.autoLoad) {
        this.loadImages();
      }
    };
    WBTRotator.prototype.defaults = {
      showLoader: true,
      frameCover: "",
      frameSrc: "",
      pathSrc: "",
      frameFirst: 0,
      leadingZero: true,
      autoLoad: true,
      rotateAuto: false,
      rotateAutoSpeed: 100,
      rotateManual: true,
      invertAxes: false,
      invertMouse: false,
      invertAutoRotate: false,
      enableMouseWheel: true,
      cursor: "arrows"
    };
    WBTRotator.prototype.registerEvents = function() {
      this.$el[0].addEventListener(($.wbtIsTouch() ? "touchstart" : "mousedown"), $.proxy(this.onPointerDown, this));
      document.addEventListener(($.wbtIsTouch() ? "touchend" : "mouseup"), $.proxy(this.onPointerUp, this));
      document.addEventListener(($.wbtIsTouch() ? "touchmove" : "mousemove"), $.proxy(this.onPointerMove, this));
      if (this.cfg.enableMouseWheel) {
        this.$el.on("mousewheel DOMMouseScroll", $.proxy(this.onScroll, this));
      }
      if (this.cfg.rotateAuto) {
        this.$el.on("mouseenter", $.proxy(this.onPointerEnter, this));
        this.$el.on("mouseleave", $.proxy(this.onPointerLeave, this));
      }
    };
    WBTRotator.prototype.getCoverSrc = function() {};
    WBTRotator.prototype.getFrameSrc = function() {
      var frameCount, frameCountLength, frameIndex, frameIndexLength, frameSrc, i;
      frameCount = parseInt(this.cfg.frameSrc.replace(/.*{{|}}.*/g, ""));
      frameCountLength = ("" + frameCount).length;
      frameIndex = 0;
      frameIndexLength = 0;
      frameSrc = [];
      i = 0;
      while (i < frameCount) {
        frameIndex = i;
        if (this.cfg.leadingZero) {
          while (frameIndexLength = ("" + frameIndex).length < frameCountLength) {
            frameIndex = "0" + frameIndex;
          }
        }
        frameSrc.push(this.cfg.frameSrc.replace(/{{.*}}/, frameIndex));
        i++;
      }
      this.cfg.frameSrc = frameSrc;
    };
    WBTRotator.prototype.getPathSrc = function() {
      var i, pathCount, pathCountLength, pathIndex, pathIndexLength, pathSrc;
      pathCount = parseInt(this.cfg.pathSrc.replace(/.*{{|}}.*/g, ""));
      pathCountLength = ("" + pathCount).length;
      pathIndex = 0;
      pathIndexLength = 0;
      pathSrc = [];
      i = 0;
      while (i < pathCount) {
        pathIndex = i;
        if (this.cfg.leadingZero) {
          while (pathIndexLength = ("" + pathIndex).length < pathCountLength) {
            pathIndex = "0" + pathIndex;
          }
        }
        pathSrc.push(this.cfg.pathSrc.replace(/{{.*}}/, pathIndex));
        i++;
      }
      this.cfg.pathSrc = pathSrc;
    };
    WBTRotator.prototype.loadCover = function() {
      this.$cover = $("<img />").attr({
        "class": "wbt-rotator-cover",
        src: this.cfg.frameCover,
        alt: ""
      }).appendTo(this.$el).on("load", (function(_this) {
        return function() {
          _this.frameSize = {
            width: _this.$cover.width(),
            height: _this.$cover.height()
          };
          _this.$el.width(_this.frameSize.width).height(_this.frameSize.height);
        };
      })(this));
    };
    WBTRotator.prototype.loadImages = function() {
      var i, _i, _ref;
      this.$el.off("click.wbt-rotator").addClass("wbt-rotator__loading");
      for (i = _i = 0, _ref = this.frameCount; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        $("<img />").attr({
          "class": "wbt-rotator-image",
          src: this.cfg.frameSrc[i],
          alt: ""
        }).appendTo(this.$el).on("load", (function(_this) {
          return function(e) {
            var $this;
            _this.frameLoadedCount++;
            if (_this.frameLoadedCount === 1 && !_this.frameCover) {
              $this = $(e.target);
              _this.frameSize = {
                width: $this.width(),
                height: $this.height()
              };
              _this.$el.width(_this.frameSize.width).height(_this.frameSize.height);
            }
            if (_this.frameLoadedCount === _this.frameCount) {
              _this.loadImagesComplete();
            }
          };
        })(this));
      }
    };
    WBTRotator.prototype.loadPaths = function(i) {
      var self;
      this.$el.off("click.wbt-rotator").addClass("wbt-rotator__loading");
      self = this;
      $.get(this.cfg.pathSrc[i], (function(_this) {
        return function(el) {
          var imageNew, pathsSet;
          _this.pathLoadedCount++;
          imageNew = _this.maskPaper.image(_this.cfg.frameSrc[i], 0, 0);
          imageNew.attr("display", "none");
          pathsSet = _this.maskPaper.g().attr({
            display: "none",
            fill: "rgba(0,255,0,.5)",
            fill: "transparent",
            cursor: "pointer"
          });
          $(el).find("path").each(function(index, el) {
            var pathNew;
            pathNew = _this.maskPaper.path($(el).attr("d"));
            pathNew.transform("s.25,.25,0,0");
            pathNew.click(function() {
              return self.$mask.toggleClass("wbt-rotator-mask__active");
            });
            pathsSet.add(pathNew);
            pathsSet.data("group", "testgroup");
            return pathsSet.data("index", i);
          });
          _this.paths.push(pathsSet);
          imageNew.attr("mask", pathsSet.clone().attr({
            fill: "#fff",
            display: ""
          }));
          _this.masks.push(imageNew);
          if (_this.pathLoadedCount === _this.pathCount) {
            return _this.loadPathsComplete();
          } else {
            return _this.loadPaths(++i);
          }
        };
      })(this));
    };
    WBTRotator.prototype.loadImagesComplete = function() {
      this.loadPaths(0);
    };
    WBTRotator.prototype.loadPathsComplete = function() {
      this.$frames = this.$el.children(".wbt-rotator-image");
      this.changeFrame(this.frameCurrent);
      this.changePath(this.frameCurrent);
      this.$el.removeClass("wbt-rotator__loading").addClass("wbt-rotator__loaded");
      this.registerEvents();
      if (this.cfg.rotateAuto) {
        this.startAutoRotate();
      }
    };
    WBTRotator.prototype.onPointerDown = function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      this.$el.addClass("wbt-rotator__active");
      this.pointerPressed = true && this.cfg.rotateManual;
      this.pointerPosition.x = e.pageX;
      this.pointerPosition.y = e.pageY;
    };
    WBTRotator.prototype.onPointerUp = function() {
      if (this.pointerPressed) {
        this.$el.removeClass("wbt-rotator__active");
        this.pointerPressed = false;
        this.frameCurrent = this.$el.children(".wbt-rotator-image").index(this.$frameCurrent);
      }
    };
    WBTRotator.prototype.onPointerMove = function(e) {
      var delta;
      if (this.pointerPressed) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        delta = void 0;
        if (this.cfg.invertAxes) {
          delta = e.pageY - this.pointerPosition.y;
        } else {
          delta = e.pageX - this.pointerPosition.x;
        }
        delta = Math.floor(delta * this.frameCount / (this.invertAxes ? this.frameSize.height : this.frameSize.width));
        if (this.cfg.invertMouse) {
          delta = this.frameCurrent - delta;
        } else {
          delta = this.frameCurrent + delta;
        }
        this.changeFrame(delta, this.frameCurrent);
        this.changePath(delta, this.frameCurrent);
      }
    };
    WBTRotator.prototype.onPointerEnter = function() {};
    WBTRotator.prototype.onPointerLeave = function() {};
    WBTRotator.prototype.onScroll = function(e, delta) {
      var scrollUp;
      if (this.cfg.rotateManual) {
        e.preventDefault();
        scrollUp = void 0;
        if (undefined !== e.wheelDelta) {
          scrollUp = e.wheelDelta > 0;
        } else if (undefined !== e.detail) {
          scrollUp = e.detail > 0;
        } else {
          scrollUp = e.originalEvent.wheelDelta > 0;
        }
        this.frameCurrent %= this.frameCount;
        if (scrollUp) {
          ++this.frameCurrent;
        } else {
          --this.frameCurrent;
        }
        this.changeFrame(this.frameCurrent);
        this.changePath(this.frameCurrent);
      }
    };
    WBTRotator.prototype.changeFrame = function(newIndex) {
      newIndex %= this.frameCount;
      newIndex += this.frameCount;
      newIndex %= this.frameCount;
      this.$frameCurrent.removeClass("wbt-rotator-image__active");
      this.$frameCurrent = this.$frames.eq(newIndex);
      this.$frameCurrent.addClass("wbt-rotator-image__active");
      this.masks[this.framePrevious].attr({
        "display": "none"
      });
      this.masks[newIndex].attr({
        "display": ""
      });
    };
    WBTRotator.prototype.changePath = function(newIndex) {
      newIndex %= this.frameCount;
      newIndex += this.frameCount;
      newIndex %= this.frameCount;
      this.paths[this.framePrevious].attr({
        display: "none"
      });
      this.paths[newIndex].attr({
        display: ""
      });
      this.framePrevious = newIndex;
    };
    WBTRotator.prototype.startAutoRotate = function() {
      setInterval(((function(_this) {
        return function() {
          if (_this.cfg.invertAutoRotate) {
            ++_this.frameCurrent;
          } else {
            --_this.frameCurrent;
          }
          if (!_this.pointerPressed) {
            _this.changeFrame(_this.frameCurrent);
            _this.changePath(_this.frameCurrent);
          }
        };
      })(this)), this.cfg.rotateAutoSpeed);
    };
    WBTRotator.prototype.stopAutoRotate = function() {};
    $.wbtError = function(error) {
      if (window.console && window.console.error) {
        console.error(error);
      }
    };
    $.wbtIsTouch = function() {
      if (("ontouchstart" in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
        return true;
      } else {
        return false;
      }
    };
    $.fn.wbtRotator = function(params) {
      return new WBTRotator(this, params);
    };
  })(jQuery);

}).call(this);
