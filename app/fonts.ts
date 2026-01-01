import localFont from 'next/font/local';

// Axiforma font for body text
export const axiforma = localFont({
    src: [
        {
            path: '../public/fonts/Kastelov - Axiforma Thin.otf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Thin Italic.otf',
            weight: '100',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Light Italic.otf',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Italic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Book.otf',
            weight: '450',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Book Italic.otf',
            weight: '450',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Medium Italic.otf',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma SemiBold.otf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma SemiBold Italic.otf',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Bold Italic.otf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma ExtraBold.otf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma ExtraBold Italic.otf',
            weight: '800',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Heavy.otf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Heavy Italic.otf',
            weight: '900',
            style: 'italic',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Black.otf',
            weight: '950',
            style: 'normal',
        },
        {
            path: '../public/fonts/Kastelov - Axiforma Black Italic.otf',
            weight: '950',
            style: 'italic',
        },
    ],
    variable: '--font-axiforma',
    display: 'swap',
});

// Clash Display font for headings
export const clashDisplay = localFont({
    src: [
        {
            path: '../public/fonts/ClashDisplay-Extralight.otf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../public/fonts/ClashDisplay-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/ClashDisplay-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/ClashDisplay-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/ClashDisplay-Semibold.otf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/ClashDisplay-Bold.otf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-clash-display',
    display: 'swap',
});

// Gochi Hand font for decorative/handwriting
export const gochiHand = localFont({
    src: '../public/fonts/GochiHand-Regular.ttf',
    variable: '--font-gochi-hand',
    weight: '400',
    display: 'swap',
});
