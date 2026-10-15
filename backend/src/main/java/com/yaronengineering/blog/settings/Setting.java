package com.yaronengineering.blog.settings;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @Column(name = "key")
    private String key;
    private String value;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;

    public static Setting of(String key, String value) {
        Setting s = new Setting();
        s.key = key;
        s.value = value;
        return s;
    }

    public String getKey() { return key; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
