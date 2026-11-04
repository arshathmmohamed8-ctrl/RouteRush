package com.routerush.dto;

import java.math.BigDecimal;

public record SeatDto(
        Long id,
        String seatNumber,
        String seatType,
        String status,
        BigDecimal price,
        String deck
) {
}
