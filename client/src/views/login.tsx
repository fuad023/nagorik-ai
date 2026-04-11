import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    MDBContainer,
    MDBCard,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBIcon,
    MDBTypography,
} from "mdb-react-ui-kit";
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
        <div className="login-page d-flex align-items-center bg-light" style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <MDBContainer>
                <MDBCard className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <MDBRow className="g-0">
                        {/* Left Panel */}
                        <MDBCol md="5" className="bg-primary text-white d-flex flex-column justify-content-center p-5 position-relative overflow-hidden">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))' }}></div>
                            
                            <div className="d-flex align-items-center mb-5 position-relative z-index-1 cursor-pointer" onClick={() => navigate('/landing')}>
                                <MDBIcon fas icon="city" size="2x" className="me-2" />
                                <span className="fw-bold fs-4">Nagorik-AI</span>
                            </div>

                            <div className="position-relative z-index-1 mb-5">
                                <MDBTypography tag="h2" className="display-6 fw-bold mb-3">
                                    Welcome Back!
                                </MDBTypography>
                                <MDBTypography tag="p" className="fs-5 opacity-75">
                                    To stay connected with us, please login with your personal info and discover the community issues.
                                </MDBTypography>
                            </div>

                            <div className="position-relative z-index-1 mt-auto">
                                <MDBTypography tag="p" className="mb-2 opacity-75">Don't have an account?</MDBTypography>
                                <MDBBtn outline color="light" size="lg" className="rounded-pill px-4" onClick={() => navigate('/registration')}>
                                    SIGN UP
                                </MDBBtn>
                            </div>

                            {/* Decorative Shapes */}
                            <div className="position-absolute rounded-circle border border-white opacity-20" style={{ width: '150px', height: '150px', bottom: '-50px', right: '-50px' }}></div>
                            <div className="position-absolute rounded-circle border border-white opacity-20" style={{ width: '60px', height: '60px', top: '20%', right: '10%' }}></div>
                        </MDBCol>

                        {/* Right Panel (Form) */}
                        <MDBCol md="7" className="p-5 d-flex flex-column justify-content-center bg-white position-relative">
                            {/* Back Button */}
                            <div className="position-absolute top-0 end-0 p-4 d-none d-md-block">
                                <MDBBtn color="light" size="sm" className="shadow-sm rounded-pill text-primary fw-bold px-3 glass-hover" onClick={() => navigate('/landing')}>
                                    <MDBIcon fas icon="arrow-left" className="me-1" /> Back
                                </MDBBtn>
                            </div>
                            <div className="d-md-none mb-4 text-start">
                                <MDBBtn color="light" size="sm" className="shadow-sm rounded-pill text-primary fw-bold px-3 glass-hover" onClick={() => navigate('/landing')}>
                                    <MDBIcon fas icon="arrow-left" className="me-1" /> Back to Home
                                </MDBBtn>
                            </div>
                            <div className="text-center mb-4">
                                <MDBTypography tag="h1" className="fw-bold text-primary mb-3">
                                    Sign In
                                </MDBTypography>
                                <div className="d-flex justify-content-center gap-3 mb-3">
                                    <MDBBtn floating color="light" className="text-primary shadow-sm glass-hover">
                                        <MDBIcon fab icon="facebook-f" />
                                    </MDBBtn>
                                    <MDBBtn floating color="light" className="text-danger shadow-sm glass-hover">
                                        <MDBIcon fab icon="google" />
                                    </MDBBtn>
                                    <MDBBtn floating color="light" className="text-info shadow-sm glass-hover">
                                        <MDBIcon fab icon="linkedin-in" />
                                    </MDBBtn>
                                </div>
                                <span className="text-muted small text-uppercase">or use your email account</span>
                            </div>

                            <form onSubmit={onSubmit} noValidate className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                {/* Email Field */}
                                <div className="mb-4">
                                    <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.email ? (errors.email ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                        <MDBIcon fas icon="envelope" className="text-muted ms-2 me-3" />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="form-control border-0 bg-transparent shadow-none p-0"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (touched.email) {
                                                    const err = validateEmail(e.target.value);
                                                    setErrors((prev) => ({ ...prev, email: err }));
                                                }
                                            }}
                                            onBlur={() => handleBlur("email")}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {touched.email && errors.email && (
                                        <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.email}</span>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="mb-4">
                                    <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.password ? (errors.password ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                        <MDBIcon fas icon="lock" className="text-muted ms-2 me-3" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="form-control border-0 bg-transparent shadow-none p-0"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (touched.password) {
                                                    const err = validatePassword(e.target.value);
                                                    setErrors((prev) => ({ ...prev, password: err }));
                                                }
                                            }}
                                            onBlur={() => handleBlur("password")}
                                            autoComplete="current-password"
                                        />
                                        <MDBIcon 
                                            fas 
                                            icon={showPassword ? "eye-slash" : "eye"} 
                                            className="text-muted mx-2 cursor-pointer" 
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                    {touched.password && errors.password && (
                                        <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.password}</span>
                                    )}
                                </div>

                                <MDBBtn block size="lg" className="rounded-pill pulse-animation mb-4 shadow-sm" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                                </MDBBtn>

                                <div className="text-center">
                                    <Link to="/registration" className="text-primary text-decoration-none fw-bold">Forgot your password?</Link>
                                </div>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </MDBContainer>
            <style>{`
                .glass-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .glass-hover:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
                .cursor-pointer { cursor: pointer; }
                .form-control:focus { box-shadow: none; border-color: transparent; }
                input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px white inset !important;
                    -webkit-text-fill-color: #4f4f4f !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    );
}