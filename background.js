/**
 * Created by StevenChapman on 19/05/15.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html',
    {
        state: "fullscreen"
      /*frame: "none",
      innerBounds: {
        width: 1980,
        height: 1080
        }
*/
    });

  /**
   * Turn on the on screen keyboard
   *
   *
   */
  var virtualKeyboard = chrome.accessibilityFeatures['virtualKeyboard'];
  virtualKeyboard.get({}, function(details) {
    if (details.levelOfControl === 'controllable_by_this_extension' &&
      details.value === false) {
      // Enables the virtual keyboard
      virtualKeyboard.set({value: true});
    }
  });
});

chrome.commands.onCommand.addListener(function(command) {
    console.log(command)
    if (command == "Ctrl+M") {

        var value = chrome.accessibilityFeatures.virtualKeyboard.get({'incognito': false}, function (callback) {
            console.log(callback);
        });
    }
});