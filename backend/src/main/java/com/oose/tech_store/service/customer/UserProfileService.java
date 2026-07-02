package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.user.*;
import com.oose.tech_store.entity.*;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        
        Account account = accountRepository.findByUserId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for user ID: " + customerId));

        List<AddressResponse> addressResponses = customer.getAddresses().stream()
                .map(addr -> new AddressResponse(
                        addr.getId(),
                        addr.getStreet(),
                        addr.getWard(),
                        addr.getDistrict(),
                        addr.getProvince(),
                        addr.getFullAddress()
                ))
                .collect(Collectors.toList());

        String membershipName = customer.getMembership() != null 
                ? customer.getMembership().getTier().name() 
                : "STANDARD";

        return new UserProfileResponse(
                customer.getId(),
                customer.getFullName(),
                account.getEmail(),
                customer.getPhone(),
                membershipName,
                addressResponses
        );
    }

    @Transactional
    public UserProfileResponse updateProfile(String customerId, UpdateProfileRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        customer.setFullName(request.fullName());
        customer.setPhone(request.phone());
        customerRepository.save(customer);

        return getProfile(customerId);
    }

    @Transactional
    public void changePassword(String customerId, ChangePasswordRequest request) {
        Account account = accountRepository.findByUserId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for user ID: " + customerId));

        if (!passwordEncoder.matches(request.currentPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác.");
        }

        account.changePassword(passwordEncoder.encode(request.newPassword()));
        accountRepository.save(account);
    }

    @Transactional
    public AddressResponse addAddress(String customerId, AddressRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Address address = new Address(
                request.street(),
                request.ward(),
                request.district(),
                request.province()
        );

        customer.addAddress(address);
        Customer saved = customerRepository.save(customer);
        // save() merges an already-managed Customer, and Hibernate's merge cascade
        // persists the new Address as a separate managed copy rather than mutating
        // `address` in place, so its generated id must be read back from the
        // returned graph instead of the original instance.
        Address savedAddress = saved.getAddresses().get(saved.getAddresses().size() - 1);

        return new AddressResponse(
                savedAddress.getId(),
                savedAddress.getStreet(),
                savedAddress.getWard(),
                savedAddress.getDistrict(),
                savedAddress.getProvince(),
                savedAddress.getFullAddress()
        );
    }

    @Transactional
    public void removeAddress(String customerId, String addressId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Address addressToRemove = customer.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        customer.removeAddress(addressToRemove);
        customerRepository.save(customer);
    }

    @Transactional
    public AddressResponse updateAddress(String customerId, String addressId, AddressRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Address addressToUpdate = customer.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        addressToUpdate.update(
                request.street(),
                request.ward(),
                request.district(),
                request.province()
        );
        customerRepository.save(customer);

        return new AddressResponse(
                addressToUpdate.getId(),
                addressToUpdate.getStreet(),
                addressToUpdate.getWard(),
                addressToUpdate.getDistrict(),
                addressToUpdate.getProvince(),
                addressToUpdate.getFullAddress()
        );
    }
}
