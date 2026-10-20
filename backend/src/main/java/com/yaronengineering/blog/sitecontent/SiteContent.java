package com.yaronengineering.blog.sitecontent;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** One editable section of the public website, stored as a JSON document. */
@Entity
@Table(name = "site_content")
public class SiteContent {
    @Id
    @Column(name = "section", length = 60)
    private String section;

    @Column(name = "data", nullable = false, columnDefinition = "text")
    private String data;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "updated_by", length = 200)
    private String updatedBy;

    public static SiteContent of(String section, String data, String updatedBy, Instant now) {
        SiteContent c = new SiteContent();
        c.section = section;
        c.data = data;
        c.updatedBy = updatedBy;
        c.updatedAt = now;
        return c;
    }

    public String getSection() { return section; }
    public String getData() { return data; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getUpdatedBy() { return updatedBy; }

    public void update(String data, String updatedBy, Instant now) {
        this.data = data;
        this.updatedBy = updatedBy;
        this.updatedAt = now;
    }
}
