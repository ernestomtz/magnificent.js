(function (root, factory) {
  var name = 'mag$';
  if (typeof define === 'function' && define.amd) {
    define(['mag',' jquery'], function (mag, $) {
        return (root[name] = factory(mag, $));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./mag'), require('jquery'));
  } else {
    root[name] = factory(mag, $);
  }
}(this, function (mag, $) {

  var normalizeOffsets = function (e) {
    var offset = $(e.target).offset();
    return {
      x: e.pageX - offset.left,
      y: e.pageY - offset.top
    };
    return e;
  };

  var ratioOffsets = function (e) {
    var normOff = normalizeOffsets(e);
    var $target = $(e.target);
    return {
      x: normOff.x / $target.width(),
      y: normOff.y / $target.height()
    }
  };

  var ratioOffsetsFor = function ($target, x, y) {
    return {
      x: x / $target.width(),
      y: y / $target.height()
    }
  };

  var cssPerc = function (frac) {
    return (frac * 100) + '%';
  };

  var toCSS = function (pt) {
    var css = {};
    if (pt.x !== undefined) css.left = cssPerc(pt.x);
    if (pt.y !== undefined) css.top = cssPerc(pt.y);
    if (pt.w !== undefined) css.width = cssPerc(pt.w);
    if (pt.h !== undefined) css.height = cssPerc(pt.h);
    return css;
  };

  var mag$ = function (options) {

    return this.each(function() {

      var $el = $(this);

      options = $.extend({}, options);

      var model = {
        mode: 'overflow',
        // mode: 'lag',
        lens: {
          w: 1,
          h: 1
        },
        focus: {
          x: 0.5,
          y: 0.5
        }
      };

      var render = function () {
        var lens, full;
        lens = model.lens;
        full = model.full;
        var css = toCSS(lens);
        $lens.css(css);
        var fullCSS = toCSS(full);
        $full.css(fullCSS);
      };


      $el.addClass('mag-host');

      var $lens = $('<div class="mag-lens"></div>');
      $lens.appendTo($el);

      var $noflow = $('<div class="mag-noflow"></div>');
      $noflow.appendTo($el);

      var $zone = $('<div class="mag-zone"></div>');
      $zone.appendTo($noflow);

      var $full = $('<div class="mag-full"></div>');
      $full.html(options.content);
      $full.appendTo($noflow);


      mag.compute(model);

      if (options.move === 'drag') {
        $zone.drag(function( e, dd ){
          console.log('drag', dd);
          console.log('e', e);

          var offset = $zone.offset();
          var focus = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
          console.log('focus', focus);

          model.focus = focus;

          mag.compute(model);
          render();
        });
      }
      // else if (options.move === 'follow') {

      //   var vx = 0;
      //   var vy = 0;

      //   $zone.drag(function( e, dd ){
      //     console.log('drag', dd);
      //     console.log('e', e);

      //     var offset = $zone.offset();
      //     var focus = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
      //     console.log('focus', focus);

      //     vx += 0.01 * (focus.x - 0.5);
      //     vy += 0.01 * (focus.y - 0.5);

      //     mag.compute(model);
      //     render();
      //   });

      //   var interval;
      //   $zone.drag('start', function( e, dd ){
      //     console.log('dragstart', dd);
      //     console.log('e', e);

      //     var offset = $zone.offset();
      //     var focus = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
      //     console.log('focus', focus);

      //     vx += 0.01 * (focus.x - 0.5);
      //     vy += 0.01 * (focus.y - 0.5);

      //     interval = setInterval(function () {
      //       console.log('interval');

      //       console.log('vx,vy', [vx, vy]);

      //       model.focus.x += vx;
      //       model.focus.y += vy;
      //       model.focus.x = mag.minMax(model.focus.x, 0, 1);
      //       model.focus.y = mag.minMax(model.focus.y, 0, 1);

      //       mag.compute(model);
      //       render();
      //     }, 100);
      //   });

      //   $zone.drag('end', function( e, dd ){
      //     console.log('dragend', dd);
      //     console.log('e', e);

      //     clearInterval(interval);
      //   });
      // }

      // $zone.on('mousemove', function (e) {
      //   model.focus = ratioOffsets(e);
      //   mag.compute(model);
      //   render();
      // });

      $zone.on('mousewheel', function (e) {
        e.preventDefault();

        var delta = e.deltaY * -0.1;

        // var lens = mag.constrainWH({
        //   w: model.lens.w + delta,
        //   h: model.lens.h + delta
        // });
        // model.lens.w = lens.w;
        // model.lens.h = lens.h;
        model.lens.w += delta;
        model.lens.h += delta;

        mag.compute(model);
        render();
      });

    });
  };

  $.fn.mag = mag$;

  return mag$;
}));