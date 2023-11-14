// AppLayout.js
import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

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
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            {/* Page Heading */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Page Content */}
            <main>{children}</main>

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
        </div>
    )
}

export default AppLayout
