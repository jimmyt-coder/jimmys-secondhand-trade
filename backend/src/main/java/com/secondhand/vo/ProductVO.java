package com.secondhand.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductVO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer conditionLevel;
    private Integer status;
    private String coverImage;
    private List<String> images;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private Integer categoryId;
    private String categoryName;
    // Seller info
    private Long sellerId;
    private String sellerNickname;
    private String sellerAvatar;
    private Integer sellerCreditScore;
    // Whether the current user has saved this item (populated on detail page only)
    private Boolean favorited;
}
