package com.secondhand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageDTO {

    @NotNull(message = "Recipient is required")
    private Long receiverId;

    private Long productId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;
}
