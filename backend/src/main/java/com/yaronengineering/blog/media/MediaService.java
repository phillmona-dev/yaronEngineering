package com.yaronengineering.blog.media;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import com.yaronengineering.blog.common.ErrorResponse;
import com.yaronengineering.blog.common.PageResponse;
import com.yaronengineering.blog.common.Paging;
import com.yaronengineering.blog.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {
    private static final Logger log = LoggerFactory.getLogger(MediaService.class);
    private static final int MIN_WIDTH = 320, MIN_HEIGHT = 180;

    private final MediaRepository media;
    private final StorageService storage;
    private final AppProperties props;

    public MediaService(MediaRepository media, StorageService storage, AppProperties props) {
        this.media = media;
        this.storage = storage;
        this.props = props;
    }

    @Transactional(readOnly = true)
    public PageResponse<MediaDto> list(Integer page, Integer size, String q) {
        var pageable = Paging.of(page, size, null);
        var result = q == null || q.isBlank()
            ? media.findAllByOrderByCreatedAtDesc(pageable)
            : media.findByAltTextContainingIgnoreCaseOrOriginalFilenameContainingIgnoreCaseOrderByCreatedAtDesc(q, q, pageable);
        return PageResponse.from(result, MediaDto::from);
    }

    @Transactional
    public MediaDto upload(MultipartFile file, String altText) {
        Media m = new Media();
        writeFile(m, file);
        m.setAltText(requireAlt(altText));
        m = media.save(m);
        log.info("admin: media uploaded id={} type={} bytes={}", m.getId(), m.getMimeType(), m.getSizeBytes());
        return MediaDto.from(m);
    }

    @Transactional
    public MediaDto updateAlt(UUID id, String altText) {
        Media m = media.findById(id).orElseThrow(() -> ApiException.notFound("Media"));
        m.setAltText(requireAlt(altText));
        return MediaDto.from(m);
    }

    @Transactional
    public MediaDto replace(UUID id, MultipartFile file) {
        Media m = media.findById(id).orElseThrow(() -> ApiException.notFound("Media"));
        String oldKey = m.getStorageKey();
        writeFile(m, file);
        try {
            storage.delete(oldKey);
        } catch (IOException e) {
            log.warn("Could not delete replaced media file {}", oldKey);
        }
        log.info("admin: media replaced id={}", id);
        return MediaDto.from(m);
    }

    @Transactional
    public void delete(UUID id) {
        Media m = media.findById(id).orElseThrow(() -> ApiException.notFound("Media"));
        if (media.referencedByArticles(id) || media.referencedByAuthors(id)) throw ApiException.conflict("Media is still referenced");
        media.delete(m);
        try {
            storage.delete(m.getStorageKey());
        } catch (IOException e) {
            log.warn("Could not delete media file {}", m.getStorageKey());
        }
        log.info("admin: media deleted id={}", id);
    }

    private void writeFile(Media m, MultipartFile file) {
        if (file == null || file.isEmpty()) throw ApiException.validation("File is required", List.of(new ErrorResponse.FieldError("file", "must not be empty")));
        long max = (long) props.media().maxSizeMb() * 1024 * 1024;
        if (file.getSize() > max) throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, ErrorCode.PAYLOAD_TOO_LARGE, "File exceeds " + props.media().maxSizeMb() + " MB");
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Could not read uploaded file");
        }
        ImageProbe.Info info = ImageProbe.probe(bytes).orElseThrow(() ->
            new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ErrorCode.UNSUPPORTED_MEDIA_TYPE, "Only JPEG, PNG, WebP and GIF images are accepted"));
        if (info.width() != null && info.height() != null && (info.width() < MIN_WIDTH || info.height() < MIN_HEIGHT)) {
            throw ApiException.validation("Image is too small", List.of(new ErrorResponse.FieldError("file", "minimum " + MIN_WIDTH + "×" + MIN_HEIGHT + " pixels")));
        }
        try {
            StorageService.Stored stored = storage.store(new ByteArrayInputStream(bytes), bytes.length, info.extension());
            m.setStorageKey(stored.key());
            m.setUrl(stored.publicUrl());
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, "Could not store file");
        }
        m.setMimeType(info.mimeType());
        m.setWidth(info.width());
        m.setHeight(info.height());
        m.setSizeBytes(bytes.length);
        m.setOriginalFilename(file.getOriginalFilename() == null ? null : file.getOriginalFilename().replaceAll("[\\r\\n]", "").substring(0, Math.min(300, file.getOriginalFilename().length())));
    }

    private static String requireAlt(String alt) {
        if (alt == null || alt.isBlank()) throw ApiException.validation("Alt text is required", List.of(new ErrorResponse.FieldError("altText", "must not be blank")));
        return alt.trim().substring(0, Math.min(300, alt.trim().length()));
    }
}
