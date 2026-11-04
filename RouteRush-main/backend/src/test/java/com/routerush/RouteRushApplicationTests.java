package com.routerush.service;

import com.routerush.dto.BookingRequestDto;
import com.routerush.dto.BookingResponseDto;
import com.routerush.entity.Booking;
import com.routerush.entity.BookingPassenger;
import com.routerush.entity.Seat;
import com.routerush.entity.Trip;
import com.routerush.repository.BookingPassengerRepository;
import com.routerush.repository.BookingRepository;
import com.routerush.repository.SeatRepository;
import com.routerush.repository.TripRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingPassengerRepository bookingPassengerRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BookingPassengerRepository bookingPassengerRepository,
            TripRepository tripRepository,
            SeatRepository seatRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new NoSuchElementException("Trip not found with id: " + request.getTripId()));

        if (request.getSeatNumbers().size() != request.getPassengers().size()) {
            throw new IllegalArgumentException("Seat count must match passenger count");
        }

        if (trip.getAvailableSeats() < request.getSeatNumbers().size()) {
            throw new IllegalArgumentException("Not enough seats available on this trip");
        }

        List<Seat> seats = new ArrayList<>();
        for (String seatNumber : request.getSeatNumbers()) {
            Seat seat = seatRepository.findByTripIdAndSeatNumber(trip.getId(), seatNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Seat " + seatNumber + " is not available for this trip"));
            if (!"available".equalsIgnoreCase(seat.getStatus())) {
                throw new IllegalArgumentException("Seat " + seatNumber + " is already booked");
            }
            seats.add(seat);
        }

        String bookingRef = "RR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal totalAmount = trip.getFare().multiply(BigDecimal.valueOf(request.getSeatNumbers().size()));

        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setTrip(trip);
        booking.setBookingRef(bookingRef);
        booking.setStatus("confirmed");
        booking.setTotalAmount(totalAmount);
        booking.setBoardingPoint(request.getBoardingPoint());
        booking.setDroppingPoint(request.getDroppingPoint());
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setCreatedAt(LocalDateTime.now());
        booking = bookingRepository.save(booking);

        for (int i = 0; i < request.getPassengers().size(); i++) {
            BookingPassenger passenger = new BookingPassenger();
            passenger.setBooking(booking);
            passenger.setName(request.getPassengers().get(i).getName());
            passenger.setAge(request.getPassengers().get(i).getAge());
            passenger.setGender(request.getPassengers().get(i).getGender());
            passenger.setSeatNumber(request.getSeatNumbers().get(i));
            bookingPassengerRepository.save(passenger);
        }

        for (Seat seat : seats) {
            seat.setStatus("booked");
            seatRepository.save(seat);
        }

        trip.setAvailableSeats(trip.getAvailableSeats() - request.getSeatNumbers().size());
        tripRepository.save(trip);

        return new BookingResponseDto(
                booking.getId(),
                booking.getUserId(),
                trip.getId(),
                booking.getBookingRef(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getBoardingPoint(),
                booking.getDroppingPoint(),
                booking.getPaymentMethod(),
                booking.getCreatedAt()
        );
    }

    public BookingResponseDto getBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NoSuchElementException("Booking not found with id: " + bookingId));

        return new BookingResponseDto(
                booking.getId(),
                booking.getUserId(),
                booking.getTrip().getId(),
                booking.getBookingRef(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getBoardingPoint(),
                booking.getDroppingPoint(),
                booking.getPaymentMethod(),
                booking.getCreatedAt()
        );
    }

    public List<BookingResponseDto> getBookingsByUser(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(booking -> new BookingResponseDto(
                        booking.getId(),
                        booking.getUserId(),
                        booking.getTrip().getId(),
                        booking.getBookingRef(),
                        booking.getStatus(),
                        booking.getTotalAmount(),
                        booking.getBoardingPoint(),
                        booking.getDroppingPoint(),
                        booking.getPaymentMethod(),
                        booking.getCreatedAt()
                ))
                .toList();
    }
}
