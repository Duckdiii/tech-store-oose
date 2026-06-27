package com.oose.tech_store.config;

import com.oose.tech_store.entity.*;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.entity.enums.MembershipTier;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipBenefitRepository membershipBenefitRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final ManagerRepository managerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (brandRepository.count() > 0) {
            log.info("Database already seeded. Skipping seeder.");
            return;
        }

        log.info("Starting database seeding for Supabase...");

        // 1. Seed Memberships and benefits
        log.info("Seeding Memberships and benefits...");
        MembershipBenefit standardBenefit = membershipBenefitRepository.save(new MembershipBenefit(0.0, false, "Standard customer benefits"));
        MembershipBenefit bronzeBenefit = membershipBenefitRepository.save(new MembershipBenefit(1.0, false, "Bronze tier: 1% discount on all orders"));
        MembershipBenefit silverBenefit = membershipBenefitRepository.save(new MembershipBenefit(2.0, false, "Silver tier: 2% discount on all orders"));
        MembershipBenefit goldBenefit = membershipBenefitRepository.save(new MembershipBenefit(5.0, true, "Gold tier: 5% discount and Free Shipping"));
        MembershipBenefit diamondBenefit = membershipBenefitRepository.save(new MembershipBenefit(10.0, true, "Diamond tier: 10% discount and Free Shipping"));

        Membership standardMembership = membershipRepository.save(new Membership(MembershipTier.STANDARD, standardBenefit, BigDecimal.ZERO, BigDecimal.valueOf(5000000)));
        Membership bronzeMembership = membershipRepository.save(new Membership(MembershipTier.BRONZE, bronzeBenefit, BigDecimal.valueOf(5000000), BigDecimal.valueOf(15000000)));
        Membership silverMembership = membershipRepository.save(new Membership(MembershipTier.SILVER, silverBenefit, BigDecimal.valueOf(15000000), BigDecimal.valueOf(50000000)));
        Membership goldMembership = membershipRepository.save(new Membership(MembershipTier.GOLD, goldBenefit, BigDecimal.valueOf(50000000), BigDecimal.valueOf(100000000)));
        Membership diamondMembership = membershipRepository.save(new Membership(MembershipTier.DIAMOND, diamondBenefit, BigDecimal.valueOf(100000000), null));

        // 2. Seed Payment Methods
        log.info("Seeding Payment Methods...");
        paymentMethodRepository.save(new CODPaymentMethod("COD", "Thanh toán khi nhận hàng", BigDecimal.valueOf(20000000), BigDecimal.ZERO));
        paymentMethodRepository.save(new MomoPaymentMethod("Ví MoMo", "Thanh toán qua ví điện tử MoMo", "MOMOBKUN20180529", "MOMO", "https://test-payment.momo.vn/v2/gateway/api/create", "http://localhost:8080/api/payments/momo/return", "https://your-ngrok-url.ngrok-free.app/api/payments/momo/ipn"));
        paymentMethodRepository.save(new VNPayPaymentMethod("VNPAY", "Thanh toán qua cổng VNPAY", "X25J2OJ1", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", "https://4c47-2001-ee0-4f87-31e0-f16e-4a3c-ca2a-c9fe.ngrok-free.app/api/payments/vnpay/return", "GC6Z9RTBCZ9QU0KKIRTC9XASLWHQZZNY"));

        // 3. Seed Brands
        log.info("Seeding Brands...");
        Brand apple = brandRepository.save(new Brand("Apple", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", "Apple Inc. - Cung cấp iPhone, iPad, Mac và các thiết bị phần cứng cao cấp."));
        Brand samsung = brandRepository.save(new Brand("Samsung", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", "Samsung Electronics - Tập đoàn công nghệ hàng đầu thế giới về điện thoại thông minh Galaxy."));
        Brand xiaomi = brandRepository.save(new Brand("Xiaomi", "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg", "Xiaomi - Thương hiệu điện thoại thông minh cấu hình cao giá tốt hàng đầu Trung Quốc."));
        Brand oppo = brandRepository.save(new Brand("OPPO", "https://upload.wikimedia.org/wikipedia/commons/e/eb/OPPO_Logo.svg", "OPPO - Chuyên gia selfie và dẫn đầu công nghệ sạc nhanh SuperVOOC."));
        Brand vivo = brandRepository.save(new Brand("Vivo", "https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_logo.svg", "Vivo - Hãng điện thoại chụp hình đỉnh cao hợp tác cùng ZEISS."));
        Brand oneplus = brandRepository.save(new Brand("OnePlus", "https://upload.wikimedia.org/wikipedia/commons/2/2c/OnePlus_logo.svg", "OnePlus - Flagship killer nổi tiếng với hiệu suất siêu nhanh và mượt mà."));
        Brand realme = brandRepository.save(new Brand("Realme", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Realme_logo.svg", "Realme - Thương hiệu điện thoại dành cho giới trẻ năng động."));
        Brand asus = brandRepository.save(new Brand("Asus", "https://upload.wikimedia.org/wikipedia/commons/d/de/Asus_Logo.svg", "Asus - Nổi tiếng với dòng ROG Phone chuyên game đỉnh nhất thị trường."));

        // 4. Seed Categories
        log.info("Seeding Categories...");
        Category phoneCat = categoryRepository.save(new Category("Điện thoại", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"));
        Category tabletCat = categoryRepository.save(new Category("Máy tính bảng", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300"));
        Category accessoryCat = categoryRepository.save(new Category("Phụ kiện", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"));
        Category laptopCat = categoryRepository.save(new Category("Laptop", "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=300"));

        // 5. Seed Users & Accounts
        log.info("Seeding Users and Accounts...");
        String defaultEncodedPassword = passwordEncoder.encode("password");

        // Manager
        Manager manager = new Manager("Nguyễn Đức Duy", "0987654321");
        manager.addAddress(new Address("123 Nguyễn Trãi", "Phường 2", "Quận 5", "Hồ Chí Minh"));
        manager = managerRepository.save(manager);
        accountRepository.save(new Account("manager@techstore.com", defaultEncodedPassword, manager, AccountStatus.ACTIVE));

        // Staff
        Staff staff1 = new Staff("Trần Hoàng Nam", "0912345678", "ST001", LocalDate.now().minusYears(1));
        staff1.addAddress(new Address("456 Lê Lợi", "Bến Nghé", "Quận 1", "Hồ Chí Minh"));
        staff1 = staffRepository.save(staff1);
        accountRepository.save(new Account("staff1@techstore.com", defaultEncodedPassword, staff1, AccountStatus.ACTIVE));

        Staff staff2 = new Staff("Lê Thị Hương", "0934567890", "ST002", LocalDate.now().minusMonths(6));
        staff2.addAddress(new Address("789 CMT8", "Phường 11", "Quận 3", "Hồ Chí Minh"));
        staff2 = staffRepository.save(staff2);
        accountRepository.save(new Account("staff2@techstore.com", defaultEncodedPassword, staff2, AccountStatus.ACTIVE));

        // Customer
        Customer customer1 = new Customer("Trần Thị Bình", "0909090909", standardMembership);
        customer1.addAddress(new Address("101 Lý Tự Trọng", "Bến Thành", "Quận 1", "Hồ Chí Minh"));
        customer1 = customerRepository.save(customer1);
        accountRepository.save(new Account("customer1@techstore.com", defaultEncodedPassword, customer1, AccountStatus.ACTIVE));

        Customer customer2 = new Customer("Lê Hoàng Nam", "0888888888", silverMembership);
        customer2.addAddress(new Address("202 Hai Bà Trưng", "Phường 6", "Quận 3", "Hồ Chí Minh"));
        customer2 = customerRepository.save(customer2);
        accountRepository.save(new Account("customer2@techstore.com", defaultEncodedPassword, customer2, AccountStatus.ACTIVE));

        // 6. Seed Products (focusing on phones with high quality images)
        log.info("Seeding Products and Variants...");

        // 1. iPhone 15 Pro Max
        Product ip15pm = new Product("iPhone 15 Pro Max", "iPhone 15 Pro Max là chiếc iPhone mạnh mẽ nhất từ trước đến nay với chip A17 Pro tiên tiến, hệ thống camera chuyên nghiệp 48MP và khung titan nhẹ bền. Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz mang lại trải nghiệm hình ảnh tuyệt vời.", apple, phoneCat);
        ip15pm.setScreenSize(6.7);
        ip15pm.setScreenResolution("1290 x 2796 pixels");
        ip15pm.setChipset("Apple A17 Pro");
        ip15pm.setFrontCamera("12MP");
        ip15pm.setRearCamera("48MP + 12MP + 12MP");
        ip15pm.setBatteryCapacity(4422);
        ip15pm.setOperatingSystem("iOS 17");
        ip15pm.setSimType("Dual SIM (nano-SIM and eSIM)");
        ip15pm.setNfcSupported(true);
        Product savedIp15pm = productRepository.save(ip15pm);
        new ProductImage(savedIp15pm, "Front View", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500");
        productRepository.save(savedIp15pm);

        createVariant(savedIp15pm, 8, 256, "Titan Tự nhiên", 34990000.0);
        createVariant(savedIp15pm, 8, 256, "Titan Đen", 34990000.0);
        createVariant(savedIp15pm, 8, 512, "Titan Tự nhiên", 37990000.0);
        createVariant(savedIp15pm, 8, 1024, "Titan Xanh", 43990000.0);

        // 2. Samsung Galaxy S24 Ultra
        Product s24u = new Product("Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP vượt trội và chip Snapdragon 8 Gen 3 mạnh mẽ. Màn hình Dynamic AMOLED 2X 6.8 inch sắc nét và khung titan cao cấp.", samsung, phoneCat);
        s24u.setScreenSize(6.8);
        s24u.setScreenResolution("1440 x 3120 pixels");
        s24u.setChipset("Snapdragon 8 Gen 3");
        s24u.setFrontCamera("12MP");
        s24u.setRearCamera("200MP + 50MP + 12MP + 10MP");
        s24u.setBatteryCapacity(5000);
        s24u.setOperatingSystem("Android 14, One UI 6.1");
        s24u.setSimType("Dual SIM (Nano-SIM, dual stand-by)");
        s24u.setNfcSupported(true);
        Product savedS24u = productRepository.save(s24u);
        new ProductImage(savedS24u, "Primary View", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500");
        productRepository.save(savedS24u);

        createVariant(savedS24u, 12, 256, "Titan Xám", 25990000.0);
        createVariant(savedS24u, 12, 512, "Titan Xám", 28990000.0);
        createVariant(savedS24u, 12, 1024, "Titan Đen", 33990000.0);

        // 3. Xiaomi 14 Pro
        Product mi14p = new Product("Xiaomi 14 Pro", "Xiaomi 14 Pro với camera Leica đẳng cấp, chip Snapdragon 8 Gen 3 và màn hình LTPO AMOLED sắc nét. Sạc nhanh HyperCharge 120W đầy pin chỉ trong 23 phút.", xiaomi, phoneCat);
        mi14p.setScreenSize(6.73);
        mi14p.setScreenResolution("1440 x 3200 pixels");
        mi14p.setChipset("Snapdragon 8 Gen 3");
        mi14p.setFrontCamera("32MP");
        mi14p.setRearCamera("50MP Leica + 50MP + 50MP");
        mi14p.setBatteryCapacity(4880);
        mi14p.setOperatingSystem("Android 14, HyperOS");
        mi14p.setSimType("Dual SIM");
        mi14p.setNfcSupported(true);
        Product savedMi14p = productRepository.save(mi14p);
        new ProductImage(savedMi14p, "Front View", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500");
        productRepository.save(savedMi14p);

        createVariant(savedMi14p, 12, 256, "Đen", 16990000.0);
        createVariant(savedMi14p, 12, 512, "Trắng", 18990000.0);

        // 4. OPPO Find X7 Pro
        Product oppofx7 = new Product("OPPO Find X7 Pro", "OPPO Find X7 Pro với hệ thống camera Hasselblad chuyên nghiệp, màn hình LTPO AMOLED và sạc nhanh SuperVOOC 100W. Thiết kế sang trọng với khung vân gỗ độc đáo.", oppo, phoneCat);
        oppofx7.setScreenSize(6.82);
        oppofx7.setScreenResolution("1440 x 3168 pixels");
        oppofx7.setChipset("Snapdragon 8 Gen 3");
        oppofx7.setFrontCamera("32MP");
        oppofx7.setRearCamera("50MP Hasselblad + 50MP + 64MP");
        oppofx7.setBatteryCapacity(5000);
        oppofx7.setOperatingSystem("Android 14, ColorOS 14");
        oppofx7.setSimType("Dual SIM");
        oppofx7.setNfcSupported(true);
        Product savedOppofx7 = productRepository.save(oppofx7);
        new ProductImage(savedOppofx7, "Rear View", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500");
        productRepository.save(savedOppofx7);

        createVariant(savedOppofx7, 16, 256, "Đen Biển Sâu", 24990000.0);
        createVariant(savedOppofx7, 16, 512, "Xanh Bầu Trời", 27990000.0);

        // 5. iPhone 15
        Product ip15 = new Product("iPhone 15", "iPhone 15 với camera 48MP mới, cổng USB-C và chip A16 Bionic mạnh mẽ. Màn hình Super Retina XDR 6.1 inch tuyệt đẹp trong thiết kế nhôm và kính sang trọng.", apple, phoneCat);
        ip15.setScreenSize(6.1);
        ip15.setScreenResolution("1179 x 2556 pixels");
        ip15.setChipset("Apple A16 Bionic");
        ip15.setFrontCamera("12MP");
        ip15.setRearCamera("48MP + 12MP");
        ip15.setBatteryCapacity(3877);
        ip15.setOperatingSystem("iOS 17");
        ip15.setSimType("Dual SIM (nano-SIM and eSIM)");
        ip15.setNfcSupported(true);
        Product savedIp15 = productRepository.save(ip15);
        new ProductImage(savedIp15, "Main View", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500");
        productRepository.save(savedIp15);

        createVariant(savedIp15, 6, 128, "Hồng", 22990000.0);
        createVariant(savedIp15, 6, 256, "Xanh lá", 25990000.0);
        createVariant(savedIp15, 6, 512, "Đen", 30990000.0);

        // 6. Samsung Galaxy Z Fold 5
        Product zfold5 = new Product("Samsung Galaxy Z Fold 5", "Galaxy Z Fold 5 là smartphone màn hình gập cao cấp nhất của Samsung với bản lề Flex mỏng hơn, màn hình AMOLED 7.6 inch và chip Snapdragon 8 Gen 2 mạnh mẽ.", samsung, phoneCat);
        zfold5.setScreenSize(7.6);
        zfold5.setScreenResolution("1812 x 2176 pixels");
        zfold5.setChipset("Snapdragon 8 Gen 2");
        zfold5.setFrontCamera("10MP");
        zfold5.setRearCamera("50MP + 12MP + 10MP");
        zfold5.setBatteryCapacity(4400);
        zfold5.setOperatingSystem("Android 13, One UI 5.1.1");
        zfold5.setSimType("Dual SIM");
        zfold5.setNfcSupported(true);
        Product savedZfold5 = productRepository.save(zfold5);
        new ProductImage(savedZfold5, "Folded and Unfolded", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500");
        productRepository.save(savedZfold5);

        createVariant(savedZfold5, 12, 256, "Xanh Đá Phiến", 43990000.0);
        createVariant(savedZfold5, 12, 512, "Kem", 47990000.0);

        // 7. Vivo X100 Pro
        Product vx100 = new Product("Vivo X100 Pro", "Vivo X100 Pro với camera ZEISS chuyên nghiệp, chip Dimensity 9300 mạnh mẽ và pin 5.400 mAh dung lượng khủng. Sạc nhanh FlashCharge 100W và sạc không dây 50W.", vivo, phoneCat);
        vx100.setScreenSize(6.78);
        vx100.setScreenResolution("1260 x 2800 pixels");
        vx100.setChipset("MediaTek Dimensity 9300");
        vx100.setFrontCamera("32MP");
        vx100.setRearCamera("50MP ZEISS + 50MP + 64MP");
        vx100.setBatteryCapacity(5400);
        vx100.setOperatingSystem("Android 14, OriginOS 4");
        vx100.setSimType("Dual SIM");
        vx100.setNfcSupported(true);
        Product savedVx100 = productRepository.save(vx100);
        new ProductImage(savedVx100, "Camera Lens view", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500");
        productRepository.save(savedVx100);

        createVariant(savedVx100, 12, 256, "Đen Tinh Thể", 19990000.0);
        createVariant(savedVx100, 12, 512, "Trắng Tinh Tuyết", 22990000.0);

        // 8. Xiaomi Redmi Note 13 Pro
        Product redmi13p = new Product("Xiaomi Redmi Note 13 Pro", "Redmi Note 13 Pro với camera 200MP sắc nét vượt trội trong phân khúc tầm trung, màn hình AMOLED 120Hz và pin 5.100 mAh sử dụng cả ngày thoải mái.", xiaomi, phoneCat);
        redmi13p.setScreenSize(6.67);
        redmi13p.setScreenResolution("1220 x 2712 pixels");
        redmi13p.setChipset("MediaTek Helio G99 Ultra");
        redmi13p.setFrontCamera("16MP");
        redmi13p.setRearCamera("200MP + 8MP + 2MP");
        redmi13p.setBatteryCapacity(5100);
        redmi13p.setOperatingSystem("Android 13, MIUI 14");
        redmi13p.setSimType("Dual SIM");
        redmi13p.setNfcSupported(true);
        Product savedRedmi13p = productRepository.save(redmi13p);
        new ProductImage(savedRedmi13p, "Front View", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500");
        productRepository.save(savedRedmi13p);

        createVariant(savedRedmi13p, 8, 128, "Xanh Rừng", 6490000.0);
        createVariant(savedRedmi13p, 8, 256, "Đen Bóng Đêm", 7490000.0);

        // 9. OPPO Reno 11 Pro
        Product reno11p = new Product("OPPO Reno 11 Pro", "OPPO Reno 11 Pro với thiết kế thời thượng, camera selfie 32MP sắc nét và màn hình AMOLED 6.7 inch tràn viền. Hiệu năng mạnh mẽ nhờ chip Dimensity 8200.", oppo, phoneCat);
        reno11p.setScreenSize(6.7);
        reno11p.setScreenResolution("1080 x 2412 pixels");
        reno11p.setChipset("MediaTek Dimensity 8200");
        reno11p.setFrontCamera("32MP");
        reno11p.setRearCamera("50MP + 32MP + 8MP");
        reno11p.setBatteryCapacity(4600);
        reno11p.setOperatingSystem("Android 14, ColorOS 14");
        reno11p.setSimType("Dual SIM");
        reno11p.setNfcSupported(true);
        Product savedReno11p = productRepository.save(reno11p);
        new ProductImage(savedReno11p, "Slim Design View", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300");
        productRepository.save(savedReno11p);

        createVariant(savedReno11p, 12, 256, "Xanh Biển", 14990000.0);

        // 10. Samsung Galaxy A55
        Product gala55 = new Product("Samsung Galaxy A55", "Samsung Galaxy A55 với màn hình Super AMOLED 6.6 inch, camera 50MP chất lượng cao và thiết kế nhôm sang trọng. Hỗ trợ Galaxy AI thông minh.", samsung, phoneCat);
        gala55.setScreenSize(6.6);
        gala55.setScreenResolution("1080 x 2340 pixels");
        gala55.setChipset("Exynos 1480");
        gala55.setFrontCamera("32MP");
        gala55.setRearCamera("50MP + 12MP + 5MP");
        gala55.setBatteryCapacity(5000);
        gala55.setOperatingSystem("Android 14, One UI 6.1");
        gala55.setSimType("Dual SIM");
        gala55.setNfcSupported(true);
        Product savedGala55 = productRepository.save(gala55);
        new ProductImage(savedGala55, "Standard design", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500");
        productRepository.save(savedGala55);

        createVariant(savedGala55, 8, 128, "Xanh Băng", 10490000.0);
        createVariant(savedGala55, 8, 256, "Đen", 12490000.0);

        // 11. iPhone 14
        Product ip14 = new Product("iPhone 14", "iPhone 14 với chip A15 Bionic, camera 12MP cải tiến và chế độ Action Mode chống rung vượt trội. Thiết kế nhôm và kính sang trọng, phù hợp cho mọi phong cách.", apple, phoneCat);
        ip14.setScreenSize(6.1);
        ip14.setScreenResolution("1170 x 2532 pixels");
        ip14.setChipset("Apple A15 Bionic");
        ip14.setFrontCamera("12MP");
        ip14.setRearCamera("12MP + 12MP");
        ip14.setBatteryCapacity(3279);
        ip14.setOperatingSystem("iOS 16 (nâng cấp iOS 17)");
        ip14.setSimType("Dual SIM");
        ip14.setNfcSupported(true);
        Product savedIp14 = productRepository.save(ip14);
        new ProductImage(savedIp14, "Original color show", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500");
        productRepository.save(savedIp14);

        createVariant(savedIp14, 6, 128, "Tím", 18990000.0);
        createVariant(savedIp14, 6, 256, "Đỏ", 21990000.0);

        // 12. Xiaomi Redmi 12C
        Product red12c = new Product("Xiaomi Redmi 12C", "Redmi 12C là lựa chọn giá rẻ thông minh với pin 5.000 mAh sử dụng cả ngày, camera 50MP chất lượng và màn hình lớn 6.71 inch. Phù hợp cho người dùng phổ thông.", xiaomi, phoneCat);
        red12c.setScreenSize(6.71);
        red12c.setScreenResolution("720 x 1650 pixels");
        red12c.setChipset("MediaTek Helio G85");
        red12c.setFrontCamera("5MP");
        red12c.setRearCamera("50MP + 2MP");
        red12c.setBatteryCapacity(5000);
        red12c.setOperatingSystem("Android 12, MIUI 13");
        red12c.setSimType("Dual SIM");
        red12c.setNfcSupported(false);
        Product savedRed12c = productRepository.save(red12c);
        new ProductImage(savedRed12c, "Matte finish design", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500");
        productRepository.save(savedRed12c);

        createVariant(savedRed12c, 4, 64, "Xám Graphite", 2990000.0);
        createVariant(savedRed12c, 4, 128, "Xanh Lá", 3490000.0);

        // Extra 1: OnePlus 12
        Product op12 = new Product("OnePlus 12", "OnePlus 12 mang đến trải nghiệm mượt mà đỉnh cao với chip Snapdragon 8 Gen 3 thế hệ mới, sạc nhanh SuperVOOC 100W và camera hợp tác cùng thương hiệu Hasselblad huyền thoại.", oneplus, phoneCat);
        op12.setScreenSize(6.82);
        op12.setScreenResolution("1440 x 3168 pixels");
        op12.setChipset("Snapdragon 8 Gen 3");
        op12.setFrontCamera("32MP");
        op12.setRearCamera("50MP Hasselblad + 48MP + 64MP");
        op12.setBatteryCapacity(5400);
        op12.setOperatingSystem("Android 14, OxygenOS 14");
        op12.setSimType("Dual SIM");
        op12.setNfcSupported(true);
        Product savedOp12 = productRepository.save(op12);
        new ProductImage(savedOp12, "Emerald Green Show", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500");
        productRepository.save(savedOp12);

        createVariant(savedOp12, 12, 256, "Xanh Lục Bảo", 22490000.0);
        createVariant(savedOp12, 16, 512, "Đen Tuyền", 24990000.0);

        // Extra 2: Realme GT5 Pro
        Product regt5p = new Product("Realme GT5 Pro", "Realme GT5 Pro là quái thú cấu hình với chip Snapdragon 8 Gen 3, tản nhiệt buồng hơi VC siêu khủng và màn hình cong 1.5K sáng nhất thế giới lên đến 4500 nits.", realme, phoneCat);
        regt5p.setScreenSize(6.78);
        regt5p.setScreenResolution("1264 x 2780 pixels");
        regt5p.setChipset("Snapdragon 8 Gen 3");
        regt5p.setFrontCamera("32MP");
        regt5p.setRearCamera("50MP + 50MP + 8MP");
        regt5p.setBatteryCapacity(5400);
        regt5p.setOperatingSystem("Android 14, Realme UI 5.0");
        regt5p.setSimType("Dual SIM");
        regt5p.setNfcSupported(true);
        Product savedRegt5p = productRepository.save(regt5p);
        new ProductImage(savedRegt5p, "Eco Leather Orange", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500");
        productRepository.save(savedRegt5p);

        createVariant(savedRegt5p, 16, 512, "Cam Da Thuần Chay", 17990000.0);

        // Extra 3: Asus ROG Phone 8 Pro
        Product rog8p = new Product("Asus ROG Phone 8 Pro", "Asus ROG Phone 8 Pro là cỗ máy chiến game tối thượng được thiết kế lại mỏng hơn, hỗ trợ chống nước IP68, màn hình phụ AniMe Vision độc quyền ở mặt sau và bộ nút trigger chơi game siêu nhạy.", asus, phoneCat);
        rog8p.setScreenSize(6.78);
        rog8p.setScreenResolution("1080 x 2400 pixels");
        rog8p.setChipset("Snapdragon 8 Gen 3");
        rog8p.setFrontCamera("32MP");
        rog8p.setRearCamera("50MP + 32MP + 13MP");
        rog8p.setBatteryCapacity(5500);
         rog8p.setOperatingSystem("Android 14");
        rog8p.setSimType("Dual SIM");
        rog8p.setNfcSupported(true);
        Product savedRog8p = productRepository.save(rog8p);
        new ProductImage(savedRog8p, "Gaming Cyber View", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300");
        productRepository.save(savedRog8p);

        createVariant(savedRog8p, 16, 512, "Phantom Black", 28990000.0);
        createVariant(savedRog8p, 24, 1024, "Shadow Edition", 34990000.0);

        // Extra 4: iPhone 15 Plus
        Product ip15p = new Product("iPhone 15 Plus", "iPhone 15 Plus nâng tầm trải nghiệm giải trí với màn hình lớn 6.7 inch siêu sắc nét, thời lượng pin trâu nhất lịch sử iPhone và đảo động thông minh Dynamic Island.", apple, phoneCat);
        ip15p.setScreenSize(6.7);
        ip15p.setScreenResolution("1290 x 2796 pixels");
        ip15p.setChipset("Apple A16 Bionic");
        ip15p.setFrontCamera("12MP");
        ip15p.setRearCamera("48MP + 12MP");
        ip15p.setBatteryCapacity(4383);
        ip15p.setOperatingSystem("iOS 17");
        ip15p.setSimType("Dual SIM (nano-SIM and eSIM)");
        ip15p.setNfcSupported(true);
        Product savedIp15p = productRepository.save(ip15p);
        new ProductImage(savedIp15p, "Pastel Blue View", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500");
        productRepository.save(savedIp15p);

        createVariant(savedIp15p, 6, 128, "Xanh Dương Nhạt", 25490000.0);
        createVariant(savedIp15p, 6, 256, "Hồng Phấn", 28490000.0);

        // Extra 5: Samsung Galaxy S24 Plus
        Product s24p = new Product("Samsung Galaxy S24 Plus", "Samsung Galaxy S24 Plus mang lại thiết kế tinh tế vuông vức, màn hình QHD+ Dynamic AMOLED 2X rực rỡ và sức mạnh xử lý đỉnh cao cùng bộ tính năng trí tuệ nhân tạo Galaxy AI.", samsung, phoneCat);
        s24p.setScreenSize(6.7);
        s24p.setScreenResolution("1440 x 3120 pixels");
        s24p.setChipset("Exynos 2400");
        s24p.setFrontCamera("12MP");
        s24p.setRearCamera("50MP + 10MP + 12MP");
        s24p.setBatteryCapacity(4900);
        s24p.setOperatingSystem("Android 14, One UI 6.1");
        s24p.setSimType("Dual SIM");
        s24p.setNfcSupported(true);
        Product savedS24p = productRepository.save(s24p);
        new ProductImage(savedS24p, "Front Curved Angle", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500");
        productRepository.save(savedS24p);

        createVariant(savedS24p, 12, 256, "Tím Coban", 21990000.0);
        createVariant(savedS24p, 12, 512, "Vàng Hổ Phách", 24490000.0);

        log.info("Database seeding completed successfully!");
    }

    private void createVariant(Product product, int ram, int storage, String color, double price) {
        ProductVariant variant = new ProductVariant(product, ram, storage, color, BigDecimal.valueOf(price));
        productVariantRepository.save(variant);
    }
}
