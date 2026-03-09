package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.secondhand.entity.Review;
import com.secondhand.vo.ReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReviewMapper extends BaseMapper<Review> {

    @Select("""
            SELECT r.*, u.nickname AS reviewer_nickname, u.avatar AS reviewer_avatar,
                   p.title AS product_title
            FROM reviews r
            LEFT JOIN users u ON r.reviewer_id = u.id
            LEFT JOIN products p ON r.product_id = p.id
            WHERE r.reviewee_id = #{revieweeId}
            ORDER BY r.created_at DESC
            """)
    List<ReviewVO> selectByRevieweeId(@Param("revieweeId") Long revieweeId);
}
