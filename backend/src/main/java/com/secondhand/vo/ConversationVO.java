package com.secondhand.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConversationVO {
    private Long otherUserId;
    private String otherUserNickname;
    private String otherUserAvatar;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Integer unreadCount;
    private Long productId;
    private String productTitle;
    private String productCoverImage;
}
