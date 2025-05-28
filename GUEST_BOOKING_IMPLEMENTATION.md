# Guest Booking and Payment Implementation

This document outlines the complete implementation of guest booking functionality that allows users to book properties and process payments without requiring authentication.

## Overview

The guest booking system allows users to:
1. Browse properties without authentication
2. Create bookings as guest users
3. Process payments using a simplified payment intent flow
4. Receive booking confirmations
5. View booking success page with option to create account

## API Endpoints Implemented

### 1. Guest Booking Creation
- **Endpoint**: `POST /api/bookings/guest`
- **Purpose**: Creates a booking for guest users and auto-creates a guest account
- **Request Body**:
```json
{
  "property_id": 123,
  "check_in_date": "2024-06-01",
  "check_out_date": "2024-06-07",
  "guests": 2,
  "guest_name": "John Doe",
  "guest_email": "john@example.com",
  "guest_phone": "+12345678901",
  "special_requests": "Late check-in if possible",
  "user_info": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+12345678901",
    "birthday": "1990-01-01"
  }
}
```

### 2. Guest Booking Access
- **Endpoint**: `POST /api/bookings/[id]/guest-access`
- **Purpose**: Allows guest users to access booking details using their email
- **Request Body**:
```json
{
  "guest_email": "john@example.com"
}
```
- **Use Case**: Used by checkout page and success page to fetch booking details for guests

### 3. Quick Payment Intent
- **Endpoint**: `POST /api/payments/quick-intent`
- **Purpose**: Creates a simplified payment intent using booking ID in request body
- **Request Body**:
```json
{
  "booking_id": 123
}
```
- **Response**:
```json
{
  "client_secret": "pi_3N9kXmXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXXX",
  "amount": 900.00,
  "id": "pi_3N9kXmXXXXXXXXXXXXXXXXXX"
}
```

### 4. Payment Confirmation
- **Endpoint**: `POST /api/payments/confirm` (for authenticated users)
- **Endpoint**: `POST /api/payments/guest/confirm` (for guest users)
- **Purpose**: Confirms payment after Stripe processing

## Frontend Implementation

### 1. BookingSection Component Updates
- **File**: `src/app/properties/[id]/BookingSection.jsx`
- **Changes**:
  - Removed authentication requirement
  - Added guest booking flow with `user_info` object
  - Maintained existing authenticated user flow
  - Added validation for guest information including date of birth

### 2. Payment Service Enhancements
- **File**: `src/services/payment.js`
- **New Methods**:
  - `createQuickPaymentIntent(bookingId)`: Simplified payment intent creation
  - Enhanced `createPaymentIntent()` and `processPayment()` to detect authentication status
  - Automatic endpoint selection based on user authentication

### 3. Booking Service Updates
- **File**: `src/services/booking.js`
- **Enhanced Methods**:
  - `getBookingById(id, guestEmail)`: Automatically detects authentication and uses appropriate endpoint
  - `createGuestBooking()`: Caches guest email and booking data for future access
- **Guest Email Caching**: 
  - Stores guest email in localStorage during booking creation
  - Automatically retrieves cached email for subsequent booking access
  - Fallback to manual email parameter if cache unavailable

### 4. Stripe Context Updates
- **File**: `src/contexts/StripeContext.jsx`
- **New Features**:
  - `createQuickPaymentIntent()` method for guest users
  - Smart caching system for payment intents
  - Mock implementation support for development

### 5. Payment Form Enhancements
- **File**: `src/components/StripePaymentForm.jsx`
- **Updates**:
  - Automatic detection of user authentication status
  - Uses `createQuickPaymentIntent()` for guests
  - Uses regular `createPaymentIntent()` for authenticated users
  - Handles both `client_secret` and `stripe_client_secret` response formats

### 6. Success Page Improvements
- **File**: `src/app/checkout/[id]/success/page.jsx`
- **Features**:
  - Guest user detection and specialized UI
  - Account creation prompt for guests
  - Different navigation options based on authentication status
  - PDF generation for booking confirmations

## User Flow

### Guest Booking Flow
1. **Property Selection**: User browses properties without authentication
2. **Booking Form**: User fills out booking details including:
   - Personal information (name, email, phone)
   - Date of birth (required, must be 18+)
   - Stay dates and guest count
   - Special requests
   - Terms and conditions acceptance
3. **Booking Creation**: System creates guest booking and auto-generates user account
4. **Payment Processing**: 
   - Quick payment intent created using simplified endpoint
   - Stripe processes payment with guest-specific flow
   - Payment confirmation handled through guest endpoints
5. **Success Page**: 
   - Confirmation displayed with booking details
   - Guest-specific messaging and navigation
   - Option to create full account

### Authenticated User Flow
1. User logs in normally
2. Pre-fills form with existing user data
3. Uses regular booking and payment endpoints
4. Full dashboard access after booking

## Testing Instructions

### 1. Guest Booking Test
1. Navigate to any property page without logging in
2. Fill out the booking form with valid information
3. Ensure date of birth shows user is 18+ years old
4. Accept terms and conditions
5. Click "Book Now & Proceed to Payment"
6. Verify redirect to checkout page

### 2. Payment Processing Test
1. On checkout page, verify booking details are correct
2. Enter test payment information (if using Stripe test mode)
3. Submit payment form
4. Verify payment processing uses quick-intent endpoint
5. Confirm successful redirect to success page

### 3. Success Page Test
1. Verify booking confirmation displays correctly
2. Check guest-specific messaging appears
3. Test PDF download functionality
4. Verify "Create Account" prompt is shown
5. Test navigation to home page (not dashboard)

## Backend Integration

The frontend expects these backend endpoints to be available:

1. `POST /bookings/guest` - Creates guest booking with user account
2. `POST /bookings/[id]/guest-access` - Allows guest access to booking details with email verification
3. `GET /bookings/[id]` - Protected endpoint for authenticated users to access booking details
4. `POST /payments/quick-intent` - Creates simplified payment intent with booking ID in request body
5. `POST /payments/confirm` - Confirms payment for authenticated users
6. `GET /payments/public-key` - Returns Stripe publishable key

### Authentication Flow

**For Authenticated Users:**
- Uses `GET /bookings/[id]` with authorization header
- Full access to all booking operations

**For Guest Users:**
- Uses `POST /bookings/[id]/guest-access` with guest email verification
- Limited access requiring email confirmation
- Email automatically cached during booking creation

## Security Considerations

1. **Guest Account Creation**: Backend auto-creates secure guest accounts
2. **Payment Security**: All payment processing through Stripe with secure tokens
3. **Data Validation**: Frontend validates all guest information before submission
4. **Age Verification**: Required date of birth validation for 18+ requirement

## Error Handling

1. **Booking Errors**: Clear error messages for invalid booking data
2. **Payment Failures**: Graceful handling with retry options
3. **Network Issues**: Proper loading states and error recovery
4. **Validation Errors**: Real-time form validation with helpful messaging

## Development Features

1. **Mock Mode**: Supports mock Stripe implementation for development
2. **Debug Logging**: Comprehensive logging for troubleshooting
3. **Rate Limiting**: Graceful fallback to mock mode on API rate limits
4. **Caching**: Smart caching of payment intents to prevent duplicates

## Future Enhancements

1. **Guest Login**: Allow guests to access bookings with email/booking reference
2. **Email Integration**: Send confirmation emails to guest users
3. **SMS Notifications**: Optional SMS booking confirmations
4. **Booking Management**: Allow guests to modify/cancel bookings
5. **Loyalty Program**: Incentives for guests to create full accounts

This implementation provides a complete guest booking experience while maintaining security and user experience standards. 