// // @desc - handles the life cycle of the application .
// // TODO: handle storage persmission if there is any consern .

// var appStorage = {
//   aboveStorageLIMIT: function (inputData){
//     return inputData.size > app.DEFAULTS.storageLimit;
//   },

//   query: function (match, data) {
//     var _match = {};
//     for (var key in data) {
//       if (data[key] == match[key]) {
//         return data;
//       }
//     }
//     return _match;
//   },

//   read: function (param) {
//     console.info("Reading storage !");
//       chrome.storage.local.get(function (data) {
//         if (data) {
//             if (param){
//               this.query(param, data)
//             } else {
//               return data;
//             }
//         } else {
//           return {};
//         }
//       });
//   },

//   store: function (data) {
//     chrome.storage.local.set({
//       added: new Date(),
//       lastModefied: new Date(),
//       data: data
//     });
//   },

//   update: function () {
//     // TODO: Implement the update functions .
//   },

//   clearAll: function (){
//     var data = this.read();
//     for (var key in data) {
//       chrome.storage.local.remove(key);
//     }
//   },

//   clear: function (key) {
//     if (key){
//       chrome.storage.local.remove(key);
//     } else {
//       this.clearAll();
//     }
//   },

//   size: function () {
//     chrome.storage.local.getBytesInUse(function (bytes) {
//       return bytes;
//     });
//   }
// };
