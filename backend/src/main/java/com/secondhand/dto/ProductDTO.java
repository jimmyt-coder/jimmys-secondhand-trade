package com.secondhand.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Please select a category")
    private Integer categoryId;

    @Min(value = 1, message = "Condition must be between 1 and 5")
    @Max(value = 5, message = "Condition must be between 1 and 5")
    private Integer conditionLevel;

    private List<String> images;  // Image URLs; first one is the cover
}
