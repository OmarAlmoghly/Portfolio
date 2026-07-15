const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   DATA — La Liga 2025-2026 (real final standings & top scorers,
   sourced from season-end reporting, May 2026). Points-progression
   curves are a smoothed illustrative trend anchored to the real
   final totals, not official matchday-by-matchday results.
   ============================================================ */
const TEAMS = [
  { key:'barcelona',   en:'Barcelona',    fr:'Barcelone',    pos:1,  pts:94, w:31, d:1,  l:6,  gf:95, ga:36, color:'#E7B33E' },
  { key:'real_madrid', en:'Real Madrid',  fr:'Real Madrid',  pos:2,  pts:86, w:27, d:5,  l:6,  gf:null, ga:null, color:'#4FBEB0' },
  { key:'villarreal',  en:'Villarreal',   fr:'Villarreal',   pos:3,  pts:72, w:null,d:null,l:null, gf:null, ga:null, color:'#E2725B' },
  { key:'mallorca',    en:'Mallorca',     fr:'Majorque',     pos:18, pts:42, w:null,d:null,l:null, gf:null, ga:null, color:'#6FA8DC' },
  { key:'girona',      en:'Girona',       fr:'Girone',       pos:19, pts:41, w:null,d:null,l:null, gf:null, ga:null, color:'#B98AC9' },
  { key:'oviedo',      en:'Real Oviedo',  fr:'Real Oviedo',  pos:20, pts:29, w:6,  d:11, l:21, gf:null, ga:null, color:'#8FBF9F' },
];

const MATCHDAYS = 38;

// Deterministic smoothed cumulative-points curve ending at the real final total.
function buildCurve(finalPts, seed){
  let hash = 0;
  for (let i=0;i<seed.length;i++) hash = (hash*31 + seed.charCodeAt(i)) >>> 0;
  const wobble = (hash % 17) / 100; // small per-team variation, deterministic
  const pts = [0];
  for (let md=1; md<=MATCHDAYS; md++){
    const t = md / MATCHDAYS;
    const shaped = Math.pow(t, 0.92 + wobble);
    pts.push(Math.round(shaped * finalPts));
  }
  pts[MATCHDAYS] = finalPts; // anchor to the real, sourced final total
  for (let i=1;i<pts.length;i++) if (pts[i] < pts[i-1]) pts[i] = pts[i-1];
  return pts;
}
TEAMS.forEach(tm => { tm.curve = buildCurve(tm.pts, tm.key); });

