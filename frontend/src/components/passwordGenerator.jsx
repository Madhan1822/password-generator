import { useState } from "react";
import API from "../services/api";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(null);

  // Map keys to descriptive labels
  const optionLabels = {
    uppercase: "UpperCase",
    lowercase: "LowerCase",
    numbers: "Numbers",
    symbols: "Symbols",
  };

  // 🔐 Strength calculator with explanation
  const getPasswordStrength = (password) => {
    let score = 0;
    const reasons = [];

    if (password.length >= 8) {
      score++;
      reasons.push({ ok: true, text: "Good length (8+ characters)" });
    } else {
      reasons.push({ ok: false, text: "Too short (min 8 characters)" });
    }

    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) {
      score++;
      reasons.push({ ok: true, text: "Contains uppercase letters" });
    } else {
      reasons.push({ ok: false, text: "No uppercase letters" });
    }

    if (/[a-z]/.test(password)) {
      score++;
      reasons.push({ ok: true, text: "Contains lowercase letters" });
    } else {
      reasons.push({ ok: false, text: "No lowercase letters" });
    }

    if (/[0-9]/.test(password)) {
      score++;
      reasons.push({ ok: true, text: "Contains numbers" });
    } else {
      reasons.push({ ok: false, text: "No numbers" });
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
      reasons.push({ ok: true, text: "Contains symbols" });
    } else {
      reasons.push({ ok: false, text: "No symbols" });
    }

    if (score <= 2)
      return { label: "WEAK", value: 33, color: "black", reasons };
    if (score <= 4)
      return { label: "MEDIUM", value: 66, color: "yellow", reasons };
    return { label: "STRONG", value: 100, color: "greenyellow", reasons };
  };

  const generatePassword = async () => {
    let payload = { length, ...options };
    const isAnySelected = Object.values(options).some(Boolean);

    if (!isAnySelected) {
      payload = {
        length,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      };
      setMessage("No options selected. Generated a strong default password 🔐");
    } else {
      setMessage("");
    }

    setLoading(true);
    try {
      const res = await API.post("/passwords/generate", payload);
      setPassword(res.data.password);
      setStrength(getPasswordStrength(res.data.password));
    } catch {
      setMessage("⚠️ Server not responding");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setMessage("Password copied to clipboard ✅");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="card">
      <h2>Password Generator</h2>

      <label>Length: {length}</label>
      <input
        type="range"
        min="6"
        max="20"
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
      />

      {/* Options */}
      <div className="checkbox-group">
        {Object.keys(options).map((key) => (
          <label key={key} className="checkbox-item">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() =>
                setOptions({ ...options, [key]: !options[key] })
              }
            />
            {optionLabels[key]}
          </label>
        ))}
      </div>

      <button onClick={generatePassword} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {message && <p className="info-text">{message}</p>}

      {password && (
        <div className="generated-password">
          <span>{password}</span>
          <button className="copy-btn" onClick={handleCopy}>
            Copy
          </button>
        </div>
      )}

      {/* Strength Meter */}
      {strength && (
        <div className="strength-meter">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${strength.value}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>

          <p className="strength-label">
            Strength:{" "}
            <strong style={{ color: strength.color }}>{strength.label}</strong>
          </p>

          {/* Strength Explanation */}
          <ul className="strength-reasons">
            {strength.reasons.map((item, index) => (
              <li key={index} className={item.ok ? "ok" : "bad"}>
                {item.ok ? "✔" : "✖"} {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
