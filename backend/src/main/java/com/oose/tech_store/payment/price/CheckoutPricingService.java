package com.oose.tech_store.payment.price;

import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Order;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckoutPricingService {

    private final List<PriceProcessor> priceProcessors;

    public PriceContext calculate(Order order, Customer customer) {
        PriceContext priceContext = new PriceContext(order, customer);
        for (PriceProcessor processor : priceProcessors) {
            processor.process(priceContext);
        }
        return priceContext;
    }
}
