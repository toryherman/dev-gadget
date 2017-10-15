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
    document.body.style.transform = "translateY(100px)";
    document.body.innerHTML += "<div id='gadget-box'; style='height:100px; background-color: yellow; width:100%; position: absolute; top:0; left:0;z-index:9999;transform:translateY(-100px);'></div>";

    // define hover class
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'dg-style-tag'

    if (style.styleSheet) {
      style.styleSheet.cssText = ".dg-hover { background-color: #a3e1ff !important; }";
    } else {
      style.appendChild(document.createTextNode(".dg-hover { background-color: #a3e1ff !important; }"));
    }
    document.getElementsByTagName("head")[0].appendChild(style);

    // add mouseover and mouseout listeners to all child nodes
    var nodes = document.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("mouseover", this.dgMouseover);
      nodes[i].addEventListener("mouseout", this.dgMouseout);
    };
  },

  removeBox: function() {
    document.body.style -= "translateY(100px)";
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
  },

  dgMouseout: function(e) {
    e.stopPropagation();
    this.classList.remove('dg-hover');
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
