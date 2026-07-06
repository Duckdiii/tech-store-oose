-- Xóa các product_variants có giá = 1đ (dữ liệu test/rác tạo khi thao tác thử nhập/xuất kho).
-- Các variant đã từng nằm trong đơn hàng thật (order_items) sẽ được GIỮ LẠI để không làm hỏng
-- lịch sử đơn hàng/hóa đơn của khách.
--
-- Cách chạy: psql -f scripts/cleanup-1-dong-variants.sql <connection-string>
-- Nên chạy trên bản sao/staging trước khi chạy trên production.

BEGIN;

-- 0. Xem trước danh sách sẽ bị xóa
SELECT pv.id, p.name AS product_name, pv.ram_gb, pv.storage_gb, pv.color, pv.price, pv.status
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
WHERE pv.price = 1
ORDER BY p.name;

-- 0b. Cảnh báo: variant giá 1đ nhưng đã có trong đơn hàng thật -> sẽ KHÔNG bị xóa
SELECT pv.id, oi.order_id
FROM product_variants pv
JOIN order_items oi ON oi.product_variant_id = pv.id
WHERE pv.price = 1;

-- 1. Xóa liên kết dịch vụ kèm theo (bundle service) của các cart item sắp bị xóa
DELETE FROM cart_item_bundle_services cibs
USING cart_items ci
JOIN product_variants pv ON pv.id = ci.product_variant_id
WHERE cibs.cart_item_id = ci.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 2. Xóa các bản ghi tham chiếu tới variant giá 1đ (trừ order_items - đơn hàng thật)
DELETE FROM cart_items ci
USING product_variants pv
WHERE ci.product_variant_id = pv.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM favorite_products fp
USING product_variants pv
WHERE fp.product_variant_id = pv.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM import_log_items ili
USING product_variants pv
WHERE ili.product_variant_id = pv.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM export_log_items eli
USING product_variants pv
WHERE eli.product_variant_id = pv.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

DELETE FROM purchase_order_items poi
USING product_variants pv
WHERE poi.product_variant_id = pv.id
  AND pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

-- 3. Xóa chính các product_variant giá 1đ (chỉ những cái chưa từng nằm trong đơn hàng thật)
DELETE FROM product_variants pv
WHERE pv.price = 1
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_variant_id = pv.id);

COMMIT;
