import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const recaptchaRef = useRef<ReCAPTCHA | null>(null);
