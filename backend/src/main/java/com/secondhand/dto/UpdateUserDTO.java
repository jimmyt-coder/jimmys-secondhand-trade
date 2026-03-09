package com.secondhand.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String nickname;
    private String bio;
    private String avatar;
}
