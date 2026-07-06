package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.user.AddressRequest;
import com.oose.tech_store.dto.user.AddressResponse;
import com.oose.tech_store.dto.user.ChangePasswordRequest;
import com.oose.tech_store.dto.user.UpdateProfileRequest;
import com.oose.tech_store.dto.user.UserProfileResponse;

public interface UserProfileService {

    UserProfileResponse getProfile(String customerId);

    UserProfileResponse updateProfile(String customerId, UpdateProfileRequest request);

    void changePassword(String customerId, ChangePasswordRequest request);

    AddressResponse addAddress(String customerId, AddressRequest request);

    void removeAddress(String customerId, String addressId);

    AddressResponse updateAddress(String customerId, String addressId, AddressRequest request);
}
