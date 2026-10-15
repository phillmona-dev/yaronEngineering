package com.yaronengineering.blog.media;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Optional;

/** Detects image type from magic bytes and reads dimensions when ImageIO supports the format. */
public final class ImageProbe {
    private ImageProbe() {}

    public record Info(String mimeType, String extension, Integer width, Integer height) {}

    public static Optional<Info> probe(byte[] bytes) {
        String mime = detect(bytes);
        if (mime == null) return Optional.empty();
        String ext = switch (mime) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/gif" -> "gif";
            default -> "bin";
        };
        Integer w = null, h = null;
        try (ImageInputStream iis = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (readers.hasNext()) {
                ImageReader r = readers.next();
                try {
                    r.setInput(iis);
                    w = r.getWidth(0);
                    h = r.getHeight(0);
                } finally {
                    r.dispose();
                }
            }
        } catch (IOException | RuntimeException ignored) {
            // Unsupported by ImageIO (e.g. WebP without a plugin): dimensions stay null.
        }
        return Optional.of(new Info(mime, ext, w, h));
    }

    static String detect(byte[] b) {
        if (b == null || b.length < 12) return null;
        if ((b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) return "image/jpeg";
        if ((b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return "image/png";
        if (b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8') return "image/gif";
        if (b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') return "image/webp";
        return null;
    }
}
