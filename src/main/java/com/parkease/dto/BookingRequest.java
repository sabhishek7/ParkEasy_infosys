package com.parkease.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private String userId;
    private String locationName;
    private String startTime; // ISO format string preferred from frontend
    private Integer duration;
    private Double price;
}
