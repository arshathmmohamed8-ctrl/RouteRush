package com.routerush.service;

import com.routerush.dto.SeatDto;
import com.routerush.dto.TripSummaryDto;
import com.routerush.entity.Trip;
import com.routerush.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RouteRushService {

    private final TripRepository tripRepository;

    public RouteRushService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<TripSummaryDto> searchTrips(String from, String to, LocalDate date, int passengerCount) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        LocalDateTime start = targetDate.atStartOfDay();
        LocalDateTime end = targetDate.plusDays(1).atStartOfDay();

        String fromCity = from == null || from.isBlank() ? null : from.trim();
        String toCity = to == null || to.isBlank() ? null : to.trim();

        return tripRepository.searchTrips(fromCity, toCity, passengerCount, start, end)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    public Trip getTripDetails(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new NoSuchElementException("Trip not found with id: " + tripId));
    }

    public List<SeatDto> getSeatAvailability(Long tripId) {
        Trip trip = getTripDetails(tripId);
        return trip.getBus() == null ? List.of() : List.of();
    }

    private TripSummaryDto toSummary(Trip trip) {
        return new TripSummaryDto(
                trip.getId(),
                trip.getBus().getName(),
                trip.getBus().getOperator().getCompanyName(),
                trip.getRoute().getFromCity().getName(),
                trip.getRoute().getToCity().getName(),
                trip.getDepartureTime(),
                trip.getArrivalTime(),
                trip.getFare(),
                trip.getAvailableSeats(),
                trip.getBus().getBusType(),
                trip.getStatus()
        );
    }
}
