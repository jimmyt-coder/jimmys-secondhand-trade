package com.secondhand.controller;

import com.secondhand.common.BusinessException;
import com.secondhand.common.Result;
import com.secondhand.entity.Comment;
import com.secondhand.mapper.CommentMapper;
import com.secondhand.util.UserHolder;
import com.secondhand.vo.CommentVO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentMapper commentMapper;

    @GetMapping
    public Result<List<CommentVO>> list(@PathVariable Long productId) {
        return Result.success(commentMapper.selectByProductId(productId));
    }

    @PostMapping
    public Result<Void> add(@PathVariable Long productId, @RequestBody CommentRequest req) {
        if (req.getContent() == null || req.getContent().isBlank()) {
            throw new BusinessException(400, "Comment cannot be empty");
        }
        Comment comment = new Comment();
        comment.setProductId(productId);
        comment.setUserId(UserHolder.get());
        comment.setContent(req.getContent().trim());
        comment.setCreatedAt(LocalDateTime.now());
        commentMapper.insert(comment);
        return Result.success();
    }

    @DeleteMapping("/{commentId}")
    public Result<Void> delete(@PathVariable Long productId, @PathVariable Long commentId) {
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null || !comment.getProductId().equals(productId)) {
            throw new BusinessException(404, "Comment not found");
        }
        if (!comment.getUserId().equals(UserHolder.get())) {
            throw new BusinessException(403, "You can only delete your own comments");
        }
        commentMapper.deleteById(commentId);
        return Result.success();
    }

    @Data
    public static class CommentRequest {
        private String content;
    }
}
