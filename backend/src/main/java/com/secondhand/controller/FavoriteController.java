package com.secondhand.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.secondhand.common.Result;
import com.secondhand.service.FavoriteService;
import com.secondhand.util.UserHolder;
import com.secondhand.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{productId}")
    public Result<Void> add(@PathVariable Long productId) {
        favoriteService.addFavorite(UserHolder.get(), productId);
        return Result.success();
    }

    @DeleteMapping("/{productId}")
    public Result<Void> remove(@PathVariable Long productId) {
        favoriteService.removeFavorite(UserHolder.get(), productId);
        return Result.success();
    }

    @GetMapping("/{productId}/status")
    public Result<Map<String, Boolean>> status(@PathVariable Long productId) {
        boolean favorited = favoriteService.isFavorited(UserHolder.get(), productId);
        return Result.success(Map.of("favorited", favorited));
    }

    @GetMapping
    public Result<IPage<ProductVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(favoriteService.listFavorites(UserHolder.get(), page, size));
    }
}
