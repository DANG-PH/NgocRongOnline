import './globals.css'
import ReduxProvider from "./Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}