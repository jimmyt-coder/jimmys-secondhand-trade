package com.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("products")
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Integer categoryId;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer conditionLevel;
    /** 0=available 1=sold 2=unlisted */
    private Integer status;
    private String coverImage;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
