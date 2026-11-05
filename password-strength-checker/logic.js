(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PasswordLogic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var COMMON_PASSWORDS = [
    "123456", "password", "123456789", "12345678", "12345", "qwerty", "1234567", "111111",
    "123123", "abc123", "1234567890", "password1", "iloveyou", "000000", "princess", "1234",
    "1q2w3e4r", "qwertyuiop", "654321", "superman", "1qaz2wsx", "dragon", "monkey", "letmein",
    "football", "welcome", "login", "admin", "passw0rd", "starwars", "whatever", "trustno1",
    "sunshine", "master", "shadow", "michael", "jennifer", "jordan", "hunter", "freedom",
    "baseball", "batman", "soccer", "charlie", "donald", "computer", "secret", "zaq12wsx",
    "qazwsx", "1q2w3e", "1qaz2wsx3edc", "password123", "qwerty123", "admin123", "root", "toor",
    "pass", "guest", "test", "testing", "test123", "changeme", "default", "temp", "welcome1",
    "welcome123", "hello", "hello123", "monkey123", "dragon123", "football1", "baseball1",
    "superman1", "batman1", "shadow1", "master1", "sunshine1", "princess1", "iloveyou1",
    "letmein1", "freedom1", "hunter1", "michael1", "jennifer1", "jordan1", "charlie1",
    "donald1", "computer1", "secret1", "starwars1", "soccer1", "login1", "guest1", "test1",
    "admin1", "root1", "summer", "winter", "spring", "autumn", "summer2023", "summer2024",
    "summer2025", "password!", "password12", "password1234", "p@ssw0rd", "p@ssword",
    "passw0rd1", "qwerty12", "qwerty1234", "abc12345", "abcd1234", "12341234", "112233",
    "121212", "555555", "666666", "777777", "888888", "999999", "123321", "1q2w3e4r5t",
    "asdfgh", "asdfghjkl", "zxcvbnm", "poiuytrewq", "lkjhgfdsa", "mnbvcxz", "qwe123",
    "asd123", "zxc123", "qaz123", "wsx123", "edc123", "iloveu", "love", "lovely", "amor",
    "teamo", "maria", "joseph", "daniel", "andrew", "anthony", "jessica", "ashley", "amanda",
    "nicole", "danielle", "michelle", "sarah", "melissa", "stephanie", "elizabeth", "matthew",
    "joshua", "robert", "william", "david", "richard", "thomas", "charles", "christopher",
    "george", "edward", "brian", "kevin", "jason", "eric", "steven", "mark", "paul", "peter",
    "james", "john", "jesus", "angel", "baby", "sweet", "cookie", "chocolate", "pepper",
    "ginger", "banana", "orange", "purple", "yellow", "silver", "golden", "diamond",
    "summer2022", "winter2023", "spring2024", "autumn2025", "january", "february", "march",
    "april", "may", "june", "july", "august", "september", "october", "november", "december"
  ];

  var COMMON_BASES = [
    "hello", "world", "helloworld", "hellokitty", "company", "office", "school", "college",
    "university", "student", "teacher", "manager", "director", "business", "money", "bank",
    "security", "google", "facebook", "instagram", "linkedin", "twitter", "youtube", "amazon",
    "apple", "microsoft", "samsung", "huawei", "meta", "tiktok", "freedom", "whatever",
    "trustno", "starwars", "superman", "batman", "princess", "sunshine", "football",
    "baseball", "basketball", "hockey", "soccer", "dragon", "monkey", "master", "shadow",
    "hunter", "michael", "jennifer", "jordan", "charlie", "donald", "computer", "secret",
    "welcome", "letmein", "qwerty", "asdfgh", "zxcvbn", "password", "admin", "login", "guest",
    "summer", "winter", "spring", "autumn", "january", "february", "march", "april", "may",
    "june", "july", "august", "september", "october", "november", "december", "chocolate",
    "cookie", "banana", "orange", "purple", "yellow", "silver", "golden", "diamond"
  ];

  var COMMON_INDEX = Object.create(null);

  for (var cp = 0; cp < COMMON_PASSWORDS.length; cp += 1) {
    if (!COMMON_INDEX[COMMON_PASSWORDS[cp]]) {
      COMMON_INDEX[COMMON_PASSWORDS[cp]] = cp + 1;
    }
  }

  for (var cb = 0; cb < COMMON_BASES.length; cb += 1) {
    if (!COMMON_INDEX[COMMON_BASES[cb]]) {
      COMMON_INDEX[COMMON_BASES[cb]] = COMMON_PASSWORDS.length + cb + 1;
    }
  }

  var KEYBOARD_PATTERNS = [
    "qwerty", "qwertyuiop", "asdf", "asdfgh", "asdfghjkl", "zxcv", "zxcvbn", "zxcvbnm",
    "qazwsx", "1q2w3e", "1qaz2wsx", "zaq12wsx", "poiuyt", "lkjhg", "mnbvc", "1234", "9876",
    "1q2w3e4r"
  ];

  var LEET_MAP = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "7": "t",
    "@": "a",
    "$": "s",
    "!": ""
  };

  function normalizeLeet(value) {
    return value.toLowerCase().replace(/[013457@$!]/g, function (character) {
      return LEET_MAP[character];
    });
  }

  function passwordVariants(password) {
    var lower = password.toLowerCase();
    var leet = normalizeLeet(lower);
    var lowerWithoutTrailing = lower.replace(/[^a-z]+$/, "");
    var leetWithoutTrailing = normalizeLeet(lowerWithoutTrailing);
    var values = [
      lower,
      leet,
      lowerWithoutTrailing,
      leetWithoutTrailing,
      lower.replace(/[^a-z0-9]/g, ""),
      leet.replace(/[^a-z0-9]/g, ""),
      lower.replace(/[^a-z0-9]/g, "").replace(/[0-9]+$/, ""),
      leet.replace(/[^a-z0-9]/g, "").replace(/[0-9]+$/, ""),
      lower.replace(/[^a-z]/g, ""),
      leet.replace(/[^a-z]/g, ""),
      lower.replace(/[^a-z0-9]/g, "").replace(/[0-9]/g, ""),
      leet.replace(/[^a-z0-9]/g, "").replace(/[0-9]/g, "")
    ];
    var unique = [];
    var seen = Object.create(null);

    for (var i = 0; i < values.length; i += 1) {
      var value = values[i];
      if (!value || seen[value]) continue;
      seen[value] = true;
      unique.push(value);
    }

    return unique;
  }

  function findCommon(password) {
    var lower = password.toLowerCase();
    var variants = passwordVariants(password);

    for (var i = 0; i < variants.length; i += 1) {
      var rank = COMMON_INDEX[variants[i]];
      if (rank) {
        return {
          rank: rank,
          value: variants[i],
          exact: variants[i] === lower
        };
      }
    }

    return null;
  }

  function smallestRepeatPeriod(characters) {
    var length = characters.length;

    for (var period = 1; period <= Math.floor(length / 2); period += 1) {
      if (length % period !== 0) continue;

      var matches = true;
      for (var i = period; i < length; i += 1) {
        if (characters[i] !== characters[i % period]) {
          matches = false;
          break;
        }
      }

      if (matches) return period;
    }

    return 0;
  }

  function analyzeRuns(characters) {
    var repeatedRuns = 0;
    var maxRepeatedRun = 1;
    var run = 1;

    for (var i = 1; i < characters.length; i += 1) {
      if (characters[i] === characters[i - 1]) {
        run += 1;
        if (run === 3) repeatedRuns += 1;
        else if (run > 3) repeatedRuns += 1;
        if (run > maxRepeatedRun) maxRepeatedRun = run;
      } else {
        run = 1;
      }
    }

    return {
      repeatedRuns: repeatedRuns,
      maxRepeatedRun: maxRepeatedRun
    };
  }

  function analyzeSequences(characters) {
    var maxRun = 1;
    var run = 1;
    var direction = 0;
    var sequenceCount = 0;

    for (var i = 1; i < characters.length; i += 1) {
      var previous = characters[i - 1];
      var current = characters[i];
      var previousCode = previous.charCodeAt(0);
      var currentCode = current.charCodeAt(0);
      var bothDigits = /[0-9]/.test(previous) && /[0-9]/.test(current);
      var bothLetters = /[a-z]/.test(previous) && /[a-z]/.test(current);
      var diff = currentCode - previousCode;

      if ((bothDigits || bothLetters) && Math.abs(diff) === 1) {
        var nextDirection = diff > 0 ? 1 : -1;
        if (run === 1 || nextDirection === direction) {
          run += 1;
        } else {
          run = 2;
        }
        direction = nextDirection;

        if (run === 3) sequenceCount += 1;
        else if (run > 3) sequenceCount += 1;

        if (run > maxRun) maxRun = run;
      } else {
        run = 1;
        direction = 0;
      }
    }

    return {
      maxRun: maxRun,
      sequenceCount: sequenceCount
    };
  }

  function countClasses(password) {
    return {
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      nonAscii: /[^\x00-\x7F]/.test(password)
    };
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds) || seconds < 1) return "instantly";

    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var months = days / 30.44;
    var years = days / 365.25;
    var value;
    var unit;

    if (seconds < 60) {
      value = Math.round(seconds);
      unit = "second";
    } else if (minutes < 60) {
      value = Math.round(minutes);
      unit = "minute";
    } else if (hours < 24) {
      value = Math.round(hours);
      unit = "hour";
    } else if (days < 31) {
      value = Math.round(days);
      unit = "day";
    } else if (months < 12) {
      value = Math.round(months);
      unit = "month";
    } else {
      if (years >= 1e9) return "more than 1 billion years";
      if (years >= 1e6) return "more than 1 million years";
      if (years >= 1000) return Math.round(years).toLocaleString() + " years";

      value = years >= 10 ? Math.round(years) : Math.round(years * 10) / 10;
      return value.toLocaleString() + " year" + (value === 1 ? "" : "s");
    }

    return value.toLocaleString() + " " + unit + (value === 1 ? "" : "s");
  }

  function crackTime(entropyBits, guessesPerSecond) {
    var log10Seconds = entropyBits * Math.log10(2) - Math.log10(guessesPerSecond);
    if (log10Seconds > 15.5) return "more than 1 billion years";
    return formatDuration(Math.pow(10, log10Seconds));
  }

  function analyze(password) {
    var value = String(password == null ? "" : password);
    var characters = Array.from(value);
    var length = characters.length;
    var lowerCharacters = characters.map(function (character) {
      return character.toLowerCase();
    });
    var lower = lowerCharacters.join("");
    var classes = countClasses(value);
    var classCount = 0;
    var poolSize = 0;

    if (classes.lower) {
      classCount += 1;
      poolSize += 26;
    }
    if (classes.upper) {
      classCount += 1;
      poolSize += 26;
    }
    if (classes.digit) {
      classCount += 1;
      poolSize += 10;
    }
    if (classes.symbol) {
      classCount += 1;
      poolSize += 33;
    }
    if (classes.nonAscii) {
      poolSize += 100;
    }
    if (poolSize === 0) poolSize = 1;

    var uniqueCount = new Set(characters).size;
    var uniqueRatio = length ? uniqueCount / length : 0;
    var repeatPeriod = length >= 4 ? smallestRepeatPeriod(characters) : 0;
    var runs = analyzeRuns(characters);
    var sequences = analyzeSequences(lowerCharacters);
    var hasSequence = sequences.maxRun >= 3;
    var hasKeyboardPattern = KEYBOARD_PATTERNS.some(function (pattern) {
      return lower.indexOf(pattern) !== -1;
    });
    var hasYear = /(?:19|20)\d{2}/.test(value);
    var common = findCommon(value);
    var entropy = length * Math.log2(poolSize);

    if (repeatPeriod && repeatPeriod < length) {
      var repeats = length / repeatPeriod;
      entropy = Math.min(entropy, repeatPeriod * Math.log2(poolSize) + Math.log2(repeats + 1));
    }

    if (hasSequence) entropy -= 8;
    if (sequences.maxRun >= 5) entropy = Math.min(entropy, 30);
    if (hasKeyboardPattern) entropy = Math.min(entropy, 32);
    if (runs.repeatedRuns > 0) entropy -= Math.min(20, runs.repeatedRuns * 4);
    if (hasYear) entropy -= 6;
    if (uniqueRatio < 0.5) entropy -= 8;

    if (common) {
      entropy = Math.min(entropy, Math.log2(common.rank + 1) + (common.exact ? 1 : 4));
    }

    entropy = Math.max(0, entropy);

    var score;
    if (entropy >= 80) score = 4;
    else if (entropy >= 60) score = 3;
    else if (entropy >= 40) score = 2;
    else if (entropy >= 28) score = 1;
    else score = 0;

    if (length < 12) score = Math.min(score, 2);
    if (length < 8) score = Math.min(score, 1);
    if (length < 6) score = 0;
    if (common) score = 0;

    var labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
    var warnings = [];
    var suggestions = [];

    if (common) {
      warnings.push(
        common.exact
          ? "This password appears in a common password list."
          : "This password is based on a common password or word."
      );
    }
    if (runs.repeatedRuns > 0) {
      warnings.push("It contains repeated character runs, such as \"aaa\" or \"111\".");
    }
    if (repeatPeriod && repeatPeriod < length) {
      warnings.push("It repeats the same block of characters multiple times.");
    }
    if (hasSequence) {
      warnings.push("It contains sequential characters, such as \"abc\" or \"123\".");
    }
    if (hasKeyboardPattern) {
      warnings.push("It contains a keyboard pattern, such as \"qwerty\" or \"asdf\".");
    }
    if (hasYear) {
      warnings.push("It contains a year, which attackers commonly try.");
    }
    if (classCount <= 1) {
      warnings.push("It uses only one type of character.");
    }
    if (length < 8) {
      warnings.push("It is shorter than 8 characters.");
    } else if (length < 12) {
      warnings.push("It is shorter than 12 characters.");
    }

    if (common) {
      suggestions.push("Choose a password that has not appeared in a data breach or common-password list.");
    }
    if (length < 16) {
      suggestions.push("Aim for at least 16 characters, or use a passphrase of 4-6 random words.");
    }
    if (runs.repeatedRuns > 0 || repeatPeriod || hasSequence || hasKeyboardPattern) {
      suggestions.push("Avoid repeated characters, predictable sequences, and keyboard patterns.");
    }
    if (classCount < 3 && length < 16) {
      suggestions.push("Add uppercase, lowercase, numbers, and symbols, or make the password longer.");
    }
    suggestions.push("Use a password manager to generate and store a unique password for every account.");
    suggestions.push("Enable multi-factor authentication wherever it is available.");

    var checks = [
      { id: "length12", label: "12+ characters", pass: length >= 12 },
      { id: "length16", label: "16+ characters", pass: length >= 16 },
      { id: "lower", label: "Lowercase letter", pass: classes.lower },
      { id: "upper", label: "Uppercase letter", pass: classes.upper },
      { id: "digit", label: "Number", pass: classes.digit },
      { id: "symbol", label: "Symbol", pass: classes.symbol },
      { id: "common", label: "Not a common password", pass: !common },
      {
        id: "patterns",
        label: "No repeated or sequential patterns",
        pass: runs.repeatedRuns === 0 && !repeatPeriod && sequences.maxRun < 3 && !hasKeyboardPattern
      },
      { id: "year", label: "No obvious year", pass: !hasYear }
    ];

    var percentByScore = [12, 32, 55, 78, 100];

    return {
      length: length,
      entropyBits: Math.round(entropy),
      poolSize: poolSize,
      classCount: classCount,
      uniqueCharacters: uniqueCount,
      score: score,
      label: labels[score],
      strengthPercent: percentByScore[score],
      common: Boolean(common),
      commonRank: common ? common.rank : 0,
      checks: checks,
      warnings: warnings,
      suggestions: suggestions,
      crackTimes: {
        onlineThrottled: crackTime(entropy, 100 / 3600),
        onlineUnthrottled: crackTime(entropy, 1e4),
        offlineSlowHash: crackTime(entropy, 1e4),
        offlineFastHash: crackTime(entropy, 1e10)
      }
    };
  }

  return {
    analyze: analyze,
    crackTime: crackTime,
    formatDuration: formatDuration
  };
});
