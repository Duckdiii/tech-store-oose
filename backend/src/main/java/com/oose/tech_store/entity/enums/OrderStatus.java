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
        throw new IllegalStateException("Order can only be confirmed when in AWAITING_CONFIRMATION status");
    }

    @Override
    public void ship(Order order) {
        throw new IllegalStateException("Order can only be marked as shipping when in PROCESSING status");
    }

    @Override
    public void complete(Order order) {
        throw new IllegalStateException("Order can only be completed when in SHIPPING status");
    }

    @Override
    public void cancel(Order order) {
        throw new IllegalStateException("Order cannot be cancelled in current status");
    }

    @Override
    public void refund(Order order) {
        throw new IllegalStateException("Order can only be refunded when COMPLETED");
    }
}
