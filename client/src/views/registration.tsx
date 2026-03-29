import React, { useState } from "react";
import "../styles/registration.css";
import { Link, useNavigate } from "react-router-dom";
import ApiClient from "../api";

interface RegErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

// --- Validators ---

function validateName(value: string, fieldLabel: string): string | undefined {
    if (!value.trim()) return `${fieldLabel} is required.`;
    if (value.trim().length < 2) return `${fieldLabel} must be at least 2 characters.`;
    if (value.trim().length > 50) return `${fieldLabel} must not exceed 50 characters.`;
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim()))
        return `${fieldLabel} can only contain letters, spaces, hyphens, or apostrophes.`;
    return undefined;
}

function validateEmail(email: string): string | undefined {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (email.length > 255) return "Email must not exceed 255 characters.";
    return undefined;
}

function validatePassword(password: string): string | undefined {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password.length > 128) return "Password must not exceed 128 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character (e.g. !@#$%).";
    return undefined;
}

function validateConfirmPassword(password: string, confirmation: string): string | undefined {
    if (!confirmation) return "Please confirm your password.";
    if (password !== confirmation) return "Passwords do not match.";
    return undefined;
}

// Password strength helper
function getPasswordStrength(password: string): { level: number; label: string; color: string } {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: score, label: "Weak", color: "#e74c3c" };
    if (score === 3) return { level: score, label: "Fair", color: "#f39c12" };
    if (score === 4) return { level: score, label: "Good", color: "#2ecc71" };
    return { level: score, label: "Strong", color: "#27ae60" };
}

