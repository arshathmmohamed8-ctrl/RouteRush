package com.routerush.repository;

import com.routerush.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByTripIdOrderBySeatNumberAsc(Long tripId);
    Optional<Seat> findByTripIdAndSeatNumber(Long tripId, String seatNumber);
}
