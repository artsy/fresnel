import RootHead from "../components/RootHead"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <RootHead />
      <body>{children}</body>
    </html>
  )
}
