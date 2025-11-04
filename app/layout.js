import { Inter } from 'next/font/google'
import './globals.css'
import { ClientWrapper } from '@/components/Common/ClientWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aarti Sangrah - Admin Panel',
  description: 'Admin panel for managing spiritual content',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}