import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import ApiClient from "../api";

interface LoginErrors {
    email?: string;
    password?: string;
}

function validateEmail(email: string): string | undefined {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return undefined;
}

function validatePassword(password: string): string | undefined {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return undefined;
}

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleBlur(field: string) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validateField(field);
    }

    function validateField(field: string) {
        const newErrors: LoginErrors = { ...errors };
        if (field === "email") {
            const err = validateEmail(email);
            err ? (newErrors.email = err) : delete newErrors.email;
        }
        if (field === "password") {
            const err = validatePassword(password);
            err ? (newErrors.password = err) : delete newErrors.password;
        }
        setErrors(newErrors);
    }

    function getFieldErrors(): LoginErrors {
        return {
            email: validateEmail(email),
            password: validatePassword(password),
        };
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ email: true, password: true });

        const fieldErrors = getFieldErrors();
        const hasErrors = Object.values(fieldErrors).some(Boolean);
        setErrors(fieldErrors as LoginErrors);

        if (hasErrors) return;

        setIsSubmitting(true);
        try {
            const data = await ApiClient.login(email, password);
            if (data && data.token) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="authPage">
            <div className="authCard">
                {/* Left Panel */}
                <aside className="panel panelLeft">
                    <div className="brandRow">
                        <div className="brandLogo">◻︎</div>
                        <div className="brandText">NagorikAI</div>
                    </div>

                    <div className="panelContent">
                        <h2>Welcome Back!</h2>
                        <p>To keep connected with us please login with your personal info</p>

                        <Link className="panelBtn" to="/registration">
                            SIGN UP
                        </Link>
                    </div>

                    <div className="panelShapes">
                        <span className="shape shape1" />
                        <span className="shape shape2" />
                        <span className="shape shape3" />
                    </div>
                </aside>

                {/* Right Form */}
                <section className="panel panelRight">
                    <h1 className="title">Sign In</h1>

                    <div className="socialRow" aria-label="social login">
                        <button className="socialBtn" type="button" title="Facebook">
                            f
                        </button>
                        <button className="socialBtn" type="button" title="Google">
                            G+
                        </button>
                        <button className="socialBtn" type="button" title="LinkedIn">
                            in
                        </button>
                    </div>

                    <div className="mutedText">or use your email account</div>

                    <form className="form" onSubmit={onSubmit} noValidate>
                        <div className="fieldWrapper">
                            <label
                                className={`field ${
                                    touched.email ? (errors.email ? "fieldError" : "fieldSuccess") : ""
                                }`}
                            >
                                <span className="icon">✉️</span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (touched.email) {
                                            const err = validateEmail(e.target.value);
                                            setErrors((prev) => ({ ...prev, email: err }));
                                        }
                                    }}
                                    onBlur={() => handleBlur("email")}
                                    aria-describedby="email-error"
                                    autoComplete="email"
                                />
                            </label>
                            {touched.email && errors.email && (
                                <span className="errorMsg" id="email-error" role="alert">
                                    ⚠ {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="fieldWrapper">
                            <label
                                className={`field ${
                                    touched.password
                                        ? errors.password
                                            ? "fieldError"
                                            : password.length >= 8
                                            ? "fieldSuccess"
                                            : ""
                                        : ""
                                }`}
                            >
                                <span className="icon">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) {
                                            const err = validatePassword(e.target.value);
                                            setErrors((prev) => ({ ...prev, password: err }));
                                        }
                                    }}
                                    onBlur={() => handleBlur("password")}
                                    aria-describedby="password-error"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="togglePasswordBtn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </label>
                            {touched.password && errors.password && (
                                <span className="errorMsg" id="password-error" role="alert">
                                    ⚠ {errors.password}
                                </span>
                            )}
                        </div>

                        <button className="primaryBtn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                        </button>

                        <div className="bottomHint">
                            Don't have an account? <Link to="/registration">Create one</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}