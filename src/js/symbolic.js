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
                    "<div class='sp-preview'><span class='sp-preview-inner'></span></div>",
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
            palette: [
                ["\uD83D\uDE02", "\uD83D\uDE05", "\uD83D\uDE04", "\uD83D\uDE06", "\uD83D\uDE00"],
                ["\uD83D\uDE39", "\uD83D\uDE38", "\uD83D\uDE3C", "\uD83D\uDE0F"]
            ]
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
        this._current = this.settings.palette[0][0];
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
            this._preview.bind("click." + this._name + " touchstart." + this._name, $.proxy(this._previewClick, this));
            this._boundElement.append(this._preview);
            this._populateContainer(this._container);
            this._appendTo.append(this._container);
            this._container.offset(this._getOffset(this._container, this._preview));
            this._container.delegate(".sp-thumb-el", "click." + this._name + " touchstart." + this._name, $.proxy(this._paletteCellClick, this));
            this._container.click(this._stopPropagation);
            this.set(this._current);
            console.log("Finished init");
        },
        get: function () {
            console.log("get()");
            return this._current;
        },
        set: function (value) {
            console.log("set()");
            this._current = value;
            this._preview.find(".sp-preview-inner").text(value);
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
            $(this._doc).bind("click." + this._name + " touchstart." + this._name, $.proxy(this._clickout, this));
            this._preview.addClass("sp-active");
            this._container.removeClass("sp-hidden");
        },
        hide: function () {
            console.log("hide()");
            this._containerVisible = false;
            this._container.addClass("sp-hidden");
            this._preview.removeClass("sp-active");
            $(this._doc).unbind("click." + this._name + " touchstart." + this._name, $.proxy(this._clickout, this));
        },
        _stopPropagation: function (e) {
            e.stopPropagation();
        },
        _getOffset: function (container, boundElement) {
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
        },
        _populateContainer: function (container) {
            var html = [];
            var paletteArray = this.settings.palette;
            for (var i = 0; i < paletteArray.length; i++) {
                html.push(this._populateRow(paletteArray[i]));
            }
            container.find(".sp-palette").append(html.join(""));
        },
        _populateRow: function (row) {
            var html = [];
            for (var i = 0; i < row.length; i++) {
                html.push("<span class='sp-thumb-el'>" + row[i] + "</span>");
            }
            return "<div class='sp-cf'>" + html.join("") + "</div>";
        },
        _clickout: function (e) {
            console.log("clickout()");
            // Return on right click.
            if (e.button === 2) {
                return;
            }
            this.hide();
        },
        _paletteCellClick: function (e) {
            console.log("paletteCellClick");
            this.set($(e.target).closest(".sp-thumb-el").text());
            this.hide();
            e.stopPropagation();
        },
        _previewClick: function (e) {
            console.log("previewClick()");
            this.toggle();
            e.stopPropagation();
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function (options) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === "object") {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, "plugin_" + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });

            // If the first parameter is a string and it doesn't start
            // with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, "plugin_" + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === "function") {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === "destroy") {
                    $.data(this, "plugin_" + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);
