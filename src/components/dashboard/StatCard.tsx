import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    color: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-[#4CAF50]/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          {trend && (
            <p className={`mt-2 text-[${trend.color}]`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-[#FF9F00]/20 rounded-full">
          <Icon className="h-6 w-6 text-[#FF9F00]" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;