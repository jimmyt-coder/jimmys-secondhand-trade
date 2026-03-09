package com.secondhand.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentVO {
    private Long id;
    private Long userId;
    private Long productId;
    private String userNickname;
    private String userAvatar;
    private String content;
    private LocalDateTime createdAt;
}
