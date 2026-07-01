package com.oose.tech_store.payment.price;

//Giá trị số càng nhỏ thì độ ưu tiên càng cao và được xếp lên đầu danh sách
//[MembershipDiscountProcessor (vị trí 0), ShippingFeeProcessor (vị trí 1)]
public interface PriceProcessor { // Interface định dạng bộ xử lý chung
    void process(PriceContext context);
}
