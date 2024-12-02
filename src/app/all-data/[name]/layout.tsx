export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div className="container-fluid">{children}</div>;
  }