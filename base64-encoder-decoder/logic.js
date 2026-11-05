(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Base64Logic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var WHITESPACE_RE = /[\t\n\f\r ]/g;
  var CONTROL_RE = /[\u0000-\u001f\u007f]/;
  var ALPHABET_INDEX = Object.create(null);

  for (var index = 0; index < BASE64_ALPHABET.length; index += 1) {
    ALPHABET_INDEX[BASE64_ALPHABET.charAt(index)] = index;
  }

  function bytesToBinaryString(bytes) {
    var parts = [];
    var chunkSize = 0x8000;

    for (var i = 0; i < bytes.length; i += chunkSize) {
      var chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      parts.push(String.fromCharCode.apply(null, chunk));
    }

    return parts.join("");
  }

  function encodeBytes(bytes, options) {
    var opts = options || {};
    var input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    var encoded = btoa(bytesToBinaryString(input));

    if (opts.urlSafe) {
      encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    return {
      output: encoded,
      byteLength: input.length,
      outputLength: encoded.length,
      urlSafe: Boolean(opts.urlSafe)
    };
  }

  function encodeText(text, options) {
    var value = String(text == null ? "" : text);
    var bytes = new TextEncoder().encode(value);
    var result = encodeBytes(bytes, options);
    result.characterLength = value.length;
    return result;
  }

  function alphabetIndex(character) {
    return Object.prototype.hasOwnProperty.call(ALPHABET_INDEX, character)
      ? ALPHABET_INDEX[character]
      : -1;
  }

  function decodeBase64(input, options) {
    var opts = options || {};
    var ignoreWhitespace = opts.ignoreWhitespace !== false;
    var raw = String(input == null ? "" : input).replace(/^\uFEFF/, "");

    if (!raw) {
      return {
        bytes: new Uint8Array(0),
        urlSafe: false,
        warnings: [],
        hadPadding: false
      };
    }

    if (ignoreWhitespace) {
      raw = raw.replace(WHITESPACE_RE, "");
    } else if (/\s/.test(raw)) {
      return { error: "Whitespace is present. Enable \"Ignore whitespace\" or remove line breaks and spaces." };
    }

    if (CONTROL_RE.test(raw)) {
      return { error: "The input contains control characters that are not valid Base64." };
    }

    if (!raw) {
      return {
        bytes: new Uint8Array(0),
        urlSafe: false,
        warnings: [],
        hadPadding: false
      };
    }

    var paddingMatch = raw.match(/=+$/);
    var paddingLength = paddingMatch ? paddingMatch[0].length : 0;

    if (paddingLength > 2) {
      return { error: "Base64 can end with at most two padding characters (=)." };
    }

    var core = paddingLength ? raw.slice(0, -paddingLength) : raw;

    if (core.indexOf("=") !== -1) {
      return { error: "Padding (=) may only appear at the end of the Base64 value." };
    }

    var hasUrlSafeChars = /[-_]/.test(core);
    var hasStandardChars = /[+\/]/.test(core);

    if (hasUrlSafeChars && hasStandardChars) {
      return { error: "The input mixes URL-safe (- and _) and standard (+ and /) Base64 characters." };
    }

    var urlSafe = hasUrlSafeChars;
    var normalizedCore = urlSafe ? core.replace(/-/g, "+").replace(/_/g, "/") : core;
    var invalidMatch = /[^A-Za-z0-9+\/]/.exec(normalizedCore);

    if (invalidMatch) {
      var invalidPosition = normalizedCore.indexOf(invalidMatch[0]) + 1;
      return { error: 'Invalid Base64 character "' + invalidMatch[0] + '" near position ' + invalidPosition + "." };
    }

    var coreRemainder = normalizedCore.length % 4;
    if (coreRemainder === 1) {
      return { error: "The Base64 length is invalid. A Base64 value cannot have exactly one leftover character." };
    }

    if (paddingLength > 0 && coreRemainder + paddingLength !== 4) {
      return { error: "The Base64 padding is incorrect. Remove the padding or add the missing padding characters." };
    }

    var warnings = [];
    var addedPadding = 0;
    var normalized = normalizedCore;

    if (paddingLength === 0 && coreRemainder !== 0) {
      addedPadding = 4 - coreRemainder;
      normalized += "=".repeat(addedPadding);
      warnings.push("The input was missing " + addedPadding + " padding character(s); decoding succeeded.");
    } else if (paddingLength > 0) {
      normalized += "=".repeat(paddingLength);
    }

    if (normalized.length % 4 !== 0) {
      return { error: "The Base64 length is invalid." };
    }

    if (coreRemainder === 2 || coreRemainder === 3) {
      var lastCharacter = normalizedCore.charAt(normalizedCore.length - 1);
      var lastIndex = alphabetIndex(lastCharacter);

      if (coreRemainder === 2 && (lastIndex & 0x0f) !== 0) {
        warnings.push("The final Base64 character has non-zero unused bits. It decodes, but the encoding is not canonical.");
      } else if (coreRemainder === 3 && (lastIndex & 0x03) !== 0) {
        warnings.push("The final Base64 character has non-zero unused bits. It decodes, but the encoding is not canonical.");
      }
    }

    var binary;
    try {
      binary = atob(normalized);
    } catch (error) {
      return { error: "The Base64 value could not be decoded. Check the characters and padding." };
    }

    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return {
      bytes: bytes,
      urlSafe: urlSafe,
      warnings: warnings,
      hadPadding: paddingLength > 0,
      addedPadding: addedPadding
    };
  }

  function decodeText(input, options) {
    var decoded = decodeBase64(input, options);
    if (decoded.error) return decoded;

    try {
      var text = new TextDecoder("utf-8", { fatal: true }).decode(decoded.bytes);
      decoded.text = text;
      decoded.isText = true;
    } catch (error) {
      decoded.text = "";
      decoded.isText = false;
      decoded.textError = "The decoded bytes are not valid UTF-8 text. Download the binary output instead.";
    }

    return decoded;
  }

  function hexPreview(bytes, limit) {
    var max = Math.min(bytes.length, typeof limit === "number" ? limit : 256);
    var lines = [];

    for (var offset = 0; offset < max; offset += 16) {
      var hex = [];
      var ascii = [];
      var end = Math.min(offset + 16, max);

      for (var i = offset; i < end; i += 1) {
        var byte = bytes[i];
        hex.push(("0" + byte.toString(16)).slice(-2));
        ascii.push(byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".");
      }

      lines.push(
        ("00000000" + offset.toString(16)).slice(-8) +
          "  " +
          hex.join(" ").padEnd(47, " ") +
          "  " +
          ascii.join("")
      );
    }

    return lines.join("\n");
  }

  return {
    encodeBytes: encodeBytes,
    encodeText: encodeText,
    decodeBase64: decodeBase64,
    decodeText: decodeText,
    hexPreview: hexPreview
  };
});
