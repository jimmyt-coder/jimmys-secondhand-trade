package com.secondhand.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.secondhand.common.BusinessException;
import com.secondhand.dto.LoginDTO;
import com.secondhand.dto.RegisterDTO;
import com.secondhand.dto.UpdateUserDTO;
import com.secondhand.entity.User;
import com.secondhand.mapper.UserMapper;
import com.secondhand.service.UserService;
import com.secondhand.util.JwtUtil;
import com.secondhand.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void register(RegisterDTO dto) {
        if (lambdaQuery().eq(User::getUsername, dto.getUsername()).exists()) {
            throw new BusinessException(400, "Username is already taken");
        }
        if (lambdaQuery().eq(User::getEmail, dto.getEmail()).exists()) {
            throw new BusinessException(400, "Email is already registered");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getUsername());
        user.setCreditScore(100);
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        save(user);
    }

    @Override
    public LoginVO login(LoginDTO dto) {
        User user = lambdaQuery()
                .eq(User::getUsername, dto.getAccount())
                .or()
                .eq(User::getEmail, dto.getAccount())
                .one();

        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessException(401, "Invalid username or password");
        }

        // Include role in JWT so Spring Security can enforce access control
        String token = jwtUtil.generateToken(user.getId(), user.getRole() != null ? user.getRole() : "USER");

        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setRole(user.getRole());
        return vo;
    }

    @Override
    public User getUserById(Long id) {
        User user = getById(id);
        if (user == null) throw new BusinessException(404, "User not found");
        return user;
    }

    @Override
    public void updateUser(Long userId, UpdateUserDTO dto) {
        lambdaUpdate()
                .eq(User::getId, userId)
                .set(dto.getNickname() != null, User::getNickname, dto.getNickname())
                .set(dto.getBio() != null, User::getBio, dto.getBio())
                .set(dto.getAvatar() != null, User::getAvatar, dto.getAvatar())
                .update();
    }

    @Override
    public void deleteUser(Long userId) {
        // GDPR right to erasure — anonymise user data instead of hard delete to preserve referential integrity
        lambdaUpdate()
                .eq(User::getId, userId)
                .set(User::getUsername, "deleted_" + userId)
                .set(User::getEmail, "deleted_" + userId + "@deleted.invalid")
                .set(User::getNickname, "Deleted User")
                .set(User::getAvatar, null)
                .set(User::getBio, null)
                .set(User::getPassword, "")
                .update();
    }
}
