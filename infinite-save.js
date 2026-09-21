"use strict";
(function () {
  var interval = null;
  var running = false;
  var START_DELAY_MS = 4000;
  var REFRESH_MS = 15000;

  function apply() {
    if (running || typeof window.applyUnlockAll !== "function") return Promise.resolve({ ready: false });
    running = true;
    return Promise.resolve().then(function () {
      return window.applyUnlockAll();
    }).catch(function (err) {
      if (!err || err.code !== "NO_SAVE") console.warn("[infinite-save] não foi possível atualizar o save:", err);
      return { ready: false, error: err };
    }).then(function (result) {
      running = false;
      return result;
    });
  }

  window.applyInfiniteSave = apply;
  window.scheduleInfiniteSaveRefresh = function () {
    if (interval) return;
    window.setTimeout(function () {
      apply();
      interval = window.setInterval(apply, REFRESH_MS);
    }, START_DELAY_MS);
  };
  window.scheduleInfiniteSaveRefresh();
})();
