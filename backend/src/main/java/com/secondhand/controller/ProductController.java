package com.secondhand.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.secondhand.common.Result;
import com.secondhand.dto.ProductDTO;
import com.secondhand.service.ProductService;
import com.secondhand.util.UserHolder;
import com.secondhand.vo.ProductVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Result<IPage<ProductVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        return Result.success(productService.listProducts(page, size, keyword, categoryId));
    }

    @GetMapping("/{id}")
    public Result<ProductVO> detail(@PathVariable Long id) {
        Long currentUserId = UserHolder.get();
        return Result.success(productService.getProductDetail(id, currentUserId));
    }

    @PostMapping
    public Result<Long> publish(@Valid @RequestBody ProductDTO dto) {
        Long id = productService.publishProduct(UserHolder.get(), dto);
        return Result.success(id);
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        productService.updateProduct(UserHolder.get(), id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(UserHolder.get(), id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        productService.updateStatus(UserHolder.get(), id, body.get("status"));
        return Result.success();
    }

    @GetMapping("/my")
    public Result<IPage<ProductVO>> myProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status) {
        return Result.success(productService.listMyProducts(UserHolder.get(), page, size, status));
    }

    @GetMapping("/user/{userId}")
    public Result<IPage<ProductVO>> userProducts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(productService.listUserProducts(userId, page, size));
    }
}
