package com.yaronengineering.blog.media;

import java.io.IOException;
import java.io.InputStream;

/** Abstraction over where binary media lives. Local disk today; S3/Azure/R2/MinIO can implement the same contract. */
public interface StorageService {
    record Stored(String key, String publicUrl) {}

    Stored store(InputStream content, long size, String extension) throws IOException;

    void delete(String key) throws IOException;
}
