package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.secondhand.entity.Product;
import com.secondhand.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {

    @Select("""
            SELECT p.*, u.nickname AS seller_nickname, u.avatar AS seller_avatar,
                   u.credit_score AS seller_credit_score, c.name AS category_name
            FROM products p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.status = 0
              AND (#{keyword} IS NULL OR p.title LIKE CONCAT('%', #{keyword}, '%'))
              AND (#{categoryId} IS NULL OR p.category_id = #{categoryId})
            ORDER BY p.created_at DESC
            """)
    IPage<ProductVO> selectProductPage(Page<ProductVO> page,
                                       @Param("keyword") String keyword,
                                       @Param("categoryId") Integer categoryId);

    @Select("""
            SELECT p.*, u.nickname AS seller_nickname, u.avatar AS seller_avatar,
                   u.credit_score AS seller_credit_score, c.name AS category_name,
                   u.id AS seller_id
            FROM products p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = #{id}
            """)
    ProductVO selectProductDetail(@Param("id") Long id);
}
