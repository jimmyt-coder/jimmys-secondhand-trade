package com.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.secondhand.dto.ReviewDTO;
import com.secondhand.entity.Review;
import com.secondhand.vo.ReviewVO;

import java.util.List;

public interface ReviewService extends IService<Review> {

    void addReview(Long reviewerId, ReviewDTO dto);

    List<ReviewVO> getReviewsByUser(Long userId);
}
