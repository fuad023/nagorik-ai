import React, { useState } from "react";
import "../styles/registration.css";
import { Link, useNavigate } from "react-router-dom";
import ApiClient from "../api";

export default function Registration() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            import("react-hot-toast").then((toast) => toast.default.error("Passwords do not match"));
            return;
        }

        try {
            const data = await ApiClient.register(firstName, lastName, email, password, passwordConfirmation);
            if (data && data.user) {
                navigate("/login");
            }
            // If no user returned, ApiClient.register will have shown a toast
        } catch (error) {
            // Error handled in ApiClient
            console.error(error);
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

                    <form className="formR" onSubmit={onSubmit}>
                        <label className="fieldR">
                            <span className="iconR">👤</span>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="fieldR">
                            <span className="iconR">👤</span>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="fieldR">
                            <span className="icon">✉️</span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="fieldR">
                            <span className="iconR">🔒</span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        
                        <label className="fieldR">
                            <span className="iconR">🔒</span>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </label>

                        <button className="primaryBtnR" type="submit">
                            SIGN UP
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