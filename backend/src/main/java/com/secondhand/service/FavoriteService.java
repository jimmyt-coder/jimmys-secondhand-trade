package com.secondhand.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.secondhand.entity.Favorite;
import com.secondhand.vo.ProductVO;

public interface FavoriteService extends IService<Favorite> {

    void addFavorite(Long userId, Long productId);

    void removeFavorite(Long userId, Long productId);

    boolean isFavorited(Long userId, Long productId);

    IPage<ProductVO> listFavorites(Long userId, int page, int size);
}
