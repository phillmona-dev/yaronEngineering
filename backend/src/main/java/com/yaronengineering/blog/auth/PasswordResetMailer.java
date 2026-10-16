package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.config.AppProperties;
import com.yaronengineering.blog.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Properties;

/**
 * Delivers password reset links. With SMTP configured (app.mail.host) the link is emailed;
 * otherwise it is written to the server log so local development still works end to end.
 */
@Component
public class PasswordResetMailer {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetMailer.class);

    private final JavaMailSender sender; // null when SMTP is not configured
    private final String from;

    public PasswordResetMailer(AppProperties props) {
        AppProperties.Mail mail = props.mail();
        this.from = mail == null || isBlank(mail.from()) ? "no-reply@yaronengineering.com" : mail.from();
        if (mail == null || isBlank(mail.host())) {
            this.sender = null;
            log.warn("auth: SMTP is not configured (SMTP_HOST empty); password reset links will be logged, not emailed");
        } else {
            JavaMailSenderImpl impl = new JavaMailSenderImpl();
            impl.setHost(mail.host());
            impl.setPort(mail.port() > 0 ? mail.port() : 587);
            if (!isBlank(mail.username())) {
                impl.setUsername(mail.username());
                impl.setPassword(mail.password());
            }
            Properties p = impl.getJavaMailProperties();
            p.put("mail.smtp.auth", String.valueOf(!isBlank(mail.username())));
            p.put("mail.smtp.starttls.enable", String.valueOf(mail.starttls()));
            p.put("mail.smtp.connectiontimeout", "10000");
            p.put("mail.smtp.timeout", "10000");
            p.put("mail.smtp.writetimeout", "10000");
            this.sender = impl;
        }
    }

    public boolean isEmailEnabled() {
        return sender != null;
    }

    public void sendResetLink(User user, String resetUrl, Instant expiresAt) {
        long minutes = Math.max(1, Duration.between(Instant.now(), expiresAt).toMinutes());
        if (sender == null) {
            log.warn("auth: PASSWORD RESET LINK for {} (valid {} min): {}", user.getEmail(), minutes, resetUrl);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(user.getEmail());
        msg.setSubject("Reset your Yaron CMS password");
        msg.setText("""
            Hello %s,

            Someone requested a password reset for your Yaron Engineering Knowledge Hub account.
            Open the link below within %d minutes to choose a new password:

            %s

            If you did not request this, you can ignore this email. Your password will not change.
            """.formatted(user.getName(), minutes, resetUrl));
        sender.send(msg);
        log.info("auth: password reset email sent to userId={}", user.getId());
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
