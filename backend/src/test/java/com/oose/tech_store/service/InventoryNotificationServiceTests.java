package com.oose.tech_store.service;

import com.oose.tech_store.service.customer.InventoryNotificationService;
import com.oose.tech_store.service.customer.impl.InventoryNotificationServiceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.oose.tech_store.dto.warehouse.AffectedProductDTO;
import com.oose.tech_store.dto.warehouse.InventoryStatusDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import com.oose.tech_store.repository.FavoriteProductRepository;
import com.oose.tech_store.repository.NotificationRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.customer.observer.InventoryObserver;
import com.oose.tech_store.service.customer.observer.InventoryStatusChangedEvent;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventoryNotificationServiceTests {

        @Mock
        private ProductVariantRepository productVariantRepository;

        @Mock
        private FavoriteProductRepository favoriteProductRepository;

        @Mock
        private NotificationRepository notificationRepository;

        @Mock
        private InventoryObserver observer1;

        @Mock
        private InventoryObserver observer2;

        private List<InventoryObserver> observers;
        private InventoryNotificationService service;

        @BeforeEach
        void setUp() {
                observers = new ArrayList<>(List.of(observer1, observer2));
                service = new InventoryNotificationServiceImpl(
                                productVariantRepository,
                                favoriteProductRepository,
                                notificationRepository,
                                observers);
        }

        @Test
        void whenProductOutOfStock_ObserversAreNotifiedWithOutOfStockTrue_AndNotificationsAreSaved() {
                // Arrange
                AffectedProductDTO product = new AffectedProductDTO("prod-123", "iPhone 16 (8GB / 256GB / Gold)", 8,
                                256, "Gold");
                when(productVariantRepository.countByProductIdAndSpecsAndStatus(
                                "prod-123", 8, 256, "Gold", ProductVariantStatus.AVAILABLE))
                                .thenReturn(0L);

                Customer customer = mock(Customer.class);
                when(customer.getNotifications()).thenReturn(new ArrayList<>());

                FavoriteProduct favoriteProduct = mock(FavoriteProduct.class);
                when(favoriteProduct.getCustomer()).thenReturn(customer);

                when(favoriteProductRepository.findBySpecsAndStatus("prod-123", 8, 256, "Gold",
                                SubscriptionStatus.SUBSCRIBED))
                                .thenReturn(List.of(favoriteProduct));

                // Act
                List<InventoryStatusDTO> results = service.notifyInventoryChange(List.of(product));

                // Assert
                assertEquals(1, results.size());
                InventoryStatusDTO status = results.get(0);
                assertEquals("OUT_OF_STOCK", status.status());
                assertEquals(1, status.notifiedCustomerCount());

                // Verify observers notified
                ArgumentCaptor<InventoryStatusChangedEvent> eventCaptor1 = ArgumentCaptor
                                .forClass(InventoryStatusChangedEvent.class);
                ArgumentCaptor<InventoryStatusChangedEvent> eventCaptor2 = ArgumentCaptor
                                .forClass(InventoryStatusChangedEvent.class);
                verify(observer1).onInventoryChanged(eventCaptor1.capture());
                verify(observer2).onInventoryChanged(eventCaptor2.capture());

                InventoryStatusChangedEvent event1 = eventCaptor1.getValue();
                assertEquals("prod-123", event1.productId());
                assertEquals("iPhone 16 (8GB / 256GB / Gold)", event1.productName());
                assertEquals(8, event1.ramGb());
                assertEquals(256, event1.storageGb());
                assertEquals("Gold", event1.color());
                assertEquals(0L, event1.availableQuantity());
                assertEquals(true, event1.outOfStock());

                InventoryStatusChangedEvent event2 = eventCaptor2.getValue();
                assertEquals(true, event2.outOfStock());

                // Verify notification saved
                verify(notificationRepository).saveAll(any());
        }

        @Test
        void whenProductHasStock_ObserversAreNotifiedWithOutOfStockFalse_AndNoNotificationsAreSaved() {
                // Arrange
                AffectedProductDTO product = new AffectedProductDTO("prod-123", "iPhone 16 (8GB / 256GB / Gold)", 8,
                                256, "Gold");
                when(productVariantRepository.countByProductIdAndSpecsAndStatus(
                                "prod-123", 8, 256, "Gold", ProductVariantStatus.AVAILABLE))
                                .thenReturn(5L);

                // Act
                List<InventoryStatusDTO> results = service.notifyInventoryChange(List.of(product));

                // Assert
                assertEquals(1, results.size());
                InventoryStatusDTO status = results.get(0);
                assertEquals("AVAILABLE", status.status());
                assertEquals(0, status.notifiedCustomerCount());

                // Verify observers notified
                ArgumentCaptor<InventoryStatusChangedEvent> eventCaptor = ArgumentCaptor
                                .forClass(InventoryStatusChangedEvent.class);
                verify(observer1).onInventoryChanged(eventCaptor.capture());
                verify(observer2).onInventoryChanged(any());

                InventoryStatusChangedEvent event = eventCaptor.getValue();
                assertEquals("prod-123", event.productId());
                assertEquals("iPhone 16 (8GB / 256GB / Gold)", event.productName());
                assertEquals(8, event.ramGb());
                assertEquals(256, event.storageGb());
                assertEquals("Gold", event.color());
                assertEquals(5L, event.availableQuantity());
                assertEquals(false, event.outOfStock());

                // Verify notifications NOT saved for customers, but saved for low stock (STAFF,
                // MANAGER)
                verifyNoInteractions(favoriteProductRepository);
                verify(notificationRepository, times(2)).save(any());
        }

        @Test
        void whenObserversListIsEmpty_NoExceptionsAreThrown() {
                // Arrange
                InventoryNotificationService serviceWithNoObservers = new InventoryNotificationServiceImpl(
                                productVariantRepository,
                                favoriteProductRepository,
                                notificationRepository,
                                List.of());
                AffectedProductDTO product = new AffectedProductDTO("prod-123", "iPhone 16 (8GB / 256GB / Gold)", 8,
                                256, "Gold");
                when(productVariantRepository.countByProductIdAndSpecsAndStatus(
                                "prod-123", 8, 256, "Gold", ProductVariantStatus.AVAILABLE))
                                .thenReturn(10L);

                // Act & Assert (Should not throw exception)
                List<InventoryStatusDTO> results = serviceWithNoObservers.notifyInventoryChange(List.of(product));
                assertEquals(1, results.size());
                assertEquals("AVAILABLE", results.get(0).status());
        }
}