const SCORERS = {
  goals: [
    { en:'K. Mbappé',  fr:'K. Mbappé',  team:'Real Madrid', value:25, color:'#E7B33E' },
    { en:'V. Muriqi',  fr:'V. Muriqi',  team:'Mallorca',     value:23, color:'#4FBEB0' },
    { en:'A. Sørloth', fr:'A. Sørloth', team:'Atlético Madrid', value:20, color:'#E2725B' },
    { en:'A. Budimir', fr:'A. Budimir', team:'Osasuna',      value:17, color:'#6FA8DC' },
  ],
  assists: [
    { en:'Lamine Yamal', fr:'Lamine Yamal', team:'Barcelona',   value:11, color:'#E7B33E' },
    { en:'Luis Milla',   fr:'Luis Milla',   team:'Getafe',       value:10, color:'#4FBEB0' },
    { en:'Arda Güler',   fr:'Arda Güler',   team:'Real Madrid', value:9,  color:'#E2725B' },
  ],
};

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const T = {
  en: {
    langBtn: ['EN','FR'],
    brandEyebrow: 'Project 04',
    brandTitle: 'La Liga Stats Hub',
    banner: '⚠ Standings and scorer totals reflect the real final 2025–26 table (season ended 24 May 2026). The points-progression line is a smoothed illustrative trend anchored to those real totals, not official matchday-by-matchday data.',
    eyebrow: '2025–26 Season · Final Table',
    heroTitle: 'Barcelona seal ',
    heroTitleEm: 'back-to-back titles',
    heroSub: 'Explore how the title race and the relegation fight unfolded, and compare the league\u2019s top scorers and playmakers — pick teams, a stat, and a stretch of the season to focus on.',
    kpi: [
      { label:'Champion', value:'Barcelona', sub:'94 pts · 31W\u20131D\u20136L' },
      { label:'Top scorer', value:'25 goals', sub:'Kylian Mbappé · Real Madrid' },
      { label:'Best goal difference', value:'+59', sub:'Barcelona · 95 GF / 36 GA' },
      { label:'Matchdays played', value:'38', sub:'20 clubs · full season' },
    ],
    line: {
      icon:'📈', title:'Points progression', desc:'Track how a club accumulated points across the season. Compare two clubs and zoom into a stretch of matchdays to see where the title race \u2014 or the relegation fight \u2014 was decided.',
      teamA:'Team', teamB:'Compare with', none:'None',
      rangeLabel:'Matchday range', rangeFull:'Full season', rangeFirst:'1st half (MD 1\u201319)', rangeSecond:'2nd half (MD 20\u201338)',
      xAxis:'Matchday', yAxis:'Points', note:'Note: the week-by-week shape is a smoothed illustrative trend anchored to each club\u2019s real final point total \u2014 not the official result-by-result record.',
    },
    bar: {
      icon:'⚽', title:'Top scorers & playmakers', desc:'Switch between goals and assists to see who led the league in each category this season.',
      goals:'Goals', assists:'Assists', xAxis:'Total', note:'Source: season-end reporting for the 2025\u201326 La Liga campaign.',
    },
    tableLabel:'Pos.', ptsShort:'pts',
    backLink:'← Back to portfolio',
    footer: 'Built for SEG3525 \u2014 Devoir 5 · Data: 2025\u201326 La Liga final standings & top-scorer statistics (season ended 24 May 2026) · Demo dashboard, not affiliated with LaLiga.',
  },
  fr: {
    langBtn: ['FR','EN'],
    brandEyebrow: 'Projet 04',
    brandTitle: 'La Liga Stats Hub',
    banner: '⚠ Le classement et les statistiques de buteurs reflètent le classement final réel de la saison 2025\u201326 (terminée le 24 mai 2026). La courbe de progression des points est une tendance lissée illustrative ancrée sur ces totaux réels, et non le résultat officiel journée par journée.',
    eyebrow: 'Saison 2025\u201326 · Classement final',
    heroTitle: 'Le Barça conserve ',
    heroTitleEm: 'son titre',
    heroSub: 'Explorez comment la course au titre et la lutte pour le maintien se sont déroulées, et comparez les meilleurs buteurs et passeurs de la ligue \u2014 choisissez des équipes, une statistique et une période de la saison.',
    kpi: [
      { label:'Champion', value:'Barcelone', sub:'94 pts · 31V\u20131N\u20136D' },
      { label:'Meilleur buteur', value:'25 buts', sub:'Kylian Mbappé · Real Madrid' },
      { label:'Meilleure différence de buts', value:'+59', sub:'Barcelone · 95 BP / 36 BC' },
      { label:'Journées disputées', value:'38', sub:'20 clubs · saison complète' },
    ],
    line: {
      icon:'📈', title:'Progression des points', desc:'Suivez l\u2019accumulation des points d\u2019un club au fil de la saison. Comparez deux clubs et zoomez sur une partie du calendrier pour voir où la course au titre \u2014 ou le combat pour le maintien \u2014 s\u2019est jouée.',
      teamA:'Équipe', teamB:'Comparer avec', none:'Aucune',
      rangeLabel:'Plage de journées', rangeFull:'Saison complète', rangeFirst:'1re moitié (J1\u201319)', rangeSecond:'2e moitié (J20\u201338)',
      xAxis:'Journée', yAxis:'Points', note:'Remarque : la courbe journée par journée est une tendance lissée illustrative ancrée sur le total final réel de chaque club \u2014 pas le résultat officiel match par match.',
    },
    bar: {
      icon:'⚽', title:'Buteurs et passeurs', desc:'Basculez entre buts et passes décisives pour voir qui a dominé la ligue dans chaque catégorie cette saison.',
      goals:'Buts', assists:'Passes déc.', xAxis:'Total', note:'Source : bilans de fin de saison de la campagne 2025\u201326 de La Liga.',
    },
    tableLabel:'Pos.', ptsShort:'pts',
    backLink:'← Retour au portfolio',
    footer: 'Réalisé pour SEG3525 \u2014 Devoir 5 · Données : classement final et statistiques de buteurs de la saison 2025\u201326 de La Liga (terminée le 24 mai 2026) · Tableau de bord de démonstration, non affilié à LaLiga.',
  },
};

