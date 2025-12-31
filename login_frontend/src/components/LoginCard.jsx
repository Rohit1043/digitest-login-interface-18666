import React, { useMemo, useRef, useState } from "react";
import "../styles/login.css";

const SAMPLE_USERNAME = "demo";
const SAMPLE_PASSWORD = "pass123";

/**
 * Artificial delay to simulate a real login request without calling any backend.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simple client-side credential check.
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
function isValidCredentials(username, password) {
  return username === SAMPLE_USERNAME && password === SAMPLE_PASSWORD;
}

/**
 * @typedef {"idle" | "loading" | "success" | "error"} LoginStatus
 */

// PUBLIC_INTERFACE
export default function LoginCard() {
  /** @type {[string, Function]} */
  const [username, setUsername] = useState("");
  /** @type {[string, Function]} */
  const [password, setPassword] = useState("");
  /** @type {[boolean, Function]} */
  const [showPassword, setShowPassword] = useState(false);

  /** @type {[LoginStatus, Function]} */
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const isLoading = status === "loading";
  const canSubmit = username.trim().length > 0 && password.length > 0 && !isLoading;

  const feedbackA11yProps = useMemo(() => {
    if (status === "success") return { role: "status", "aria-live": "polite" };
    if (status === "error") return { role: "alert", "aria-live": "assertive" };
    return { role: "status", "aria-live": "polite" };
  }, [status]);

  const validate = () => {
    const nextErrors = { username: "", password: "" };

    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);

    // Focus first invalid field for keyboard users.
    if (nextErrors.username) {
      usernameRef.current?.focus();
      return false;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleAutofill = () => {
    setUsername(SAMPLE_USERNAME);
    setPassword(SAMPLE_PASSWORD);
    setErrors({ username: "", password: "" });
    setStatus("idle");
    setFeedback("Autofilled sample credentials. Press Enter to submit.");
    // Move focus to submit flow quickly.
    passwordRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous feedback but keep errors until re-validated.
    setFeedback("");
    setStatus("idle");

    if (!validate()) return;

    setStatus("loading");
    setFeedback("Signing in… (demo simulation)");

    await wait(800);

    const ok = isValidCredentials(username.trim(), password);

    if (ok) {
      setStatus("success");
      setFeedback("Signed in successfully. Redirecting to dashboard (mock)...");
      return;
    }

    setStatus("error");
    setFeedback("Invalid credentials. Please use the sample login or try again.");
  };

  return (
    <div className="loginPage">
      <div className="loginShell">
        <div className="brandHeader">
          <h1 className="brandTitle">DigiTest Login</h1>
          <p className="brandSubtitle">Secure access • Corporate Navy theme • Demo-only client-side check</p>
        </div>

        <section className="card" aria-label="Login card">
          <div className="cardAccent" aria-hidden="true" />
          <div className="cardBody">
            <h2 className="sectionTitle">Sign in</h2>
            <p className="sectionHint">Enter your username and password to continue.</p>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <div className="labelRow">
                  <label className="label" htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="inputWrap">
                  <input
                    ref={usernameRef}
                    id="username"
                    name="username"
                    className="input"
                    type="text"
                    inputMode="text"
                    autoComplete="username"
                    placeholder="e.g., demo"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                    }}
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    disabled={isLoading}
                  />
                </div>
                {errors.username ? (
                  <p className="errorText" id="username-error">
                    {errors.username}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <div className="labelRow">
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="helperLink"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="inputWrap">
                  <input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    className="input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.password ? (
                  <p className="errorText" id="password-error">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className="credentialsBox" aria-label="Sample credentials">
                <div className="credentialsRow">
                  <p className="credText">
                    Sample credentials:{" "}
                    <span className="credCode" aria-label="sample username">
                      {SAMPLE_USERNAME}
                    </span>{" "}
                    /{" "}
                    <span className="credCode" aria-label="sample password">
                      {SAMPLE_PASSWORD}
                    </span>
                  </p>
                  <button type="button" className="autofillBtn" onClick={handleAutofill} disabled={isLoading}>
                    Autofill
                  </button>
                </div>
              </div>

              <button className="submitBtn" type="submit" disabled={!canSubmit} aria-disabled={!canSubmit}>
                {isLoading ? (
                  <span className="loadingRow">
                    <span className="spinner" aria-hidden="true" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              {status !== "idle" || feedback ? (
                <div
                  className={[
                    "feedback",
                    status === "success" ? "feedbackSuccess" : "",
                    status === "error" ? "feedbackError" : "",
                  ].join(" ")}
                  {...feedbackA11yProps}
                >
                  <div className="feedbackTitleRow">
                    <p className="feedbackTitle">
                      {status === "success" ? "Success" : status === "error" ? "Sign-in failed" : "Status"}
                    </p>
                    {status === "success" ? (
                      <span className={"badge badgeSuccess"}>✓ OK</span>
                    ) : status === "error" ? (
                      <span className={"badge badgeError"}>!</span>
                    ) : null}
                  </div>
                  <div>{feedback}</div>
                </div>
              ) : null}
            </form>

            <div className="footerNote">
              Demo-only: change credentials in <strong>src/components/LoginCard.jsx</strong>.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
