package com.secondhand.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.secondhand.common.BusinessException;
import com.secondhand.dto.ProductDTO;
import com.secondhand.entity.Product;
import com.secondhand.entity.ProductImage;
import com.secondhand.mapper.ProductImageMapper;
import com.secondhand.mapper.ProductMapper;
import com.secondhand.service.FavoriteService;
import com.secondhand.service.ProductService;
import com.secondhand.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    private final ProductImageMapper productImageMapper;
    @Lazy
    private final FavoriteService favoriteService;

    @Override
    public IPage<ProductVO> listProducts(int page, int size, String keyword, Integer categoryId) {
        return baseMapper.selectProductPage(new Page<>(page, size),
                keyword != null && !keyword.isBlank() ? keyword : null,
                categoryId);
    }

    @Override
    public ProductVO getProductDetail(Long id, Long currentUserId) {
        ProductVO vo = baseMapper.selectProductDetail(id);
        if (vo == null) {
            throw new BusinessException(404, "Item not found");
        }
        // Populate image list
        List<String> images = productImageMapper.selectUrlsByProductId(id);
        vo.setImages(images);
        // Populate favorite status
        if (currentUserId != null) {
            vo.setFavorited(favoriteService.isFavorited(currentUserId, id));
        } else {
            vo.setFavorited(false);
        }
        // Increment view count
        lambdaUpdate().eq(Product::getId, id).setSql("view_count = view_count + 1").update();
        return vo;
    }

    @Override
    @Transactional
    public Long publishProduct(Long userId, ProductDTO dto) {
        Product product = new Product();
        product.setUserId(userId);
        product.setCategoryId(dto.getCategoryId());
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setConditionLevel(dto.getConditionLevel() != null ? dto.getConditionLevel() : 5);
        product.setStatus(0);
        product.setViewCount(0);
        product.setCreatedAt(LocalDateTime.now());

        if (!CollectionUtils.isEmpty(dto.getImages())) {
            product.setCoverImage(dto.getImages().get(0));
        }
        save(product);

        saveImages(product.getId(), dto.getImages());
        return product.getId();
    }

    @Override
    @Transactional
    public void updateProduct(Long userId, Long productId, ProductDTO dto) {
        Product product = getById(productId);
        if (product == null || !product.getUserId().equals(userId)) {
            throw new BusinessException(403, "You do not have permission to modify this item");
        }
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategoryId(dto.getCategoryId());
        product.setConditionLevel(dto.getConditionLevel());
        if (!CollectionUtils.isEmpty(dto.getImages())) {
            product.setCoverImage(dto.getImages().get(0));
        }
        updateById(product);

        // Reset images
        productImageMapper.delete(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ProductImage>()
                        .eq(ProductImage::getProductId, productId));
        saveImages(productId, dto.getImages());
    }

    @Override
    public void deleteProduct(Long userId, Long productId) {
        Product product = getById(productId);
        if (product == null || !product.getUserId().equals(userId)) {
            throw new BusinessException(403, "You do not have permission to delete this item");
        }
        removeById(productId);
    }

    @Override
    public void updateStatus(Long userId, Long productId, Integer status) {
        Product product = getById(productId);
        if (product == null || !product.getUserId().equals(userId)) {
            throw new BusinessException(403, "You do not have permission to update this item");
        }
        lambdaUpdate().eq(Product::getId, productId).set(Product::getStatus, status).update();
    }

    @Override
    public IPage<ProductVO> listMyProducts(Long userId, int page, int size, Integer status) {
        Page<Product> p = lambdaQuery()
                .eq(Product::getUserId, userId)
                .eq(status != null, Product::getStatus, status)
                .orderByDesc(Product::getCreatedAt)
                .page(new Page<>(page, size));

        return p.convert(product -> {
            ProductVO vo = new ProductVO();
            vo.setId(product.getId());
            vo.setTitle(product.getTitle());
            vo.setPrice(product.getPrice());
            vo.setStatus(product.getStatus());
            vo.setCoverImage(product.getCoverImage());
            vo.setCreatedAt(product.getCreatedAt());
            vo.setConditionLevel(product.getConditionLevel());
            vo.setCategoryId(product.getCategoryId());
            vo.setViewCount(product.getViewCount());
            return vo;
        });
    }

    @Override
    public IPage<ProductVO> listUserProducts(Long userId, int page, int size) {
        Page<Product> p = lambdaQuery()
                .eq(Product::getUserId, userId)
                .eq(Product::getStatus, 0)
                .orderByDesc(Product::getCreatedAt)
                .page(new Page<>(page, size));

        return p.convert(product -> {
            ProductVO vo = new ProductVO();
            vo.setId(product.getId());
            vo.setTitle(product.getTitle());
            vo.setPrice(product.getPrice());
            vo.setStatus(product.getStatus());
            vo.setCoverImage(product.getCoverImage());
            vo.setCreatedAt(product.getCreatedAt());
            vo.setConditionLevel(product.getConditionLevel());
            return vo;
        });
    }

    private void saveImages(Long productId, List<String> urls) {
        if (CollectionUtils.isEmpty(urls)) return;
        for (int i = 0; i < urls.size(); i++) {
            ProductImage img = new ProductImage();
            img.setProductId(productId);
            img.setUrl(urls.get(i));
            img.setSort(i);
            productImageMapper.insert(img);
        }
    }
}
