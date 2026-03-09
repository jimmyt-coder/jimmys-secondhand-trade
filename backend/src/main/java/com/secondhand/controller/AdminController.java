package com.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.secondhand.common.BusinessException;
import com.secondhand.common.Result;
import com.secondhand.entity.Comment;
import com.secondhand.entity.Product;
import com.secondhand.entity.User;
import com.secondhand.mapper.CommentMapper;
import com.secondhand.mapper.ProductMapper;
import com.secondhand.service.UserService;
import com.secondhand.vo.CommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ProductMapper productMapper;
    private final CommentMapper commentMapper;

    // --- Users ---

    @GetMapping("/users")
    public Result<List<User>> listUsers(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "20") int size) {
        Page<User> result = userService.page(new Page<>(page, size),
                new LambdaQueryWrapper<User>().orderByDesc(User::getCreatedAt));
        return Result.success(result.getRecords());
    }

    @PutMapping("/users/{id}/role")
    public Result<Void> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            throw new BusinessException(400, "Invalid role");
        }
        userService.lambdaUpdate().eq(User::getId, id).set(User::getRole, role).update();
        return Result.success();
    }

    @DeleteMapping("/users/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    // --- Products ---

    @GetMapping("/products")
    public Result<List<Product>> listProducts(@RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        Page<Product> result = productMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<Product>().orderByDesc(Product::getCreatedAt));
        return Result.success(result.getRecords());
    }

    @DeleteMapping("/products/{id}")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        productMapper.deleteById(id);
        return Result.success();
    }

    // --- Comments ---

    @GetMapping("/comments")
    public Result<List<CommentVO>> listComments(@RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        // Fetch all comments joined with user info, ordered by newest
        List<CommentVO> comments = commentMapper.selectAllForAdmin((page - 1) * size, size);
        return Result.success(comments);
    }

    @DeleteMapping("/comments/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentMapper.deleteById(id);
        return Result.success();
    }
}
