(function(root){
  "use strict";
  function getSyncDelay({hidden,online}) {
    if (hidden) return null;
    return online ? 5000 : 15000;
  }
  const api = { getSyncDelay };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YarperSyncScheduler = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
