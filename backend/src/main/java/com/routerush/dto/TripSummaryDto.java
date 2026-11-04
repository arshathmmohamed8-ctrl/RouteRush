package com.routerush.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponseDto(
        Long id,
        String userId,
        Long tripId,
        String bookingRef,
        String status,
        BigDecimal totalAmount,
        String boardingPoint,
        String droppingPoint,
        String paymentMethod,
        LocalDateTime createdAt
) {
}
