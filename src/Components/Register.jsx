import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

const Register = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "password") {
            checkPasswordStrength(value);
        }

        setError("");
    };

    const checkPasswordStrength = (password) => {
        if (password.length === 0) {
            setPasswordStrength("");
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength <= 1) setPasswordStrength("weak");
        else if (strength === 2) setPasswordStrength("medium");
        else if (strength === 3) setPasswordStrength("good");
        else setPasswordStrength("strong");
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError("Username is required");
            return false;
        }

        if (formData.username.length < 3) {
            setError("Username must be at least 3 characters");
            return false;
        }

        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (!formData.password) {
            setError("Password is required");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/api/store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess(true);
            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
            setPasswordStrength("");

            setTimeout(() => {
                if (onRegisterSuccess) {
                    onRegisterSuccess();
                }
            }, 2000);

        } catch (error) {
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case "weak": return "#dc3545";
            case "medium": return "#ffc107";
            case "good": return "#17a2b8";
            case "strong": return "#28a745";
            default: return "#e0e0e0";
        }
    };

    const getStrengthWidth = () => {
        switch (passwordStrength) {
            case "weak": return "25%";
            case "medium": return "50%";
            case "good": return "75%";
            case "strong": return "100%";
            default: return "0%";
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logo}>👤</div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>
                        {isMobile ? "Employee System" : "Employee Management System"}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div style={styles.successMessage}>
                        <span style={styles.messageIcon}>✅</span>
                        <div style={styles.messageContent}>
                            <strong style={styles.messageTitle}>Registration Successful!</strong>
                            <p style={styles.messageText}>
                                Your account has been created. {!isMobile && "You can now log in."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={styles.errorMessage}>
                        <span style={styles.messageIcon}>⚠️</span>
                        <span style={styles.errorText}>{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Username */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Username <span style={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            style={styles.input}
                            autoComplete="username"
                        />
                        <small style={styles.hint}>At least 3 characters</small>
                    </div>

                    {/* Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Email Address <span style={styles.required}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            style={styles.input}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Password <span style={styles.required}>*</span>
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                style={{...styles.input, paddingRight: "50px"}}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                                tabIndex={-1}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div style={styles.strengthContainer}>
                                <div style={styles.strengthBar}>
                                    <div style={{
                                        ...styles.strengthFill,
                                        width: getStrengthWidth(),
                                        background: getStrengthColor()
                                    }} />
                                </div>
                                <small style={{ ...styles.hint, color: getStrengthColor(), fontWeight: "600" }}>
                                    {isMobile ? passwordStrength : `Password strength: ${passwordStrength}`}
                                </small>
                            </div>
                        )}
                        <small style={styles.hint}>At least 6 characters</small>
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Confirm Password <span style={styles.required}>*</span>
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                style={{...styles.input, paddingRight: "50px"}}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <small style={{ ...styles.hint, color: "#dc3545", fontWeight: "600" }}>
                                ✗ Passwords do not match
                            </small>
                        )}
                        {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                            <small style={{ ...styles.hint, color: "#28a745", fontWeight: "600" }}>
                                ✓ Passwords match
                            </small>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || success}
                        style={{
                            ...styles.submitButton,
                            background: loading || success ? "#95a5a6" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            cursor: loading || success ? "not-allowed" : "pointer"
                        }}
                        onMouseOver={(e) => {
                            if (!loading && !success) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                        }}
                    >
                        {loading ? "Creating..." : success ? "Created ✓" : isMobile ? "Register" : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{" "}
                        <a href="/login" style={styles.link}>
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Additional Info */}
                {!isMobile && (
                    <div style={styles.infoBox}>
                        <small style={styles.infoText}>
                            By registering, you agree to our Terms of Service and Privacy Policy
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "clamp(15px, 3vw, 20px)"
    },
    container: {
        background: "white",
        padding: "clamp(25px, 5vw, 50px)",
        borderRadius: "clamp(15px, 3vw, 20px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        maxWidth: "500px",
        width: "100%",
        margin: "0 auto"
    },
    header: {
        textAlign: "center",
        marginBottom: "clamp(20px, 4vw, 35px)"
    },
    logo: {
        fontSize: "clamp(36px, 7vw, 48px)",
        marginBottom: "clamp(8px, 2vw, 10px)"
    },
    title: {
        margin: 0,
        fontSize: "clamp(24px, 5vw, 32px)",
        color: "#2c3e50",
        fontWeight: "600",
        lineHeight: 1.2
    },
    subtitle: {
        margin: "clamp(8px, 2vw, 10px) 0 0",
        color: "#7f8c8d",
        fontSize: "clamp(12px, 2.5vw, 16px)"
    },
    successMessage: {
        background: "#d4edda",
        color: "#155724",
        padding: "clamp(12px, 2.5vw, 15px)",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "clamp(12px, 2.5vw, 14px)",
        border: "1px solid #c3e6cb",
        display: "flex",
        alignItems: "flex-start",
        gap: "clamp(8px, 2vw, 10px)"
    },
    errorMessage: {
        background: "#fee",
        color: "#c33",
        padding: "clamp(12px, 2.5vw, 15px)",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "clamp(12px, 2.5vw, 14px)",
        border: "1px solid #fcc",
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 2vw, 10px)"
    },
    messageIcon: {
        fontSize: "clamp(18px, 4vw, 20px)",
        flexShrink: 0
    },
    messageContent: {
        flex: 1
    },
    messageTitle: {
        display: "block",
        marginBottom: "5px",
        fontSize: "clamp(13px, 2.5vw, 14px)"
    },
    messageText: {
        margin: "5px 0 0",
        fontSize: "clamp(12px, 2vw, 14px)",
        lineHeight: 1.4
    },
    errorText: {
        flex: 1,
        fontSize: "clamp(12px, 2.5vw, 14px)"
    },
    form: {
        width: "100%"
    },
    inputGroup: {
        marginBottom: "clamp(16px, 3vw, 20px)"
    },
    label: {
        display: "block",
        marginBottom: "clamp(6px, 1.5vw, 8px)",
        color: "#2c3e50",
        fontSize: "clamp(12px, 2.5vw, 14px)",
        fontWeight: "600"
    },
    required: {
        color: "#dc3545"
    },
    input: {
        width: "100%",
        padding: "clamp(10px, 2.5vw, 15px)",
        fontSize: "clamp(14px, 2.5vw, 16px)",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        outline: "none",
        transition: "border 0.3s",
        boxSizing: "border-box",
        fontFamily: "inherit"
    },
    passwordWrapper: {
        position: "relative",
        width: "100%"
    },
    eyeButton: {
        position: "absolute",
        right: "clamp(10px, 2vw, 15px)",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "clamp(16px, 3vw, 18px)",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    hint: {
        display: "block",
        marginTop: "clamp(4px, 1vw, 5px)",
        fontSize: "clamp(10px, 2vw, 12px)",
        color: "#6c757d",
        lineHeight: 1.3
    },
    strengthContainer: {
        marginTop: "clamp(6px, 1.5vw, 8px)"
    },
    strengthBar: {
        width: "100%",
        height: "clamp(4px, 1vw, 6px)",
        background: "#e0e0e0",
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "clamp(4px, 1vw, 5px)"
    },
    strengthFill: {
        height: "100%",
        transition: "all 0.3s ease",
        borderRadius: "3px"
    },
    submitButton: {
        width: "100%",
        padding: "clamp(12px, 2.5vw, 15px)",
        fontSize: "clamp(15px, 3vw, 18px)",
        fontWeight: "600",
        color: "white",
        border: "none",
        borderRadius: "8px",
        transition: "all 0.3s",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
        marginTop: "clamp(8px, 2vw, 10px)"
    },
    footer: {
        marginTop: "clamp(18px, 3vw, 25px)",
        textAlign: "center",
        fontSize: "clamp(12px, 2.5vw, 14px)"
    },
    footerText: {
        margin: 0,
        color: "#7f8c8d",
        lineHeight: 1.5
    },
    link: {
        color: "#667eea",
        textDecoration: "none",
        fontWeight: "600",
        borderBottom: "1px solid transparent",
        transition: "border-color 0.3s"
    },
    infoBox: {
        marginTop: "clamp(12px, 2.5vw, 15px)",
        padding: "clamp(8px, 2vw, 10px)",
        background: "#f8f9fa",
        borderRadius: "8px",
        textAlign: "center"
    },
    infoText: {
        color: "#6c757d",
        fontSize: "clamp(10px, 2vw, 12px)",
        lineHeight: 1.4
    }
};

// Add media query for input focus states
const inputFocusStyle = `
    input:focus {
        border-color: #667eea !important;
    }
    
    @media (max-width: 768px) {
        input {
            font-size: 16px !important; /* Prevents zoom on iOS */
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = inputFocusStyle;
    document.head.appendChild(styleSheet);
}

export default Register;