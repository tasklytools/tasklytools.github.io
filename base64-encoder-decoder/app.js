(function () {
  "use strict";

  function init() {
    var logic = window.Base64Logic;
    var toolkit = window.TasklyToolkit;

    if (!logic || !toolkit) return;

    var tabEncode = document.getElementById("tabEncode");
    var tabDecode = document.getElementById("tabDecode");
    var panelEncode = document.getElementById("panelEncode");
    var panelDecode = document.getElementById("panelDecode");

    var sourceSelect = document.getElementById("encodeSource");
    var textPanel = document.getElementById("encodeTextPanel");
    var filePanel = document.getElementById("encodeFilePanel");
    var inputText = document.getElementById("encodeText");
    var inputFile = document.getElementById("encodeFile");
    var fileInfo = document.getElementById("encodeFileInfo");
    var urlSafe = document.getElementById("encodeUrlSafe");
    var encodeOutput = document.getElementById("encodeOutput");
    var encodeOutputWrap = document.getElementById("encodeOutputWrap");
    var encodeEmpty = document.getElementById("encodeEmpty");
    var encodeStats = document.getElementById("encodeStats");
    var encodeStatus = document.getElementById("encodeStatus");
    var copyEncodedBtn = document.getElementById("copyEncodedBtn");
    var downloadEncodedBtn = document.getElementById("downloadEncodedBtn");
    var decodeEncodedBtn = document.getElementById("decodeEncodedBtn");
    var resetEncodeBtn = document.getElementById("resetEncodeBtn");

    var decodeInput = document.getElementById("decodeInput");
    var ignoreWhitespace = document.getElementById("decodeIgnoreWhitespace");
    var decodeButton = document.getElementById("decodeButton");
    var decodeOutput = document.getElementById("decodeOutput");
    var decodeOutputWrap = document.getElementById("decodeOutputWrap");
    var decodeEmpty = document.getElementById("decodeEmpty");
    var decodeStats = document.getElementById("decodeStats");
    var decodeStatus = document.getElementById("decodeStatus");
    var copyDecodedBtn = document.getElementById("copyDecodedBtn");
    var downloadDecodedBtn = document.getElementById("downloadDecodedBtn");
    var resetDecodeBtn = document.getElementById("resetDecodeBtn");

    if (!sourceSelect || !encodeOutput || !decodeInput) return;

    var fileBytes = null;
    var fileName = "";
    var encoded = "";
    var decodedBytes = null;
    var decodedText = null;
    var decodedIsText = false;

    function bytesLabel(count) {
      return count.toLocaleString() + " byte" + (count === 1 ? "" : "s");
    }

    function updateFileInfo() {
      if (!fileName) {
        fileInfo.textContent = "No file selected. Files are read locally and never uploaded.";
        return;
      }

      fileInfo.textContent = "Selected: " + fileName + " (" + bytesLabel(fileBytes ? fileBytes.length : 0) + ")";
    }

    function setActiveTab(which) {
      var showEncode = which === "encode";
      panelEncode.classList.toggle("tt-hidden", !showEncode);
      panelDecode.classList.toggle("tt-hidden", showEncode);
      tabEncode.setAttribute("aria-selected", String(showEncode));
      tabDecode.setAttribute("aria-selected", String(!showEncode));
      tabEncode.tabIndex = showEncode ? 0 : -1;
      tabDecode.tabIndex = showEncode ? -1 : 0;

      if (!showEncode && decodeInput.value.trim()) {
        renderDecode();
      }
    }

    function resetEncodeOutput() {
      encoded = "";
      encodeOutput.textContent = "";
      encodeOutputWrap.classList.add("tt-hidden");
      encodeEmpty.classList.remove("tt-hidden");
      encodeStats.textContent = "0 bytes in / 0 characters out";
      copyEncodedBtn.disabled = true;
      downloadEncodedBtn.disabled = true;
      decodeEncodedBtn.disabled = true;
    }

    function renderEncode() {
      var isFile = sourceSelect.value === "file";

      if (isFile) {
        if (!fileBytes) {
          resetEncodeOutput();
          toolkit.setStatus(encodeStatus, "neutral", "Choose a file to encode.");
          return;
        }

        var fileResult = logic.encodeBytes(fileBytes, { urlSafe: urlSafe.checked });
        encoded = fileResult.output;
        encodeOutput.textContent = encoded;
        encodeOutputWrap.classList.remove("tt-hidden");
        encodeEmpty.classList.add("tt-hidden");
        encodeStats.textContent = bytesLabel(fileResult.byteLength) + " in / " + encoded.length.toLocaleString() + " characters out";
        toolkit.setStatus(
          encodeStatus,
          fileResult.byteLength ? "success" : "warning",
          fileResult.byteLength
            ? "Encoded " + fileName + " locally. Copy the Base64 or download it as a text file."
            : "The selected file is empty."
        );
      } else {
        var text = inputText.value;

        if (!text) {
          resetEncodeOutput();
          toolkit.setStatus(encodeStatus, "neutral", "Enter text to encode.");
          return;
        }

        var textResult = logic.encodeText(text, { urlSafe: urlSafe.checked });
        encoded = textResult.output;
        encodeOutput.textContent = encoded;
        encodeOutputWrap.classList.remove("tt-hidden");
        encodeEmpty.classList.add("tt-hidden");
        encodeStats.textContent =
          bytesLabel(textResult.byteLength) + " in / " + encoded.length.toLocaleString() + " characters out";
        toolkit.setStatus(encodeStatus, "success", "Encoded locally as UTF-8" + (urlSafe.checked ? " using the URL-safe alphabet." : "."));
      }

      var hasOutput = Boolean(encoded);
      copyEncodedBtn.disabled = !hasOutput;
      downloadEncodedBtn.disabled = !hasOutput;
      decodeEncodedBtn.disabled = !hasOutput;
    }

    function resetDecodeOutput() {
      decodedBytes = null;
      decodedText = null;
      decodedIsText = false;
      decodeOutput.textContent = "";
      decodeOutputWrap.classList.add("tt-hidden");
      decodeEmpty.classList.remove("tt-hidden");
      decodeStats.textContent = "0 bytes";
      copyDecodedBtn.disabled = true;
      downloadDecodedBtn.disabled = true;
    }

    function renderDecode() {
      var value = decodeInput.value;

      if (!value.trim()) {
        resetDecodeOutput();
        toolkit.setStatus(decodeStatus, "neutral", "Paste Base64 to decode it as UTF-8 text or download the decoded bytes.");
        return;
      }

      var result = logic.decodeText(value, { ignoreWhitespace: ignoreWhitespace.checked });

      if (result.error) {
        resetDecodeOutput();
        toolkit.setStatus(decodeStatus, "error", result.error);
        return;
      }

      decodedBytes = result.bytes;
      decodedIsText = result.isText;
      decodedText = result.isText ? result.text : null;
      decodeStats.textContent =
        bytesLabel(result.bytes.length) +
        (result.isText ? " / " + result.text.length.toLocaleString() + " characters" : "") +
        " / " +
        (result.urlSafe ? "URL-safe input" : "standard input");

      if (result.isText) {
        decodeOutput.textContent = result.text;
      } else {
        decodeOutput.textContent =
          "Binary data (" +
          bytesLabel(result.bytes.length) +
          ").\n\nHex preview:\n\n" +
          logic.hexPreview(result.bytes, 512);
      }

      decodeOutputWrap.classList.remove("tt-hidden");
      decodeEmpty.classList.add("tt-hidden");

      var warnings = result.warnings.slice();
      if (!result.isText) {
        warnings.unshift(result.textError);
      }

      if (warnings.length) {
        toolkit.setStatus(decodeStatus, "warning", warnings.join(" "));
      } else {
        toolkit.setStatus(decodeStatus, "success", "Decoded successfully as UTF-8 text.");
      }

      copyDecodedBtn.disabled = !result.isText || !result.text;
      downloadDecodedBtn.disabled = result.bytes.length === 0;
    }

    var debouncedEncode = toolkit.debounce(renderEncode, 120);
    var debouncedDecode = toolkit.debounce(renderDecode, 160);

    sourceSelect.addEventListener("change", function () {
      var isFile = sourceSelect.value === "file";
      textPanel.classList.toggle("tt-hidden", isFile);
      filePanel.classList.toggle("tt-hidden", !isFile);
      renderEncode();
    });

    inputText.addEventListener("input", debouncedEncode);
    urlSafe.addEventListener("change", renderEncode);
    ignoreWhitespace.addEventListener("change", renderDecode);

    inputFile.addEventListener("change", function () {
      var file = inputFile.files && inputFile.files[0];

      if (!file) {
        fileBytes = null;
        fileName = "";
        updateFileInfo();
        renderEncode();
        return;
      }

      if (typeof file.arrayBuffer !== "function") {
        toolkit.setStatus(encodeStatus, "error", "This browser cannot read the selected file. Try a modern browser.");
        return;
      }

      toolkit.setStatus(encodeStatus, "info", "Reading " + file.name + " locally...");
      file.arrayBuffer().then(function (buffer) {
        fileBytes = new Uint8Array(buffer);
        fileName = file.name;
        updateFileInfo();
        renderEncode();
      }).catch(function () {
        fileBytes = null;
        fileName = "";
        updateFileInfo();
        renderEncode();
        toolkit.setStatus(encodeStatus, "error", "The file could not be read. Try selecting it again.");
      });
    });

    copyEncodedBtn.addEventListener("click", function () {
      if (!encoded) return;
      toolkit.copyText(encoded).then(function () {
        toolkit.flashButton(copyEncodedBtn, "Copied");
        toolkit.setStatus(encodeStatus, "success", "Copied the encoded Base64 to the clipboard.");
      }).catch(function () {
        toolkit.setStatus(encodeStatus, "error", "Copy failed. Select the output manually and copy it.");
      });
    });

    downloadEncodedBtn.addEventListener("click", function () {
      if (!encoded) return;
      toolkit.downloadText("base64-output.txt", encoded, "text/plain");
      toolkit.setStatus(encodeStatus, "info", "Downloaded base64-output.txt.");
    });

    decodeEncodedBtn.addEventListener("click", function () {
      if (!encoded) return;
      decodeInput.value = encoded;
      setActiveTab("decode");
      renderDecode();
      decodeInput.focus();
    });

    resetEncodeBtn.addEventListener("click", function () {
      sourceSelect.value = "text";
      inputText.value = "";
      inputFile.value = "";
      fileBytes = null;
      fileName = "";
      urlSafe.checked = false;
      textPanel.classList.remove("tt-hidden");
      filePanel.classList.add("tt-hidden");
      updateFileInfo();
      renderEncode();
      inputText.focus();
    });

    decodeInput.addEventListener("input", debouncedDecode);
    decodeButton.addEventListener("click", renderDecode);

    copyDecodedBtn.addEventListener("click", function () {
      if (decodedText === null) return;
      toolkit.copyText(decodedText).then(function () {
        toolkit.flashButton(copyDecodedBtn, "Copied");
        toolkit.setStatus(decodeStatus, "success", "Copied the decoded text to the clipboard.");
      }).catch(function () {
        toolkit.setStatus(decodeStatus, "error", "Copy failed. Select the output manually and copy it.");
      });
    });

    downloadDecodedBtn.addEventListener("click", function () {
      if (!decodedBytes || !decodedBytes.length) return;
      var filename = decodedIsText ? "decoded.txt" : "decoded.bin";
      toolkit.downloadBytes(filename, decodedBytes, decodedIsText ? "text/plain" : "application/octet-stream");
      toolkit.setStatus(decodeStatus, "info", "Downloaded " + filename + ".");
    });

    resetDecodeBtn.addEventListener("click", function () {
      decodeInput.value = "";
      ignoreWhitespace.checked = true;
      resetDecodeOutput();
      renderDecode();
      decodeInput.focus();
    });

    tabEncode.addEventListener("click", function () {
      setActiveTab("encode");
    });

    tabDecode.addEventListener("click", function () {
      setActiveTab("decode");
    });

    tabEncode.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveTab("decode");
        tabDecode.focus();
      }
    });

    tabDecode.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveTab("encode");
        tabEncode.focus();
      }
    });

    updateFileInfo();
    setActiveTab("encode");
    renderEncode();
    resetDecodeOutput();
    toolkit.setStatus(decodeStatus, "neutral", "Paste Base64 to decode it as UTF-8 text or download the decoded bytes.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
