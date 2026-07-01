import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const translations = {
  vi: {
    'Trang chủ': 'Trang chủ',
    'Điện thoại': 'Điện thoại',
    'Ngôn ngữ': 'Ngôn ngữ',
    'Hệ thống': 'Hệ thống',
    'Giao diện': 'Giao diện',
    'Sáng': 'Sáng',
    'Tối': 'Tối',
    'Đăng xuất': 'Đăng xuất',
    'Đăng nhập': 'Đăng nhập',
    'Trang quản lý': 'Trang quản lý',
    'Hồ sơ': 'Hồ sơ',
    'Đơn hàng': 'Đơn hàng',
    'Thông báo': 'Thông báo',
    'Danh sách yêu thích': 'Danh sách yêu thích',
    'Không có thông báo mới': 'Không có thông báo mới',
    'Đánh dấu đã đọc': 'Đánh dấu đã đọc',
    'Tìm kiếm sản phẩm...': 'Tìm kiếm sản phẩm...',
    'Đăng ký': 'Đăng ký',
    'Theo dõi đơn hàng': 'Theo dõi đơn hàng',
    'Hệ thống cửa hàng': 'Hệ thống cửa hàng',
    'Tuyển dụng': 'Tuyển dụng',
    'Điện thoại chính hãng': 'Điện thoại chính hãng',
    'Đang tải...': 'Đang tải...',
    'Chưa có sản phẩm nào yêu thích': 'Chưa có sản phẩm nào yêu thích',
    'Đang theo dõi thông báo': 'Đang theo dõi thông báo',
    'Không có thông báo nào.': 'Không có thông báo nào.',
    'Đọc': 'Đọc',
    'Đã thích': 'Đã thích',
    'Bạn có {count} thông báo chưa đọc': 'Bạn có {count} thông báo chưa đọc',
    'Miễn phí vận chuyển đơn từ': 'Miễn phí vận chuyển đơn từ',
    'Áp dụng toàn quốc': 'Áp dụng toàn quốc',
    'Hotline': 'Hotline',
    'hằng ngày': 'hằng ngày',
    'Thêm sản phẩm': 'Thêm sản phẩm',
    'Giỏ hàng': 'Giỏ hàng'
  },
  en: {
    'Trang chủ': 'Home',
    'Điện thoại': 'Phones',
    'Ngôn ngữ': 'Language',
    'Hệ thống': 'System',
    'Giao diện': 'Theme',
    'Sáng': 'Light',
    'Tối': 'Dark',
    'Đăng xuất': 'Sign Out',
    'Đăng nhập': 'Sign In',
    'Trang quản lý': 'Manager Portal',
    'Hồ sơ': 'Profile',
    'Đơn hàng': 'Orders',
    'Thông báo': 'Notifications',
    'Danh sách yêu thích': 'Favorites',
    'Không có thông báo mới': 'No new notifications',
    'Đánh dấu đã đọc': 'Mark read',
    'Tìm kiếm sản phẩm...': 'Search products...',
    'Đăng ký': 'Sign Up',
    'Theo dõi đơn hàng': 'Track Orders',
    'Hệ thống cửa hàng': 'Store Finder',
    'Tuyển dụng': 'Careers',
    'Điện thoại chính hãng': 'Official Mobile Store',
    'Đang tải...': 'Loading...',
    'Chưa có sản phẩm nào yêu thích': 'No favorite products yet',
    'Đang theo dõi thông báo': 'Subscribed to notifications',
    'Không có thông báo nào.': 'No notifications.',
    'Đọc': 'Read',
    'Đã thích': 'Liked',
    'Bạn có {count} thông báo chưa đọc': 'You have {count} unread notifications',
    'Miễn phí vận chuyển đơn từ': 'Free shipping from',
    'Áp dụng toàn quốc': 'Nationwide delivery',
    'Hotline': 'Hotline',
    'hằng ngày': 'daily',
    'Thêm sản phẩm': 'Add to Cart',
    'Giỏ hàng': 'Cart'
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ts_theme') || 'light');
  const [lang,  setLang]  = useState(() => localStorage.getItem('ts_lang')  || 'vi');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ts_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ts_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['vi']?.[key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, lang, setLang, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
