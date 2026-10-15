package com.yaronengineering.blog.newsletter;

/** Pluggable delivery provider (Mailchimp, Brevo, SendGrid, SES…). The domain never depends on a vendor SDK. */
public interface NewsletterProvider {
    void subscribe(String email, String source);
}
