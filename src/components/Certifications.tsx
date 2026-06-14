'use client';

import { certifications } from '@/data/certifications';
import SectionWrapper from './SectionWrapper';
import GlassCard from './ui/GlassCard';

/** Inline SVG logos for certification issuers */
function IssuerLogo({ logo }: { logo?: string }) {
  switch (logo) {
    case 'aws':
      return (
        <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none" aria-label="Amazon Web Services logo">
          <path d="M18.9 33.2c0 .7.1 1.3.2 1.7.2.5.4.9.6 1.5.1.2.1.3.1.4 0 .2-.1.4-.4.6l-1.2.8c-.2.1-.3.2-.5.2-.2 0-.4-.1-.5-.3-.3-.3-.5-.6-.7-1-.2-.4-.4-.8-.7-1.3-1.7 2-3.8 3-6.4 3-1.8 0-3.3-.5-4.4-1.6-1.1-1-1.6-2.4-1.6-4.1 0-1.8.6-3.3 1.9-4.4 1.3-1.1 3-1.6 5.1-1.6.7 0 1.4.1 2.2.2.8.1 1.6.3 2.4.5v-1.6c0-1.6-.3-2.8-1-3.4-.7-.7-1.9-1-3.6-1-.8 0-1.6.1-2.4.3-.8.2-1.6.5-2.4.8-.4.2-.6.2-.8.3-.1 0-.2.1-.3.1-.2 0-.3-.2-.3-.5v-1c0-.3 0-.5.1-.6.1-.1.2-.3.5-.4.8-.4 1.7-.7 2.8-1 1.1-.3 2.2-.4 3.4-.4 2.6 0 4.5.6 5.7 1.8 1.2 1.2 1.8 3 1.8 5.5v7.2h.1zm-8.8 3.3c.7 0 1.4-.1 2.2-.4.8-.3 1.5-.7 2-1.4.3-.4.6-.8.7-1.3.1-.5.2-1.1.2-1.8v-.9c-.6-.2-1.2-.3-1.9-.4-.7-.1-1.3-.1-2-.1-1.4 0-2.4.3-3.1.8-.7.6-1 1.3-1 2.4 0 1 .3 1.7.8 2.2.5.6 1.2.9 2.1.9zm17.5 2.3c-.3 0-.5-.1-.6-.2-.1-.1-.3-.4-.4-.8l-4.2-13.9c-.1-.4-.2-.7-.2-.8 0-.3.2-.5.5-.5h1.9c.3 0 .5.1.6.2.2.1.3.4.3.8l3 11.8 2.8-11.8c.1-.4.2-.7.3-.8.2-.1.4-.2.7-.2h1.5c.3 0 .5.1.7.2.1.2.3.4.3.8l2.8 11.9 3.1-11.9c.1-.4.2-.7.3-.8.2-.1.4-.2.6-.2h1.8c.3 0 .5.2.5.5 0 .1 0 .2-.1.4 0 .1-.1.3-.2.5l-4.3 13.9c-.1.4-.2.7-.4.8-.1.2-.4.2-.6.2h-1.7c-.3 0-.5-.1-.7-.2-.1-.2-.3-.4-.3-.8l-2.7-11.5-2.7 11.4c-.1.4-.2.7-.3.8-.2.2-.4.2-.7.2h-1.7zm28 .6c-1.1 0-2.1-.1-3.1-.4-1-.3-1.8-.6-2.3-1-.3-.2-.5-.4-.6-.6-.1-.2-.1-.4-.1-.5v-1.1c0-.4.1-.5.4-.5.1 0 .2 0 .3.1.1 0 .3.1.5.2.7.3 1.4.6 2.2.7.8.2 1.6.3 2.3.3 1.2 0 2.2-.2 2.8-.7.6-.5.9-1.1.9-2 0-.6-.2-1.1-.5-1.5-.4-.4-1-.7-2-1.1l-2.8-1c-1.5-.5-2.6-1.2-3.3-2.1-.7-.8-1-1.8-1-2.9 0-.8.2-1.6.5-2.2.4-.7.8-1.2 1.4-1.7.6-.5 1.3-.8 2-.1 .8-.2 1.6-.4 2.5-.4.4 0 .9 0 1.4.1.5.1.9.2 1.3.3.4.1.7.3 1 .4.3.1.5.3.6.4.2.2.3.3.4.5 0 .2.1.4.1.6v1c0 .4-.1.5-.4.5-.1 0-.4-.1-.7-.3-1.1-.5-2.4-.8-3.8-.8-1.1 0-2 .2-2.6.6-.6.4-.9 1-.9 1.9 0 .6.2 1.1.6 1.5.4.4 1.1.8 2.1 1.1l2.7.9c1.5.5 2.5 1.2 3.2 2 .6.8 1 1.8 1 2.9 0 .9-.2 1.7-.5 2.4-.4.7-.8 1.3-1.5 1.8-.6.5-1.4.9-2.2 1.1-.9.4-1.9.5-3 .5z" fill="#FF9900"/>
          <path d="M50.4 48.8c-5.9 4.4-14.5 6.7-21.8 6.7-10.3 0-19.6-3.8-26.6-10.2-.6-.5-.1-1.2.6-.8 7.6 4.4 16.9 7.1 26.6 7.1 6.5 0 13.7-1.3 20.3-4.1 1-.5 1.8.6.9 1.3z" fill="#FF9900"/>
          <path d="M52.7 46.2c-.8-1-5-0.5-6.9-.2-.6.1-.7-.4-.2-.8 3.4-2.4 8.9-1.7 9.6-.9.7.8-.2 6.2-3.3 8.8-.5.4-1 .2-.7-.3.7-1.8 2.3-5.6 1.5-6.6z" fill="#FF9900"/>
        </svg>
      );
    case 'google':
      return (
        <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none" aria-label="Google logo">
          <path d="M32.5 27.3v9.8h13.6c-.6 3.5-2.3 6.4-4.8 8.4l7.8 6c4.5-4.2 7.1-10.3 7.1-17.6 0-1.7-.2-3.4-.5-5H32.5z" fill="#4285F4"/>
          <path d="M14.8 38l-1.7 1.3-6.1 4.7c3.9 7.7 11.8 13 21 13 6.3 0 11.7-2.1 15.6-5.7l-7.8-6c-2.1 1.4-4.8 2.3-7.8 2.3-6 0-11.1-4-12.9-9.5l-.3-.1z" fill="#34A853"/>
          <path d="M7 20c-1.3 2.6-2 5.5-2 8.5s.7 5.9 2 8.5l7.8-6.1c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4L7 20z" fill="#FBBC05"/>
          <path d="M28 15.4c3.4 0 6.4 1.2 8.8 3.4l6.6-6.6C39.6 8.8 34.2 6.5 28 6.5c-9.2 0-17.1 5.3-21 13l7.8 6.1c1.8-5.5 6.9-10.2 13.2-10.2z" fill="#EA4335"/>
        </svg>
      );
    case 'ibm':
      return (
        <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none" aria-label="IBM logo">
          <g fill="#1F70C1">
            {/* I */}
            <rect x="6" y="16" width="10" height="3"/>
            <rect x="6" y="21" width="10" height="3"/>
            <rect x="8" y="26" width="6" height="3"/>
            <rect x="8" y="31" width="6" height="3"/>
            <rect x="8" y="36" width="6" height="3"/>
            <rect x="6" y="41" width="10" height="3"/>
            <rect x="6" y="46" width="10" height="3"/>
            {/* B */}
            <rect x="20" y="16" width="10" height="3"/>
            <path d="M30 16h5c2.5 0 4.5 1 4.5 3H30z"/>
            <rect x="20" y="21" width="10" height="3"/>
            <path d="M30 21h6.5c1.5 0 3 .5 3 3H30z"/>
            <rect x="22" y="26" width="8" height="3"/>
            <rect x="22" y="31" width="12" height="3"/>
            <rect x="22" y="36" width="8" height="3"/>
            <rect x="20" y="41" width="10" height="3"/>
            <path d="M30 41h7c1.5 0 3 .5 3 3H30z"/>
            <rect x="20" y="46" width="10" height="3"/>
            <path d="M30 46h5c2.5 0 4.5-1 4.5-3H30z"/>
            {/* M */}
            <rect x="42" y="16" width="4" height="3"/>
            <rect x="54" y="16" width="4" height="3"/>
            <rect x="42" y="21" width="5" height="3"/>
            <rect x="51" y="21" width="7" height="3"/>
            <rect x="44" y="26" width="4" height="3"/>
            <rect x="50" y="26" width="4" height="3"/>
            <rect x="44" y="31" width="10" height="3"/>
            <rect x="44" y="36" width="4" height="3"/>
            <rect x="50" y="36" width="4" height="3"/>
            <rect x="42" y="41" width="4" height="3"/>
            <rect x="52" y="41" width="4" height="3"/>
            <rect x="42" y="46" width="4" height="3"/>
            <rect x="52" y="46" width="4" height="3"/>
          </g>
        </svg>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <span className="text-white/60 text-xs font-bold">
            {logo?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      );
  }
}

export default function Certifications() {
  return (
    <SectionWrapper sectionId="certifications">
      <section id="certifications" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Certifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <GlassCard key={cert.id}>
              <div className="flex items-start gap-4">
                {/* Issuer Logo */}
                <div className="flex-shrink-0">
                  <IssuerLogo logo={cert.logo} />
                </div>

                {/* Cert Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-1">{cert.issuer}</p>
                  <p className="text-white/50 text-xs">{cert.date}</p>
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-neon-blue hover:text-neon-purple text-sm font-medium transition-colors"
                    >
                      Verify Credential →
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}
