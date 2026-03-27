'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'commission' | 'refund' | 'fee';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface FinancialSummaryProps {
  transactions: Transaction[];
  totalEarnings: number;
  totalSpent: number;
  pendingPayments: number;
  commissionOwed: number;
}

const FinancialSummary = ({ 
  transactions, 
  totalEarnings, 
  totalSpent, 
  pendingPayments, 
  commissionOwed 
}: FinancialSummaryProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return 'ArrowTrendingUpIcon';
      case 'purchase':
        return 'ArrowTrendingDownIcon';
      case 'commission':
        return 'CurrencyPoundIcon';
      case 'refund':
        return 'ArrowUturnLeftIcon';
      case 'fee':
        return 'MinusIcon';
      default:
        return 'CurrencyPoundIcon';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale': case'refund':
        return 'text-success';
      case 'purchase': case'commission': case'fee':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'text-success bg-success/10', label: 'Completed' };
      case 'pending':
        return { color: 'text-warning bg-warning/10', label: 'Pending' };
      case 'failed':
        return { color: 'text-error bg-error/10', label: 'Failed' };
      default:
        return { color: 'text-muted-foreground bg-muted', label: 'Unknown' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Financial Summary</h3>
        
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'overview' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'transactions' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            Transactions
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-success/10 p-3 rounded-lg inline-flex mb-2">
                <Icon name="ArrowTrendingUpIcon" size={24} className="text-success" />
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-lg font-semibold text-success">{formatPrice(totalEarnings)}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-error/10 p-3 rounded-lg inline-flex mb-2">
                <Icon name="ArrowTrendingDownIcon" size={24} className="text-error" />
              </div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-lg font-semibold text-error">{formatPrice(totalSpent)}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-warning/10 p-3 rounded-lg inline-flex mb-2">
                <Icon name="ClockIcon" size={24} className="text-warning" />
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-lg font-semibold text-warning">{formatPrice(pendingPayments)}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-3 rounded-lg inline-flex mb-2">
                <Icon name="CurrencyPoundIcon" size={24} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="text-lg font-semibold text-primary">{formatPrice(commissionOwed)}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Net Balance</p>
                <p className="text-sm text-muted-foreground">After commissions and fees</p>
              </div>
              <p className="text-xl font-bold text-card-foreground">
                {formatPrice(totalEarnings - totalSpent - commissionOwed)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.slice(0, 10).map((transaction) => {
              const statusBadge = getStatusBadge(transaction.status);
              
              return (
                <div key={transaction.id} className="p-6 hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={getTransactionIcon(transaction.type)} 
                        size={20} 
                        className={getTransactionColor(transaction.type)} 
                      />
                      
                      <div>
                        <p className="font-medium text-card-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'sale' || transaction.type === 'refund' ? '+' : '-'}
                        {formatPrice(Math.abs(transaction.amount))}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Icon name="CurrencyPoundIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;