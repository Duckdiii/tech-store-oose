import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="hero">
      <p className="eyebrow">404</p>
      <h1>Không tìm thấy trang</h1>
      <Link to="/">Về trang chủ</Link>
    </section>
  );
}
