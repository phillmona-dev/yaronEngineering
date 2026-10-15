package com.yaronengineering.blog.settings;

import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {
    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR','AUTHOR')")
    public SettingsDto get() {
        return service.get();
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SettingsDto update(@Valid @RequestBody SettingsDto dto) {
        return service.update(dto);
    }
}
