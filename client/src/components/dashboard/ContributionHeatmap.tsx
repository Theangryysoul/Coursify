'use client';

import React from 'react';

interface ActivityDay {
  date: string;
  count: number;
  level: number; // 0-4
}

const ContributionHeatmap: React.FC = () => {
  // Hardcoded data to match the visual pattern in the image
  // Months: Jul -> next Jul (approx 1 year+)
  // Levels: 0=none (dark gray), 1=light, 2=medium, 3=bright, 4=dark green
  const months = [
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'
  ];

  // Simulate ~53 weeks × 7 days, but we'll generate a realistic sparse pattern matching the image
  const generateHeatmapData = (): ActivityDay[][] => {
    const data: ActivityDay[][] = [];
    const startDate = new Date('2024-07-01'); // Starting from July
    let currentDate = new Date(startDate);

    // Create 7 rows (days of week) x ~55 columns (weeks)
    for (let week = 0; week < 55; week++) {
      const weekData: ActivityDay[] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Generate activity pattern matching the screenshot:
        // Mostly empty early, sparse in Mar, increasing in Apr-May-Jun-Jul
        let level = 0;
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        // Early months (Jul 2024 - Feb 2025): mostly empty
        if (year === 2024 && month >= 6) { // Jul-Dec 2024
          level = Math.random() > 0.92 ? Math.floor(Math.random() * 2) + 1 : 0;
        } 
        // Jan-Feb 2025: almost empty
        else if (year === 2025 && month < 2) {
          level = Math.random() > 0.95 ? 1 : 0;
        } 
        // March 2025: first cluster
        else if (year === 2025 && month === 2) {
          level = Math.random() > 0.65 ? Math.floor(Math.random() * 3) + 1 : 0;
        } 
        // April 2025: more activity
        else if (year === 2025 && month === 3) {
          level = Math.random() > 0.45 ? Math.floor(Math.random() * 4) + 1 : (Math.random() > 0.7 ? 1 : 0);
        } 
        // May-June-July 2025: high activity with clusters
        else if (year === 2025 && month >= 4) {
          level = Math.random() > 0.25 ? Math.floor(Math.random() * 4) + 1 : (Math.random() > 0.6 ? 1 : 0);
        }

        weekData.push({
          date: dateStr,
          count: level * Math.floor(Math.random() * 5) + level,
          level,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Color mapping (matching GitHub-style and the provided legend)
  const getColor = (level: number): string => {
    switch (level) {
      case 0: return '#1f2529'; // dark gray (less)
      case 1: return '#3ba46d';
      case 2: return '#4cd080';
      case 3: return '#6be9a0';
      case 4: return '#9ef9c2'; // brightest
      default: return '#1f2529';
    }
  };

  return (
    <div className="bg-[#0d1117] p-6 rounded-xl text-white font-mono text-sm w-fit">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-[#8b949e] text-sm">Activity Heatmap</div>
        <div className="text-xs text-[#8b949e]">July 2024 — July 2025</div>
      </div>

      {/* Main Heatmap Grid */}
      <div className="flex gap-2">
        {/* Day labels (vertical) - GitHub style */}
        <div className="flex flex-col justify-between pr-2 text-[10px] text-[#8b949e] pt-6 pb-1 h-[210px]">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
            <div key={i} className="h-4 flex items-center">{day}</div>
          ))}
        </div>

        {/* The grid */}
        <div>
          <div 
            className="grid gap-[3px]"
            style={{
              gridTemplateRows: 'repeat(7, 12px)',
              gridTemplateColumns: `repeat(${heatmapData.length}, 12px)`
            }}
          >
            {heatmapData.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-3 h-3 rounded-sm hover:ring-1 hover:ring-white/50 transition-all cursor-pointer"
                  style={{
                    backgroundColor: getColor(day.level),
                  }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))
            ))}
          </div>

          {/* Month labels */}
          <div className="flex text-[10px] text-[#8b949e] mt-1 pl-1">
            {months.map((month, index) => (
              <div 
                key={index} 
                className="text-center flex-1"
                style={{ 
                  width: `${(heatmapData.length / months.length) * 12 + 3}px`,
                  minWidth: '38px'
                }}
              >
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend (exactly like pic 2) */}
      <div className="flex items-center justify-end gap-2 mt-6 text-xs text-[#8b949e]">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(level) }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip hint */}
      <div className="text-center text-[10px] text-[#8b949e] mt-2">
        Hover squares for details
      </div>
    </div>
  );
};

export default ContributionHeatmap;