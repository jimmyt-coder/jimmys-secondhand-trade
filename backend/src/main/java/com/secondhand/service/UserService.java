package com.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.secondhand.dto.LoginDTO;
import com.secondhand.dto.RegisterDTO;
import com.secondhand.dto.UpdateUserDTO;
import com.secondhand.entity.User;
import com.secondhand.vo.LoginVO;

public interface UserService extends IService<User> {

    void register(RegisterDTO dto);

    LoginVO login(LoginDTO dto);

    User getUserById(Long id);

    void updateUser(Long userId, UpdateUserDTO dto);

    void deleteUser(Long userId);
}
