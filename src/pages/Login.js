import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { useApi } from '../context/AuthContext';

const Login = () => {
    const { login } = useApi()
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value); // Store reCAPTCHA value
        formik.setFieldValue('captchaValue', value);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            captchaValue: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
            captchaValue: Yup.string().test(
                'captcha',
                'Please complete the CAPTCHA',
                (value) => value && value.length > 0
            ).required('CAPTCHA is required'),
        }),
        onSubmit: (values) => {
            if (!captchaValue) {
                alert('Please complete the CAPTCHA');
                return;
            }
            login(values.email, values.password);
        },
    });

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '20px', textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{ color: 'red' }}>{formik.errors.email}</div>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: 'red' }}>{formik.errors.password}</div>
                    )}
                </div>

                <div>
                    <ReCAPTCHA
                        sitekey={"6LeUW9YqAAAAAK5quQ_72oWcMGJi4RXnbROANTvv"}
                        onChange={handleCaptchaChange}
                    />
                    {formik.touched.captchaValue && formik.errors.captchaValue ? (
                        <div style={{ color: 'red' }}>{formik.errors.captchaValue}</div>
                    ) : null}
                </div>

                <div>
                    Don't have an account?
                    <Link to="/auth/register" style={{ marginLeft: '5px', color: 'blue', textDecoration: 'underline' }}>
                        Register
                    </Link>
                </div>

                <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
