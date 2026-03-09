package com.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    private String avatar;
    private String nickname;
    private String bio;
    private Integer creditScore;
    private String role; // USER or ADMIN
    private LocalDateTime createdAt;
}
