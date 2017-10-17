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

  buildBox: function() {
    // move body down and insert gadget box
    document.body.style.marginTop = "100px";
    document.body.innerHTML += "<div id='gadget-box'></div>";

    // define hover class
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'dg-style-tag'

    var classesText = ".dg-hover { background-color: #a3e1ff !important; } "
    + "#gadget-box { "
    +   "height: 100px; "
    +   "background-color: #000; "
    +   "width: 100%; "
    +   "padding: 12px 20px; "
    +   "position: fixed; "
    +   "top: 0; "
    +   "left: 0; "
    +   "z-index: 9999; "
    + "} "
    + ".dg-code { "
    +   "font-family: Monaco, Consolas, 'Andale Mono', 'DejaVu Sans Mono', monospace; "
    +   "font-size: 95%; "
    +   "color: #b7f279; "
    +   "line-height: 140%; "
    + "}";

    if (style.styleSheet) {
      style.styleSheet.cssText = classesText;
    } else {
      style.appendChild(document.createTextNode(classesText));
    }
    document.getElementsByTagName("head")[0].appendChild(style);

    // add mouseover and mouseout listeners to all child nodes
    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id !== "gadget-box") {
        nodes[i].addEventListener("mouseover", this.dgMouseover);
        nodes[i].addEventListener("mouseout", this.dgMouseout);
      }
    };
  },

  removeBox: function() {
    document.body.style -= "margin-top = 100px;";
    var gadgetBox = document.getElementById("gadget-box");
    gadgetBox.parentNode.removeChild(gadgetBox);

    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].removeEventListener("mouseover", this.dgMouseover);
      nodes[i].removeEventListener("mouseout", this.dgMouseout);
    };

    document.getElementById('dg-style-tag').remove();
  },

  dgMouseover: function(e) {
    e.stopPropagation();
    this.classList.add('dg-hover');

    // show hovered item in gadget box
    var box = document.getElementById('gadget-box'),
        css = window.getComputedStyle(this),
        fontFamily = css.getPropertyValue('font-family'),
        fontSize = css.getPropertyValue('font-size'),
        color = css.getPropertyValue('color');

    box.innerHTML = "<code class='dg-code'>"
    + "font-family: " + fontFamily + ";<br>"
    + "font-size: " + fontSize + ";<br>"
    + "color: " + color + ";"
    + "</code>";
  },

  dgMouseout: function(e) {
    e.stopPropagation();
    this.classList.remove('dg-hover');
    var box = document.getElementById('gadget-box');
    box.innerHTML = "";
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
