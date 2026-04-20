var config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                primary: "rgb(var(--primary) / <alpha-value>)",
                "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
                border: "rgb(var(--border) / <alpha-value>)",
                "input-background": "rgb(var(--input-background) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",
                "surface-foreground": "rgb(var(--surface-foreground) / <alpha-value>)",
                destructive: "rgb(var(--destructive) / <alpha-value>)",
                "destructive-foreground": "rgb(var(--destructive-foreground) / <alpha-value>)",
            },
        },
    },
    plugins: [],
};
export default config;
