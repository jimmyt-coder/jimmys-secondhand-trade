package com.secondhand.controller;

import com.secondhand.common.Result;
import com.secondhand.dto.UpdateUserDTO;
import com.secondhand.entity.User;
import com.secondhand.service.UserService;
import com.secondhand.util.UserHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public Result<User> getMe() {
        return Result.success(userService.getUserById(UserHolder.get()));
    }

    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable Long id) {
        return Result.success(userService.getUserById(id));
    }

    @PutMapping("/me")
    public Result<Void> updateMe(@RequestBody UpdateUserDTO dto) {
        userService.updateUser(UserHolder.get(), dto);
        return Result.success();
    }
}
