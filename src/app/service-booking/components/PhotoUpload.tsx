'use client';

import { useState, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  analysis?: {
    damageType: string;
    severity: string;
    estimatedCost: number;
  };
}

interface PhotoUploadProps {
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
}

const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setIsAnalyzing(true);

    const newPhotos: UploadedPhoto[] = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const id = Math.random().toString(36).substr(2, 9);
        
        // Mock AI analysis
        const analysis = await mockAnalyzePhoto(file);
        
        newPhotos.push({
          id,
          file,
          preview,
          analysis
        });
      }
    }

    onPhotosChange([...photos, ...newPhotos]);
    setIsAnalyzing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mockAnalyzePhoto = async (file: File): Promise<UploadedPhoto['analysis']> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const damageTypes = ['Dent', 'Scratch', 'Paint Chip', 'Rust', 'Crack'];
    const severities = ['Minor', 'Moderate', 'Severe'];
    
    return {
      damageType: damageTypes[Math.floor(Math.random() * damageTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      estimatedCost: Math.floor(Math.random() * 500) + 50
    };
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const totalEstimate = photos.reduce((sum, photo) => 
    sum + (photo.analysis?.estimatedCost || 0), 0
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-card-foreground">Upload Damage Photos</h2>
        <span className="text-sm text-muted-foreground">
          {photos.length}/{maxPhotos} photos
        </span>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Upload clear photos of any damage for accurate estimation. Our AI will analyze the images and provide preliminary quotes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= maxPhotos || isAnalyzing}
            className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="CameraIcon" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">
              {isAnalyzing ? 'Analyzing...' : 'Upload Photos'}
            </span>
          </button>

          {totalEstimate > 0 && (
            <div className="flex items-center space-x-2 px-4 py-3 bg-success/10 text-success rounded-lg">
              <Icon name="CurrencyPoundIcon" size={20} />
              <span className="text-sm font-medium">
                Estimated Total: {formatPrice(totalEstimate)}
              </span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                <AppImage
                  src={photo.preview}
                  alt="Damage photo for assessment and repair estimation"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1 bg-error text-error-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Icon name="XMarkIcon" size={16} />
                </button>
              </div>

              {photo.analysis ? (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">
                      {photo.analysis.damageType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      photo.analysis.severity === 'Minor' ?'bg-success/20 text-success'
                        : photo.analysis.severity === 'Moderate' ?'bg-warning/20 text-warning' :'bg-error/20 text-error'
                    }`}>
                      {photo.analysis.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">
                    Est. {formatPrice(photo.analysis.estimatedCost)}
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin">
                      <Icon name="ArrowPathIcon" size={16} className="text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Icon name="PhotoIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No photos uploaded yet</p>
          <p className="text-sm text-muted-foreground">
            Upload photos of damage for AI-powered cost estimation
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;