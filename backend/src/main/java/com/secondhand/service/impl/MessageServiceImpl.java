package com.secondhand.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.secondhand.dto.MessageDTO;
import com.secondhand.entity.Message;
import com.secondhand.mapper.MessageMapper;
import com.secondhand.service.MessageService;
import com.secondhand.vo.ConversationVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Override
    public void sendMessage(Long senderId, MessageDTO dto) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(dto.getReceiverId());
        message.setProductId(dto.getProductId());
        message.setContent(dto.getContent());
        message.setIsRead(0);
        message.setCreatedAt(LocalDateTime.now());
        save(message);
    }

    @Override
    public List<ConversationVO> getConversations(Long userId) {
        return baseMapper.selectConversations(userId);
    }

    @Override
    public List<Message> getChatHistory(Long userId, Long otherId) {
        baseMapper.markAsRead(userId, otherId);
        return baseMapper.selectChatHistory(userId, otherId);
    }

    @Override
    public Integer getUnreadCount(Long userId) {
        return baseMapper.countUnread(userId);
    }

    @Override
    public void markAsRead(Long userId, Long otherId) {
        baseMapper.markAsRead(userId, otherId);
    }
}
