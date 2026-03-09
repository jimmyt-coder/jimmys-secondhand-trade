package com.secondhand.service.impl;

import com.secondhand.common.BusinessException;
import com.secondhand.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.s3.enabled", havingValue = "true")
public class FileServiceImpl implements FileService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    @Value("${app.s3.bucket}")
    private String bucket;

    @Value("${app.s3.base-url}")
    private String baseUrl;

    private final S3Client s3Client;

    public FileServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadImage(MultipartFile file) {
        validateFile(file);

        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        String key = "uploads/" + datePath + "/" + filename;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            log.error("S3 upload failed", e);
            throw new BusinessException("File upload failed");
        }

        return baseUrl.endsWith("/") ? baseUrl + key : baseUrl + "/" + key;
    }

    static void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BusinessException(400, "File cannot be empty");
        if (!ALLOWED_TYPES.contains(file.getContentType())) throw new BusinessException(400, "Only JPG/PNG/WebP/GIF formats are supported");
        if (file.getSize() > MAX_SIZE) throw new BusinessException(400, "File size cannot exceed 5MB");
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }
}
