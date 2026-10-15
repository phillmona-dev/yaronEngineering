package com.yaronengineering.blog.media;

import com.yaronengineering.blog.common.PageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@PreAuthorize("hasAnyRole('ADMIN','EDITOR','AUTHOR')")
public class MediaController {
    private final MediaService service;

    public MediaController(MediaService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<MediaDto> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size,
                                       @RequestParam(required = false) String q) {
        return service.list(page, size, q);
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaDto upload(@RequestParam("file") MultipartFile file, @RequestParam(value = "altText", required = false) String altText) {
        return service.upload(file, altText);
    }

    @PutMapping("/{id}")
    public MediaDto updateAlt(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        return service.updateAlt(id, body.get("altText"));
    }

    @PostMapping(value = "/{id}/replace", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public MediaDto replace(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        return service.replace(id, file);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
