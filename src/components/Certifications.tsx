'use client';

import { certifications } from '@/data/certifications';
import SectionWrapper from './SectionWrapper';
import GlassCard from './ui/GlassCard';

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
              <h3 className="text-lg font-semibold text-white mb-2">
                {cert.name}
              </h3>
              <p className="text-white/70 text-sm mb-1">{cert.issuer}</p>
              <p className="text-white/50 text-sm mb-3">{cert.date}</p>
              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:text-neon-purple text-sm font-medium transition-colors"
                >
                  Verify Credential →
                </a>
              )}
            </GlassCard>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
}
