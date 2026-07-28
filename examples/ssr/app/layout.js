export const metadata = {
  title: 'ReactSVG SSR Example',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
