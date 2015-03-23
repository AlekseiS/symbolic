// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var pluginName = "symbolic",
        defaults = {
            previewTemplate: [
                "<div class='sp-replacer'>",
                    "<div class='sp-preview'><span class='sp-preview-inner'>A</span></div>",
                    "<div class='sp-dd'>&#9660;</div>",
                "</div>"
            ].join(""),
            containerTemplate: [
                "<div class='sp-container sp-hidden'>",
                    "<div class='sp-palette-container'>",
                        "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "</div>",
                "</div>"
            ].join(""),
            disabled: false
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._name = pluginName;
        this._doc = element.ownerDocument;
        this._boundElement = $(element);
        this._containerVisible = false;
        this._preview = $(this.settings.previewTemplate);
        this._container = $(this.settings.containerTemplate, this._doc);
        this._appendTo = $("body");
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
            console.log("Started init");
            this._preview.bind("click." + this._name + " touchstart." + this._name, $.proxy(function (e) {
                console.log("clicked");
                this.toggle();
                e.stopPropagation();
            }, this));
            this._boundElement.append(this._preview);
            this._appendTo.append(this._container);
            // TODO: recalculate offset on resize
            this._container.offset(this.getOffset(this._container, this._preview));
            // prevent clicks from bubbling up to document. This would cause it to be hidden.
            this._container.click(this.stopPropagation);
            console.log("Finished init");
        },
        toggle: function () {
            console.log("toggle()");
            if (this._containerVisible) {
                this.hide();
            } else {
                this.show();
            }
        },
        show: function () {
            console.log("show()");
            this._containerVisible = true;
            this._preview.addClass("sp-active");
            this._container.removeClass("sp-hidden");
        },
        hide: function () {
            console.log("hide()");
            this._containerVisible = false;
            this._container.addClass("sp-hidden");
            this._preview.removeClass("sp-active");
        },
        stopPropagation: function (e) {
            e.stopPropagation();
        },
        getOffset: function (container, boundElement) {
            var extraY = 0;
            var dpWidth = container.outerWidth();
            var dpHeight = container.outerHeight();
            var inputHeight = boundElement.outerHeight();
            var doc = container[0].ownerDocument;
            var docElem = doc.documentElement;
            var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
            var viewHeight = docElem.clientHeight + $(doc).scrollTop();
            var offset = boundElement.offset();
            offset.top += inputHeight;
            offset.left -=
                Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
                    Math.abs(offset.left + dpWidth - viewWidth) : 0);
            offset.top -=
                Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                    Math.abs(dpHeight + inputHeight - extraY) : extraY));
            return offset;
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