const fmtNum = (v, lang) => v.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');

/* ============================================================
   SCOREBOARD (KPI strip)
   ============================================================ */
function Scoreboard({ lang }){
  const t = T[lang];
  const icons = ['🏆','🎯','🛡️','📅'];
  return (
    <div className="scoreboard">
      {t.kpi.map((k,i)=>(
        <div className="score-tile" key={i}>
          <div className="tile-label">{icons[i]} {k.label}</div>
          <div className="tile-value num">{k.value}</div>
          <div className="tile-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   LINE CHART — Points progression (team compare + matchday range)
   ============================================================ */
function LineChartCard({ lang }){
  const t = T[lang].line;
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [teamA, setTeamA] = useState('barcelona');
  const [teamB, setTeamB] = useState('real_madrid');
  const [range, setRange] = useState('full');

  const bounds = useMemo(() => {
    if (range === 'first')  return [0, 19];
    if (range === 'second') return [19, 38];
    return [0, 38];
  }, [range]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    const labels = Array.from({length: bounds[1]-bounds[0]+1}, (_,i) => bounds[0]+i);

    const teams = [TEAMS.find(x=>x.key===teamA)];
    if (teamB !== 'none') teams.push(TEAMS.find(x=>x.key===teamB));

    const datasets = teams.map(tm => ({
      label: `${tm[lang]} — ${tm.pts} ${T[lang].ptsShort}`,
      data: tm.curve.slice(bounds[0], bounds[1]+1),
      borderColor: tm.color,
      backgroundColor: tm.color + '33',
      pointBackgroundColor: tm.color,
      borderWidth: 2.75,
      pointRadius: 2.5,
      pointHoverRadius: 7,
      tension: 0.3,
      fill: teams.length === 1,
    }));

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position:'top', labels:{ color:'#F3E9DE', boxWidth:12, boxHeight:12, padding:14, font:{ size:11.5 } } },
          tooltip: {
            backgroundColor:'#170402', borderColor:'#5C2418', borderWidth:1, titleColor:'#fff', bodyColor:'#F3E9DE',
            callbacks: { label:(c)=> `  ${c.dataset.label.split(' — ')[0]}: ${fmtNum(c.parsed.y, lang)} ${T[lang].ptsShort}` }
          }
        },
        scales: {
          x: { title:{ display:true, text:t.xAxis, color:'#D9BFA6', font:{size:11} }, grid:{ color:'rgba(217,165,33,0.08)' }, ticks:{ color:'#D9BFA6', font:{size:10} } },
          y: { min:0, max:100, title:{ display:true, text:t.yAxis, color:'#D9BFA6', font:{size:11} }, grid:{ color:'rgba(217,165,33,0.08)' }, ticks:{ color:'#D9BFA6', font:{size:10}, callback:(v)=>fmtNum(v,lang) } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [lang, teamA, teamB, range]);

  return (
    <div className="chart-card">
      <div className="card-head">
        <span className="card-icon">{t.icon}</span>
        <div>
          <h3>{t.title}</h3>
          <p>{t.desc}</p>
        </div>
      </div>

      <div className="controls">
        <div className="field">
          <label htmlFor="teamA-select">{t.teamA}</label>
          <select id="teamA-select" value={teamA} onChange={e=>setTeamA(e.target.value)}>
            {TEAMS.map(tm => <option key={tm.key} value={tm.key}>{tm.pos}. {tm[lang]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="teamB-select">{t.teamB}</label>
          <select id="teamB-select" value={teamB} onChange={e=>setTeamB(e.target.value)}>
            <option value="none">{t.none}</option>
            {TEAMS.filter(tm=>tm.key!==teamA).map(tm => <option key={tm.key} value={tm.key}>{tm.pos}. {tm[lang]}</option>)}
          </select>
        </div>
        <div className="field">
          <label>{t.rangeLabel}</label>
          <div className="segmented" role="group" aria-label={t.rangeLabel}>
            <button className={range==='full'?'active':''} onClick={()=>setRange('full')}>{t.rangeFull}</button>
            <button className={range==='first'?'active':''} onClick={()=>setRange('first')}>{t.rangeFirst}</button>
            <button className={range==='second'?'active':''} onClick={()=>setRange('second')}>{t.rangeSecond}</button>
          </div>
        </div>
      </div>

      <div className="canvas-wrapper tall"><canvas ref={canvasRef}></canvas></div>
      <div className="legend-note">{t.note}</div>
    </div>
  );
}

/* ============================================================
   BAR CHART — Top scorers & playmakers (goals / assists toggle)
   ============================================================ */
function BarChartCard({ lang }){
  const t = T[lang].bar;
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [stat, setStat] = useState('goals');

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    const rows = SCORERS[stat];

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rows.map(r => r[lang]),
        datasets: [{
          label: stat === 'goals' ? t.goals : t.assists,
          data: rows.map(r => r.value),
          backgroundColor: rows.map(r => r.color + 'CC'),
          borderColor: rows.map(r => r.color),
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display:false },
          tooltip: {
            backgroundColor:'#170402', borderColor:'#5C2418', borderWidth:1, titleColor:'#fff', bodyColor:'#F3E9DE',
            callbacks: {
              title: (c)=> c[0].label,
              label: (c)=> `${rows[c.dataIndex].team} — ${fmtNum(c.parsed.x, lang)}`
            }
          }
        },
        scales: {
          x: { beginAtZero:true, title:{ display:true, text:t.xAxis, color:'#D9BFA6', font:{size:11} }, grid:{ color:'rgba(217,165,33,0.08)' }, ticks:{ color:'#D9BFA6', font:{size:10} } },
          y: { grid:{ display:false }, ticks:{ color:'#F3E9DE', font:{size:12, weight:600} } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [lang, stat]);

  return (
    <div className="chart-card">
      <div className="card-head">
        <span className="card-icon">{t.icon}</span>
        <div>
          <h3>{t.title}</h3>
          <p>{t.desc}</p>
        </div>
      </div>

      <div className="controls">
        <div className="segmented" role="group" aria-label={t.title}>
          <button className={stat==='goals'?'active':''} onClick={()=>setStat('goals')}>{t.goals}</button>
          <button className={stat==='assists'?'active':''} onClick={()=>setStat('assists')}>{t.assists}</button>
        </div>
      </div>

      <div className="canvas-wrapper"><canvas ref={canvasRef}></canvas></div>
      <div className="legend-note">{t.note}</div>
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
function App(){
  const [lang, setLang] = useState('fr');
  const t = T[lang];

  const changeLang = (next) => {
    setLang(next);
    document.getElementById('html-root').setAttribute('lang', next);
  };

  return (
    <>
      <header>
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">⚽</div>
          <div className="brand-text">
            <div className="eyebrow-mini">{t.brandEyebrow}</div>
            <h1>{t.brandTitle}</h1>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'0.9rem'}}>
          <a className="back-link" href="../design4.html">{t.backLink}</a>
          <div className="lang-toggle" role="group" aria-label="Language / Langue">
            <button className={lang==='fr'?'active':''} onClick={()=>changeLang('fr')} aria-pressed={lang==='fr'}>FR</button>
            <button className={lang==='en'?'active':''} onClick={()=>changeLang('en')} aria-pressed={lang==='en'}>EN</button>
          </div>
        </div>
      </header>

      <div className="gold-divider" aria-hidden="true"></div>
      <div className="data-banner" role="note">{t.banner}</div>

      <main>
        <div className="hero">
          <div className="eyebrow"><span className="rule"></span>{t.eyebrow}</div>
          <h2>{t.heroTitle}<em>{t.heroTitleEm}</em></h2>
          <p>{t.heroSub}</p>
        </div>

        <Scoreboard lang={lang} />

        <div className="dashboard-grid">
          <LineChartCard lang={lang} />
          <BarChartCard lang={lang} />
        </div>
      </main>

      <footer>{t.footer}</footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);