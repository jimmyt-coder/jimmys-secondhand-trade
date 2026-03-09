package com.secondhand.controller;

import com.secondhand.common.Result;
import com.secondhand.dto.ReviewDTO;
import com.secondhand.service.ReviewService;
import com.secondhand.util.UserHolder;
import com.secondhand.vo.ReviewVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public Result<Void> add(@Valid @RequestBody ReviewDTO dto) {
        reviewService.addReview(UserHolder.get(), dto);
        return Result.success();
    }

    @GetMapping("/user/{userId}")
    public Result<List<ReviewVO>> getByUser(@PathVariable Long userId) {
        return Result.success(reviewService.getReviewsByUser(userId));
    }
}
