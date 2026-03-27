interface VehicleSpec {
  label: string;
  value: string;
  icon?: string;
}

interface VehicleSpecificationsProps {
  specifications: VehicleSpec[];
  motHistory: MOTRecord[];
  serviceHistory: ServiceRecord[];
}

interface MOTRecord {
  id: string | number;  // ✅
  date: string;
  result: 'Pass' | 'Fail' | 'Advisory';
  mileage: number;
  expiryDate: string;
  advisories?: string[];
}

interface ServiceRecord {
  id: string | number;  // ✅
  date: string;
  type: string;
  garage: string;
  mileage: number;
  cost: number;
}

const VehicleSpecifications = ({
  specifications,
  motHistory,
  serviceHistory,
}: VehicleSpecificationsProps) => {
  return (
    <div className="space-y-6">
      {/* Key Specifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Vehicle Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
            >
              <span className="text-muted-foreground font-medium">
                {spec.label}
              </span>
              <span className="text-card-foreground font-semibold">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MOT History */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          MOT History
        </h3>
        <div className="space-y-3">
          {motHistory.map((record) => (
            <div
              key={record.id}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.result === 'Pass'
                        ? 'bg-success/10 text-success'
                        : record.result === 'Fail'
                        ? 'bg-error/10 text-error'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {record.result}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {record.date}
                  </span>
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {record.mileage.toLocaleString()} miles
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Expires: {record.expiryDate}
              </p>
              {record.advisories && record.advisories.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-card-foreground mb-1">
                    Advisories:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {record.advisories.map((advisory, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2"
                      >
                        <span className="text-warning mt-0.5">•</span>
                        <span>{advisory}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Service History */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Service History
        </h3>
        <div className="space-y-3">
          {serviceHistory.map((service) => (
            <div
              key={service.id}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-card-foreground">
                    {service.type}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {service.garage}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    £{service.cost.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.date}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {service.mileage.toLocaleString()} miles
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleSpecifications;
