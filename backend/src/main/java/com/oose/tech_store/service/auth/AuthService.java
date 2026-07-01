package com.oose.tech_store.service.auth;

import com.oose.tech_store.dto.account.LoginRequest;
import com.oose.tech_store.dto.account.LoginResponse;
import com.oose.tech_store.dto.auth.RegisterRequest;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Cart;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.LoginLog;
import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.entity.enums.MembershipTier;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.CartRepository;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.LoginLogRepository;
import com.oose.tech_store.repository.MembershipRepository;
import com.oose.tech_store.security.AccountPrincipal;
import com.oose.tech_store.security.UserRoleResolver;
import java.util.List;
import java.util.Locale;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final LoginLogRepository loginLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final MembershipRepository membershipRepository;

    public AuthService(
            AccountRepository accountRepository,
            LoginLogRepository loginLogRepository,
            PasswordEncoder passwordEncoder,
            CustomerRepository customerRepository,
            CartRepository cartRepository,
            MembershipRepository membershipRepository) {
        this.accountRepository = accountRepository;
        this.loginLogRepository = loginLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.membershipRepository = membershipRepository;
    }

    public LoginResult login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        try {
            Account account = accountRepository.findByEmailIgnoreCase(email).orElse(null);
            if (account == null || !passwordEncoder.matches(request.password(), account.getPassword())) {
                loginLogRepository.save(account == null ? LoginLog.failure(email) : LoginLog.failure(account));
                throw new ApiException(HttpStatus.UNAUTHORIZED,
                        "Incorrect email or password. Please try again");
            }
            if (account.getStatus() != AccountStatus.ACTIVE) {
                loginLogRepository.save(LoginLog.failure(account));
                throw new ApiException(HttpStatus.FORBIDDEN,
                        "Your account is blocked or no longer active");
            }

            String role = UserRoleResolver.resolve(account.getUser());
            loginLogRepository.save(LoginLog.success(account));
            AccountPrincipal principal = new AccountPrincipal(account.getId(), account.getUser().getId(),
                    account.getEmail(), account.getUser().getFullName(), role);
            Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                    principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            LoginResponse response = new LoginResponse(account.getId(), account.getUser().getId(),
                    account.getEmail(), account.getUser().getFullName(), role, account.getStatus());
            return new LoginResult(authentication, response);
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to connect to the system. Please try again later");
        }
    }

    @Transactional
    public void register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        try {
            if (accountRepository.existsByEmailIgnoreCase(email)) {
                throw new ApiException(HttpStatus.CONFLICT, "Email already exists");
            }

            Membership standardMembership = membershipRepository.findByTier(MembershipTier.STANDARD)
                    .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Standard membership tier not found in database"));

            Customer customer = new Customer(request.name().trim(), request.phone().trim(), standardMembership);
            customer = customerRepository.save(customer);

            Cart cart = new Cart(customer);
            cartRepository.save(cart);

            Account account = new Account(email, passwordEncoder.encode(request.password()), customer, AccountStatus.ACTIVE);
            accountRepository.save(account);
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to register account. Please try again later");
        }
    }

    public record LoginResult(Authentication authentication, LoginResponse response) {
    }
}
