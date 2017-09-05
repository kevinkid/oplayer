/** @desc - syncs background tasks of the applicatioan . */

// @docs -  https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

var worker = {

    onWebRequest: function (ev) {
      if (ev.permission === "download") {
          console.info("web permission request .");
          this.requestDownload(ev);
      }  
    },

    requestDownload: function (ev) {
          console.info("[download request ]");
          console.dir(ev);
          e.request.allow();
    }

};