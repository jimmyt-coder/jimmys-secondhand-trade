package com.secondhand.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.secondhand.common.BusinessException;
import com.secondhand.entity.Favorite;
import com.secondhand.mapper.FavoriteMapper;
import com.secondhand.service.FavoriteService;
import com.secondhand.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {

    @Override
    public void addFavorite(Long userId, Long productId) {
        if (isFavorited(userId, productId)) {
            throw new BusinessException(400, "Item already saved");
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setProductId(productId);
        favorite.setCreatedAt(LocalDateTime.now());
        save(favorite);
    }

    @Override
    public void removeFavorite(Long userId, Long productId) {
        lambdaUpdate()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getProductId, productId)
                .remove();
    }

    @Override
    public boolean isFavorited(Long userId, Long productId) {
        if (userId == null) return false;
        return lambdaQuery()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getProductId, productId)
                .exists();
    }

    @Override
    public IPage<ProductVO> listFavorites(Long userId, int page, int size) {
        return baseMapper.selectFavoriteProducts(new Page<>(page, size), userId);
    }
}
