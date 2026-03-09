package com.secondhand.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewVO {
    private Long id;
    private Long reviewerId;
    private String reviewerNickname;
    private String reviewerAvatar;
    private Long productId;
    private String productTitle;
    private Integer score;
    private String content;
    private LocalDateTime createdAt;
}
