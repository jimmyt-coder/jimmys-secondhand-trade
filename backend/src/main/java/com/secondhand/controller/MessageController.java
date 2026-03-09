package com.secondhand.controller;

import com.secondhand.common.Result;
import com.secondhand.dto.MessageDTO;
import com.secondhand.entity.Message;
import com.secondhand.service.MessageService;
import com.secondhand.util.UserHolder;
import com.secondhand.vo.ConversationVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Result<Void> send(@Valid @RequestBody MessageDTO dto) {
        messageService.sendMessage(UserHolder.get(), dto);
        return Result.success();
    }

    @GetMapping("/conversations")
    public Result<List<ConversationVO>> conversations() {
        return Result.success(messageService.getConversations(UserHolder.get()));
    }

    @GetMapping("/{userId}")
    public Result<List<Message>> history(@PathVariable Long userId) {
        return Result.success(messageService.getChatHistory(UserHolder.get(), userId));
    }

    @GetMapping("/unread-count")
    public Result<Map<String, Integer>> unreadCount() {
        return Result.success(Map.of("count", messageService.getUnreadCount(UserHolder.get())));
    }
}
