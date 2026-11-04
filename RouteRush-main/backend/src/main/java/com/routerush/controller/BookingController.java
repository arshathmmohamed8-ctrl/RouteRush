package com.routerush.controller;

import com.routerush.dto.TripSummaryDto;
import com.routerush.dto.SeatDto;
import com.routerush.service.RouteRushService;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BusController {

    private final RouteRushService routeRushService;

    public BusController(RouteRushService routeRushService) {
        this.routeRushService = routeRushService;
    }

    @GetMapping("/search")
    public List<TripSummaryDto> searchTrips(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @RequestParam(required = false) LocalDate date,
            @RequestParam(defaultValue = "1") @Min(1) int passengers
    ) {
        return routeRushService.searchTrips(from, to, date, passengers);
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<?> getTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(routeRushService.getTripDetails(tripId));
    }

    @GetMapping("/trips/{tripId}/seats")
    public List<SeatDto> getTripSeats(@PathVariable Long tripId) {
        return routeRushService.getSeatAvailability(tripId);
    }
}
