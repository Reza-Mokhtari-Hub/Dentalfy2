const fs = require('fs');
let dashboard = fs.readFileSync('src/components/PanelDashboard.tsx', 'utf8');
dashboard = dashboard.replace('پیکربندی سوالات سنجش علمی و گواهی دوره', 'پیکربندی سوالات سنجش علمی دوره');
fs.writeFileSync('src/components/PanelDashboard.tsx', dashboard);

let panel = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');
panel = panel.replace('پیش‌نیاز آزمون و گواهی:', 'پیش‌نیاز آزمون نهایی:');
panel = panel.replace('متاسفانه حد نصاب قبولی برای صدور گواهی', 'متاسفانه حد نصاب قبولی در این آزمون');
fs.writeFileSync('src/components/StudentPanel.tsx', panel);
console.log('patched');
