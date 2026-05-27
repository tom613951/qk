/**
 * DataVision 全球数据指挥中心
 * Common Utilities - Shared across all dashboards
 */

// ============================================================
// Dashboard Initialization
// ============================================================

function initDashboard() {
  initScale();
  initClock();
  initParticles();
  setActiveNav();
  addPanelDecorations();

  // Page entrance animation
  const dashboard = document.querySelector('.dashboard');
  if (dashboard) dashboard.classList.add('entering');

  // Hide loading screen after short delay
  setTimeout(hideLoading, 600);
}

// ============================================================
// Auto-Scale to Viewport
// ============================================================

function initScale() {
  const dashboard = document.querySelector('.dashboard');
  if (!dashboard) return;

  function resize() {
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    dashboard.style.transform = `translate(-50%, -50%) scale(${scale})`;
    dashboard.style.transformOrigin = 'center center';
  }

  resize();
  window.addEventListener('resize', resize);
}

// ============================================================
// Real-Time Clock
// ============================================================

function initClock() {
  const timeEl = document.getElementById('header-time');
  const dateEl = document.getElementById('header-date');

  function update() {
    const now = new Date();
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    if (dateEl) {
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      dateEl.textContent = `${y}.${m}.${d} ${weekdays[now.getDay()]}`;
    }
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// Particle Background
// ============================================================

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 1920;
  canvas.height = 1080;

  const particles = [];
  const PARTICLE_COUNT = 80;
  const MAX_DISTANCE = 130;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.15
    });
  }

  function animate() {
    ctx.clearRect(0, 0, 1920, 1080);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 1920;
      if (p.x > 1920) p.x = 0;
      if (p.y < 0) p.y = 1080;
      if (p.y > 1080) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================
// Loading Overlay
// ============================================================

function hideLoading() {
  const loading = document.getElementById('loading-overlay');
  if (loading) {
    loading.classList.add('hidden');
    setTimeout(() => loading.remove(), 600);
  }
}

// ============================================================
// Number Animation (count-up)
// ============================================================

function animateValue(element, start, end, duration = 2000, prefix = '', suffix = '') {
  if (!element) return;

  const startTime = performance.now();
  const range = end - start;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + range * easeOut);
    element.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ============================================================
// Page Navigation with Transition
// ============================================================

function navigateTo(url) {
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 350);
  } else {
    window.location.href = url;
  }
}

// ============================================================
// Set Active Nav Item
// ============================================================

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ============================================================
// Panel Corner Decorations
// ============================================================

function addPanelDecorations() {
  document.querySelectorAll('.panel').forEach((panel, index) => {
    if (panel.querySelector('.corner-decoration')) return;
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
      const corner = document.createElement('div');
      corner.className = `corner-decoration ${pos}`;
      panel.appendChild(corner);
    });
    panel.style.animationDelay = `${index * 0.08}s`;
  });
}

// ============================================================
// ECharts Custom Theme
// ============================================================

function registerEChartsTheme() {
  if (typeof echarts === 'undefined') return;

  echarts.registerTheme('datavision', {
    color: ['#00f2fe', '#4facfe', '#7c3aed', '#00e676', '#ff9100', '#ff4081', '#ffd740', '#00bfa5', '#536dfe', '#e040fb'],
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e0e6ff',
      fontFamily: '"Noto Sans SC", "PingFang SC", sans-serif'
    },
    title: {
      textStyle: { color: '#e0e6ff', fontFamily: '"Rajdhani", sans-serif' }
    },
    legend: {
      textStyle: { color: 'rgba(224, 230, 255, 0.65)' }
    },
    tooltip: {
      backgroundColor: 'rgba(10, 14, 39, 0.95)',
      borderColor: 'rgba(0, 242, 254, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#e0e6ff', fontSize: 12 },
      extraCssText: 'box-shadow: 0 0 20px rgba(0, 242, 254, 0.15); border-radius: 4px;'
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: 'rgba(0, 242, 254, 0.15)' } },
      axisTick: { lineStyle: { color: 'rgba(0, 242, 254, 0.1)' } },
      axisLabel: { color: 'rgba(224, 230, 255, 0.5)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0, 242, 254, 0.05)' } }
    },
    valueAxis: {
      axisLine: { lineStyle: { color: 'rgba(0, 242, 254, 0.15)' } },
      axisTick: { lineStyle: { color: 'rgba(0, 242, 254, 0.1)' } },
      axisLabel: { color: 'rgba(224, 230, 255, 0.5)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0, 242, 254, 0.05)' } }
    }
  });
}

// ============================================================
// Mock Data Generators
// ============================================================

