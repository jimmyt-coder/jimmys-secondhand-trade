package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.secondhand.entity.Comment;
import com.secondhand.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {

    @Select("""
            SELECT c.id, c.user_id, u.nickname AS user_nickname, u.avatar AS user_avatar,
                   c.content, c.created_at, c.product_id
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.product_id = #{productId}
            ORDER BY c.created_at ASC
            """)
    List<CommentVO> selectByProductId(@Param("productId") Long productId);

    @Select("""
            SELECT c.id, c.user_id, u.nickname AS user_nickname, u.avatar AS user_avatar,
                   c.content, c.created_at, c.product_id
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT #{size} OFFSET #{offset}
            """)
    List<CommentVO> selectAllForAdmin(@Param("offset") int offset, @Param("size") int size);
}
