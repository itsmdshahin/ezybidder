import Icon from '@/components/ui/AppIcon';

interface Participant {
  id: string;
  username: string;
  bidCount: number;
  highestBid: number;
  isActive: boolean;
  joinedAt: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  currentUserId: string;
}

const ParticipantsList = ({ participants, currentUserId }: ParticipantsListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sortedParticipants = [...participants].sort((a, b) => b.highestBid - a.highestBid);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Active Bidders</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="UsersIcon" size={16} />
          <span>{participants.length} participants</span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
              participant.id === currentUserId
                ? 'bg-primary/10 border border-primary/20' :'bg-muted/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index === 0 
                  ? 'bg-success text-success-foreground' 
                  : participant.id === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    participant.id === currentUserId ? 'text-primary' : 'text-card-foreground'
                  }`}>
                    {participant.username}
                    {participant.id === currentUserId && ' (You)'}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {participant.isActive && (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    )}
                    {index === 0 && (
                      <Icon name="TrophyIcon" size={16} className="text-success" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{participant.bidCount} bids</span>
                  <span>•</span>
                  <span>
                    {participant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-semibold ${
                index === 0 
                  ? 'text-success' 
                  : participant.id === currentUserId
                  ? 'text-primary' :'text-card-foreground'
              }`}>
                {formatCurrency(participant.highestBid)}
              </div>
              <div className="text-xs text-muted-foreground">
                Highest bid
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Active bidders: {participants.filter(p => p.isActive).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="EyeIcon" size={16} />
            <span>Watching: {participants.length + Math.floor(Math.random() * 20) + 10}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;