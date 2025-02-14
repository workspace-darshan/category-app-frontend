import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useApi } from '../context/AuthContext';

const Register = () => {
    const { register } = useApi()

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Register Data:', values);
            register(values.name, values.email, values.password)
        },
    });

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '20px', textAlign: 'center' }}>
            <h2>Register</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div style={{ color: 'red' }}>{formik.errors.name}</div>
                    )}
                </div>

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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div style={{ color: 'red' }}>{formik.errors.confirmPassword}</div>
                    )}
                </div>

                <div>
                    Already have an account?
                    <Link to="/auth/login" style={{ marginLeft: '5px', color: 'blue', textDecoration: 'underline' }}>
                        Login
                    </Link>
                </div>


                <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;
