package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.secondhand.entity.Favorite;
import com.secondhand.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface FavoriteMapper extends BaseMapper<Favorite> {

    @Select("""
            SELECT p.*, u.nickname AS seller_nickname, u.avatar AS seller_avatar,
                   u.credit_score AS seller_credit_score, c.name AS category_name
            FROM favorites f
            JOIN products p ON f.product_id = p.id
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE f.user_id = #{userId}
            ORDER BY f.created_at DESC
            """)
    IPage<ProductVO> selectFavoriteProducts(Page<ProductVO> page, @Param("userId") Long userId);
}
