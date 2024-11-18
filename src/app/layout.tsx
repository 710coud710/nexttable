// src/app/layout.tsx
import '../styles/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header style={headerStyle}>
          
          <nav>
            {/* <a href="/">Home</a> | <a href="/about">About</a> | <a href="/dashboard">Dashboard</a> */}
            <h3>web</h3>
          </nav>
        </header>
        <main >{children}</main>
        <footer>
          <p>© 2024 My Website</p>
        </footer>
      </body>
    </html>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '1px',
  backgroundColor: '#ffff',
  color: 'black',
  textAlign: 'center',
};

