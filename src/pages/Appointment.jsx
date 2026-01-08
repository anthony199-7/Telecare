import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx'; // FIX: Added explicit .jsx extension
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Generate fixed time slots for the day (e.g., 9:00 AM to 5:00 PM)
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) { // 9 AM to 4 PM (for 1-hour slots)
        slots.push(`${hour}:00`);
    }
    return slots;
};

const fixedTimeSlots = generateTimeSlots();

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, token, currencySymbol } = useContext(AppContext);

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [selectedTime, setSelectedTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);

    const minDate = formatDate(new Date());

    useEffect(() => {
        if (doctor) {
            const dateKey = selectedDate;
            const booked = doctor.slots_booked && doctor.slots_booked[dateKey] ? doctor.slots_booked[dateKey] : [];
            setBookedSlots(booked);
            if (booked.includes(selectedTime)) {
                setSelectedTime('');
            }
        }
    }, [doctor, selectedDate, selectedTime]);

    // --- FIX 1: URL corrected to plural '/doctors' ---
    const fetchDoctorDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/doctors/${docId}`); 
            const data = await response.json();

            if (data.success) {
                setDoctor(data.doctor);
            } else {
                toast.error(data.message);
                navigate('/doctors');
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            toast.error("Failed to load doctor details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (docId) {
            fetchDoctorDetails();
        }
    }, [docId, backendUrl, navigate]);

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Please login to book an appointment.');
            return navigate('/login');
        }

        if (!selectedDate || !selectedTime) {
            toast.error('Please select both a date and a time slot.');
            return;
        }

        setIsBooking(true);
        try {
            // --- FIX 2: URL corrected to plural '/users' and hyphenated 'book-appointment' ---
            const response = await fetch(`${backendUrl}/api/users/book-appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    docId,
                    slotDate: selectedDate,
                    slotTime: selectedTime
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Appointment booked successfully!');
                setDoctor(prevDoctor => {
                    const newSlots = { ...prevDoctor.slots_booked };
                    if (!newSlots[selectedDate]) {
                        newSlots[selectedDate] = [];
                    }
                    newSlots[selectedDate].push(selectedTime);
                    return { ...prevDoctor, slots_booked: newSlots };
                });
                setSelectedTime('');
                navigate('/my-appointments'); 
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Booking failed:', error);
            toast.error('An error occurred during booking.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-lg text-gray-600">Loading doctor details...</div>;
    }

    if (!doctor) {
        return <div className="text-center py-20 text-lg text-red-500">Doctor not found.</div>;
    }
    
    if (!doctor.available) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Booking</h2>
                <p className="text-red-600 font-semibold">
                    Dr. {doctor.name} is currently marked as unavailable for new appointments.
                </p>
                <button 
                    onClick={() => navigate('/doctors')} 
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Go back to Doctor List
                </button>
            </div>
        );
    }

    return (
        <div className='p-4 min-h-screen bg-gray-50'>
            <div className='max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl'>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">Book Appointment</h2>
                
                <div className="flex items-center space-x-4 mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <img
                        className='w-16 h-16 object-cover rounded-full border-2 border-indigo-400'
                        src={doctor.image ? `${backendUrl}/images/${doctor.image}` : 'https://placehold.co/64x64/e0e7ff/3f3f46?text=Dr'}
                        alt={`Dr. ${doctor.name}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/e0e7ff/3f3f46?text=Dr' }}
                    />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-indigo-600">{doctor.speciality} | Fee: {currencySymbol}{doctor.fees}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                        id="date"
                        type="date"
                        min={minDate}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {fixedTimeSlots.map(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            const isSelected = selectedTime === slot;
                            
                            return (
                                <button
                                    key={slot}
                                    onClick={() => !isBooked && setSelectedTime(slot)}
                                    disabled={isBooked || isBooking}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm
                                        ${isBooked 
                                            ? 'bg-red-100 text-red-700 cursor-not-allowed line-through' 
                                            : isSelected 
                                                ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                                                : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:shadow-md'
                                        }`
                                    }
                                >
                                    {isBooked ? 'Booked' : slot}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t pt-6 flex justify-between items-center">
                    <div className='text-xl font-bold text-gray-800'>
                        Total Fee: <span className='text-indigo-600'>{currencySymbol}{doctor.fees}</span>
                    </div>
                    <button
                        onClick={bookAppointment}
                        disabled={!selectedTime || isBooking}
                        className={`px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 transform 
                            ${!selectedTime || isBooking
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                            }`
                        }
                    >
                        {isBooking ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Appointment;