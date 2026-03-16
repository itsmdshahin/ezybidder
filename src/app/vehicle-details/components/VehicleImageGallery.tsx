'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface VehicleImage {
  id: string;           // use string for UUIDs
  url: string;
  alt?: string;
  thumbnail?: string;
}

interface VehicleImageGalleryProps {
  images: VehicleImage[]; // can be an empty array
  vehicleName: string;
}

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">No image available</text></svg>';

const VehicleImageGallery = ({ images = [], vehicleName }: VehicleImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keep selectedImageIndex valid if images array length changes
  useEffect(() => {
    if (images.length === 0) {
      setSelectedImageIndex(0);
    } else if (selectedImageIndex >= images.length) {
      setSelectedImageIndex(images.length - 1);
    }
  }, [images, selectedImageIndex]);

  const handlePrevious = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Defensive - if no images, selectedImage will be null
  const selectedImage = images.length ? images[selectedImageIndex] : null;

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-card rounded-lg overflow-hidden border border-border">
        <div className="aspect-[4/3] relative flex items-center justify-center bg-muted">
          {selectedImage ? (
            /* Wrap AppImage in a button/div to ensure click works even if AppImage doesn't forward onClick */
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="w-full h-full block focus:outline-none"
              aria-label="Open image"
            >
              <AppImage
                src={selectedImage.url}
                alt={selectedImage.alt ?? `${vehicleName} image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </button>
          ) : (
            <img src={PLACEHOLDER} alt="no image" className="w-full h-full object-cover" />
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Previous image"
                type="button"
              >
                <Icon name="ChevronLeftIcon" size={20} className="text-foreground" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Next image"
                type="button"
              >
                <Icon name="ChevronRightIcon" size={20} className="text-foreground" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-full text-sm font-medium text-foreground">
            {selectedImage ? `${selectedImageIndex + 1} / ${images.length}` : '0 / 0'}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumb = image.thumbnail ?? image.url;
            return (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedImageIndex ? 'border-primary' : 'border-border hover:border-muted-foreground'
                }`}
                type="button"
                aria-label={`Show image ${index + 1}`}
              >
                <AppImage
                  src={thumb}
                  alt={image.alt ?? `${vehicleName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && selectedImage && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-200 z-10"
              type="button"
              aria-label="Close image"
            >
              <Icon name="XMarkIcon" size={20} className="text-foreground" />
            </button>
            <AppImage
              src={selectedImage.url}
              alt={selectedImage.alt ?? `${vehicleName} enlarged`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
