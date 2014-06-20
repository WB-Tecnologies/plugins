// Generated by CoffeeScript 1.7.1

/*
wbt.rotator.js v2.1.0

Dependencies: jQuery 1.7+, Snap SVG 0.2+

Basic usage:
$(".any-selector").wbtRotator({
  src: "path/template/{{30}}.jpg",
  masks: [{
    title: "First Mask",
    src: "path/to/mask/{{30}}.svg"
  }, {
    title: "Second Mask",
    src: "path/to/mask/{{30}}.svg"
  }]
});

Copyright 2014, Visual Science, http://visualscience.ru/
Created by WB—Tech, http://wbtech.pro/
 */

(function() {
  (function($) {
    var WBTRotator;
    WBTRotator = function($el, params) {
      var $legendDescription, $legendTitle, $style, cssText, lang, mask, tplLanguages, _i, _j, _len, _len1, _ref, _ref1;
      this.cfg = $.extend({}, WBTRotator.prototype.defaults, params);
      this.cfg.frameSrc = this.createSrcArray(this.cfg.src);
      this.cfg.frameCover = this.cfg.cover;
      this.cfg.frameFirst = this.cfg.first;
      this.cfg.maskSrc = this.cfg.masks;
      _ref = this.cfg.maskSrc;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mask = _ref[_i];
        mask.titleId = mask.id;
      }
      this.cfg.language = this.cfg.language.toUpperCase();
      this.$el = $el.addClass("wbt-rotator");
      this.$elContent = $("<div></div>").attr({
        "class": "wbt-rotator-content"
      }).prependTo(this.$el);
      this.$frameCurrent = $();
      this.$maskCurrent = $();
      this.$frames = $();
      this.frames = {
        previous: 0,
        current: this.cfg.frameFirst,
        total: this.cfg.frameSrc.length,
        loaded: 0,
        size: {
          width: 0,
          height: 0
        }
      };
      this.$masks = {};
      this.masks = {
        current: "",
        titles: this.cfg.maskSrc.length,
        total: this.cfg.maskSrc.length * this.frames.total,
        loaded: 0
      };
      this.$legendHeading = {};
      this.$legendTitles = {};
      this.$legendDescriptions = {};
      this.pointerPressed = false;
      this.pointerMoved = false;
      this.pointerPosition = {
        x: 0,
        y: 0
      };
      if (!this.$el.length) {
        return $.wbtError("Specify non empty rotator placeholder.");
      }
      if (!this.cfg.frameSrc) {
        return $.wbtError("Specify 'src' in $().wbtRotator() call.");
      }
      this.$loader = $("<span></span>").attr({
        "class": "wbt-rotator-loader"
      }).prependTo(this.$elContent);
      if (!this.cfg.frameCover) {
        this.cfg.frameCover = this.cfg.src.replace(/{{.*}}/, "00");
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
      if (this.cfg.autoLoad) {
        this.loadImages();
      } else {
        this.$elContent.on("" + ($.wbtIsTouch() ? "singleTap" : "click") + ".wbt-rotator", $.proxy(this.loadImages, this));
      }
      this.maskSVG = Snap();
      this.$maskSVG = $(this.maskSVG.node);
      this.$maskSVG.appendTo(this.$elContent).attr({
        "class": "wbt-rotator-mask"
      });
      if (typeof this.cfg.maskSrc === "object") {
        if (this.cfg.autoLoad) {
          this.loadSVG();
        } else {
          this.$elContent.on("" + ($.wbtIsTouch() ? "singleTap" : "click") + ".wbt-rotator", $.proxy(this.loadSVG, this));
        }
      } else {

      }
      if (this.cfg.legend) {
        this.$maskLegend = $("<div></div>").attr({
          "class": "wbt-rotator-legend"
        }).appendTo(this.$el);
        this.$legendHeading = $("<div><span class='wbt-rotator-heading_text'></span></div>").attr({
          "class": "wbt-rotator-heading"
        }).appendTo(this.$maskLegend);
        this.$maskTitles = $("<ul></ul>").attr({
          "class": "wbt-rotator-titles_list"
        }).appendTo(this.$maskLegend);
        this.$maskDescriptions = $("<ul></ul>").attr({
          "class": "wbt-rotator-descriptions_list"
        }).appendTo(this.$maskLegend);
        _ref1 = this.cfg.maskSrc;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          mask = _ref1[_j];
          $legendTitle = $("<li></li>").attr("class", "wbt-rotator-titles_item").appendTo(this.$maskTitles).data("title", mask.titleId);
          $("<span></span>").attr("class", "wbt-rotator-titles_text").appendTo($legendTitle).html(mask.titleId);
          $("<span></span>").attr("class", "wbt-rotator-titles_icon").appendTo($legendTitle).css({
            "background-color": mask.color || "#fff"
          });
          $legendDescription = $("<li></li>").attr("class", "wbt-rotator-descriptions_item").appendTo(this.$maskDescriptions).data("title", mask.titleId).html(mask.titleId);
          this.$legendTitles[mask.titleId] = $legendTitle;
          this.$legendDescriptions[mask.titleId] = $legendDescription;
        }
        this.$maskTitles.on("" + ($.wbtIsTouch() ? "singleTap" : "click"), "li", $.proxy(this.onPathClick, this, null));
        if (!$.wbtIsTouch()) {
          this.$maskTitles.on("mouseover", "li", $.proxy(this.onPathOver, this, null));
          this.$maskTitles.on("mouseout", "li", $.proxy(this.onPathOut, this, null));
        }
        if ($.wbtRotator.l10n != null) {
          tplLanguages = "";
          for (lang in $.wbtRotator.l10n) {
            tplLanguages += "<option " + (lang === this.cfg.language ? "selected" : void 0) + " value='" + lang + "'>" + lang + "</option>";
          }
          $("<select>" + tplLanguages + "</select>").prependTo(this.$legendHeading).wbtFormStyler().on("change", $.proxy(this.changeLocale, this)).parent().find(".wbt-input-select_options").css({
            "background-color": this.$el.css("background-color"),
            "box-shadow": "0 0 1px 1px " + (this.$el.css("background-color"))
          });
          this.updateLocalization(true);
        }
      }
      if (this.cfg.theme) {
        if (this.cfg.theme.background) {
          this.$el.css({
            "color": this.cfg.theme.text,
            "background-color": this.cfg.theme.background
          });
        }
      }
      cssText = ".wbt-rotator {color:" + this.cfg.theme.text + " !important;background-color:" + this.cfg.theme.background + " !important;} .wbt-rotator-titles_item:hover, .wbt-rotator-titles_item__hover, .wbt-rotator .wbt-input-select_item:hover {color:" + this.cfg.theme.hover + " !important;} .wbt-rotator-titles_item__active, .wbt-rotator-titles_item__active:hover, .wbt-rotator-legend a, .wbt-rotator .wbt-input-select__active .wbt-input-select_button, .wbt-rotator .wbt-input-select_item__active, .wbt-rotator .wbt-input-select_item__active:hover, .wbt-rotator .wbt-input-select_selected:hover {color:" + this.cfg.theme.active + " !important;} .wbt-rotator .wbt-input-select_selected, .wbt-rotator .wbt-input-select_list {border:1px solid " + this.cfg.theme.text + ";} .wbt-rotator .wbt-input-select_selected:hover, .wbt-rotator .wbt-input-select_list:hover, .wbt-rotator .wbt-input-select__active .wbt-input-select_list {border:1px solid " + this.cfg.theme.active + ";} .wbt-rotator-titles_item__active .wbt-rotator-titles_icon {border-color:" + this.cfg.theme.active + ";}";
      $style = $("<style></style>").prependTo(this.$el);
      if ($style[0].styleSheet) {
        $style[0].styleSheet.cssText = cssText;
      } else {
        $style.html(cssText);
      }
    };
    WBTRotator.prototype.defaults = {
      language: "EN",
      frameCover: "",
      frameSrc: "",
      frameFirst: 0,
      first: 0,
      leadingZero: true,
      autoLoad: true,
      rotateAuto: false,
      rotateAutoSpeed: 100,
      rotateManual: true,
      invertAxes: false,
      invertMouse: false,
      invertAutoRotate: false,
      enableMouseWheel: true,
      circular: true,
      fogging: true,
      legend: true,
      cursor: "grab"
    };
    WBTRotator.prototype.registerEvents = function() {
      this.$elContent[0].addEventListener(($.wbtIsTouch() ? "touchstart" : "mousedown"), $.proxy(this.onPointerDown, this));
      document.addEventListener(($.wbtIsTouch() ? "touchend" : "mouseup"), $.proxy(this.onPointerUp, this));
      document.addEventListener(($.wbtIsTouch() ? "touchmove" : "mousemove"), $.proxy(this.onPointerMove, this));
      if (this.cfg.enableMouseWheel) {
        this.$elContent.on("mousewheel DOMMouseScroll", $.proxy(this.onScroll, this));
      }
      if (this.cfg.rotateAuto) {
        this.$elContent.on("mouseenter", $.proxy(this.onPointerEnter, this));
        this.$elContent.on("mouseleave", $.proxy(this.onPointerLeave, this));
      }
    };
    WBTRotator.prototype.createSrcArray = function(template) {
      var i, itemCount, itemCountLength, itemIndex, itemIndexLength, itemSrcArray;
      itemCount = parseInt(template.replace(/.*{{|}}.*/g, ""));
      itemCountLength = ("" + itemCount).length;
      itemIndex = 0;
      itemIndexLength = 0;
      itemSrcArray = [];
      i = 1;
      while (i <= itemCount) {
        itemIndex = i;
        if (this.cfg.leadingZero) {
          while (itemIndexLength = ("" + itemIndex).length < itemCountLength) {
            itemIndex = "0" + itemIndex;
          }
        }
        itemSrcArray.push(template.replace(/{{.*}}/, itemIndex));
        i++;
      }
      return itemSrcArray;
    };
    WBTRotator.prototype.updateLoader = function() {
      this.$loader.css("background-position", "left -" + (Math.round((this.frames.loaded + this.masks.loaded) * 60 / (this.frames.total + this.masks.total)) * 40) + "px");
    };
    WBTRotator.prototype.loadCover = function() {
      this.$cover = $("<img />").attr({
        "class": "wbt-rotator-cover",
        src: this.cfg.frameCover,
        alt: ""
      }).appendTo(this.$elContent).on("load", (function(_this) {
        return function() {
          _this.frames.size = {
            width: _this.$cover.width(),
            height: _this.$cover.height()
          };
          _this.$elContent.width(_this.frames.size.width);
          _this.$el.height(_this.frames.size.height);
        };
      })(this)).on("error", (function(_this) {
        return function() {
          if (_this.cfg.frameCover !== _this.cfg.frameSrc[0]) {
            _this.cfg.frameCover = _this.cfg.frameSrc[0];
            _this.loadCover();
          }
        };
      })(this));
    };
    WBTRotator.prototype.loadSVG = function() {
      var getCallback, i, index, mask, maskSrc, _i, _j, _len, _ref, _ref1, _results;
      this.$elContent.off("" + ($.wbtIsTouch() ? "singleTap" : "click") + ".wbt-rotator");
      this.$el.addClass("wbt-rotator__loading");
      _ref = this.cfg.maskSrc;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        mask = _ref[index];
        this.cfg.maskSrc[index].srcArray = this.createSrcArray(mask.src);
      }
      _results = [];
      for (i = _j = 0, _ref1 = this.frames.total - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        _results.push((function() {
          var _k, _len1, _ref2, _results1;
          _ref2 = this.cfg.maskSrc;
          _results1 = [];
          for (index = _k = 0, _len1 = _ref2.length; _k < _len1; index = ++_k) {
            maskSrc = _ref2[index];
            getCallback = (function(_this) {
              return function(title, index) {
                return function(data) {
                  return _this.loadedSVG(data, title, index);
                };
              };
            })(this);
            _results1.push($.get(maskSrc.srcArray[i], getCallback(this.cfg.maskSrc[index].titleId, i)));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };
    WBTRotator.prototype.loadedSVG = function(documentSVG, title, index) {
      var colorRGB, imageGroup, imageNew, mask, path, pathGroup, _i, _j, _len, _len1, _ref, _ref1;
      this.masks.loaded++;
      this.updateLoader();
      if (this.$masks[title] == null) {
        this.$masks[title] = {};
      }
      if (this.$masks[title].paths == null) {
        this.$masks[title].paths = [];
      }
      if (this.$masks[title].images == null) {
        this.$masks[title].images = [];
      }
      imageNew = this.maskSVG.image(this.cfg.frameSrc[index], 0, 0);
      imageNew.attr("display", "none");
      imageGroup = this.maskSVG.g().append(imageNew);
      pathGroup = this.maskSVG.g().attr({
        display: "none",
        fill: "transparent",
        style: "-webkit-transition:100ms;transition:100ms;",
        cursor: "pointer"
      });
      $(documentSVG).find("path").each((function(_this) {
        return function(index, el) {
          var pathNew;
          pathNew = _this.maskSVG.path($(el).attr("d"));
          if ($.wbtIsTouch()) {
            pathNew.touchstart(function() {
              return _this.pointerMoved = false;
            });
            pathNew.touchmove(function() {
              return _this.pointerMoved = true;
            });
            pathNew.touchend(function() {
              if (!_this.pointerMoved) {
                return $.proxy(_this.onPathClick, _this, pathNew)();
              }
            });
          } else {
            pathNew.click($.proxy(_this.onPathClick, _this, pathNew));
            pathNew.mouseover($.proxy(_this.onPathOver, _this, pathNew));
            pathNew.mouseout($.proxy(_this.onPathOut, _this, pathNew));
          }
          pathNew.data("index", index);
          pathNew.data("title", title);
          return pathGroup.add(pathNew);
        };
      })(this));
      this.$masks[title].paths[index] = pathGroup.attr("display", "none");
      this.$masks[title].paths[index].data("id", index);
      imageNew.attr("mask", pathGroup.clone().attr({
        fill: "#fff",
        display: ""
      }));
      this.$masks[title].images[index] = imageNew;
      if (this.masks.loaded === this.masks.total) {
        _ref = this.cfg.maskSrc;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mask = _ref[_i];
          _ref1 = this.$masks[mask.titleId].paths;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            path = _ref1[_j];
            colorRGB = Snap.getRGB(mask.color);
            mask.colorRGB = colorRGB;
            path.attr({
              stroke: "rgba(" + mask.colorRGB.r + "," + mask.colorRGB.g + "," + mask.colorRGB.b + ",.4)"
            });
            path.attr({
              "stroke-width": 0
            });
            path.appendTo(this.maskSVG);
          }
        }
        if (this.frames.loaded === this.frames.total) {
          return this.loadComplete();
        }
      }
    };
    WBTRotator.prototype.loadImages = function() {
      var i, _i, _ref;
      this.$elContent.off("" + ($.wbtIsTouch() ? "singleTap" : "click") + ".wbt-rotator");
      this.$el.addClass("wbt-rotator__loading");
      for (i = _i = 0, _ref = this.frames.total; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        $("<img />").attr({
          "class": "wbt-rotator-image",
          src: this.cfg.frameSrc[i],
          alt: ""
        }).appendTo(this.$elContent).on("load", (function(_this) {
          return function(e) {
            var $this;
            _this.frames.loaded++;
            _this.updateLoader();
            if (_this.frames.loaded === 1 && !_this.frameCover) {
              $this = $(e.target);
              _this.frames.size = {
                width: $this.width(),
                height: $this.height()
              };
              _this.$elContent.width(_this.frames.size.width);
              _this.$elContent.height(_this.frames.size.height);
            }
            if (_this.frames.loaded === _this.frames.total && _this.masks.loaded === _this.masks.total) {
              _this.loadComplete();
            }
          };
        })(this));
      }
    };
    WBTRotator.prototype.loadComplete = function() {
      this.$elContent.on("" + ($.wbtIsTouch() ? "singleTap" : "click") + ".wbt-rotator", "image", $.proxy(this.pathDeselect, this, null));
      this.$frames = this.$elContent.children(".wbt-rotator-image");
      this.changeFrame(this.frames.current);
      this.$el.removeClass("wbt-rotator__loading").addClass("wbt-rotator__loaded");
      this.registerEvents();
      if (this.cfg.rotateAuto) {
        this.startAutoRotate();
      }
    };
    WBTRotator.prototype.onPointerDown = function(e) {
      this.$el.addClass("wbt-rotator__active");
      this.pointerPressed = true && this.cfg.rotateManual;
      if (e.touches && e.touches.length > 1) {
        this.pointerPressed = false;
      } else {
        this.pointerPosition.x = e.pageX;
        this.pointerPosition.y = e.pageY;
      }
    };
    WBTRotator.prototype.onPointerUp = function() {
      if (this.pointerPressed) {
        this.$el.removeClass("wbt-rotator__active");
        this.pointerPressed = false;
        this.frames.current = this.$elContent.children(".wbt-rotator-image").index(this.$frameCurrent);
      }
    };
    WBTRotator.prototype.onPointerMove = function(e) {
      var delta, x, y;
      if (this.pointerPressed) {
        if (!e.touches || e.touches && e.touches.length === 1) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
        if (e.touches) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
        } else {
          x = e.pageX;
          y = e.pageX;
        }
        if (this.cfg.invertAxes) {
          delta = y - this.pointerPosition.y;
        } else {
          delta = x - this.pointerPosition.x;
        }
        delta = Math.floor(delta * this.frames.total / (this.invertAxes ? this.frames.size.height : this.frames.size.width));
        if (this.cfg.invertMouse) {
          delta = this.frames.current - delta;
        } else {
          delta = this.frames.current + delta;
        }
        this.changeFrame(delta);
      }
    };
    WBTRotator.prototype.pathSelect = function(title, frame) {
      var mask, _i, _len, _ref;
      if (frame == null) {
        frame = this.frames.current;
      }
      _ref = this.cfg.maskSrc;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mask = _ref[_i];
        if (mask.titleId === title) {
          this.$masks[mask.titleId].paths[frame].attr({
            "stroke-width": 1
          });
          if (this.cfg.fogging) {
            this.$masks[mask.titleId].paths[frame].attr({
              fill: "rgba(255,255,255,0)"
            });
          } else {
            this.$masks[mask.titleId].paths[frame].attr({
              fill: "rgba(" + mask.colorRGB.r + "," + mask.colorRGB.g + "," + mask.colorRGB.b + ",.4)"
            });
          }
          this.$masks[mask.titleId].images[frame].attr({
            display: ""
          });
        }
      }
      if (this.cfg.fogging) {
        return this.$el.addClass("wbt-rotator-mask__active");
      }
    };
    WBTRotator.prototype.pathDeselect = function(title, frame) {
      var mask, _i, _len, _ref;
      if (frame == null) {
        frame = this.frames.current;
      }
      _ref = this.cfg.maskSrc;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mask = _ref[_i];
        if (mask.titleId === title) {
          this.$masks[mask.titleId].paths[frame].attr({
            "stroke-width": 0,
            fill: "rgba(255,255,255,0)"
          });
          this.$masks[mask.titleId].images[frame].attr({
            display: "none"
          });
        }
      }
      if (this.cfg.fogging) {
        return this.$el.removeClass("wbt-rotator-mask__active");
      }
    };
    WBTRotator.prototype.onPathClick = function(el, e) {
      var mask, title, _i, _len, _ref, _results;
      title = el ? el.data("title") : $(e.target).data("title") || $(e.target).closest("li").data("title");
      if (this.masks.current && this.masks.current === title) {
        this.pathDeselect(this.masks.current);
        this.masks.current = "";
      } else {
        if (this.masks.current && this.masks.current !== title) {
          this.pathDeselect(this.masks.current);
        }
        this.pathSelect(title);
        this.masks.current = title;
        this.findFrame();
      }
      if (this.cfg.legend) {
        _ref = this.cfg.maskSrc;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mask = _ref[_i];
          this.$legendTitles[mask.titleId].toggleClass("wbt-rotator-titles_item__active", mask.titleId === this.masks.current);
          _results.push(this.$legendDescriptions[mask.titleId].toggleClass("wbt-rotator-descriptions_item__active", mask.titleId === this.masks.current));
        }
        return _results;
      }
    };
    WBTRotator.prototype.onPathOver = function(el, e) {
      var mask, title, _i, _j, _len, _len1, _ref, _ref1, _results;
      title = el ? el.data("title") : $(e.target).data("title") || $(e.target).closest("li").data("title");
      _ref = this.cfg.maskSrc;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mask = _ref[_i];
        if (mask.titleId === title && mask.titleId !== this.masks.current) {
          this.$masks[mask.titleId].paths[this.frames.current].attr({
            fill: "rgba(" + mask.colorRGB.r + "," + mask.colorRGB.g + "," + mask.colorRGB.b + ",.4)"
          });
        }
      }
      if (this.cfg.legend) {
        _ref1 = this.cfg.maskSrc;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          mask = _ref1[_j];
          this.$legendTitles[mask.titleId].toggleClass("wbt-rotator-titles_item__hover", mask.titleId === title);
          _results.push(this.$legendDescriptions[mask.titleId].toggleClass("wbt-rotator-descriptions_item__hover", mask.titleId === title));
        }
        return _results;
      }
    };
    WBTRotator.prototype.onPathOut = function(el, e) {
      var mask, title, _i, _len, _ref, _results;
      title = el ? el.data("title") : $(e.target).data("title") || $(e.target).closest("li").data("title");
      if (this.cfg.fogging || title !== this.masks.current) {
        this.$masks[title].paths[this.frames.current].attr({
          fill: "rgba(255,255,255,0)"
        });
      }
      if (this.cfg.legend) {
        _ref = this.cfg.maskSrc;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mask = _ref[_i];
          this.$legendTitles[mask.titleId].removeClass("wbt-rotator-titles_item__hover");
          _results.push(this.$legendDescriptions[mask.titleId].removeClass("wbt-rotator-descriptions_item__hover"));
        }
        return _results;
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
        if (scrollUp) {
          this.frames.current++;
        } else {
          this.frames.current--;
        }
        if (this.cfg.circular) {
          this.frames.current += this.frames.total;
          this.frames.current %= this.frames.total;
        } else {
          if (this.frames.current > this.frames.total - 1) {
            this.frames.current = this.frames.total - 1;
          }
          if (this.frames.current < 0) {
            this.frames.current = 0;
          }
        }
        this.changeFrame(this.frames.current);
      }
    };
    WBTRotator.prototype.findFrame = function() {
      var animateStep, path, pathsRotated, stepsBackward, stepsForward, _i, _j, _len;
      pathsRotated = this.$masks[this.masks.current].paths.slice(0);
      stepsForward = 0;
      pathsRotated.rotate(this.frames.current);
      for (_i = 0, _len = pathsRotated.length; _i < _len; _i++) {
        path = pathsRotated[_i];
        if (!path.node.childElementCount) {
          stepsForward++;
        } else {
          break;
        }
      }
      stepsBackward = 0;
      pathsRotated.rotate(1);
      for (_j = pathsRotated.length - 1; _j >= 0; _j += -1) {
        path = pathsRotated[_j];
        if (!path.node.childElementCount) {
          stepsBackward++;
        } else {
          break;
        }
      }
      animateStep = (function(_this) {
        return function(stepsRemaining, direction) {
          _this.frames.current += direction;
          _this.frames.current %= _this.frames.total;
          _this.changeFrame(_this.frames.current);
          if (stepsRemaining > 1) {
            return setTimeout(function() {
              return animateStep(stepsRemaining - 1, direction);
            }, 40);
          }
        };
      })(this);
      if (stepsForward === 0 || stepsBackward === 0) {
        return false;
      } else {
        if (stepsBackward > stepsForward) {
          animateStep(stepsForward, 1);
        }
        if (stepsBackward < stepsForward) {
          animateStep(stepsBackward, -1);
        }
      }
      return true;
    };
    WBTRotator.prototype.changeFrame = function(frameCurrent) {
      var mask, _i, _len, _ref;
      if (this.cfg.circular) {
        frameCurrent += this.frames.total;
        frameCurrent %= this.frames.total;
      } else {
        if (frameCurrent > this.frames.total - 1) {
          frameCurrent = this.frames.total - 1;
        }
        if (frameCurrent < 0) {
          frameCurrent = 0;
        }
      }
      if (frameCurrent === this.framePrevious) {
        return;
      }
      this.$frameCurrent.removeClass("wbt-rotator-image__active");
      this.$frameCurrent = this.$frames.eq(frameCurrent);
      this.$frameCurrent.addClass("wbt-rotator-image__active");

      /*
      for mask in @cfg.maskSrc
         * Deselect and hide everything on previous frame
        @$masks[mask.titleId].paths[@frames.previous].attr display: "none", "stroke-width": 0, fill: "rgba(255,255,255,0)"
        @$masks[mask.titleId].images[@frames.previous].attr display: "none"
      
         * Show current frame
        @$masks[mask.titleId].paths[frameCurrent].attr display: ""
        if @masks.current and @masks.current is mask.titleId
          @$masks[mask.titleId].paths[frameCurrent].attr "stroke-width": 1
          if @cfg.fogging
            @$masks[mask.titleId].paths[@frames.current].attr fill: "rgba(255,255,255,0)"
          else
            @$masks[mask.titleId].paths[@frames.current].attr fill: "rgba(#{mask.colorRGB.r},#{mask.colorRGB.g},#{mask.colorRGB.b},.4)"
          @$masks[mask.titleId].images[frameCurrent].attr display: ""
       */
      _ref = this.cfg.maskSrc;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mask = _ref[_i];
        this.$masks[mask.titleId].paths[this.frames.previous].attr({
          display: "none",
          "stroke-width": 0,
          fill: "rgba(255,255,255,0)"
        });
        this.$masks[mask.titleId].images[this.frames.previous].attr({
          display: "none"
        });
        this.$masks[mask.titleId].paths[frameCurrent].attr({
          display: ""
        });
      }
      if (this.masks.current) {
        this.pathSelect(this.masks.current, frameCurrent);
      }
      this.frames.previous = frameCurrent;
    };
    WBTRotator.prototype.startAutoRotate = function() {
      setInterval(((function(_this) {
        return function() {
          if (_this.cfg.invertAutoRotate) {
            ++_this.frames.current;
          } else {
            --_this.frames.current;
          }
          if (!_this.pointerPressed) {
            _this.changeFrame(_this.frames.current);
          }
        };
      })(this)), this.cfg.rotateAutoSpeed);
    };
    WBTRotator.prototype.stopAutoRotate = function() {};
    WBTRotator.prototype.changeLocale = function(e) {
      this.cfg.language = $(e.target).val().toUpperCase();
      return this.updateLocalization();
    };
    WBTRotator.prototype.updateLocalization = function(isFirstTime) {
      var $descriptionsActive, $descriptionsList, $descriptionsPrevious, $el, $heading, $headingTextActive, $headingTextPrevious, $titlesItems, $titlesItemsActive, $titlesItemsPrevious, $titlesList, animationTime, titleId, val, _ref, _ref1;
      this.$el.attr("lang", this.cfg.language);
      animationTime = isFirstTime ? 0 : 500;
      $titlesList = $(".wbt-rotator-titles_list");
      $titlesItems = $(".wbt-rotator-titles_item");
      $titlesItemsActive = $(".wbt-rotator-titles_item__active");
      $titlesItemsPrevious = $titlesItems.clone().appendTo($titlesList);
      $titlesItemsPrevious.each(function(index, el) {
        return $(el).css({
          opacity: "0",
          position: "absolute",
          left: "0",
          right: "0",
          top: index * 30 + "px"
        });
      });
      $descriptionsList = $(".wbt-rotator-descriptions_list");
      $descriptionsActive = $(".wbt-rotator-descriptions_item__active");
      $descriptionsPrevious = $descriptionsActive.clone().appendTo($descriptionsList);
      $descriptionsPrevious.css({
        opacity: "0",
        position: "absolute",
        left: "0",
        right: "0",
        top: "0"
      });
      $heading = $(".wbt-rotator-heading");
      $headingTextActive = $(".wbt-rotator-heading_text");
      $headingTextPrevious = $headingTextActive.clone().appendTo($heading);
      $headingTextPrevious.css({
        opacity: "0",
        position: "absolute",
        left: "0",
        top: "0"
      });
      val = $.wbtRotator.l10n[this.cfg.language].heading;
      if (val === "{{EN}}") {
        val = $.wbtRotator.l10n["EN"].heading;
      }
      $headingTextActive.text(val);
      _ref = this.$legendTitles;
      for (titleId in _ref) {
        $el = _ref[titleId];
        val = $.wbtRotator.l10n[this.cfg.language].masks[titleId].title;
        if (val === "{{EN}}") {
          val = $.wbtRotator.l10n["en"].masks[titleId].title;
        }
        $el.attr("title", val).children("span").eq(0).text(val);
      }
      _ref1 = this.$legendDescriptions;
      for (titleId in _ref1) {
        $el = _ref1[titleId];
        val = $.wbtRotator.l10n[this.cfg.language].masks[titleId].description;
        if (val === "{{EN}}") {
          val = $.wbtRotator.l10n["EN"].masks[titleId].description;
        }
        $el.html(val);
      }
      $titlesItems.sort(function(a, b) {
        if ($(a).text() > $(b).text()) {
          return 1;
        }
        if ($(a).text() < $(b).text()) {
          return -1;
        }
        return 0;
      });
      $titlesItems.appendTo($titlesList);
      $headingTextActive.css({
        opacity: 0
      }).animate({
        opacity: "1"
      }, animationTime);
      $headingTextPrevious.css({
        opacity: 1
      }).animate({
        opacity: "0"
      }, animationTime, function() {
        return $headingTextPrevious.remove();
      });
      $titlesItems.css({
        opacity: 0
      }).animate({
        opacity: "1"
      }, animationTime);
      $titlesItemsPrevious.css({
        opacity: 1
      }).animate({
        opacity: "0"
      }, animationTime, function() {
        return $titlesItemsPrevious.remove();
      });
      $descriptionsActive.css({
        opacity: 0
      }).animate({
        opacity: "1"
      }, animationTime);
      return $descriptionsPrevious.css({
        opacity: 1
      }).animate({
        opacity: "0"
      }, animationTime, function() {
        return $descriptionsPrevious.remove();
      });
    };
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
    $.wbtRotator = {} || $.wbtRotator;
    Array.prototype.rotate = (function() {
      var push, splice;
      push = Array.prototype.push;
      splice = Array.prototype.splice;
      return function(count) {
        var len;
        len = this.length >>> 0;
        count = count >> 0;
        count = ((count % len) + len) % len;
        push.apply(this, splice.call(this, 0, count));
        return this;
      };
    })();
  })(jQuery);

}).call(this);
