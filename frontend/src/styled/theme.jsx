// theme.js
const commonStyles = {
    fontSizes: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
    },
    spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '1.5rem',
        xlarge: '2rem',
    },
    borderRadius: '0.5rem',
    transition: '0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
}

export const lightTheme = {
    ...commonStyles,
    colors: {
        primary: '#1B5E20', // dark green
        secondary: '#2979FF', // blue
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#333333',
        border: '#E0E0E0',
        accent: '#FFB74D', // accent for highlights
        error: '#D32F2F',
        card: "#fff",
        kakaoBackground: '#FEE500',
        kakaoFont: '#000000',
        googleBackground: '#4285F4',
        googleFont: '#FFFFFF',
    },
}

export const darkTheme = {
    ...commonStyles,
    colors: {
        primary: '#76FF03',
        secondary: '#00E5FF',
        background: '#121212',
        surface: '#1E1E1E',
        text: '#E0E0E0',
        border: '#333333',
        accent: '#FF4081',
        error: '#FF5252',
        card: '#2a2a2a',
        kakaoBackground: '#FEE500',
        kakaoFont: '#000000',
        googleBackground: '#4285F4',
        googleFont: '#FFFFFF',
    },
}
