package com.secondhand.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.secondhand.common.BusinessException;
import com.secondhand.dto.ReviewDTO;
import com.secondhand.entity.Review;
import com.secondhand.mapper.ReviewMapper;
import com.secondhand.service.ReviewService;
import com.secondhand.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl extends ServiceImpl<ReviewMapper, Review> implements ReviewService {

    @Override
    public void addReview(Long reviewerId, ReviewDTO dto) {
        // Prevent duplicate reviews
        boolean exists = lambdaQuery()
                .eq(Review::getReviewerId, reviewerId)
                .eq(Review::getProductId, dto.getProductId())
                .exists();
        if (exists) {
            throw new BusinessException(400, "You have already reviewed this item");
        }

        Review review = new Review();
        review.setReviewerId(reviewerId);
        review.setRevieweeId(dto.getRevieweeId());
        review.setProductId(dto.getProductId());
        review.setScore(dto.getScore());
        review.setContent(dto.getContent());
        review.setCreatedAt(LocalDateTime.now());
        save(review);
    }

    @Override
    public List<ReviewVO> getReviewsByUser(Long userId) {
        return baseMapper.selectByRevieweeId(userId);
    }
}
