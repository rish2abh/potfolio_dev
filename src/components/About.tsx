'use client';

import SectionWrapper from './SectionWrapper';

export default function About() {
  return (
    <SectionWrapper sectionId="about">
      <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          System Profile
        </h2>

        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <p>
            I specialize in building high-performance backend systems using{' '}
            <span className="text-neon-blue font-medium">Node.js</span>,{' '}
            <span className="text-neon-blue font-medium">Express.js</span>, and{' '}
            <span className="text-neon-blue font-medium">NestJS</span>. My work
            powers platforms serving{' '}
            <span className="text-white font-semibold">150,000+ daily active users</span>{' '}
            and handling{' '}
            <span className="text-white font-semibold">2 million+ daily API requests</span>,
            with architectures designed for reliability, scalability, and real-time
            data delivery through technologies like Server-Sent Events and
            microservices patterns.
          </p>

          <p>
            On the AI integration front, I work extensively with{' '}
            <span className="text-neon-purple font-medium">OpenAI</span>,{' '}
            <span className="text-neon-purple font-medium">Deepgram</span>,{' '}
            <span className="text-neon-purple font-medium">ElevenLabs</span>, and{' '}
            <span className="text-neon-purple font-medium">Twilio</span> to build
            intelligent conversational automation and voice AI systems. These
            integrations enable enterprise-grade AI calling pipelines that handle
            complex multi-turn conversations, real-time transcription, and natural
            voice synthesis at scale.
          </p>

          <p>
            The impact of this work is measurable:{' '}
            <span className="text-white font-semibold">99.9% uptime</span> across
            production services,{' '}
            <span className="text-white font-semibold">40% reduction in manual tasks</span>{' '}
            through automation workflows, and systems processing{' '}
            <span className="text-white font-semibold">200,000+ records monthly</span>.
            Every system I build is driven by solving real problems — reducing
            operational overhead, improving response times, and delivering reliable
            infrastructure that teams can depend on.
          </p>
        </div>
      </section>
    </SectionWrapper>
  );
}
