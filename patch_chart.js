const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'resources/js/Pages/Seller/SellerAnalytics.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the chart section by line numbers approach
const lines = content.split('\n');

// Lines 106-119 (0-indexed: 105-118) contain the chart div
// We'll rebuild those lines
const newChartLines = [
`            <div className="flex items-end justify-between h-64 gap-4 px-2">`,
`               {(() => {`,
`                 const revenues = revenue_overview?.map(r => Number(r.revenue) || 0);`,
`                 const maxRevenue = Math.max(...revenues, 1);`,
`                 const currentMonth = new Date().toLocaleString('default', { month: 'short' });`,
`                 return revenue_overview?.map((item, idx) => {`,
`                   const pct = Math.max((revenues[idx] / maxRevenue) * 100, 8);`,
`                   const isCurrent = item.month === currentMonth;`,
`                   return (`,
`                     <div key={item.month} className="flex-1 flex flex-col items-center gap-3 group relative">`,
`                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-lg whitespace-nowrap transition-all pointer-events-none z-10">`,
"                          \u20b1{(revenues[idx] || 0).toLocaleString()}",
`                        </div>`,
"                        <div",
"                         style={{ height: `${pct}%` }}",
"                         className={`w-full rounded-2xl transition-all duration-700 cursor-pointer ${isCurrent ? 'bg-[#f5a623] shadow-lg shadow-[#f5a623]/30' : 'bg-[#fff1de] group-hover:bg-[#ffd99a]'}`}",
`                        ></div>`,
"                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-[#f5a623]' : 'text-gray-400'}`}>{item.month.toUpperCase()}</span>",
`                     </div>`,
`                   );`,
`                 });`,
`               })()}`,
`            </div>`,
];

// Replace lines 105 to 118 (0-indexed) = lines 106-119 in 1-indexed
lines.splice(105, 14, ...newChartLines);

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Chart patched successfully! Lines replaced: 106-119');
