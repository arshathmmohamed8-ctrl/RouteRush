package com.routerush.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TripSummaryDto(
        Long id,
        String busName,
        String operatorName,
        String fromCity,
        String toCity,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal fare,
        Integer availableSeats,
        String busType,
        String status
) {
}
