package com.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.secondhand.dto.MessageDTO;
import com.secondhand.entity.Message;
import com.secondhand.vo.ConversationVO;

import java.util.List;

public interface MessageService extends IService<Message> {

    void sendMessage(Long senderId, MessageDTO dto);

    List<ConversationVO> getConversations(Long userId);

    List<Message> getChatHistory(Long userId, Long otherId);

    Integer getUnreadCount(Long userId);

    void markAsRead(Long userId, Long otherId);
}
