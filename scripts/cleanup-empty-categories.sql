-- Xóa các danh mục KHÔNG phải "Điện thoại" (Máy tính bảng, Phụ kiện, Laptop).
-- Chạy SAU KHI đã dọn hết sản phẩm ngoài "Điện thoại" (xem scripts/cleanup-non-phone-products.sql) —
-- script này chỉ xóa category nếu nó không còn sản phẩm nào tham chiếu tới, để tránh vi phạm
-- ràng buộc khóa ngoại products.category_id -> categories.id.
--
-- Cách chạy: psql -f scripts/cleanup-empty-categories.sql <connection-string>
-- Nên chạy trên bản sao/staging trước khi chạy trên production.

BEGIN;

-- 0. Xem trước danh mục sẽ bị xóa và số sản phẩm còn lại của từng danh mục
SELECT c.name AS category, count(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.name <> 'Điện thoại'
GROUP BY c.name
ORDER BY c.name;

-- 1. Xóa các danh mục ngoài "Điện thoại" đã hết sản phẩm
DELETE FROM categories c
WHERE c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.category_id = c.id);

COMMIT;
