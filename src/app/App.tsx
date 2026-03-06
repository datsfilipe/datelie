import iconSvg from '@/assets/icon.svg';
import marcaDaguaSvg from '@/assets/marca-d-agua.svg';
import { Instagram, MapPin, MessageCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { HelpModal } from './components/HelpModal';
import { ImageCarousel } from './components/ImageCarousel';

interface LinkButtonProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

function LinkButton({
  href,
  onClick,
  icon,
  label,
  sublabel,
  variant = 'outline',
}: LinkButtonProps) {
  const baseStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px 20px',
    borderRadius: '14px',
    transition: 'all 0.18s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    textAlign: 'left',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: '#7a004b',
      color: '#fff',
      border: '1px solid #ff0d97',
      boxShadow: '0 4px 24px rgba(255,13,151,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    },
    outline: {
      background: 'rgba(255,13,151,0.07)',
      border: '1.5px solid rgba(255,13,151,0.28)',
      color: '#fff',
    },
    ghost: {
      background: 'rgba(255,255,255,0.05)',
      border: '1.5px solid rgba(255,255,255,0.1)',
      color: '#fff',
    },
  };

  const Tag = href ? 'a' : 'button';
  const extraProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <Tag
      {...extraProps}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      className="group hover:scale-[1.015] hover:shadow-lg active:scale-[0.985]"
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (variant === 'primary') {
          el.style.background = '#660040';
          el.style.boxShadow =
            '0 6px 32px rgba(255,13,151,0.6), inset 0 1px 0 rgba(255,255,255,0.08)';
        } else if (variant === 'outline') {
          el.style.background = 'rgba(255,13,151,0.14)';
          el.style.borderColor = 'rgba(255,13,151,0.55)';
        } else {
          el.style.background = 'rgba(255,255,255,0.09)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (variant === 'primary') {
          el.style.background = '#7a004b';
          el.style.boxShadow =
            '0 4px 24px rgba(255,13,151,0.4), inset 0 1px 0 rgba(255,255,255,0.08)';
        } else if (variant === 'outline') {
          el.style.background = 'rgba(255,13,151,0.07)';
          el.style.borderColor = 'rgba(255,13,151,0.28)';
        } else {
          el.style.background = 'rgba(255,255,255,0.05)';
        }
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          flexShrink: 0,
          background: variant === 'primary' ? 'rgba(255,255,255,0.18)' : 'rgba(255,13,151,0.15)',
        }}
      >
        {icon}
      </span>

      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: '16px', fontWeight: 500 }}>{label}</span>
        {sublabel && (
          <span
            style={{
              display: 'block',
              fontSize: '13px',
              opacity: variant === 'primary' ? 0.82 : 0.6,
              marginTop: '1px',
            }}
          >
            {sublabel}
          </span>
        )}
      </span>

      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ flexShrink: 0, opacity: 0.45 }}
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tag>
  );
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(
    () => new URLSearchParams(window.location.search).get('pix') === 'true',
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: 'linear-gradient(160deg, #0a0a0e 0%, #12080f 60%, #0d0509 100%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,13,151,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,13,151,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pt-10 pb-6 min-h-screen">
        <header className="w-full max-w-md text-center mb-7 md:max-w-2xl lg:max-w-5xl">
          <div className="flex items-center justify-center mb-4">
            <img
              src={marcaDaguaSvg}
              alt="Deuzinete Ateliê"
              style={{ height: 'clamp(80px, 18vw, 130px)', width: 'auto' }}
            />
          </div>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(14px, 3.5vw, 17px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.65,
              maxWidth: '380px',
              margin: '0 auto',
            }}
          >
            Deuzinete Ateliê transforma a roupa dos seus sonhos em realidade. Cada peça é feita sob
            medida. São mais de{' '}
            <span style={{ color: '#ff0d97', fontWeight: 500 }}>15 anos de experiência</span> em
            modelagem e crepagem.
          </p>

          <a
            href={import.meta.env.VITE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mt-3 hover:opacity-80 transition-opacity"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <MapPin size={16} strokeWidth={2.2} style={{ color: '#ff0d97', opacity: 0.9 }} />
            <span>Porto Franco — MA</span>
          </a>

          <div className="flex items-center justify-center gap-3 mt-5">
            <span
              style={{
                display: 'block',
                height: '1px',
                width: '40px',
                background: 'linear-gradient(to right, transparent, rgba(255,13,151,0.4))',
              }}
            />
            <span style={{ color: '#ff0d97', fontSize: '14px', opacity: 0.7 }}>✦</span>
            <span
              style={{
                display: 'block',
                height: '1px',
                width: '40px',
                background: 'linear-gradient(to left, transparent, rgba(255,13,151,0.4))',
              }}
            />
          </div>
        </header>

        <div className="w-full max-w-md lg:max-w-5xl lg:flex lg:gap-10 lg:items-start lg:justify-center">
          <div
            className="w-full flex-shrink-0 lg:w-1/2"
            style={{ height: 'clamp(220px, 33vh, 360px)' }}
          >
            <ImageCarousel />
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-3 mt-5 lg:mt-0 lg:justify-center">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,13,151,0.6)',
                marginBottom: '2px',
              }}
            >
              Conecte-se
            </p>

            <LinkButton
              href="https://www.instagram.com/deuzineteatelie/"
              icon={<Instagram size={18} style={{ color: '#fff' }} strokeWidth={1.8} />}
              label="Instagram"
              sublabel="Veja nosso portfólio"
              variant="primary"
            />

            <LinkButton
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              icon={<MessageCircle size={18} style={{ color: '#ff0d97' }} strokeWidth={1.8} />}
              label="WhatsApp Business"
              sublabel="Entre em contato"
              variant="outline"
            />

            <LinkButton
              onClick={() => setHelpOpen(true)}
              icon={<Star size={18} style={{ color: '#ff0d97' }} strokeWidth={1.8} />}
              label="Apoie o Ateliê"
              sublabel="Contribua via PIX"
              variant="ghost"
            />
          </div>
        </div>
      </div>

      <footer
        className="relative z-10 w-full flex items-center justify-center gap-3 py-6 px-4"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <span>©</span>
        <img
          src={iconSvg}
          alt="Deuzinete Ateliê"
          style={{ height: '24px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.5 }}
        />
        <span>Deuzinete Ateliê</span>
        <span style={{ fontSize: '6px', opacity: 0.6 }}>●</span>
        <span>2026</span>
      </footer>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
