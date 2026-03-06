import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import carousel1 from '@/assets/carousel/carousel_1.jpeg';
import carousel10 from '@/assets/carousel/carousel_10.jpeg';
import carousel11 from '@/assets/carousel/carousel_11.jpeg';
import carousel12 from '@/assets/carousel/carousel_12.jpeg';
import carousel13 from '@/assets/carousel/carousel_13.jpeg';
import carousel14 from '@/assets/carousel/carousel_14.jpeg';
import carousel2 from '@/assets/carousel/carousel_2.jpeg';
import carousel3 from '@/assets/carousel/carousel_3.jpeg';
import carousel4 from '@/assets/carousel/carousel_4.jpeg';
import carousel5 from '@/assets/carousel/carousel_5.jpeg';
import carousel6 from '@/assets/carousel/carousel_6.jpeg';
import carousel7 from '@/assets/carousel/carousel_7.jpeg';
import carousel8 from '@/assets/carousel/carousel_8.jpeg';
import carousel9 from '@/assets/carousel/carousel_9.jpeg';

const images = [
  { url: carousel1, alt: 'Três vestidos de festa em manequins no ateliê' },
  { url: carousel2, alt: 'Vestido tubinho azul claro com gola diferenciada' },
  { url: carousel3, alt: 'Conjunto feminino bege com blazer e saia lápis' },
  { url: carousel4, alt: 'Camisa estampada com borboletas na mesa de costura' },
  { url: carousel5, alt: 'Vestido curto terracota sem mangas com gola alta' },
  { url: carousel6, alt: 'Saia preta drapeada com cinto de fivela' },
  { url: carousel7, alt: 'Vestido preto com mangas bufantes e cinto' },
  { url: carousel8, alt: 'Vestido longo vermelho com mangas e saia rodada' },
  { url: carousel9, alt: 'Vestido de festa com corpete dourado e saia marsala' },
  { url: carousel10, alt: 'Vestido longo terracota com cintura franzida no ateliê' },
  { url: carousel11, alt: 'Conjunto verde esmeralda com cropped e calça pantalona' },
  { url: carousel12, alt: 'Vestido longo terracota com decote V e mangas longas' },
  { url: carousel13, alt: 'Detalhe do vestido rosa com decote V e faixa na cintura' },
  { url: carousel14, alt: 'Blusa listrada rosa e branca com saia preta' },
];

function ImageModal({
  image,
  onClose,
}: {
  image: { url: string; alt: string } | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (image) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [image]);

  useEffect(() => {
    if (!image) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [image, onClose]);

  if (!mounted || !image) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[900] cursor-pointer"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.22s ease',
        }}
        onClick={onClose}
      />
      <div
        className="fixed z-[910] inset-0 flex items-center justify-center p-4 pointer-events-none"
        style={{
          opacity: show ? 1 : 0,
          transform: `scale(${show ? '1' : '0.95'})`,
          transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
        }}
      >
        <img
          src={image.url}
          alt={image.alt}
          className="max-w-full max-h-full object-contain pointer-events-auto"
          style={{ borderRadius: '16px' }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 cursor-pointer pointer-events-auto"
          style={{
            color: 'rgba(255,255,255,0.5)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
          }}
          aria-label="Fechar"
        >
          <X size={24} />
        </button>
      </div>
    </>
  );
}

export function ImageCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <>
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <div className="overflow-hidden h-full rounded-2xl" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 flex-grow-0 basis-full h-full flex items-center justify-center"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  style={{ borderRadius: '16px' }}
                  draggable={false}
                  onClick={() => setLightbox(img)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width: selectedIndex === i ? '20px' : '6px',
                height: '6px',
                background: selectedIndex === i ? '#ff0d97' : 'rgba(255,255,255,0.6)',
              }}
              aria-label={`Ir para imagem ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <ImageModal image={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
