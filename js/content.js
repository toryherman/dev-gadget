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
    document.body.style.transform = "translateY(100px)";
    document.body.innerHTML += "<div id='gadget-box'; style='height:100px; background-color: yellow; width:100%; position: absolute; top:0; left:0;z-index:9999;transform:translateY(-100px);'></div>";
  },

  removeBox: function() {
    document.body.style = "";
    var gadgetBox = document.getElementById("gadget-box");
    gadgetBox.parentNode.removeChild(gadgetBox);
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
