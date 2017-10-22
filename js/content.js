"use strict";

window.__DevGadget = {
  active: false,

  enable: function() {
    this.buildBox();
    console.log("enabled!");
    this.active = true;
  },

  disable: function() {
    this.removeBox();
    console.log("disabled!");
    this.active = false;
  },

  /**
   * buildBox() defines css styles
   * builds div at top of page to display styles of hovered elements
   * adds listeners to all child nodes
   */
  buildBox: function() {
    // inject css styles
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'dg-style-tag'

    var classesText = ".dg-hover { "
    +   "background-color: #a3e1ff !important; "
    +   "cursor: crosshair !important; "
    + "} "
    + "div#dg-box { "
    +   "box-sizing: border-box !important; "
    +   "height: 128px !important; "
    +   "background-color: #000 !important; "
    +   "width: 100% !important; "
    +   "padding: 12px 20px !important; "
    +   "position: fixed !important; "
    +   "top: 0 !important; "
    +   "left: 0 !important; "
    +   "z-index: 9999999 !important; "
    +   "line-height: 20px !important; "
    +   "cursor: default !important; "
    + "} "
    + "div#dg-box > code { "
    +   "font-family: 'Source Code Pro', monospace !important; "
    +   "font-size: 12px !important; "
    +   "font-weight: 500 !important; "
    +   "white-space: nowrap !important; "
    +   "background-color: transparent !important; "
    +   "margin: 0 !important; "
    +   "line-height: 20px !important; "
    + "} "
    + "div#dg-box > code, div#dg-box > code > span { "
    +   "-webkit-font-smoothing: subpixel-antialiased !important; "
    + "} "
    + "code#dg-code { "
    +   "color: #b7f279 !important; "
    +   "padding: 0 0 0 15px !important; "
    +   "display: block !important; "
    + "} "
    + "code#dg-copied { "
    +   "position: absolute !important; "
    +   "top: 12px !important; "
    +   "right: 25px !important; "
    +   "padding: 0 !important; "
    +   "color: #ff6254 !important; "
    + "} "
    + "span.dg-tag { "
    +   "color: #e468f9 !important; "
    + "} "
    + "span.dg-brace { "
    +   "margin-left: -15px !important; "
    + "} "
    + "@font-face { "
    +   "font-family: 'Source Code Pro'; "
    +   "font-style: normal; "
    +   "src: url('https://fonts.googleapis.com/css?family=Source+Code+Pro:500'); "
    + "}";

    if (style.styleSheet) {
      style.styleSheet.cssText = classesText;
    } else {
      style.appendChild(document.createTextNode(classesText));
    }
    document.getElementsByTagName("head")[0].appendChild(style);

    // move body down and insert gadget box
    var gadgetBox = document.createElement('div');
    gadgetBox.id = 'dg-box';
    document.body.style.setProperty("transform", "translateY(128px)", "important");
    document.documentElement.appendChild(gadgetBox);

    // add mouseover, mouseout, and click listeners to all child nodes
    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id !== "dg-box") {
        nodes[i].addEventListener("mouseover", this.dgMouseover);
        nodes[i].addEventListener("mouseout", this.dgMouseout);
        nodes[i].addEventListener("click", this.dgClick);
      }
    };
  },

  // removeBox() undoes buildBox() on disable
  removeBox: function() {
    document.body.style -= "margin-top = 100px;";
    var gadgetBox = document.getElementById("dg-box");
    gadgetBox.parentNode.removeChild(gadgetBox);

    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].removeEventListener("mouseover", this.dgMouseover);
      nodes[i].removeEventListener("mouseout", this.dgMouseout);
      nodes[i].removeEventListener("click", this.dgClick);
    };

    document.getElementById('dg-style-tag').remove();
  },

  /**
   * dgMouseover() listener function
   * adds dg-hover class to element on mouseover
   * appends text of relevant css styles to dg-box div
   * @param {Event} e
   */
  dgMouseover: function(e) {
    e.stopPropagation();
    this.classList.add('dg-hover');

    // show hovered item in gadget box
    var box = document.getElementById('dg-box'),
        css = window.getComputedStyle(this),
        fontFamily = css.getPropertyValue('font-family'),
        fontSize = css.getPropertyValue('font-size'),
        color = css.getPropertyValue('color'),
        tag = this.tagName.toLowerCase();

    box.innerHTML = "<code id='dg-code'>"
    + "<span class='dg-tag dg-brace'>" + tag + "</span> &#123; <br>"
    + "font-family: " + fontFamily + "; <br>"
    + "font-size: " + fontSize + "; <br>"
    + "color: " + color + "; <br>"
    + "<span class='dg-brace'>&#125;</span>"
    + "</code>";
  },

  /**
   * dgMouseout() listener function
   * removes dg-hover class on mouseout
   * @param {Event} e
   */
  dgMouseout: function(e) {
    e.stopPropagation();
    this.classList.remove('dg-hover');
    var box = document.getElementById('dg-box');
    box.innerHTML = "";
  },

  /**
   * dgClick() listener function
   * copies displayed element styles to user clipboard
   * appends 'copied to clipboard' to dg-box div
   * @param {Event} e
   */
  dgClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var range = document.createRange(),
        textField = document.createElement('textarea'),
        codeText = document.getElementById('dg-code').innerText;

    textField.innerText = codeText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    var copied = document.createElement('code');
    copied.id = 'dg-copied';
    copied.innerText = 'copied to clipboard!';
    document.getElementById('dg-box').appendChild(copied);
  }
};

(function(dg) {
  // remove listener if script has been executed previously
  if (window.msgListener) {
    chrome.runtime.onMessage.removeListener(window.msgListener);
  }

  window.msgListener = function(message, sender, sendResponse) {
    switch (message.type) {
      case "enable":
        dg.enable();
        break;

      case "disable":
        dg.disable();
        break;
    }
    sendResponse({
      success: true
    });
  };

  chrome.runtime.onMessage.addListener(window.msgListener);
})(__DevGadget);
