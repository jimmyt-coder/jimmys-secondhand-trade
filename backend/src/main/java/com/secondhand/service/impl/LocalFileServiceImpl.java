package com.secondhand.service.impl;

import com.secondhand.common.BusinessException;
import com.secondhand.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.s3.enabled", havingValue = "false", matchIfMissing = true)
public class LocalFileServiceImpl implements FileService {

    @Value("${app.upload.path:./uploads}")
    private String uploadPath;

    @Override
    public String uploadImage(MultipartFile file) {
        FileServiceImpl.validateFile(file);

        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;

        Path dir = Paths.get(uploadPath, datePath);
        try {
            Files.createDirectories(dir);
            Files.copy(file.getInputStream(), dir.resolve(filename));
        } catch (IOException e) {
            log.error("Local file upload failed", e);
            throw new BusinessException("File upload failed");
        }

        // Return relative path; frontend prepends the backend base URL
        return "/uploads/" + datePath + "/" + filename;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }
}
