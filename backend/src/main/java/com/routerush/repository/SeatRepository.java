package com.routerush.repository;

import com.routerush.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("select t from Trip t " +
            "join fetch t.route r " +
            "join fetch r.fromCity fc " +
            "join fetch r.toCity tc " +
            "join fetch t.bus b " +
            "join fetch b.operator o " +
            "where t.status = 'scheduled' " +
            "and (:fromCity is null or lower(fc.name) like lower(concat('%', :fromCity, '%'))) " +
            "and (:toCity is null or lower(tc.name) like lower(concat('%', :toCity, '%'))) " +
            "and t.availableSeats >= :passengerCount " +
            "and t.departureTime >= :start and t.departureTime < :end " +
            "order by t.departureTime asc")
    List<Trip> searchTrips(@Param("fromCity") String fromCity,
                           @Param("toCity") String toCity,
                           @Param("passengerCount") int passengerCount,
                           @Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);
} 
