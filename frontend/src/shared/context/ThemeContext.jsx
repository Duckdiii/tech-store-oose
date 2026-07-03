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
    'Giỏ hàng': 'Giỏ hàng',
    'No products found matching your search criteria': 'Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn',
    'Invalid filter input. Please check your search criteria': 'Bộ lọc đầu vào không hợp lệ. Vui lòng kiểm tra lại tiêu chí tìm kiếm',
    'Unable to load products. Please try again later': 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau',
    'This product is currently out of stock.': 'Sản phẩm này hiện đã hết hàng.',
    'Invalid quantity. Please enter a valid quantity.': 'Số lượng không hợp lệ. Vui lòng nhập số lượng hợp lệ.',
    'Your cart is empty. Please add products before checkout.': 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.',
    'Some items in your cart are no longer available. Please remove or update them to continue.': 'Một số sản phẩm trong giỏ hàng không còn khả dụng. Vui lòng xóa hoặc cập nhật để tiếp tục.',
    'Unable to complete your order. Please try again later.': 'Không thể hoàn thành đơn hàng của bạn. Vui lòng thử lại sau.',
    'Unable to update inventory information. Please contact support or try again later.': 'Không thể cập nhật thông tin tồn kho. Vui lòng liên hệ bộ phận hỗ trợ hoặc thử lại sau.',
    'Payment failed. Please try again or choose another payment method.': 'Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
    'This bundle service is currently unavailable': 'Dịch vụ đính kèm này hiện tại không khả dụng.',
    'Unable to add bundle service. Please try again later.': 'Không thể thêm dịch vụ đính kèm. Vui lòng thử lại sau.',
    'Payment was cancelled. Please try again.': 'Giao dịch thanh toán đã bị hủy. Vui lòng thử lại.',
    'Payment service is currently unavailable. Please try again later.': 'Dịch vụ thanh toán hiện tại không khả dụng. Vui lòng thử lại sau.',
    'You have successfully subscribed to product updates.': 'Bạn đã đăng ký nhận thông báo cập nhật sản phẩm thành công.',
    'You have successfully unsubscribed from product updates.': 'Bạn đã hủy đăng ký nhận thông báo cập nhật sản phẩm thành công.',
    'This product is no longer available for subscription.': 'Sản phẩm này hiện không còn khả dụng để đăng ký thông báo.',
    'Unable to update subscription. Please try again later.': 'Không thể cập nhật đăng ký thông báo. Vui lòng thử lại sau.',
    'Your account has been restricted. You are unable to access membership benefits': 'Tài khoản của bạn đã bị hạn chế. Bạn không thể truy cập quyền lợi thành viên.',
    'Unable to load membership information. Please try again later': 'Không thể tải thông tin hạng thành viên. Vui lòng thử lại sau.',
    'Standard membership benefits': 'Quyền lợi thành viên tiêu chuẩn',
    'Standard customer benefits': 'Quyền lợi thành viên tiêu chuẩn',
    'Free shipping benefit': 'Ưu đãi miễn phí vận chuyển',
    'Account Restricted': 'Tài khoản bị hạn chế',
    'Congratulations! You are now BRONZE Tier!': 'Chúc mừng! Bạn đã được thăng hạng BRONZE!',
    'Congratulations! You are now SILVER Tier!': 'Chúc mừng! Bạn đã được thăng hạng SILVER!',
    'Congratulations! You are now GOLD Tier!': 'Chúc mừng! Bạn đã được thăng hạng GOLD!',
    'Congratulations! You are now DIAMOND Tier!': 'Chúc mừng! Bạn đã được thăng hạng DIAMOND!',
    'Product information already exists': 'Thông tin sản phẩm đã tồn tại',
    'Unable to import products. Please try again later': 'Không thể nhập hàng vào kho. Vui lòng thử lại sau.',
    'Unable to export products. Please try again later': 'Không thể xuất sản phẩm khỏi kho. Vui lòng thử lại sau.',
    'Insufficient product quantity in inventory': 'Số lượng sản phẩm trong kho không đủ.',
    'Products were exported, but the receipt could not be generated.': 'Sản phẩm đã được xuất kho, nhưng không thể tạo phiếu xuất.',
    'Inventory was updated, but notification status could not be displayed.': 'Kho hàng đã cập nhật, nhưng không thể hiển thị trạng thái thông báo.',
    'Export information was not found': 'Không tìm thấy thông tin xuất kho.',
    'Unable to generate receipt. Please try again later': 'Không thể tạo phiếu xuất kho. Vui lòng thử lại sau.',
    'Unable to retrieve inventory status': 'Không thể lấy trạng thái tồn kho.',
    'Unable to record inventory change status': 'Không thể ghi nhận trạng thái thay đổi tồn kho.',
    'Unable to load warehouse log data. Please try again later': 'Không thể tải dữ liệu nhật ký kho. Vui lòng thử lại sau.',
    'Invalid filter input. Please check the selected conditions': 'Điều kiện lọc không hợp lệ. Vui lòng kiểm tra lại.',
    'No warehouse log records were found matching the selected criteria': 'Không tìm thấy nhật ký kho nào phù hợp với điều kiện đã chọn.'
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
    'Giỏ hàng': 'Cart',
    'No products found matching your search criteria': 'No products found matching your search criteria',
    'Invalid filter input. Please check your search criteria': 'Invalid filter input. Please check your search criteria',
    'Unable to load products. Please try again later': 'Unable to load products. Please try again later',
    'This product is currently out of stock.': 'This product is currently out of stock.',
    'Invalid quantity. Please enter a valid quantity.': 'Invalid quantity. Please enter a valid quantity.',
    'Your cart is empty. Please add products before checkout.': 'Your cart is empty. Please add products before checkout.',
    'Some items in your cart are no longer available. Please remove or update them to continue.': 'Some items in your cart are no longer available. Please remove or update them to continue.',
    'Unable to complete your order. Please try again later.': 'Unable to complete your order. Please try again later.',
    'Unable to update inventory information. Please contact support or try again later.': 'Unable to update inventory information. Please contact support or try again later.',
    'Payment failed. Please try again or choose another payment method.': 'Payment failed. Please try again or choose another payment method.',
    'This bundle service is currently unavailable': 'This bundle service is currently unavailable',
    'Unable to add bundle service. Please try again later.': 'Unable to add bundle service. Please try again later.',
    'Payment was cancelled. Please try again.': 'Payment was cancelled. Please try again.',
    'Payment service is currently unavailable. Please try again later.': 'Payment service is currently unavailable. Please try again later.',
    'You have successfully subscribed to product updates.': 'You have successfully subscribed to product updates.',
    'You have successfully unsubscribed from product updates.': 'You have successfully unsubscribed from product updates.',
    'This product is no longer available for subscription.': 'This product is no longer available for subscription.',
    'Unable to update subscription. Please try again later.': 'Unable to update subscription. Please try again later.',
    'Your account has been restricted. You are unable to access membership benefits': 'Your account has been restricted. You are unable to access membership benefits',
    'Unable to load membership information. Please try again later': 'Unable to load membership information. Please try again later',
    'Standard membership benefits': 'Standard membership benefits',
    'Standard customer benefits': 'Standard customer benefits',
    'Free shipping benefit': 'Free shipping benefit',
    'Account Restricted': 'Account Restricted',
    'Congratulations! You are now BRONZE Tier!': 'Congratulations! You are now BRONZE Tier!',
    'Congratulations! You are now SILVER Tier!': 'Congratulations! You are now SILVER Tier!',
    'Congratulations! You are now GOLD Tier!': 'Congratulations! You are now GOLD Tier!',
    'Congratulations! You are now DIAMOND Tier!': 'Congratulations! You are now DIAMOND Tier!',
    'Product information already exists': 'Product information already exists',
    'Unable to import products. Please try again later': 'Unable to import products. Please try again later',
    'Unable to export products. Please try again later': 'Unable to export products. Please try again later',
    'Insufficient product quantity in inventory': 'Insufficient product quantity in inventory',
    'Products were exported, but the receipt could not be generated.': 'Products were exported, but the receipt could not be generated.',
    'Inventory was updated, but notification status could not be displayed.': 'Inventory was updated, but notification status could not be displayed.',
    'Export information was not found': 'Export information was not found',
    'Unable to generate receipt. Please try again later': 'Unable to generate receipt. Please try again later',
    'Unable to retrieve inventory status': 'Unable to retrieve inventory status',
    'Unable to record inventory change status': 'Unable to record inventory change status',
    'Unable to load warehouse log data. Please try again later': 'Unable to load warehouse log data. Please try again later',
    'Invalid filter input. Please check the selected conditions': 'Invalid filter input. Please check the selected conditions',
    'No warehouse log records were found matching the selected criteria': 'No warehouse log records were found matching the selected criteria'
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