export default function Registration() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<RegErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordRequirements = [
        { label: "8+ characters", met: password.length >= 8 },
        { label: "Uppercase", met: /[A-Z]/.test(password) },
        { label: "Lowercase", met: /[a-z]/.test(password) },
        { label: "Number", met: /[0-9]/.test(password) },
        { label: "Special char", met: /[^A-Za-z0-9]/.test(password) },
    ];

    const strength = getPasswordStrength(password);

    function handleBlur(field: string) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        updateError(field);
    }

    function updateError(field: string, overrides?: Partial<RegErrors>) {
        const vals = {
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation,
            ...overrides,
        };
        const newErrors: RegErrors = { ...errors };

        if (field === "firstName") {
            const err = validateName(vals.firstName, "First name");
            err ? (newErrors.firstName = err) : delete newErrors.firstName;
        }
        if (field === "lastName") {
            const err = validateName(vals.lastName, "Last name");
            err ? (newErrors.lastName = err) : delete newErrors.lastName;
        }
        if (field === "email") {
            const err = validateEmail(vals.email);
            err ? (newErrors.email = err) : delete newErrors.email;
        }
        if (field === "password") {
            const err = validatePassword(vals.password);
            err ? (newErrors.password = err) : delete newErrors.password;
            // Re-validate confirm if already touched
            if (touched.passwordConfirmation) {
                const cerr = validateConfirmPassword(vals.password, vals.passwordConfirmation);
                cerr ? (newErrors.passwordConfirmation = cerr) : delete newErrors.passwordConfirmation;
            }
        }
        if (field === "passwordConfirmation") {
            const err = validateConfirmPassword(vals.password, vals.passwordConfirmation);
            err ? (newErrors.passwordConfirmation = err) : delete newErrors.passwordConfirmation;
        }
        setErrors(newErrors);
    }

    function getAllErrors(vals: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }): RegErrors {
        return {
            firstName: validateName(vals.firstName, "First name"),
            lastName: validateName(vals.lastName, "Last name"),
            email: validateEmail(vals.email),
            password: validatePassword(vals.password),
            passwordConfirmation: validateConfirmPassword(vals.password, vals.passwordConfirmation),
        };
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            passwordConfirmation: true,
        });

        const fieldErrors = getAllErrors({ firstName, lastName, email, password, passwordConfirmation });
        const hasErrors = Object.values(fieldErrors).some(Boolean);
        setErrors(fieldErrors as RegErrors);

        if (hasErrors) return;

        setIsSubmitting(true);
        try {
            const data = await ApiClient.register(firstName, lastName, email, password, passwordConfirmation);
            if (data && data.user) {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="authPageR">
            <div className="authCardR">
                {/* Left Panel */}
                <aside className="panelR panelLeftR">
                    <div className="brandRowR">
                        <div className="brandLogoR">◻︎</div>
                        <div className="brandTextR">NagorikAI</div>
                    </div>

                    <div className="panelContentR">
                        <h2>Hello, Friend!</h2>
                        <p>Enter your personal details and start your journey with us</p>

                        <Link className="panelBtnR" to="/login">
                            SIGN IN
                        </Link>
                    </div>

                    <div className="panelShapesR">
                        <span className="shapeR shape1R" />
                        <span className="shapeR shape2R" />
                        <span className="shapeR shape3R" />
                    </div>
                </aside>

                {/* Right Form */}
                <section className="panelR panelRightR">
                    <h1 className="titleR">Create Account</h1>

                    <div className="socialRowR" aria-label="social signup">
                        <button className="socialBtnR" type="button" title="Facebook">
                            f
                        </button>
                        <button className="socialBtnR" type="button" title="Google">
                            G+
                        </button>
                        <button className="socialBtnR" type="button" title="LinkedIn">
                            in
                        </button>
                    </div>

                    <div className="mutedTextR">or use your email for registration</div>

                    <form className="formR" onSubmit={onSubmit} noValidate>
                        {/* First Name */}
                        <div className="fieldWrapperR">
                            <label
                                className={`fieldR ${
                                    touched.firstName ? (errors.firstName ? "fieldErrorR" : "fieldSuccessR") : ""
                                }`}
                            >
                                <span className="iconR">👤</span>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        if (touched.firstName) updateError("firstName", { firstName: e.target.value });
                                    }}
                                    onBlur={() => handleBlur("firstName")}
                                    maxLength={50}
                                    autoComplete="given-name"
                                />
                            </label>
                            {touched.firstName && errors.firstName && (
                                <span className="errorMsgR" role="alert">⚠ {errors.firstName}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="fieldWrapperR">
                            <label
                                className={`fieldR ${
                                    touched.lastName ? (errors.lastName ? "fieldErrorR" : "fieldSuccessR") : ""
                                }`}
                            >
                                <span className="iconR">👤</span>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        if (touched.lastName) updateError("lastName", { lastName: e.target.value });
                                    }}
                                    onBlur={() => handleBlur("lastName")}
                                    maxLength={50}
                                    autoComplete="family-name"
                                />
                            </label>
                            {touched.lastName && errors.lastName && (
                                <span className="errorMsgR" role="alert">⚠ {errors.lastName}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="fieldWrapperR">
                            <label
                                className={`fieldR ${
                                    touched.email ? (errors.email ? "fieldErrorR" : "fieldSuccessR") : ""
                                }`}
                            >
                                <span className="iconR">✉️</span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (touched.email) updateError("email", { email: e.target.value });
                                    }}
                                    onBlur={() => handleBlur("email")}
                                    maxLength={255}
                                    autoComplete="email"
                                />
                            </label>
                            {touched.email && errors.email && (
                                <span className="errorMsgR" role="alert">⚠ {errors.email}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="fieldWrapperR">
                            <label
                                className={`fieldR ${
                                    touched.password
                                        ? errors.password
                                            ? "fieldErrorR"
                                            : "fieldSuccessR"
                                        : ""
                                }`}
                            >
                                <span className="iconR">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) updateError("password", { password: e.target.value });
                                    }}
                                    onBlur={() => handleBlur("password")}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="togglePasswordBtnR"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </label>
                            {touched.password && errors.password && (
                                <span className="errorMsgR" role="alert">⚠ {errors.password}</span>
                            )}

                            {/* Real-time Checklist */}
                            {(password || touched.password) && (
                                <div className="checklistR">
                                    {passwordRequirements.map((req, idx) => (
                                        <div key={idx} className={`checkItemR ${req.met ? "met" : ""}`}>
                                            <span className="checkIconR">{req.met ? "✓" : "×"}</span>
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Password Strength Bar */}
                            {password && (
                                <div className="strengthBarWrapperR">
                                    <div className="strengthBarR">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="strengthSegmentR"
                                                style={{
                                                    backgroundColor:
                                                        i <= strength.level ? strength.color : "#e0e0e0",
                                                    transition: "background-color 0.3s ease",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className="strengthLabelR" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                            {/* Password requirements hint */}
                            {touched.password && !errors.password && (
                                <span className="successHintR">✓ Password looks great!</span>
                            )}
                            {!touched.password && (
                                <span className="hintTextR">
                                    Min 8 chars · Uppercase · Lowercase · Number · Special char
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="fieldWrapperR">
                            <label
                                className={`fieldR ${
                                    touched.passwordConfirmation
                                        ? errors.passwordConfirmation
                                            ? "fieldErrorR"
                                            : passwordConfirmation
                                            ? "fieldSuccessR"
                                            : ""
                                        : ""
                                }`}
                            >
                                <span className="iconR">🔒</span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={passwordConfirmation}
                                    onChange={(e) => {
                                        setPasswordConfirmation(e.target.value);
                                        if (touched.passwordConfirmation)
                                            updateError("passwordConfirmation", {
                                                passwordConfirmation: e.target.value,
                                            });
                                    }}
                                    onBlur={() => handleBlur("passwordConfirmation")}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="togglePasswordBtnR"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                    title={showConfirm ? "Hide" : "Show"}
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </label>
                            {touched.passwordConfirmation && errors.passwordConfirmation && (
                                <span className="errorMsgR" role="alert">
                                    ⚠ {errors.passwordConfirmation}
                                </span>
                            )}
                            {touched.passwordConfirmation &&
                                !errors.passwordConfirmation &&
                                passwordConfirmation && (
                                    <span className="successHintR">✓ Passwords match!</span>
                                )}
                        </div>

                        <button className="primaryBtnR" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "CREATING ACCOUNT..." : "SIGN UP"}
                        </button>

                        <div className="bottomHintR">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}