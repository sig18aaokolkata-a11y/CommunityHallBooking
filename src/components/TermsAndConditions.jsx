import React from 'react';

const TermsAndConditions = ({ style, className }) => {
    return (
        <div style={style} className={className}>
            <h3>Terms and Conditions:</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Booking is subject to availability and prior approval by the Association.</li>
                <li>
                    Booking charge is Rs.2500/- (non-refundable) and Security Deposit of Rs.2000/- (refundable) – Rs. 4500/- in total to be transferred to Association Account (cash is not accepted), and payment confirmation to be emailed to Association id: SIG18AAOKOLKATA@GMAIL.COM
                </li>
                <li>
                    Please make a note of electric meter reading before and after event in coordination with Facility Manager. Units consumed to be charged @Rs. 12/- per unit and to be adjusted against advance Security Deposit paid.
                </li>
                <li>The hall must be left clean after use.</li>
                <li>
                    Any damage to property will be the responsibility of the booking owner, and damages will be adjusted against security deposit with the owner liable to pay surplus amounts, if any.
                </li>
                <li>Noise levels should be kept under control to avoid disturbance.</li>
                <li>Community rules and regulations must be strictly followed.</li>
            </ul>
        </div>
    );
};

export default TermsAndConditions;
