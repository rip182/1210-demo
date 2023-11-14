// Home.js
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    const theme = {
        loginButton: {
            backgroundColor: '#4caf50',
            color: '#fff',
            hoverBackgroundColor: '#45a049',
            tiltDegree: '3deg',
        },
        registerButton: {
            backgroundColor: '#3498db',
            color: '#fff',
            hoverBackgroundColor: '#2980b9',
            tiltDegree: '3deg',
        },
    }

    return (
        <>
            <Head>
                <title>Laravel</title>
            </Head>

            <style jsx>{`
                .login-btn,
                .register-btn {
                    display: inline-block;
                    padding: 10px 20px;
                    border-radius: 5px;
                    transition: background-color 0.3s ease-in-out,
                        transform 0.3s ease-in-out;
                }

                .login-btn {
                    background-color: ${theme.loginButton.backgroundColor};
                    color: ${theme.loginButton.color};
                }

                .register-btn {
                    background-color: ${theme.registerButton.backgroundColor};
                    color: ${theme.registerButton.color};
                }

                .login-btn:hover,
                .register-btn:hover {
                    background-color: ${theme.loginButton.hoverBackgroundColor};
                    transform: rotate(${theme.loginButton.tiltDegree});
                }

                .register-btn:hover {
                    background-color: ${theme.registerButton
                    .hoverBackgroundColor};
                    transform: rotate(${theme.registerButton.tiltDegree});
                }

                .login-btn:active,
                .register-btn:active {
                    transform: scale(0.95);
                }
            `}</style>

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-extrabold mb-4">
                        Welcome to Awesome App
                    </h1>

                    {user ? (
                        <Link href="/dashboard">
                            <a className="btn-primary">Go to Dashboard</a>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <span className="login-btn">Login</span>
                            </Link>

                            <Link href="/register">
                                <span className="ml-4 register-btn">
                                    Register
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
