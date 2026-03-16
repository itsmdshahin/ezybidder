'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  service: string;
  status: 'waiting' | 'in-progress' | 'quality-check' | 'ready' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCompletion: string;
  progress: number;
  assignedTechnician: string;
  customerImage: string;
  lastUpdate: string;
}

interface ActiveJobsTableProps {
  className?: string;
}

const ActiveJobsTable = ({ className = '' }: ActiveJobsTableProps) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const mockJobs: Job[] = [
    {
      id: '1',
      jobNumber: 'WS-2024-001',
      customer: 'John Smith',
      vehicle: '2019 BMW X5',
      service: 'Full Service + MOT',
      status: 'in-progress',
      priority: 'medium',
      estimatedCompletion: '16:30',
      progress: 65,
      assignedTechnician: 'Mike Johnson',
      customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastUpdate: '2 hours ago'
    },
    {
      id: '2',
      jobNumber: 'WS-2024-002',
      customer: 'Sarah Wilson',
      vehicle: '2021 Audi A4',
      service: 'Brake Pad Replacement',
      status: 'quality-check',
      priority: 'high',
      estimatedCompletion: '14:00',
      progress: 90,
      assignedTechnician: 'David Brown',
      customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastUpdate: '30 minutes ago'
    },
    {
      id: '3',
      jobNumber: 'WS-2024-003',
      customer: 'Robert Davis',
      vehicle: '2018 Mercedes C-Class',
      service: 'Dent Repair + Paint',
      status: 'waiting',
      priority: 'low',
      estimatedCompletion: '17:45',
      progress: 15,
      assignedTechnician: 'Tom Wilson',
      customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastUpdate: '1 hour ago'
    },
    {
      id: '4',
      jobNumber: 'WS-2024-004',
      customer: 'Emma Thompson',
      vehicle: '2020 Volkswagen Golf',
      service: 'Tyre Replacement',
      status: 'ready',
      priority: 'urgent',
      estimatedCompletion: 'Ready',
      progress: 100,
      assignedTechnician: 'James Miller',
      customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastUpdate: '15 minutes ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-muted text-muted-foreground';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      case 'quality-check':
        return 'bg-warning/10 text-warning';
      case 'ready':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 30) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const filteredJobs = filterStatus === 'all' 
    ? mockJobs 
    : mockJobs.filter(job => job.status === filterStatus);

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Active Jobs</h3>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="quality-check">Quality Check</option>
              <option value="ready">Ready</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200">
              <Icon name="PlusIcon" size={16} />
              <span className="text-sm font-medium">New Job</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Job Details</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Service</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Progress</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Completion</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr 
                key={job.id} 
                className={`border-b border-border hover:bg-muted/30 transition-colors duration-200 ${
                  selectedJob === job.id ? 'bg-primary/5' : ''
                }`}
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-8 rounded-full ${getPriorityColor(job.priority)} opacity-60`}></div>
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{job.jobNumber}</p>
                      <p className="text-xs text-muted-foreground">{job.vehicle}</p>
                      <p className="text-xs text-muted-foreground">Tech: {job.assignedTechnician}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <AppImage
                      src={job.customerImage}
                      alt={`Profile photo of ${job.customer}, workshop customer`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{job.customer}</p>
                      <p className="text-xs text-muted-foreground">Updated {job.lastUpdate}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-card-foreground">{job.service}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.progress)}`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{job.progress}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-card-foreground">{job.estimatedCompletion}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="ChatBubbleLeftIcon" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="PencilIcon" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                      <Icon name="EllipsisVerticalIcon" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredJobs.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="WrenchScrewdriverIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs found for the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default ActiveJobsTable;