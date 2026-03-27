import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface SellerInfo {
  id: string; // ✅ profiles.id uuid
  name: string;
  type: 'Private' | 'Dealer' | 'Showroom';
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  memberSince: string;
  responseTime: string;
  avatar: string;
  avatarAlt: string;
}

interface SellerInformationProps {
  seller: SellerInfo;
  onMessage: () => void;
  onCall: () => void;
}

const SellerInformation = ({ seller, onMessage, onCall }: SellerInformationProps) => {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={16}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={
          index < Math.floor(rating)
            ? 'text-warning'
            : 'text-muted-foreground'
        }
      />
    ));

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Seller Information
      </h3>

      {/* Seller Profile */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <AppImage
            src={seller.avatar}
            alt={seller.avatarAlt}
            className="w-16 h-16 rounded-full object-cover"
          />
          {seller.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckIcon" size={12} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-card-foreground">
              {seller.name}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                seller.type === 'Dealer'
                  ? 'bg-primary/10 text-primary'
                  : seller.type === 'Showroom'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-secondary/10 text-secondary'
              }`}
            >
              {seller.type}
            </span>
          </div>

          <div className="flex items-center space-x-1 mb-2">
            {renderStars(seller.rating)}
            <span className="text-sm font-medium text-card-foreground ml-2">
              {seller.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({seller.reviewCount} reviews)
            </span>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="MapPinIcon" size={14} />
              <span>{seller.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CalendarIcon" size={14} />
              <span>Member since {seller.memberSince}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="ClockIcon" size={14} />
              <span>Responds within {seller.responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mb-6">
        <h5 className="font-medium text-card-foreground mb-3">
          Trust & Safety
        </h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon
              name="ShieldCheckIcon"
              size={16}
              className="text-success"
            />
            <span className="text-sm text-muted-foreground">
              Identity Verified
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon
              name="DocumentCheckIcon"
              size={16}
              className="text-success"
            />
            <span className="text-sm text-muted-foreground">
              DVLA Registered
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon
              name="BanknotesIcon"
              size={16}
              className="text-success"
            />
            <span className="text-sm text-muted-foreground">
              Secure Payment Protected
            </span>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="space-y-3">
        <button
          onClick={onMessage}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="ChatBubbleLeftIcon" size={20} />
          <span>Send Message</span>
        </button>

        <button
          onClick={onCall}
          className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="PhoneIcon" size={20} />
          <span>Call Showroom</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Report this listing</span>
          <button className="text-error hover:text-error/80 transition-colors duration-200">
            <Icon name="FlagIcon" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerInformation;
