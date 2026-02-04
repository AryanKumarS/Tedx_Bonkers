import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';

interface TicketRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTicketType: 'VIP' | 'General';
}

const TicketRegistrationModal: React.FC<TicketRegistrationModalProps> = ({
    isOpen,
    onClose,
    defaultTicketType,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        ticketType: defaultTicketType,
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        phone: '',
        email: '',
    });

    // Reset form and update ticket type when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                phone: '',
                email: '',
                ticketType: defaultTicketType,
            });
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen, defaultTicketType]);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'phone') {
            if (value && value.length !== 10) {
                error = 'Phone number must be exactly 10 digits.';
            }
        }
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                error = 'Please enter a valid email address.';
            }
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let newValue = value;

        // Validation: Phone number should only contain numbers
        if (name === 'phone') {
            newValue = value.replace(/\D/g, ''); // Remove non-numeric chars
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));

        // Real-time validation
        if (name === 'phone' || name === 'email') {
            validateField(name, newValue);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        // Final Validation check before submit
        const phoneError = validateField('phone', formData.phone);
        const emailError = validateField('email', formData.email);

        if (phoneError || emailError) {
            setStatus('idle');
            return;
        }

        // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbylNGgEsN-4K0fZ59q1ojmqUNUk_xj2CSL16rKe0R4L1ryi07UozDg73pDalNgkHhUQXw/exec';


        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                // content-type header can cause CORS issues with Google Apps Script, text/plain is safer
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
                className="
          relative w-full max-w-md bg-black border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8
          transform transition-all duration-300 scale-100
        "
                style={{
                    boxShadow: formData.ticketType === 'VIP' ? '0 0 40px rgba(195, 195, 195, 0.2)' : '0 0 40px rgba(0, 157, 178, 0.2)'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <h2 className={`text-2xl font-bold mb-6 text-center ${formData.ticketType === 'VIP' ? 'text-[#c3c3c3]' : 'text-[#009db2]'}`}>
                    {status === 'success' ? 'Registration Complete!' : 'Secure Your Spot'}
                </h2>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className={`rounded-full p-4 ${formData.ticketType === 'VIP' ? 'bg-[#c3c3c3]/20 text-[#c3c3c3]' : 'bg-[#009db2]/20 text-[#009db2]'}`}>
                            <Check className="w-12 h-12" />
                        </div>
                        <p className="text-white/80 text-center">
                            Thank you, {formData.name}!<br />
                            We'll be contacting you shortly at {formData.phone}.
                        </p>
                        <button
                            onClick={onClose}
                            className={`
                mt-6 px-6 py-2 rounded-lg font-bold text-black transition-transform hover:scale-105
                ${formData.ticketType === 'VIP' ? 'bg-[#c3c3c3] hover:bg-[#b0b0b0]' : 'bg-[#009db2] hover:bg-[#008c9e]'}
              `}
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="Enter Your Name"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                                {fieldErrors.phone && (
                                    <span className="text-red-400 text-xs font-medium animate-pulse">{fieldErrors.phone}</span>
                                )}
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="Enter Your Phone Number"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-400">Email Address</label>
                                {fieldErrors.email && (
                                    <span className="text-red-400 text-xs font-medium animate-pulse">{fieldErrors.email}</span>
                                )}
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="Enter Student Email"
                            />
                        </div>

                        {/* Ticket Type Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ticket Type</label>
                            <div className="relative">
                                <select
                                    name="ticketType"
                                    value={formData.ticketType}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="VIP" className="bg-black text-[#c3c3c3]">VIP Ticket</option>
                                    <option value="General" className="bg-black text-[#009db2]">General Attendee</option>
                                </select>
                                {/* Custom arrow if needed, but simple for now */}
                            </div>
                        </div>

                        {/* Error Message */}
                        {status === 'error' && (
                            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className={`
                w-full mt-6 py-4 rounded-lg font-bold text-black text-lg transition-all duration-300
                flex items-center justify-center gap-2
                ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
                ${formData.ticketType === 'VIP' ? 'bg-[#c3c3c3] hover:bg-[#b0b0b0]' : 'bg-[#009db2] hover:bg-[#008c9e]'}
              `}
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm & Register'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TicketRegistrationModal;
