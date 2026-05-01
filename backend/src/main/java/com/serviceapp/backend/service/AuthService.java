package com.serviceapp.backend.service;

import com.serviceapp.backend.config.JwtUtil;
import com.serviceapp.backend.dto.LoginRequest;
import com.serviceapp.backend.dto.RegisterRequest;
import com.serviceapp.backend.model.User;
import com.serviceapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public String register(RegisterRequest request) {

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            return "Phone number already exists";
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByPhone(request.getPhone())
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return "Invalid Password";
        }

        return jwtUtil.generateToken(user.getPhone());
    }
}