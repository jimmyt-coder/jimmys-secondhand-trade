package com.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("reviews")
public class Review {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long reviewerId;
    private Long revieweeId;
    private Long productId;
    private Integer score;
    private String content;
    private LocalDateTime createdAt;
}
