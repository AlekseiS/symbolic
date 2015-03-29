# Symbolic

## A symbol picker jQuery plugin

Inspired by [Spectrum](https://github.com/bgrins/spectrum) colorpicker, Symbolic is a jQuery plugin that provides a way to select a character from a set of characters presented on a palette.

[Symbolic](https://github.com/AlekseiS/symbolic) gives a nice way to create a palette of smileys, emojis, special symbols or just plain characters and ask the user to pick one of them. See [demo/index.html](https://github/AlekseiS/symbolic/demo/index.html) for a smileys example.

The plugin supports "show", "hide", "toggle", "get", "set" methods. Initial markup is customizable via plugin settings. Appearance is customizeable via CSS.


## Usage

1. Include jQuery and Symbolic's code along with styles:

    ```html
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script src="dist/js/symbolic.min.js"></script>
    <link href="dist/css/symbolic.min.css" rel="stylesheet">
    ```

2. Add a div container where Symbolic will be attached:

    ```html
    <div id="element"></div>
    ```

3. Attach Symbolic to the container and provide a symbol palette you want:

    ```javascript
    $("#element").symbolic({
        palette: [
            ["😂", "😅", "😄"],
            ["😏", "😆", "😀"]
        ]
    });
    ```
4. You can add a handler for "selected.symbolic" event which will fire when a user picks an element:

    ```javascript
    $("#element").on("selected.symbolic", function(e, value){
        console.log("User selected:", value);
    });
    ```


## Demo
See [demo/index.html](https://github/AlekseiS/symbolic/demo/index.html) for a complete example demonstrating initial setup, handling "selected.symbolic" event and using "set" method.


## License
MIT license. See [LICENSE](https://github/AlekseiS/symbolic/LICENSE) file for more information.
