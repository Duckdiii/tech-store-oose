package com.oose.tech_store.entity.enums;

import com.oose.tech_store.entity.Order;
import com.oose.tech_store.entity.state.OrderState;

public enum OrderStatus implements OrderState {

    AWAITING_CONFIRMATION {
        @Override
        public void confirm(Order order) {
            order.setOrderStatus(PROCESSING);
        }
        @Override
        public void cancel(Order order) {
            order.setOrderStatus(CANCELLED);
        }
    },

    PROCESSING {
        @Override
        public void ship(Order order) {
            order.setOrderStatus(SHIPPING);
        }
        @Override
        public void cancel(Order order) {
            order.setOrderStatus(CANCELLED);
        }
    },

    SHIPPING {
        @Override
        public void complete(Order order) {
            order.setOrderStatus(COMPLETED);
        }
    },

    COMPLETED {
        @Override
        public void refund(Order order) {
            order.setOrderStatus(REFUNDED);
        }
    },

    CANCELLED,

    REFUNDED;

    @Override
    public void confirm(Order order) {
        throw new IllegalStateException("Đơn hàng chỉ có thể xác nhận khi đang ở trạng thái Chờ xác nhận");
    }

    @Override
    public void ship(Order order) {
        throw new IllegalStateException("Đơn hàng chỉ có thể chuyển sang Đang giao khi đang ở trạng thái Đang xử lý");
    }

    @Override
    public void complete(Order order) {
        throw new IllegalStateException("Đơn hàng chỉ có thể hoàn thành khi đang ở trạng thái Đang giao");
    }

    @Override
    public void cancel(Order order) {
        throw new IllegalStateException("Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    @Override
    public void refund(Order order) {
        throw new IllegalStateException("Chỉ có thể hoàn tiền khi đơn hàng đã hoàn thành");
    }
}
