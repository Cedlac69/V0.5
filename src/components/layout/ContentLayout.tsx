import React from 'react';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ContentLayout({ title, children, actions }: ContentLayoutProps) {
  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}