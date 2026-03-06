import { Check, Copy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PIX_KEY = import.meta.env.VITE_PIX_CODE ?? '';
const QR_API_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=ff0d97&bgcolor=ffffff&data=${encodeURIComponent(PIX_KEY)}&margin=10&qzone=2`;

async function getCachedQrUrl(): Promise<string> {
  const CACHE_KEY = 'datelie_qr_code';
  const CACHE_DURATION = 86400000; // 1 day in ms

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { dataUrl, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) return dataUrl;
    }
  } catch {}

  try {
    const res = await fetch(QR_API_URL);
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ dataUrl, timestamp: Date.now() }));
    } catch {}
    return dataUrl;
  } catch {
    return QR_API_URL;
  }
}

function Toast({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
      style={{
        background: 'rgba(10,10,14,0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,13,151,0.3)',
        transform: `translateX(-50%) translateY(${show ? '0' : '24px'}) scale(${show ? '1' : '0.92'})`,
        opacity: show ? 1 : 0,
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }}
    >
      <Check size={15} style={{ color: '#ff0d97' }} strokeWidth={2.5} />
      <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
        Chave copiada!
      </span>
    </div>
  );
}

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [qrSrc, setQrSrc] = useState(QR_API_URL);

  useEffect(() => {
    getCachedQrUrl().then(setQrSrc);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY).catch(() => {
      const el = document.createElement('textarea');
      el.value = PIX_KEY;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });

    setCopied(true);
    setToastVisible(true);

    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastVisible(false);
      setCopied(false);
    }, 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      {mounted && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[900] cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(4px)',
              opacity: show ? 1 : 0,
              transition: 'opacity 0.22s ease',
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className="fixed z-[910] left-1/2 top-1/2 w-[90vw] max-w-sm rounded-3xl p-6 shadow-2xl"
            style={{
              background: '#0a0a0e',
              border: '1px solid rgba(255,13,151,0.18)',
              transform: `translate(-50%, -50%) translateY(${show ? '0' : '40px'}) scale(${show ? '1' : '0.96'})`,
              opacity: show ? 1 : 0,
              transition: 'transform 0.22s ease-out, opacity 0.22s ease-out',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1.5 cursor-pointer"
              style={{ transition: 'color 0.15s ease' }}
              aria-label="Fechar"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              <X size={16} style={{ color: 'inherit' }} />
            </button>

            <h2
              className="text-white mb-1"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600 }}
            >
              Apoie o Ateliê
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.65)',
                marginBottom: '20px',
              }}
            >
              Escaneie o QR Code ou copie a chave PIX abaixo.
            </p>

            <div
              className="flex items-center justify-center mx-auto rounded-2xl p-3 mb-5"
              style={{
                background: '#fff',
                width: 'fit-content',
                boxShadow: '0 0 0 4px rgba(255,13,151,0.15)',
              }}
            >
              <img
                src={qrSrc}
                alt="QR Code PIX"
                width={180}
                height={180}
                className="rounded-xl block"
              />
            </div>

            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(255,13,151,0.22)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0 cursor-pointer"
                style={{
                  borderRight: '1px solid rgba(255,13,151,0.22)',
                  background: copied ? 'rgba(255,13,151,0.18)' : 'rgba(255,13,151,0.08)',
                  color: '#ff0d97',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  minWidth: '68px',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,13,151,0.22)';
                  el.style.boxShadow = '0 0 12px rgba(255,13,151,0.3)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = copied ? 'rgba(255,13,151,0.18)' : 'rgba(255,13,151,0.08)';
                  el.style.boxShadow = 'none';
                }}
                aria-label="Copiar chave PIX"
              >
                {copied ? (
                  <Check size={13} strokeWidth={2.5} />
                ) : (
                  <Copy size={13} strokeWidth={2} />
                )}
                {copied ? 'Copiado' : 'Copiar'}
              </button>

              <input
                type="text"
                value={PIX_KEY}
                disabled
                readOnly
                className="flex-1 bg-transparent px-3 py-2.5 outline-none cursor-default"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  minWidth: 0,
                }}
              />
            </div>

            <p
              className="mt-4 text-center"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              Qualquer valor é muito bem-vindo 💕
            </p>
          </div>
        </>
      )}

      <Toast visible={toastVisible} />
    </>
  );
}
