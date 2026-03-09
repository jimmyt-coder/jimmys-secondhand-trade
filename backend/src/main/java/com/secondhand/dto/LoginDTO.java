package com.secondhand.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @NotBlank(message = "Account is required")
    private String account;  // username or email

    @NotBlank(message = "Password is required")
    private String password;
}
