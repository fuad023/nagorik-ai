import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface RegErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
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

function validatePhone(phone: string): string | undefined {
    if (!phone.trim()) return "Phone number is required.";
    return undefined;
}

function validateLocation(location: string): string | undefined {
    if (!location.trim()) return "Location is required.";
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
    return { level: score, label: "Strong", color: "#198754" };
}

export default function Registration() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
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
            phone,
            location,
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
        if (field === "phone") {
            const err = validatePhone(vals.phone);
            err ? (newErrors.phone = err) : delete newErrors.phone;
        }
        if (field === "location") {
            const err = validateLocation(vals.location);
            err ? (newErrors.location = err) : delete newErrors.location;
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
        phone: string;
        location: string;
        password: string;
        passwordConfirmation: string;
    }): RegErrors {
        return {
            firstName: validateName(vals.firstName, "First name"),
            lastName: validateName(vals.lastName, "Last name"),
            email: validateEmail(vals.email),
            phone: validatePhone(vals.phone),
            location: validateLocation(vals.location),
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
            phone: true,
            location: true,
            password: true,
            passwordConfirmation: true,
        });

        const fieldErrors = getAllErrors({ firstName, lastName, email, phone, location, password, passwordConfirmation });
        const hasErrors = Object.values(fieldErrors).some(Boolean);
        setErrors(fieldErrors as RegErrors);

        if (hasErrors) return;

        setIsSubmitting(true);
        try {
            const data = await ApiClient.register(firstName, lastName, email, phone, location, password, passwordConfirmation);
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
        <div className="registration-page d-flex align-items-center bg-light" style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <MDBContainer>
                <MDBCard className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <MDBRow className="g-0 min-vh-75">
                        
                        {/* Left Panel */}
                        <MDBCol md="5" className="bg-primary text-white d-flex flex-column justify-content-center p-5 position-relative overflow-hidden order-md-1 order-2">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))' }}></div>
                            
                            <div className="d-flex align-items-center mb-5 position-relative z-index-1 cursor-pointer" onClick={() => navigate('/landing')}>
                                <MDBIcon fas icon="city" size="2x" className="me-2" />
                                <span className="fw-bold fs-4">Nagorik-AI</span>
                            </div>

                            <div className="position-relative z-index-1 mb-5">
                                <MDBTypography tag="h2" className="display-6 fw-bold mb-3">
                                    Hello, Friend!
                                </MDBTypography>
                                <MDBTypography tag="p" className="fs-5 opacity-75">
                                    Enter your personal details and start your journey with us to improve our city together.
                                </MDBTypography>
                            </div>

                            <div className="position-relative z-index-1 mt-auto">
                                <MDBTypography tag="p" className="mb-2 opacity-75">Already have an account?</MDBTypography>
                                <MDBBtn outline color="light" size="lg" className="rounded-pill px-4" onClick={() => navigate('/login')}>
                                    SIGN IN
                                </MDBBtn>
                            </div>

                            {/* Decorative Shapes */}
                            <div className="position-absolute rounded-circle border border-white opacity-20" style={{ width: '150px', height: '150px', bottom: '-50px', left: '-50px' }}></div>
                            <div className="position-absolute rounded-circle border border-white opacity-20" style={{ width: '60px', height: '60px', top: '10%', right: '10%' }}></div>
                        </MDBCol>

                        {/* Right Panel (Form) */}
                        <MDBCol md="7" className="p-5 p-md-5 d-flex flex-column justify-content-center bg-white order-md-2 order-1 position-relative">
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
                                <MDBTypography tag="h2" className="fw-bold text-primary mb-3">
                                    Create Account
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
                                <span className="text-muted small text-uppercase">or use your email for registration</span>
                            </div>

                            <form onSubmit={onSubmit} noValidate className="w-100" style={{ maxWidth: '450px', margin: '0 auto' }}>
                                {/* First & Last Name */}
                                <MDBRow>
                                    <MDBCol sm="6" className="mb-3">
                                        <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.firstName ? (errors.firstName ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                            <MDBIcon fas icon="user" className="text-muted ms-2 me-2" />
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className="form-control border-0 bg-transparent shadow-none p-0"
                                                value={firstName}
                                                onChange={(e) => {
                                                    setFirstName(e.target.value);
                                                    if (touched.firstName) updateError("firstName", { firstName: e.target.value });
                                                }}
                                                onBlur={() => handleBlur("firstName")}
                                                maxLength={50}
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        {touched.firstName && errors.firstName && (
                                            <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.firstName}</span>
                                        )}
                                    </MDBCol>

                                    <MDBCol sm="6" className="mb-3">
                                        <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.lastName ? (errors.lastName ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                            <MDBIcon fas icon="user" className="text-muted ms-2 me-2" />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className="form-control border-0 bg-transparent shadow-none p-0"
                                                value={lastName}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                    if (touched.lastName) updateError("lastName", { lastName: e.target.value });
                                                }}
                                                onBlur={() => handleBlur("lastName")}
                                                maxLength={50}
                                                autoComplete="family-name"
                                            />
                                        </div>
                                        {touched.lastName && errors.lastName && (
                                            <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.lastName}</span>
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                {/* Email */}
                                <div className="mb-3">
                                    <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.email ? (errors.email ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                        <MDBIcon fas icon="envelope" className="text-muted ms-2 me-3" />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="form-control border-0 bg-transparent shadow-none p-0"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (touched.email) updateError("email", { email: e.target.value });
                                            }}
                                            onBlur={() => handleBlur("email")}
                                            maxLength={255}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {touched.email && errors.email && (
                                        <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.email}</span>
                                    )}
                                </div>

                                {/* Phone and Location */}
                                <MDBRow className="mb-3">
                                    <MDBCol sm="6" className="mb-3 mb-sm-0">
                                        <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.phone ? (errors.phone ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                            <MDBIcon fas icon="phone" className="text-muted ms-2 me-2" />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                className="form-control border-0 bg-transparent shadow-none p-0"
                                                value={phone}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);
                                                    if (touched.phone) updateError("phone", { phone: e.target.value });
                                                }}
                                                onBlur={() => handleBlur("phone")}
                                                maxLength={20}
                                                autoComplete="tel"
                                            />
                                        </div>
                                        {touched.phone && errors.phone && (
                                            <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.phone}</span>
                                        )}
                                    </MDBCol>

                                    <MDBCol sm="6">
                                        <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.location ? (errors.location ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                            <MDBIcon fas icon="map-marker-alt" className="text-muted ms-2 me-2" />
                                            <input
                                                type="text"
                                                placeholder="Location (e.g. Dhaka)"
                                                className="form-control border-0 bg-transparent shadow-none p-0"
                                                value={location}
                                                onChange={(e) => {
                                                    setLocation(e.target.value);
                                                    if (touched.location) updateError("location", { location: e.target.value });
                                                }}
                                                onBlur={() => handleBlur("location")}
                                                maxLength={255}
                                                autoComplete="address-level2"
                                            />
                                        </div>
                                        {touched.location && errors.location && (
                                            <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.location}</span>
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                {/* Password */}
                                <div className="mb-3">
                                    <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.password ? (errors.password ? 'border-danger bg-danger bg-opacity-10' : 'border-success bg-success bg-opacity-10') : 'border-light bg-light'}`}>
                                        <MDBIcon fas icon="lock" className="text-muted ms-2 me-3" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="form-control border-0 bg-transparent shadow-none p-0"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (touched.password) updateError("password", { password: e.target.value });
                                            }}
                                            onBlur={() => handleBlur("password")}
                                            autoComplete="new-password"
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
                                    
                                    {/* Real-time Checklist & Strength */}
                                    {(password || touched.password) && (
                                        <div className="mt-2 bg-light p-3 rounded-3 border border-light">
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                {passwordRequirements.map((req, idx) => (
                                                    <span key={idx} className={`badge rounded-pill ${req.met ? 'bg-success' : 'bg-secondary text-light opacity-50'}`}>
                                                        <MDBIcon fas icon={req.met ? "check" : "times"} className="me-1" />
                                                        {req.label}
                                                    </span>
                                                ))}
                                            </div>
                                            {password && (
                                                <div className="d-flex align-items-center mt-2">
                                                    <div className="d-flex gap-1 flex-grow-1 me-3">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <div 
                                                                key={i} 
                                                                className="flex-grow-1 rounded-pill" 
                                                                style={{ 
                                                                    height: '6px', 
                                                                    backgroundColor: i <= strength.level ? strength.color : "#e0e0e0",
                                                                    transition: 'background-color 0.3s ease'
                                                                }} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="small fw-bold" style={{ color: strength.color, width: '50px', textAlign: 'right' }}>
                                                        {strength.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-4">
                                    <div className={`border rounded-3 p-2 d-flex align-items-center ${touched.passwordConfirmation ? (errors.passwordConfirmation ? 'border-danger bg-danger bg-opacity-10' : (passwordConfirmation ? 'border-success bg-success bg-opacity-10' : 'border-light bg-light')) : 'border-light bg-light'}`}>
                                        <MDBIcon fas icon="check-circle" className="text-muted ms-2 me-3" />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="form-control border-0 bg-transparent shadow-none p-0"
                                            value={passwordConfirmation}
                                            onChange={(e) => {
                                                setPasswordConfirmation(e.target.value);
                                                if (touched.passwordConfirmation) updateError("passwordConfirmation", { passwordConfirmation: e.target.value });
                                            }}
                                            onBlur={() => handleBlur("passwordConfirmation")}
                                            autoComplete="new-password"
                                        />
                                        <MDBIcon 
                                            fas 
                                            icon={showConfirm ? "eye-slash" : "eye"} 
                                            className="text-muted mx-2 cursor-pointer" 
                                            onClick={() => setShowConfirm(!showConfirm)}
                                        />
                                    </div>
                                    {touched.passwordConfirmation && errors.passwordConfirmation && (
                                        <span className="text-danger small mt-1 d-block"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.passwordConfirmation}</span>
                                    )}
                                </div>

                                <MDBBtn block size="lg" className="rounded-pill pulse-animation mb-4 shadow-sm" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "CREATING ACCOUNT..." : "SIGN UP"}
                                </MDBBtn>
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