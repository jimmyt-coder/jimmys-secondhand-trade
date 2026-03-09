package com.secondhand.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Username must be 2–20 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 30, message = "Password must be 6–30 characters")
    private String password;
}
