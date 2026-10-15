package com.yaronengineering.blog.media;

import com.yaronengineering.blog.config.AppProperties;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {
    private final Path root;
    private final String publicBase;

    public LocalStorageService(AppProperties props) {
        this.root = Path.of(props.media().storagePath()).toAbsolutePath().normalize();
        String base = props.media().publicBaseUrl();
        this.publicBase = base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
    }

    @Override
    public Stored store(InputStream content, long size, String extension) throws IOException {
        LocalDate today = LocalDate.now();
        String key = String.format("%04d/%02d/%s.%s", today.getYear(), today.getMonthValue(), UUID.randomUUID(), extension);
        Path target = root.resolve(key).normalize();
        if (!target.startsWith(root)) throw new IOException("Invalid storage path");
        Files.createDirectories(target.getParent());
        Files.copy(content, target, StandardCopyOption.REPLACE_EXISTING);
        return new Stored(key, publicBase + "/media/files/" + key);
    }

    @Override
    public void delete(String key) throws IOException {
        if (key == null) return;
        Path target = root.resolve(key).normalize();
        if (target.startsWith(root)) Files.deleteIfExists(target);
    }
}
