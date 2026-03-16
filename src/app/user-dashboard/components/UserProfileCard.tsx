import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  alt: string;
  role: 'buyer' | 'seller' | 'workshop_owner';
  verificationLevel: 'unverified' | 'basic' | 'premium';
  memberSince: string;
  location: string;
  rating: number;
  totalTransactions: number;
}

interface UserProfileCardProps {
  user: UserProfile;
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const getVerificationBadge = () => {
    switch (user.verificationLevel) {
      case 'premium':
        return { icon: 'ShieldCheckIcon', color: 'text-success', bg: 'bg-success/10', label: 'Premium Verified' };
      case 'basic':
        return { icon: 'CheckBadgeIcon', color: 'text-primary', bg: 'bg-primary/10', label: 'Basic Verified' };
      default:
        return { icon: 'ExclamationTriangleIcon', color: 'text-warning', bg: 'bg-warning/10', label: 'Unverified' };
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'workshop_owner':
        return 'Workshop Owner';
      case 'seller':
        return 'Seller';
      default:
        return 'Buyer';
    }
  };

  const badge = getVerificationBadge();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <AppImage
            src={user.avatar}
            alt={user.alt}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 ${badge.bg} rounded-full p-1`}>
            <Icon name={badge.icon} size={16} className={badge.color} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-card-foreground truncate">{user.name}</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {getRoleLabel()}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-1">
              <Icon name="MapPinIcon" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.location}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name="CalendarIcon" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Since {user.memberSince}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-1">
              <Icon name="StarIcon" size={16} className="text-accent fill-current" />
              <span className="text-sm font-medium text-card-foreground">{user.rating}</span>
              <span className="text-sm text-muted-foreground">({user.totalTransactions} transactions)</span>
            </div>
            
            <div className={`flex items-center space-x-1 ${badge.bg} px-2 py-1 rounded-full`}>
              <Icon name={badge.icon} size={14} className={badge.color} />
              <span className={`text-xs font-medium ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;