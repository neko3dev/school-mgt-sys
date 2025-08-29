import React, { useState } from 'react';
import { UniversalReportGenerator } from './UniversalReportGenerator';

interface ReportExporterProps {
  data: any;
  title: string;
  type: 'students' | 'assessment' | 'finance' | 'attendance' | 'transport' | 'privacy' | 'staff' | 'welfare' | 'communications' | 'library' | 'inventory';
  onClose?: () => void;
}

export function ReportExporter({ data, title, type, onClose }: ReportExporterProps) {
  return (
    <UniversalReportGenerator
      reportType={type}
      data={data}
      title={title}
      onClose={onClose}
    />
  );
}