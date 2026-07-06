-- Xóa các sản phẩm KHÔNG thuộc danh mục "Điện thoại" (Máy tính bảng, Phụ kiện, Laptop, ...).
-- Cùng logic bảo toàn dữ liệu như scripts/cleanup-1-dong-variants.sql:
-- Biến thể (product_variants) đã từng nằm trong đơn hàng thật (order_items) sẽ được GIỮ LẠI
-- để không làm hỏng lịch sử đơn hàng/hóa đơn của khách -> sản phẩm cha của biến thể đó cũng
-- sẽ được giữ lại (không xóa sản phẩm còn biến thể).
--
-- Cách chạy: psql -f scripts/cleanup-non-phone-products.sql <connection-string>
-- Nên chạy trên bản sao/staging trước khi chạy trên production.

BEGIN;

-- 0. Xem trước danh sách sản phẩm ngoài "Điện thoại" sẽ bị ảnh hưởng
SELECT p.id, p.name AS product_name, c.name AS category_name
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE c.name <> 'Điện thoại'
ORDER BY c.name, p.name;

-- 0b. Cảnh báo: biến thể của các sản phẩm trên nhưng đã có trong đơn hàng thật -> sẽ KHÔNG bị xóa
--     (kéo theo sản phẩm cha cũng được giữ lại)
SELECT p.id AS product_id, p.name AS product_name, pv.id AS variant_id, oi.order_id
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
JOIN order_items oi ON oi.product_variant_id = pv.id
WHERE c.name <> 'Điện thoại';

-- 1. Gỡ liên kết dịch vụ kèm theo (bundle service) của các cart item sắp bị xóa
DELETE FROM cart_item_bundle_services cibs
USING cart_items ci
JOIN product_variants pv ON pv.id = ci.product_variant_id
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE cibs.cart_item_id = ci.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 2. Xóa các bản ghi tham chiếu tới biến thể sắp bị xóa (trừ order_items - đơn hàng thật)
DELETE FROM cart_items ci
USING product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE ci.product_variant_id = pv.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 2b. Gỡ tham chiếu thông báo tới các đăng ký theo dõi (favorite/notification subscription) sắp bị xóa
UPDATE notifications n
SET favorite_product_id = NULL
FROM favorite_products fp
JOIN product_variants pv ON pv.id = fp.product_variant_id
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE n.favorite_product_id = fp.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM favorite_products fp
USING product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE fp.product_variant_id = pv.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM import_log_items ili
USING product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE ili.product_variant_id = pv.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM export_log_items eli
USING product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE eli.product_variant_id = pv.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM purchase_order_items poi
USING product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN categories c ON c.id = p.category_id
WHERE poi.product_variant_id = pv.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 3. Xóa các product_variant thuộc sản phẩm ngoài "Điện thoại"
--    (chỉ những biến thể chưa từng nằm trong đơn hàng thật)
DELETE FROM product_variants pv
USING products p
JOIN categories c ON c.id = p.category_id
WHERE pv.product_id = p.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 4. Xóa ảnh và liên kết khuyến mãi của các sản phẩm sẽ bị xóa hẳn ở bước 5
--    (chỉ những sản phẩm không còn biến thể nào sau bước 3, tức không có lịch sử đơn hàng thật)
DELETE FROM product_images pi
USING products p
JOIN categories c ON c.id = p.category_id
WHERE pi.product_id = p.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

DELETE FROM product_promotions pp
USING products p
JOIN categories c ON c.id = p.category_id
WHERE pp.product_id = p.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

-- 5. Xóa chính các sản phẩm ngoài "Điện thoại" đã sạch biến thể
--    (sản phẩm còn biến thể do có lịch sử đơn hàng thật sẽ tự động được giữ lại)
DELETE FROM products p
USING categories c
WHERE p.category_id = c.id
  AND c.name <> 'Điện thoại'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

COMMIT;
