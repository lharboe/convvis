require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Path":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Path = (function(superClass) {
  var animate, animating, animations, bezier, close, path, point, points, quadratic;

  extend(Path, superClass);

  path = [];

  animating = [];

  point = [];

  animate = [];

  quadratic = [];

  bezier = [];

  close = [];

  animations = points = 0;

  function Path(options) {
    var pathBegin, pathEnd, svgEnd, svgStart;
    options = _.defaults(options, this.pointVisible = this.handleVisible = false, this.pointSize = 4, this.handleSize = 2, this.strokeWidth = 1, this.pointColor = this.handleColor = this.strokeColor = "white", this.fill, this.path = {
      animationOptions: {
        time: 1,
        curve: "bezier-curve"
      },
      draggable: false,
      point: (function(_this) {
        return function(p) {
          var cx, cy, i, j, obj, ref;
          point[points] = new Layer({
            name: "Point #" + points,
            backgroundColor: _this.pointColor,
            superLayer: _this,
            width: _this.pointSize,
            height: _this.pointSize,
            borderRadius: _this.pointSize / 2,
            x: p.x - _this.pointSize / 2,
            y: p.y - _this.pointSize / 2
          });
          animate[points] = new Animation;
          if (_this.pointVisible === false) {
            point[points].opacity = 0;
          }
          if (_this.path.draggable === true) {
            point[points].draggable = true;
          }
          if (p.quadratic === "first" || p.bezier === "first" || p.bezier === "second") {
            point[points].name = "Point #" + points + " (handle)";
            point[points].backgroundColor = _this.handleColor;
            point[points].width = _this.handleSize;
            point[points].height = _this.handleSize;
            if (_this.handleVisible === false) {
              point[points].opacity = 0;
            }
          }
          if (p.states !== void 0) {
            animations = points;
            if (Array.isArray(p.states.x) && Array.isArray(p.states.y)) {
              for (i = j = 0, ref = p.states.x.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                cx = p.states.x;
                cy = p.states.y;
                point[points].states.add((
                  obj = {},
                  obj["array " + i] = {
                    x: cx[i],
                    y: cy[i]
                  },
                  obj
                ));
              }
            }
            if (Array.isArray(p.states.x) === false && Array.isArray(p.states.y) === false) {
              point[points].states.add({
                second: {
                  x: p.states.x,
                  y: p.states.y
                }
              });
              animate[points] = new Animation({
                layer: point[points],
                properties: {
                  x: p.states.x,
                  y: p.states.y
                },
                time: _this.path.animationOptions.time,
                curve: _this.path.animationOptions.curve
              });
            }
            if (Array.isArray(p.states.x) && Array.isArray(p.states.y) === false) {
              print("Y values are not an array");
            }
            if (Array.isArray(p.states.x) === false && Array.isArray(p.states.y)) {
              print("X values are not an array");
            }
            point[points].states.animationOptions = _this.path.animationOptions;
          }
          if (p.quadratic === void 0 && p.bezier !== "first") {
            quadratic[points] = false;
            bezier[points] = false;
            if (p.close === true) {
              path.push('L' + p.x);
              close[points] = true;
            } else {
              path.push(p.x);
            }
          }
          if (p.quadratic === "first") {
            bezier[points] = false;
            quadratic[points] = true;
            path.push('Q' + p.x);
          }
          if (p.bezier === "first") {
            quadratic[points] = false;
            bezier[points] = true;
            path.push('C' + p.x);
          }
          path.push(p.y);
          _this.html = svgStart + pathBegin + path + pathEnd + svgEnd;
          return points++;
        };
      })(this),
      animate: (function(_this) {
        return function(t) {
          var execute, i, j, k, ref, ref1, results;
          for (i = j = 0, ref = point.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (t === void 0 || t === "states") {
              point[i].states.next();
            } else {
              animate[i].start();
            }
            execute = function() {
              var c, k, ref1;
              for (i = k = 0, ref1 = point.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
                c = i + i;
                animating[c] = point[i].x + _this.pointSize / 2;
                if (quadratic[i] === true) {
                  animating[c] = "Q" + animating[c];
                }
                if (bezier[i] === true) {
                  animating[c] = "C" + animating[c];
                }
                if (close[i] === true) {
                  animating[c] = "L" + animating[c];
                }
                animating[c + 1] = point[i].y + _this.pointSize / 2;
              }
              return _this.html = svgStart + pathBegin + animating + pathEnd + svgEnd;
            };
          }
          results = [];
          for (i = k = 0, ref1 = point.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
            results.push(point[i].on('change:point', function() {
              return execute();
            }));
          }
          return results;
        };
      })(this),
      quadratic: (function(_this) {
        return function(p) {
          var handle, quadraticPoint;
          if (p.states !== void 0) {
            handle = {
              x: p.x,
              y: p.y,
              states: {
                x: p.states.x,
                y: p.states.y
              },
              quadratic: "first"
            };
            quadraticPoint = {
              x: p.qx,
              y: p.qy,
              states: {
                x: p.states.qx,
                y: p.states.qy
              }
            };
          } else {
            handle = {
              x: p.x,
              y: p.y,
              quadratic: "first"
            };
            quadraticPoint = {
              x: p.qx,
              y: p.qy
            };
          }
          _this.path.point(handle);
          return _this.path.point(quadraticPoint);
        };
      })(this),
      cubic: (function(_this) {
        return function(p) {
          var bezierPoint, handleOne, handleTwo;
          if (p.states !== void 0) {
            handleOne = {
              x: p.cx1,
              y: p.cy1,
              states: {
                x: p.states.cx1,
                y: p.states.cy1
              },
              bezier: "first"
            };
            handleTwo = {
              x: p.cx2,
              y: p.cy2,
              states: {
                x: p.states.cx2,
                y: p.states.cy2
              },
              bezier: "second"
            };
            bezierPoint = {
              x: p.x,
              y: p.y,
              states: {
                x: p.states.x,
                y: p.states.y
              }
            };
          } else {
            handleOne = {
              x: p.cx1,
              y: p.cy1,
              bezier: "first"
            };
            handleTwo = {
              x: p.cx2,
              y: p.cy2,
              bezier: "second"
            };
            bezierPoint = {
              x: p.x,
              y: p.y
            };
          }
          _this.path.point(handleOne);
          _this.path.point(handleTwo);
          return _this.path.point(bezierPoint);
        };
      })(this),
      close: (function(_this) {
        return function(p) {
          p.close = true;
          return _this.path.point(p);
        };
      })(this)
    });
    Path.__super__.constructor.call(this, options);
    svgStart = '<svg height="' + this.height + '" width="' + this.width + '" stroke=' + this.strokeColor + ' stroke-width="' + this.strokeWidth + '" fill="' + this.fill + '">';
    pathBegin = '<path d="M';
    pathEnd = '">';
    svgEnd = '</svg>';
  }

  Path.define("path.animationOptions", {
    get: function() {
      return this._path.animationOptions;
    },
    set: function(value) {
      return this._path.animationOptions = value;
    }
  });

  Path.define("path.draggable", {
    get: function() {
      return this._path.draggable;
    },
    set: function(value) {
      return this._path.draggable = value;
    }
  });

  Path.define("pointVisible", {
    get: function() {
      return this._pointVisible;
    },
    set: function(value) {
      return this._pointVisible = value;
    }
  });

  Path.define("handleVisible", {
    get: function() {
      return this._handleVisible;
    },
    set: function(value) {
      return this._handleVisible = value;
    }
  });

  Path.define("pointSize", {
    get: function() {
      return this._pointSize;
    },
    set: function(value) {
      return this._pointSize = value;
    }
  });

  Path.define("handleSize", {
    get: function() {
      return this._handleSize;
    },
    set: function(value) {
      return this._handleSize = value;
    }
  });

  Path.define("pointColor", {
    get: function() {
      return this._pointColor;
    },
    set: function(value) {
      return this._pointColor = value;
    }
  });

  Path.define("handleColor", {
    get: function() {
      return this._handleColor;
    },
    set: function(value) {
      return this._handleColor = value;
    }
  });

  Path.define("strokeColor", {
    get: function() {
      return this._strokeColor;
    },
    set: function(value) {
      return this._strokeColor = value;
    }
  });

  Path.define("strokeWidth", {
    get: function() {
      return this._strokeWidth;
    },
    set: function(value) {
      return this._strokeWidth = value;
    }
  });

  Path.define("fill", {
    get: function() {
      return this._fill;
    },
    set: function(value) {
      return this._fill = value;
    }
  });

  return Path;

})(Layer);


},{}],"SVGLayer":[function(require,module,exports){
"SVGLayer class\n\nproperties\n- linecap <string> (\"round\" || \"square\" || \"butt\")\n- fill <string> (css color)\n- stroke <string> (css color)\n- strokeWidth <number>\n- dashOffset <number> (from -1 to 1, defaults to 0)";
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.SVGLayer = (function(superClass) {
  extend(SVGLayer, superClass);

  function SVGLayer(options) {
    var cName, d, footer, header, path, t;
    if (options == null) {
      options = {};
    }
    options = _.defaults(options, {
      dashOffset: 1,
      strokeWidth: 2,
      stroke: "#28affa",
      backgroundColor: null,
      clip: false,
      fill: "transparent",
      linecap: "round"
    });
    SVGLayer.__super__.constructor.call(this, options);
    if (options.fill === null) {
      this.fill = null;
    }
    this.width += options.strokeWidth / 2;
    this.height += options.strokeWidth / 2;
    d = new Date();
    t = d.getTime();
    cName = "c" + t;
    header = "<svg class='" + cName + "' x='0px' y='0px' width='" + this.width + "' height='" + this.height + "' viewBox='-" + (this.strokeWidth / 2) + " -" + (this.strokeWidth / 2) + " " + (this.width + this.strokeWidth / 2) + " " + (this.height + this.strokeWidth / 2) + "'>";
    path = options.path;
    footer = "</svg>";
    this.html = header + path + footer;
    Utils.domComplete((function(_this) {
      return function() {
        var domPath;
        domPath = document.querySelector('.' + cName + ' path');
        _this._pathLength = domPath.getTotalLength();
        _this.style = {
          "stroke-dasharray": _this.pathLength
        };
        return _this.dashOffset = options.dashOffset;
      };
    })(this));
  }

  SVGLayer.define("pathLength", {
    get: function() {
      return this._pathLength;
    },
    set: function(value) {
      return print("SVGLayer.pathLength is readonly");
    }
  });

  SVGLayer.define("linecap", {
    get: function() {
      return this.style.strokeLinecap;
    },
    set: function(value) {
      return this.style.strokeLinecap = value;
    }
  });

  SVGLayer.define("strokeLinecap", {
    get: function() {
      return this.style.strokeLinecap;
    },
    set: function(value) {
      return this.style.strokeLinecap = value;
    }
  });

  SVGLayer.define("fill", {
    get: function() {
      return this.style.fill;
    },
    set: function(value) {
      if (value === null) {
        value = "transparent";
      }
      return this.style.fill = value;
    }
  });

  SVGLayer.define("stroke", {
    get: function() {
      return this.style.stroke;
    },
    set: function(value) {
      return this.style.stroke = value;
    }
  });

  SVGLayer.define("strokeColor", {
    get: function() {
      return this.style.stroke;
    },
    set: function(value) {
      return this.style.stroke = value;
    }
  });

  SVGLayer.define("strokeWidth", {
    get: function() {
      return Number(this.style.strokeWidth.replace(/[^\d.-]/g, ''));
    },
    set: function(value) {
      return this.style.strokeWidth = value;
    }
  });

  SVGLayer.define("dashOffset", {
    get: function() {
      return this._dashOffset;
    },
    set: function(value) {
      var dashOffset;
      this._dashOffset = value;
      if (this.pathLength != null) {
        dashOffset = Utils.modulate(value, [0, 1], [this.pathLength, 0]);
        return this.style.strokeDashoffset = dashOffset;
      }
    }
  });

  return SVGLayer;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9TVkdMYXllci5jb2ZmZWUiLCIuLi9tb2R1bGVzL1BhdGguY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiXCJcIlwiXG5TVkdMYXllciBjbGFzc1xuXG5wcm9wZXJ0aWVzXG4tIGxpbmVjYXAgPHN0cmluZz4gKFwicm91bmRcIiB8fCBcInNxdWFyZVwiIHx8IFwiYnV0dFwiKVxuLSBmaWxsIDxzdHJpbmc+IChjc3MgY29sb3IpXG4tIHN0cm9rZSA8c3RyaW5nPiAoY3NzIGNvbG9yKVxuLSBzdHJva2VXaWR0aCA8bnVtYmVyPlxuLSBkYXNoT2Zmc2V0IDxudW1iZXI+IChmcm9tIC0xIHRvIDEsIGRlZmF1bHRzIHRvIDApXG5cIlwiXCJcblxuY2xhc3MgZXhwb3J0cy5TVkdMYXllciBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cdFx0b3B0aW9ucyA9IF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGRhc2hPZmZzZXQ6IDFcblx0XHRcdHN0cm9rZVdpZHRoOiAyXG5cdFx0XHRzdHJva2U6IFwiIzI4YWZmYVwiXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0XHRmaWxsOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdGxpbmVjYXA6IFwicm91bmRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdGlmIG9wdGlvbnMuZmlsbCA9PSBudWxsXG5cdFx0XHRAZmlsbCA9IG51bGxcblxuXHRcdEB3aWR0aCArPSBvcHRpb25zLnN0cm9rZVdpZHRoIC8gMlxuXHRcdEBoZWlnaHQgKz0gb3B0aW9ucy5zdHJva2VXaWR0aCAvIDJcblxuXHRcdCMgSFRNTCBmb3IgdGhlIFNWRyBET00gZWxlbWVudCwgbmVlZCB1bmlxdWUgY2xhc3MgbmFtZXNcblx0XHRkID0gbmV3IERhdGUoKVxuXHRcdHQgPSBkLmdldFRpbWUoKVxuXHRcdGNOYW1lID0gXCJjXCIgKyB0XG5cdFx0aGVhZGVyID0gXCI8c3ZnIGNsYXNzPScje2NOYW1lfScgeD0nMHB4JyB5PScwcHgnIHdpZHRoPScje0B3aWR0aH0nIGhlaWdodD0nI3tAaGVpZ2h0fScgdmlld0JveD0nLSN7QHN0cm9rZVdpZHRoLzJ9IC0je0BzdHJva2VXaWR0aC8yfSAje0B3aWR0aCArIEBzdHJva2VXaWR0aC8yfSAje0BoZWlnaHQgKyBAc3Ryb2tlV2lkdGgvMn0nPlwiXG5cdFx0cGF0aCA9IG9wdGlvbnMucGF0aFxuXHRcdGZvb3RlciA9IFwiPC9zdmc+XCJcblx0XHRAaHRtbCA9IGhlYWRlciArIHBhdGggKyBmb290ZXJcblxuXHRcdCMgd2FpdCB3aXRoIHF1ZXJ5aW5nIHBhdGhsZW5ndGggZm9yIHdoZW4gZG9tIGlzIGZpbmlzaGVkXG5cdFx0VXRpbHMuZG9tQ29tcGxldGUgPT5cblx0XHRcdGRvbVBhdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJytjTmFtZSsnIHBhdGgnKVxuXHRcdFx0QF9wYXRoTGVuZ3RoID0gZG9tUGF0aC5nZXRUb3RhbExlbmd0aCgpXG5cdFx0XHRAc3R5bGUgPSB7XCJzdHJva2UtZGFzaGFycmF5XCI6QHBhdGhMZW5ndGg7fVxuXHRcdFx0QGRhc2hPZmZzZXQgPSBvcHRpb25zLmRhc2hPZmZzZXRcblxuXHRAZGVmaW5lIFwicGF0aExlbmd0aFwiLFxuXHRcdGdldDogLT4gQF9wYXRoTGVuZ3RoXG5cdFx0c2V0OiAodmFsdWUpIC0+IHByaW50IFwiU1ZHTGF5ZXIucGF0aExlbmd0aCBpcyByZWFkb25seVwiXG5cblx0QGRlZmluZSBcImxpbmVjYXBcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2VMaW5lY2FwXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAc3R5bGUuc3Ryb2tlTGluZWNhcCA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZUxpbmVjYXBcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2VMaW5lY2FwXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAc3R5bGUuc3Ryb2tlTGluZWNhcCA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZpbGxcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5maWxsXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZSA9PSBudWxsXG5cdFx0XHRcdHZhbHVlID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRAc3R5bGUuZmlsbCA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZVwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnN0cm9rZVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc3R5bGUuc3Ryb2tlID0gdmFsdWVcblxuXHRAZGVmaW5lIFwic3Ryb2tlQ29sb3JcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5zdHJva2Vcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHN0eWxlLnN0cm9rZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcInN0cm9rZVdpZHRoXCIsXG5cdFx0Z2V0OiAtPiBOdW1iZXIoQHN0eWxlLnN0cm9rZVdpZHRoLnJlcGxhY2UoL1teXFxkLi1dL2csICcnKSlcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBzdHlsZS5zdHJva2VXaWR0aCA9IHZhbHVlXG5cblx0QGRlZmluZSBcImRhc2hPZmZzZXRcIixcblx0XHRnZXQ6IC0+IEBfZGFzaE9mZnNldFxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9kYXNoT2Zmc2V0ID0gdmFsdWVcblx0XHRcdGlmIEBwYXRoTGVuZ3RoP1xuXHRcdFx0XHRkYXNoT2Zmc2V0ID0gVXRpbHMubW9kdWxhdGUodmFsdWUsIFswLCAxXSwgW0BwYXRoTGVuZ3RoLCAwXSlcblx0XHRcdFx0QHN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBkYXNoT2Zmc2V0XG4iLCJjbGFzcyBleHBvcnRzLlBhdGggZXh0ZW5kcyBMYXllclx0XG5cblx0cGF0aCA9IFtdOyBhbmltYXRpbmcgPSBbXTsgcG9pbnQgPSBbXTsgYW5pbWF0ZSA9IFtdOyBxdWFkcmF0aWMgPSBbXTsgYmV6aWVyID0gW107IGNsb3NlID0gW11cblx0YW5pbWF0aW9ucyA9IHBvaW50cyA9IDBcblx0XG5cblx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRcblx0XHRcblx0XHRvcHRpb25zID0gXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFxuXHRcdFx0QHBvaW50VmlzaWJsZSA9IEBoYW5kbGVWaXNpYmxlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0QHBvaW50U2l6ZSA9IDRcblx0XHRcdEBoYW5kbGVTaXplID0gMlxuXHRcdFx0QHN0cm9rZVdpZHRoID0gMVxuXHRcdFx0XG5cdFx0XHRAcG9pbnRDb2xvciA9IEBoYW5kbGVDb2xvciA9IEBzdHJva2VDb2xvcj0gXCJ3aGl0ZVwiXG5cblx0XHRcdEBmaWxsXG5cdFx0XHRcblx0XHRcdEBwYXRoID0gXG5cdFx0XHRcdFxuXHRcdFx0XHRhbmltYXRpb25PcHRpb25zOiB7dGltZToxOyBjdXJ2ZTpcImJlemllci1jdXJ2ZVwifVxuXHRcdFx0XHRcblx0XHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZVxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRwb2ludDogKHApID0+XG5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRwb2ludFtwb2ludHNdID0gbmV3IExheWVyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IFwiUG9pbnQgI1wiK3BvaW50c1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IEBwb2ludENvbG9yXG5cdFx0XHRcdFx0XHRcdHN1cGVyTGF5ZXI6IEBcblx0XHRcdFx0XHRcdFx0d2lkdGg6IEBwb2ludFNpemVcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiBAcG9pbnRTaXplXG5cdFx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogQHBvaW50U2l6ZS8yXG5cdFx0XHRcdFx0XHRcdHg6IHAueCAtIEBwb2ludFNpemUvMlxuXHRcdFx0XHRcdFx0XHR5OiBwLnkgLSBAcG9pbnRTaXplLzJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0YW5pbWF0ZVtwb2ludHNdID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRcdFxuXHRcdFx0XHQgaWYgQHBvaW50VmlzaWJsZSA9PSBmYWxzZVxuXHRcdFx0XHRcdFx0cG9pbnRbcG9pbnRzXS5vcGFjaXR5ID0gMFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdCBpZiBAcGF0aC5kcmFnZ2FibGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0cG9pbnRbcG9pbnRzXS5kcmFnZ2FibGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0IGlmIHAucXVhZHJhdGljID09IFwiZmlyc3RcIiBvciBwLmJlemllciA9PSBcImZpcnN0XCIgb3IgcC5iZXppZXIgPT0gXCJzZWNvbmRcIlxuXHRcdFx0XHQgXHRcdHBvaW50W3BvaW50c10ubmFtZSA9IFwiUG9pbnQgI1wiK3BvaW50cytcIiAoaGFuZGxlKVwiXG5cdFx0XHRcdCBcdFx0cG9pbnRbcG9pbnRzXS5iYWNrZ3JvdW5kQ29sb3IgPSBAaGFuZGxlQ29sb3Jcblx0XHRcdFx0IFx0XHRwb2ludFtwb2ludHNdLndpZHRoID0gQGhhbmRsZVNpemVcblx0XHRcdFx0IFx0XHRwb2ludFtwb2ludHNdLmhlaWdodCA9IEBoYW5kbGVTaXplXG5cdFx0XHRcdCBcdFx0XG5cdFx0XHRcdCBcdFx0aWYgQGhhbmRsZVZpc2libGUgPT0gZmFsc2Vcblx0XHRcdFx0IFx0XHRcdHBvaW50W3BvaW50c10ub3BhY2l0eSA9IDBcblxuXHRcdFx0XHRcdGlmIHAuc3RhdGVzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRhbmltYXRpb25zID0gcG9pbnRzXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgQXJyYXkuaXNBcnJheShwLnN0YXRlcy54KSAmJiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLnkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGZvciBpIGluIFswLi4ucC5zdGF0ZXMueC5sZW5ndGhdXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0Y3ggPSBwLnN0YXRlcy54XG5cdFx0XHRcdFx0XHRcdFx0Y3kgPSBwLnN0YXRlcy55XG5cdFx0XHRcdFx0XHRcdFx0XG5cblx0XHRcdFx0XHRcdFx0XHRwb2ludFtwb2ludHNdLnN0YXRlcy5hZGRcblx0XHRcdFx0XHRcdFx0XHRcdFwiYXJyYXkgI3tpfVwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHg6IGN4W2ldXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0eTogY3lbaV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLngpPT1mYWxzZSAmJiBBcnJheS5pc0FycmF5KHAuc3RhdGVzLnkpPT1mYWxzZVx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdHBvaW50W3BvaW50c10uc3RhdGVzLmFkZFxuXHRcdFx0XHRcdFx0XHRcdFx0c2Vjb25kOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4OiBwLnN0YXRlcy54XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHk6IHAuc3RhdGVzLnlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVbcG9pbnRzXSA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0XHRcdFx0XHRsYXllcjogcG9pbnRbcG9pbnRzXVxuXHRcdFx0XHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBwLnN0YXRlcy54XG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBwLnN0YXRlcy55XG5cdFx0XHRcdFx0XHRcdFx0dGltZTogQC5wYXRoLmFuaW1hdGlvbk9wdGlvbnMudGltZVxuXHRcdFx0XHRcdFx0XHRcdGN1cnZlOiBALnBhdGguYW5pbWF0aW9uT3B0aW9ucy5jdXJ2ZVxuXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFxuXHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0IyBJbiBjYXNlIGlmIG5vdCBib3RoIHZhbHVlcyBhcmUgYXJyYXlzXHRcblx0XHRcdFx0XHRcdGlmIEFycmF5LmlzQXJyYXkocC5zdGF0ZXMueCkgJiYgQXJyYXkuaXNBcnJheShwLnN0YXRlcy55KT09ZmFsc2Vcblx0XHRcdFx0XHRcdFx0cHJpbnQgXCJZIHZhbHVlcyBhcmUgbm90IGFuIGFycmF5XCJcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgQXJyYXkuaXNBcnJheShwLnN0YXRlcy54KT09ZmFsc2UgJiYgQXJyYXkuaXNBcnJheShwLnN0YXRlcy55KVxuXHRcdFx0XHRcdFx0XHRwcmludCBcIlggdmFsdWVzIGFyZSBub3QgYW4gYXJyYXlcIlxuXHRcdFx0XHRcblxuXHRcdFx0XHRcdFxuXHRcdFx0XHQgXHRwb2ludFtwb2ludHNdLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID0gQHBhdGguYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0XHQgXG5cdFx0XHRcdCBcdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0aWYgcC5xdWFkcmF0aWMgPT0gdW5kZWZpbmVkICYmIHAuYmV6aWVyICE9IFwiZmlyc3RcIlxuXHRcdFx0XHRcdFx0IHF1YWRyYXRpY1twb2ludHNdID0gZmFsc2Vcblx0XHRcdFx0XHRcdCBiZXppZXJbcG9pbnRzXSA9IGZhbHNlXG5cdFx0XHRcdFx0XHQgXG5cdFx0XHRcdFx0XHQgaWYgcC5jbG9zZSA9PSB0cnVlXG5cdFx0XHRcdFx0XHQgXHRwYXRoLnB1c2goJ0wnK3AueClcblx0XHRcdFx0XHRcdCBcdGNsb3NlW3BvaW50c10gPSB0cnVlXG5cdFx0XHRcdFx0XHQgZWxzZVxuXHRcdFx0XHRcdFx0IFx0cGF0aC5wdXNoKHAueClcdFxuXHRcdFx0XHRcdFx0IFxuXHRcdFx0XHQgXG5cdFx0XHRcdCBcdGlmIHAucXVhZHJhdGljID09IFwiZmlyc3RcIlx0XG5cdFx0XHRcdCBcdFx0YmV6aWVyW3BvaW50c10gPSBmYWxzZVxuXHRcdFx0XHQgXHRcdFxuXHRcdFx0XHQgXHRcdHF1YWRyYXRpY1twb2ludHNdID0gdHJ1ZVxuXHRcdFx0XHQgXHRcdHBhdGgucHVzaCgnUScrcC54KVxuXHRcdFx0XHQgXHRcdFxuXHRcdFx0XHQgXHRpZiBwLmJlemllciA9PSBcImZpcnN0XCJcblx0XHRcdFx0IFx0XHRxdWFkcmF0aWNbcG9pbnRzXSA9IGZhbHNlXG5cdFx0XHRcdCBcdFx0XG5cdFx0XHRcdCBcdFx0YmV6aWVyW3BvaW50c10gPSB0cnVlXG5cdFx0XHRcdCBcdFx0cGF0aC5wdXNoKCdDJytwLngpXG5cdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHBhdGgucHVzaChwLnkpXG5cdFx0XHRcdFx0XG4jIFx0XHRcdFx0XHRwcmludCBwb2ludHMrXCI6IFwiK3F1YWRyYXRpY1twb2ludHNdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0QGh0bWwgPSBzdmdTdGFydCArIHBhdGhCZWdpbiArIHBhdGggKyBwYXRoRW5kICsgc3ZnRW5kXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0cG9pbnRzKytcblx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGFuaW1hdGU6ICh0KSA9PlxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFx0Zm9yIGkgaW5bMC4uLnBvaW50Lmxlbmd0aF1cblx0XHRcdFx0XHRcdGlmIHQgPT0gdW5kZWZpbmVkIHx8IHQgPT0gXCJzdGF0ZXNcIlxuXHRcdFx0XHRcdFx0XHRwb2ludFtpXS5zdGF0ZXMubmV4dCgpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVbaV0uc3RhcnQoKVxuIFx0XHRcdFx0XHRcbiBcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGV4ZWN1dGUgPSA9PlxuXHRcdFx0XHRcdFx0XG4gXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Zm9yIGkgaW4gWzAuLi5wb2ludC5sZW5ndGhdXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRjID0gaStpXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XG5cblx0XHRcdFx0XHRcdFx0XHRhbmltYXRpbmdbY10gPSBwb2ludFtpXS54ICsgQHBvaW50U2l6ZS8yXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0aWYgcXVhZHJhdGljW2ldID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGFuaW1hdGluZ1tjXSA9IFwiUVwiICsgYW5pbWF0aW5nW2NdXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRpZiBiZXppZXJbaV0gPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW5nW2NdID0gXCJDXCIgKyBhbmltYXRpbmdbY11cblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGlmIGNsb3NlW2ldID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGFuaW1hdGluZ1tjXSA9IFwiTFwiICsgYW5pbWF0aW5nW2NdXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0aW5nW2MrMV0gPSBwb2ludFtpXS55ICsgQHBvaW50U2l6ZS8yXG5cdFx0XHRcdFx0XHRcdFx0XG5cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdEBodG1sID0gc3ZnU3RhcnQgKyBwYXRoQmVnaW4gKyBhbmltYXRpbmcgKyBwYXRoRW5kICsgc3ZnRW5kXHRcdFx0XG4jIFx0XHRcdFx0XHRcdFx0cHJpbnQgQGh0bWxcblx0XHRcblx0XHRcdFx0XHRmb3IgaSBpblswLi4ucG9pbnQubGVuZ3RoXVxuXHRcdFx0XHRcdFx0XHRwb2ludFtpXS5vbiAnY2hhbmdlOnBvaW50JywgPT4gXG5cdFx0XHRcdFx0XHRcdFx0ZXhlY3V0ZSgpXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cblx0XHRcdFxuXHRcdFx0XHRxdWFkcmF0aWM6IChwKSA9PlxuXHRcdFx0XHRcblx0XHRcdFx0XHRpZiBwLnN0YXRlcyAhPSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdGhhbmRsZSA9XG5cdFx0XHRcdFx0XHRcdHg6IHAueFxuXHRcdFx0XHRcdFx0XHR5OiBwLnlcblx0XHRcdFx0XHRcdFx0c3RhdGVzOiBcblx0XHRcdFx0XHRcdFx0XHR4OiBwLnN0YXRlcy54XG5cdFx0XHRcdFx0XHRcdFx0eTogcC5zdGF0ZXMueVxuXHRcdFx0XHRcdFx0XHRxdWFkcmF0aWM6IFwiZmlyc3RcIlxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRxdWFkcmF0aWNQb2ludCA9XG5cdFx0XHRcdFx0XHRcdHg6IHAucXhcblx0XHRcdFx0XHRcdFx0eTogcC5xeVxuXHRcdFx0XHRcdFx0XHRzdGF0ZXM6IFxuXHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLnF4XG5cdFx0XHRcdFx0XHRcdFx0eTogcC5zdGF0ZXMucXlcblx0XHRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRoYW5kbGUgPVxuXHRcdFx0XHRcdFx0XHR4OiBwLnhcblx0XHRcdFx0XHRcdFx0eTogcC55XG5cdFx0XHRcdFx0XHRcdHF1YWRyYXRpYzogXCJmaXJzdFwiXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cXVhZHJhdGljUG9pbnQgPVxuXHRcdFx0XHRcdFx0XHR4OiBwLnF4XG5cdFx0XHRcdFx0XHRcdHk6IHAucXlcblx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRAcGF0aC5wb2ludChoYW5kbGUpXG5cdFx0XHRcdFx0QHBhdGgucG9pbnQocXVhZHJhdGljUG9pbnQpXG5cdFx0XHRcdFx0XG5cdFx0XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0Y3ViaWM6IChwKSA9PlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIHAuc3RhdGVzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aGFuZGxlT25lID0gXG5cdFx0XHRcdFx0XHRcdHg6IHAuY3gxXG5cdFx0XHRcdFx0XHRcdHk6IHAuY3kxXG5cdFx0XHRcdFx0XHRcdHN0YXRlczpcblx0XHRcdFx0XHRcdFx0XHR4OiBwLnN0YXRlcy5jeDFcblx0XHRcdFx0XHRcdFx0XHR5OiBwLnN0YXRlcy5jeTFcblx0XHRcdFx0XHRcdFx0YmV6aWVyOiBcImZpcnN0XCJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRoYW5kbGVUd28gPSBcblx0XHRcdFx0XHRcdFx0eDogcC5jeDJcblx0XHRcdFx0XHRcdFx0eTogcC5jeTJcblx0XHRcdFx0XHRcdFx0c3RhdGVzOlxuXHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLmN4MlxuXHRcdFx0XHRcdFx0XHRcdHk6IHAuc3RhdGVzLmN5MlxuXHRcdFx0XHRcdFx0XHRiZXppZXI6IFwic2Vjb25kXCJcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRiZXppZXJQb2ludCA9XG5cdFx0XHRcdFx0XHRcdHg6IHAueFxuXHRcdFx0XHRcdFx0XHR5OiBwLnlcblx0XHRcdFx0XHRcdFx0c3RhdGVzOlxuXHRcdFx0XHRcdFx0XHRcdHg6IHAuc3RhdGVzLnhcblx0XHRcdFx0XHRcdFx0XHR5OiBwLnN0YXRlcy55XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aGFuZGxlT25lID0gXG5cdFx0XHRcdFx0XHRcdHg6IHAuY3gxXG5cdFx0XHRcdFx0XHRcdHk6IHAuY3kxXG5cdFx0XHRcdFx0XHRcdGJlemllcjogXCJmaXJzdFwiXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRoYW5kbGVUd28gPSBcblx0XHRcdFx0XHRcdFx0eDogcC5jeDJcblx0XHRcdFx0XHRcdFx0eTogcC5jeTJcblx0XHRcdFx0XHRcdFx0YmV6aWVyOiBcInNlY29uZFwiXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0YmV6aWVyUG9pbnQgPVxuXHRcdFx0XHRcdFx0XHR4OiBwLnhcblx0XHRcdFx0XHRcdFx0eTogcC55XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0QHBhdGgucG9pbnQoaGFuZGxlT25lKVxuXHRcdFx0XHRcdEBwYXRoLnBvaW50KGhhbmRsZVR3bylcdFxuXHRcdFx0XHRcdEBwYXRoLnBvaW50KGJlemllclBvaW50KVx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGNsb3NlOiAocCkgPT5cblx0XHRcdFx0XHRwLmNsb3NlID0gdHJ1ZVxuXHRcdFx0XHRcdEBwYXRoLnBvaW50KHApXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRcblx0XHRzdmdTdGFydCA9ICc8c3ZnIGhlaWdodD1cIicrQGhlaWdodCsnXCIgd2lkdGg9XCInK0B3aWR0aCsnXCIgc3Ryb2tlPScrQHN0cm9rZUNvbG9yKycgc3Ryb2tlLXdpZHRoPVwiJytAc3Ryb2tlV2lkdGgrJ1wiIGZpbGw9XCInK0BmaWxsKydcIj4nXG5cdFx0cGF0aEJlZ2luID0gJzxwYXRoIGQ9XCJNJ1xuXHRcdHBhdGhFbmQgPSAnXCI+J1xuXHRcdHN2Z0VuZCA9ICc8L3N2Zz4nXHRcblx0XG5cdFx0XG5cdFx0XG5cdFx0XG5cdEBkZWZpbmUgXCJwYXRoLmFuaW1hdGlvbk9wdGlvbnNcIixcblx0XHRnZXQ6IC0+IEBfcGF0aC5hbmltYXRpb25PcHRpb25zXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9wYXRoLmFuaW1hdGlvbk9wdGlvbnMgPSB2YWx1ZVxuXHRcdFxuXHRAZGVmaW5lIFwicGF0aC5kcmFnZ2FibGVcIixcblx0XHRnZXQ6IC0+IEBfcGF0aC5kcmFnZ2FibGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3BhdGguZHJhZ2dhYmxlID0gdmFsdWVcblx0XHRcblx0QGRlZmluZSBcInBvaW50VmlzaWJsZVwiLFxuXHRcdGdldDogLT4gQF9wb2ludFZpc2libGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3BvaW50VmlzaWJsZSA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcImhhbmRsZVZpc2libGVcIixcblx0XHRnZXQ6IC0+IEBfaGFuZGxlVmlzaWJsZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfaGFuZGxlVmlzaWJsZSA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcInBvaW50U2l6ZVwiLFxuXHRcdGdldDogLT4gQF9wb2ludFNpemVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX3BvaW50U2l6ZSA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcImhhbmRsZVNpemVcIixcblx0XHRnZXQ6IC0+IEBfaGFuZGxlU2l6ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfaGFuZGxlU2l6ZSA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcInBvaW50Q29sb3JcIixcblx0XHRnZXQ6IC0+IEBfcG9pbnRDb2xvclxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBfcG9pbnRDb2xvciA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcImhhbmRsZUNvbG9yXCIsXG5cdFx0Z2V0OiAtPiBAX2hhbmRsZUNvbG9yXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9oYW5kbGVDb2xvciA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcInN0cm9rZUNvbG9yXCIsXG5cdFx0Z2V0OiAtPiBAX3N0cm9rZUNvbG9yXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9zdHJva2VDb2xvciA9IHZhbHVlXG5cdFx0XHRcblx0QGRlZmluZSBcInN0cm9rZVdpZHRoXCIsXG5cdFx0Z2V0OiAtPiBAX3N0cm9rZVdpZHRoXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QF9zdHJva2VXaWR0aCA9IHZhbHVlXG5cdFx0XG5cdEBkZWZpbmUgXCJmaWxsXCIsXG5cdFx0Z2V0OiAtPiBAX2ZpbGxcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAX2ZpbGwgPSB2YWx1ZSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBR0FBO0FEQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDO0FBRWIsTUFBQTs7OztFQUFBLElBQUEsR0FBTzs7RUFBSSxTQUFBLEdBQVk7O0VBQUksS0FBQSxHQUFROztFQUFJLE9B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
