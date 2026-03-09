package com.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.secondhand.entity.ProductImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductImageMapper extends BaseMapper<ProductImage> {

    @Select("SELECT url FROM product_images WHERE product_id = #{productId} ORDER BY sort")
    List<String> selectUrlsByProductId(Long productId);
}
