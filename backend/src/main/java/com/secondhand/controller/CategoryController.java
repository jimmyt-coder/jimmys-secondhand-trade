package com.secondhand.controller;

import com.secondhand.common.Result;
import com.secondhand.entity.Category;
import com.secondhand.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;

    @GetMapping
    public Result<List<Category>> list() {
        return Result.success(categoryMapper.selectList(null));
    }
}
