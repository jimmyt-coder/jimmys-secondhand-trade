package com.secondhand.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.secondhand.dto.ProductDTO;
import com.secondhand.entity.Product;
import com.secondhand.vo.ProductVO;

public interface ProductService extends IService<Product> {

    IPage<ProductVO> listProducts(int page, int size, String keyword, Integer categoryId);

    ProductVO getProductDetail(Long id, Long currentUserId);

    Long publishProduct(Long userId, ProductDTO dto);

    void updateProduct(Long userId, Long productId, ProductDTO dto);

    void deleteProduct(Long userId, Long productId);

    void updateStatus(Long userId, Long productId, Integer status);

    IPage<ProductVO> listMyProducts(Long userId, int page, int size, Integer status);

    IPage<ProductVO> listUserProducts(Long userId, int page, int size);
}
