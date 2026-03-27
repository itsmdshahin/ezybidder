import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Workshop {
  id: number;
  name: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  openingHours: {
    [key: string]: string;
  };
  lat: number;
  lng: number;
}

interface WorkshopInfoProps {
  workshop: Workshop;
}

const WorkshopInfo = ({ workshop }: WorkshopInfoProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={16}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={index < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workshop Image and Basic Info */}
        <div>
          <div className="relative h-64 rounded-lg overflow-hidden mb-4">
            <AppImage
              src={workshop.image}
              alt={workshop.alt}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-card-foreground mb-2">{workshop.name}</h1>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(workshop.rating)}
            </div>
            <span className="text-sm font-medium text-card-foreground">{workshop.rating}</span>
            <span className="text-sm text-muted-foreground">({workshop.reviewCount} reviews)</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <Icon name="MapPinIcon" size={16} className="text-muted-foreground mt-1" />
              <span className="text-sm text-card-foreground">{workshop.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="PhoneIcon" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">{workshop.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="EnvelopeIcon" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">{workshop.email}</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-card-foreground mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {workshop.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Map and Opening Hours */}
        <div>
          <div className="h-64 rounded-lg overflow-hidden mb-4 border border-border">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={workshop.name}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${workshop.lat},${workshop.lng}&z=14&output=embed`}
            />
          </div>

          <div>
            <h3 className="font-medium text-card-foreground mb-3">Opening Hours</h3>
            <div className="space-y-2">
              {Object.entries(workshop.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm text-card-foreground capitalize">{day}</span>
                  <span className="text-sm text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-medium text-card-foreground mb-2">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{workshop.description}</p>
      </div>
    </div>
  );
};

export default WorkshopInfo;