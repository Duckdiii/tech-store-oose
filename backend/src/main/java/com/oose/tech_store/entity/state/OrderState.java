package com.oose.tech_store.entity.state;

import com.oose.tech_store.entity.Order;

public interface OrderState {
    void confirm(Order order);
    void ship(Order order);
    void complete(Order order);
    void cancel(Order order);
    void refund(Order order);
}
