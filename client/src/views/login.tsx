import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import ApiClient from "../api";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // async function onSubmit(e: React.FormEvent) {
    //     e.preventDefault();

    //     try {
    //         const data = await ApiClient.login(email, password);
    //         if (data && data.token) {
    //             navigate("/dashboard");
    //         }
    //         // If no token returned, ApiClient.login will have shown a toast
    //     } catch (error) {
    //         // error is handled in ApiClient via toast
    //         console.error("Login failed", error);
    //     }
    // }

    async function onSubmit(e : React.FormEvent) {
        e.preventDefault();
        navigate("/dashboard");
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

                    <form className="form" onSubmit={onSubmit}>
                        <label className="field">
                            <span className="icon">✉️</span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="icon">🔒</span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>

                        <button className="primaryBtn" type="submit">
                            SIGN IN
                        </button>

                        <div className="bottomHint">
                            Don’t have an account? <Link to="/registration">Create one</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}