const DataGen = {
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  },

  randomArray(length, min, max) {
    return Array.from({ length }, () => this.random(min, max));
  },

  randomFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  generateTimeSeries(points, min = 100, max = 1000) {
    const data = [];
    let value = this.random(min, max);
    for (let i = 0; i < points; i++) {
      value += this.random(-50, 50);
      value = Math.max(min, Math.min(max, value));
      data.push(value);
    }
    return data;
  },

  generateTimeLabels(count, unit = 'hour') {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      if (unit === 'hour') d.setHours(d.getHours() - i);
      else if (unit === 'day') d.setDate(d.getDate() - i);
      else if (unit === 'minute') d.setMinutes(d.getMinutes() - i * 5);
      labels.push(d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  },

  generateDayLabels(count) {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return labels;
  },

  generateRankData(names, min = 100, max = 10000) {
    return names.map(name => ({
      name,
      value: this.random(min, max)
    })).sort((a, b) => b.value - a.value);
  }
};

// ============================================================
// Auto-Scrolling List
// ============================================================

function initScrollList(wrapper) {
  if (!wrapper) return;
  const list = wrapper.querySelector('.scroll-list');
  if (!list || !list.children.length) return;

  const clone = list.innerHTML;
  list.innerHTML += clone;

  let offset = 0;
  const singleHeight = list.scrollHeight / 2;
  let paused = false;

  wrapper.addEventListener('mouseenter', () => (paused = true));
  wrapper.addEventListener('mouseleave', () => (paused = false));

  function animate() {
    if (!paused) {
      offset += 0.5;
      if (offset >= singleHeight) offset = 0;
      list.style.transform = `translateY(-${offset}px)`;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ============================================================
// Chart Helper
// ============================================================

const chartInstances = [];

function createChart(el, option, theme = 'datavision') {
  if (!el) return null;
  const chart = echarts.init(el, theme);
  chart.setOption(option);
  chartInstances.push(chart);
  return chart;
}

window.addEventListener('resize', () => {
  chartInstances.forEach(c => c.resize());
});

// ============================================================
// Common ECharts Tooltip Config
// ============================================================

const tooltipConfig = {
  backgroundColor: 'rgba(10, 14, 39, 0.95)',
  borderColor: 'rgba(0, 242, 254, 0.3)',
  borderWidth: 1,
  textStyle: { color: '#e0e6ff', fontSize: 12 },
  extraCssText: 'box-shadow: 0 0 15px rgba(0, 242, 254, 0.1); border-radius: 4px;'
};

// Common axis style
const axisLineStyle = { lineStyle: { color: 'rgba(0, 242, 254, 0.15)' } };
const axisLabelStyle = { color: 'rgba(224, 230, 255, 0.45)', fontSize: 10 };
const splitLineStyle = { lineStyle: { color: 'rgba(0, 242, 254, 0.05)' } };

// ============================================================
// Gradient Color Helpers for ECharts
// ============================================================

function linearGradient(startColor, endColor, direction = 'vertical') {
  if (direction === 'vertical') {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: startColor },
      { offset: 1, color: endColor }
    ]);
  }
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: startColor },
    { offset: 1, color: endColor }
  ]);
}

// ============================================================
// Header HTML Template (shared across pages)
// ============================================================

function getHeaderHTML(activePage) {
  const pages = [
    { href: 'index.html', name: '🌍 主控中心', id: 'index' },
    { href: 'smart-city.html', name: '🏙️ 智慧城市', id: 'smart-city' },
    { href: 'cyber-security.html', name: '🛡️ 网络安全', id: 'cyber-security' },
    { href: 'industrial-iot.html', name: '🏭 工业物联网', id: 'industrial-iot' },
    { href: 'financial.html', name: '💹 金融交易', id: 'financial' },
    { href: 'environmental.html', name: '🌿 环境监测', id: 'environmental' },
    { href: 'healthcare.html', name: '🏥 医疗健康', id: 'healthcare' },
  ];

  const navItems = pages.map(p =>
    `<a href="${p.href}" class="nav-item ${p.id === activePage ? 'active' : ''}" onclick="navigateTo('${p.href}'); return false;">${p.name}</a>`
  ).join('\n            ');

  return `
    <header class="dashboard-header">
      <div class="header-logo">
        <div class="logo-icon">⬡</div>
        <div>
          <div class="logo-text">DATAVISION</div>
          <div class="logo-subtitle">GLOBAL COMMAND CENTER</div>
        </div>
      </div>
      <nav class="header-nav">
        ${navItems}
      </nav>
      <div class="header-right">
        <div>
          <div class="header-datetime" id="header-time">00:00:00</div>
          <div class="header-date" id="header-date"></div>
        </div>
      </div>
    </header>`;
}

// ============================================================
// Init on DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  registerEChartsTheme();
  initDashboard();
});
