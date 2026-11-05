(function (root) {
  "use strict";

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, area.value.length);

      try {
        var copied = document.execCommand("copy");
        document.body.removeChild(area);
        if (copied) {
          resolve();
        } else {
          reject(new Error("Copy command failed"));
        }
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  function downloadBlob(filename, blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function downloadText(filename, text, mimeType) {
    var type = mimeType || "text/plain";
    downloadBlob(filename, new Blob([text], { type: type + ";charset=utf-8" }));
  }

  function downloadBytes(filename, bytes, mimeType) {
    var source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    downloadBlob(filename, new Blob([source], { type: mimeType || "application/octet-stream" }));
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  function setStatus(element, type, message) {
    if (!element) return;

    var icons = {
      info: "bi-info-circle",
      success: "bi-check-circle",
      warning: "bi-exclamation-triangle",
      error: "bi-x-circle",
      neutral: "bi-circle"
    };

    element.className = "tt-status tt-status--" + type;
    element.textContent = "";

    var icon = document.createElement("i");
    icon.className = "bi " + (icons[type] || icons.info);
    icon.setAttribute("aria-hidden", "true");

    var text = document.createElement("span");
    text.textContent = message;

    element.appendChild(icon);
    element.appendChild(text);
  }

  function flashButton(button, message) {
    if (!button) return;
    var original = button.getAttribute("data-original-html");
    if (!original) {
      original = button.innerHTML;
      button.setAttribute("data-original-html", original);
    }
    button.textContent = message;
    window.setTimeout(function () {
      button.innerHTML = original;
    }, 1600);
  }

  root.TasklyToolkit = {
    copyText: copyText,
    downloadText: downloadText,
    downloadBytes: downloadBytes,
    debounce: debounce,
    setStatus: setStatus,
    flashButton: flashButton
  };
})(window);
