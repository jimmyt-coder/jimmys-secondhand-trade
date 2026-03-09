package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.secondhand.entity.Message;
import com.secondhand.vo.ConversationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {

    /**
     * Get all conversations for the current user (one entry per contact, showing the latest message)
     */
    @Select("""
            SELECT
                other_id AS other_user_id,
                u.nickname AS other_user_nickname,
                u.avatar AS other_user_avatar,
                last_content AS last_message,
                last_time AS last_message_time,
                unread_count,
                last_product_id AS product_id,
                p.title AS product_title,
                p.cover_image AS product_cover_image
            FROM (
                SELECT
                    CASE WHEN sender_id = #{userId} THEN receiver_id ELSE sender_id END AS other_id,
                    MAX(created_at) AS last_time,
                    SUM(CASE WHEN receiver_id = #{userId} AND is_read = 0 THEN 1 ELSE 0 END) AS unread_count,
                    SUBSTRING_INDEX(GROUP_CONCAT(content ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1) AS last_content,
                    SUBSTRING_INDEX(GROUP_CONCAT(IFNULL(product_id,'') ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1) AS last_product_id
                FROM messages
                WHERE sender_id = #{userId} OR receiver_id = #{userId}
                GROUP BY other_id
            ) t
            LEFT JOIN users u ON u.id = t.other_id
            LEFT JOIN products p ON p.id = t.last_product_id
            ORDER BY last_time DESC
            """)
    List<ConversationVO> selectConversations(@Param("userId") Long userId);

    @Select("""
            SELECT * FROM messages
            WHERE (sender_id = #{userId} AND receiver_id = #{otherId})
               OR (sender_id = #{otherId} AND receiver_id = #{userId})
            ORDER BY created_at ASC
            """)
    List<Message> selectChatHistory(@Param("userId") Long userId, @Param("otherId") Long otherId);

    @Select("SELECT COUNT(*) FROM messages WHERE receiver_id = #{userId} AND is_read = 0")
    Integer countUnread(@Param("userId") Long userId);

    @Update("UPDATE messages SET is_read = 1 WHERE sender_id = #{otherId} AND receiver_id = #{userId} AND is_read = 0")
    void markAsRead(@Param("userId") Long userId, @Param("otherId") Long otherId);
}
