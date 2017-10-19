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
    + "div#gadget-box { "
    +   "box-sizing: border-box !important; "
    +   "height: 130px !important; "
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
    + "code#dg-code { "
    +   "font-family: Monaco, Consolas, 'Andale Mono', 'DejaVu Sans Mono', monospace !important; "
    +   "font-size: 12px !important; "
    +   "white-space: pre-line; "
    +   "color: #b7f279 !important; "
    +   "background-color: transparent !important; "
    + "} "
    + "span.dg-tag { "
    +   "color: #e468f9 !important; "
    + "} "
    + "span.dg-prop{ "
    +   "padding-left: 15px !important; "
    + "} "
    + "code#dg-copied { "
    +   "position: absolute !important; "
    +   "top: 12px !important; "
    +   "right: 25px !important; "
    +   "font-size: 12px !important; "
    +   "color: #ff6254 !important; "
    +   "background-color: transparent !important; "
    + "}";

    if (style.styleSheet) {
      style.styleSheet.cssText = classesText;
    } else {
      style.appendChild(document.createTextNode(classesText));
    }
    document.getElementsByTagName("head")[0].appendChild(style);

    // move body down and insert gadget box
    var gadgetBox = document.createElement('div');
    gadgetBox.id = 'gadget-box';
    document.body.style.setProperty("transform", "translateY(130px)", "important");
    document.documentElement.appendChild(gadgetBox);

    // add mouseover, mouseout, and click listeners to all child nodes
    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id !== "gadget-box") {
        nodes[i].addEventListener("mouseover", this.dgMouseover);
        nodes[i].addEventListener("mouseout", this.dgMouseout);
        nodes[i].addEventListener("click", this.dgClick);
      }
    };
  },

  // removeBox() undoes buildBox() on disable
  removeBox: function() {
    document.body.style -= "margin-top = 100px;";
    var gadgetBox = document.getElementById("gadget-box");
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
   * appends text of relevant css styles to gadget-box div
   * @param {Event} e
   */
  dgMouseover: function(e) {
    e.stopPropagation();
    this.classList.add('dg-hover');

    // show hovered item in gadget box
    var box = document.getElementById('gadget-box'),
        css = window.getComputedStyle(this),
        fontFamily = css.getPropertyValue('font-family'),
        fontSize = css.getPropertyValue('font-size'),
        color = css.getPropertyValue('color'),
        tag = this.tagName.toLowerCase();

    box.innerHTML = "<code id='dg-code'>"
    + "<span class='dg-tag'>" + tag + "</span> &#123; <br>"
    + "<span class='dg-prop'>font-family: " + fontFamily + ";</span> <br>"
    + "<span class='dg-prop'>font-size: " + fontSize + ";</span> <br>"
    + "<span class='dg-prop'>color: " + color + ";</span> <br>"
    + "&#125;"
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
    var box = document.getElementById('gadget-box');
    box.innerHTML = "";
  },

  /**
   * dgClick() listener function
   * copies displayed element styles to user clipboard
   * appends 'copied to clipboard' to gadget-box div
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
    document.getElementById('gadget-box').appendChild(copied);
  }
};

(function(dg) {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
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
  });
})(__DevGadget);
