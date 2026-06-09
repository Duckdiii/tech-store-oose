import { Link, Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          Tech Store
        </Link>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
