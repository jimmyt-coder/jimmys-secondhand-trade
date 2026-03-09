package com.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("product_images")
public class ProductImage {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String url;
    private Integer sort;
}
