'use client'

import React, { useEffect } from 'react';

const ConversionTracker: React.FC = () => {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'allow_custom_scripts': true,
        'send_to': 'DC-13776505/websi0/quran000+standard'
      });
    }
  }, []);

  return (
    <noscript>
      <img
        src="https://ad.doubleclick.net/ddm/activity/src=13776505;type=websi0;cat=quran000;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1?"
        width="1"
        height="1"
        alt=""
      />
    </noscript>
  );
};

export default ConversionTracker;
