import { useState, useCallback } from "react";

const SpeechEngine = (() => {
  let voices = [];
  let ready = false;
  const queue = [];
  const load = () => {
    if (!window.speechSynthesis) return;
    const v = window.speechSynthesis.getVoices();
    if (v.length) { voices = v; ready = true; queue.forEach(fn => fn()); queue.length = 0; }
  };
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = load;
    load();
    [200, 600, 1200].forEach(ms => setTimeout(load, ms));
  }
  const onReady = (fn) => { if (ready) fn(); else queue.push(fn); };
  const speak = (text, rate = 0.84) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const say = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE"; u.rate = rate; u.pitch = 1.0;
      const prefs = ["Google Deutsch", "de-DE", "de_DE", "Deutsch", "de"];
      let best = null;
      for (const p of prefs) {
        best = voices.find(v => v.name.includes(p) || v.lang === p || v.lang.startsWith(p));
        if (best) break;
      }
      if (!best) best = voices.find(v => v.lang.startsWith("de"));
      if (best) u.voice = best;
      if (text.length > 80) {
        const parts = text.split(/[,;]/);
        let i = 0;
        const next = () => {
          if (i >= parts.length) return;
          const pu = new SpeechSynthesisUtterance(parts[i++].trim());
          pu.lang = "de-DE"; pu.rate = rate; pu.pitch = 1.0;
          if (best) pu.voice = best;
          pu.onend = next;
          window.speechSynthesis.speak(pu);
        };
        next();
      } else {
        window.speechSynthesis.speak(u);
      }
    };
    onReady(say);
  };
  return { speak };
})();

const C = {
  bg:"#F0F4F8", card:"#FFFFFF",
  p:"#4F46E5", pl:"#6366F1", ps:"#EEF2FF", pxs:"#F5F3FF",
  gr:"#16A34A", grs:"#DCFCE7",
  rd:"#DC2626", rds:"#FEE2E2",
  am:"#D97706", ams:"#FEF3C7",
  lt:"#E2E8F0", md:"#64748B", dk:"#0F172A",
  sh:"0 2px 12px rgba(0,0,0,0.08)", sh2:"0 4px 24px rgba(79,70,229,0.14)",
};

const UNITS = [
  { id:1, color:"#58CC02", dark:"#3D8A01", soft:"#E5F8CC", icon:"🌱", title:"Unit 1", sub:"Absolute Basics",
    lessons:[
      { id:"1-1", title:"Greetings", icon:"👋", xp:10, ex:[
        {t:"LISTEN",de:"Hallo",en:"Hello",o:["Hello","Goodbye","Thank you","Please"]},
        {t:"PICK",en:"Thank you",de:"Danke",o:["Ja","Bitte","Danke","Nein"]},
        {t:"LISTEN",de:"Bitte",en:"Please",o:["Please","Yes","No","Sorry"]},
        {t:"PAIRS",p:[{de:"Ja",en:"Yes"},{de:"Nein",en:"No"},{de:"Tschüss",en:"Bye"},{de:"Toll",en:"Great"}]},
        {t:"PICK",en:"Excuse me",de:"Entschuldigung",o:["Hallo","Bitte","Entschuldigung","Danke"]},
        {t:"LISTEN",de:"Auf Wiedersehen",en:"Goodbye (formal)",o:["Goodbye (formal)","Good morning","Good night","See you"]},
      ]},
      { id:"1-2", title:"Good Morning", icon:"☀️", xp:10, ex:[
        {t:"LISTEN",de:"Guten Morgen",en:"Good morning",o:["Good morning","Good night","Good evening","Hello"]},
        {t:"PICK",en:"Good night",de:"Gute Nacht",o:["Guten Tag","Guten Abend","Gute Nacht","Guten Morgen"]},
        {t:"PAIRS",p:[{de:"Morgen",en:"Morning"},{de:"Abend",en:"Evening"},{de:"Nacht",en:"Night"},{de:"Tag",en:"Day"}]},
        {t:"LISTEN",de:"Wie geht es Ihnen?",en:"How are you? (formal)",o:["How are you? (formal)","What is that?","Where are you?","Who are you?"]},
        {t:"PICK",en:"I am fine",de:"Mir geht es gut",o:["Ich bin müde","Mir geht es gut","Ich bin hungrig","Es tut mir leid"]},
        {t:"LISTEN",de:"Bis später",en:"See you later",o:["See you later","Good morning","Goodbye","Good night"]},
      ]},
      { id:"1-3", title:"Numbers", icon:"🔢", xp:10, ex:[
        {t:"LISTEN",de:"Eins, zwei, drei",en:"One, two, three",o:["One, two, three","Four, five, six","Seven, eight, nine","Ten, eleven, twelve"]},
        {t:"PICK",en:"Five",de:"Fünf",o:["Drei","Vier","Fünf","Sechs"]},
        {t:"PAIRS",p:[{de:"Sieben",en:"Seven"},{de:"Acht",en:"Eight"},{de:"Neun",en:"Nine"},{de:"Zehn",en:"Ten"}]},
        {t:"LISTEN",de:"Zwanzig",en:"Twenty",o:["Twenty","Twelve","Two hundred","Two thousand"]},
        {t:"PICK",en:"One hundred",de:"Hundert",o:["Zehn","Zwanzig","Hundert","Tausend"]},
        {t:"LISTEN",de:"Wie alt bist du?",en:"How old are you?",o:["How old are you?","What is your name?","Where are you from?","When is your birthday?"]},
      ]},
    ]
  },
  { id:2, color:"#1CB0F6", dark:"#0E8EC4", soft:"#D0F0FF", icon:"👤", title:"Unit 2", sub:"People & Identity",
    lessons:[
      { id:"2-1", title:"Introductions", icon:"🙋", xp:15, ex:[
        {t:"LISTEN",de:"Ich heiße Anna",en:"My name is Anna",o:["My name is Anna","I am from Germany","I am a student","Nice to meet you"]},
        {t:"PICK",en:"Where are you from?",de:"Woher kommst du?",o:["Wie heißt du?","Woher kommst du?","Wie alt bist du?","Was machst du?"]},
        {t:"PAIRS",p:[{de:"Ich",en:"I"},{de:"Du",en:"You"},{de:"Er",en:"He"},{de:"Sie",en:"She"}]},
        {t:"LISTEN",de:"Ich komme aus Indien",en:"I come from India",o:["I come from India","I live in Berlin","I speak German","I am a teacher"]},
        {t:"PICK",en:"Nice to meet you",de:"Schön dich kennenzulernen",o:["Auf Wiedersehen","Schön dich kennenzulernen","Tut mir leid","Kein Problem"]},
        {t:"LISTEN",de:"Ich bin Student",en:"I am a student",o:["I am a student","I am a teacher","I am a doctor","I am an engineer"]},
      ]},
      { id:"2-2", title:"Family", icon:"👨‍👩‍👧", xp:15, ex:[
        {t:"LISTEN",de:"Meine Mutter",en:"My mother",o:["My mother","My father","My sister","My brother"]},
        {t:"PICK",en:"My father",de:"Mein Vater",o:["Meine Mutter","Mein Vater","Meine Schwester","Mein Bruder"]},
        {t:"PAIRS",p:[{de:"Bruder",en:"Brother"},{de:"Schwester",en:"Sister"},{de:"Sohn",en:"Son"},{de:"Tochter",en:"Daughter"}]},
        {t:"LISTEN",de:"Ich habe zwei Geschwister",en:"I have two siblings",o:["I have two siblings","I am an only child","My family is big","I live with my parents"]},
        {t:"PICK",en:"Grandmother",de:"Oma",o:["Opa","Oma","Tante","Onkel"]},
        {t:"LISTEN",de:"Meine Familie ist sehr wichtig",en:"My family is very important",o:["My family is very important","I love my family","We are a big family","Family comes first"]},
      ]},
    ]
  },
  { id:3, color:"#FF9600", dark:"#CC7200", soft:"#FFE9C0", icon:"🍽️", title:"Unit 3", sub:"Food & Drink",
    lessons:[
      { id:"3-1", title:"Drinks", icon:"☕", xp:20, ex:[
        {t:"LISTEN",de:"Ein Kaffee, bitte",en:"A coffee, please",o:["A coffee, please","A tea, please","A water, please","A juice, please"]},
        {t:"PICK",en:"Water",de:"Wasser",o:["Tee","Kaffee","Wasser","Saft"]},
        {t:"PAIRS",p:[{de:"Milch",en:"Milk"},{de:"Saft",en:"Juice"},{de:"Bier",en:"Beer"},{de:"Wein",en:"Wine"}]},
        {t:"LISTEN",de:"Ich bin durstig",en:"I am thirsty",o:["I am thirsty","I am hungry","I am full","I am tired"]},
        {t:"PICK",en:"Cheers!",de:"Prost!",o:["Mahlzeit!","Guten Appetit!","Prost!","Zum Wohl!"]},
        {t:"LISTEN",de:"Was möchten Sie trinken?",en:"What would you like to drink?",o:["What would you like to drink?","Are you hungry?","The menu please","Can I help you?"]},
      ]},
      { id:"3-2", title:"Food", icon:"🍞", xp:20, ex:[
        {t:"LISTEN",de:"Das Brot",en:"The bread",o:["The bread","The meat","The cheese","The egg"]},
        {t:"PICK",en:"The cheese",de:"Der Käse",o:["Das Brot","Der Käse","Das Fleisch","Die Butter"]},
        {t:"PAIRS",p:[{de:"Das Ei",en:"The egg"},{de:"Die Suppe",en:"The soup"},{de:"Der Salat",en:"The salad"},{de:"Der Kuchen",en:"The cake"}]},
        {t:"LISTEN",de:"Das Essen schmeckt lecker",en:"The food tastes delicious",o:["The food tastes delicious","The food is too spicy","I don't like it","It is expensive"]},
        {t:"PICK",en:"I am vegetarian",de:"Ich bin Vegetarier",o:["Ich bin vegan","Ich bin Vegetarier","Ich bin allergisch","Ich esse kein Fleisch"]},
        {t:"LISTEN",de:"Guten Appetit!",en:"Enjoy your meal!",o:["Enjoy your meal!","Cheers!","Thank you!","Good morning!"]},
      ]},
      { id:"3-3", title:"At a Restaurant", icon:"🍴", xp:20, ex:[
        {t:"LISTEN",de:"Die Speisekarte, bitte",en:"The menu, please",o:["The menu, please","The bill, please","A table for two","What do you recommend?"]},
        {t:"PICK",en:"The bill, please",de:"Die Rechnung, bitte",o:["Guten Appetit","Die Rechnung, bitte","Einen Tisch für zwei","Noch einmal, bitte"]},
        {t:"PAIRS",p:[{de:"Der Kellner",en:"The waiter"},{de:"Der Tisch",en:"The table"},{de:"Die Gabel",en:"The fork"},{de:"Das Messer",en:"The knife"}]},
        {t:"LISTEN",de:"Ich möchte bestellen",en:"I would like to order",o:["I would like to order","Can I get the bill?","Is this table free?","What do you recommend?"]},
        {t:"PICK",en:"A table for two, please",de:"Einen Tisch für zwei, bitte",o:["Zahlen, bitte","Guten Appetit","Einen Tisch für zwei, bitte","Noch ein Bier, bitte"]},
        {t:"LISTEN",de:"Hat es Ihnen geschmeckt?",en:"Did you enjoy your meal?",o:["Did you enjoy your meal?","Would you like dessert?","Can I take your plate?","Are you ready to order?"]},
      ]},
    ]
  },
  { id:4, color:"#FF4B4B", dark:"#CC2E2E", soft:"#FFD7D7", icon:"✈️", title:"Unit 4", sub:"Travel & Navigation",
    lessons:[
      { id:"4-1", title:"Directions", icon:"🗺️", xp:25, ex:[
        {t:"LISTEN",de:"Links abbiegen",en:"Turn left",o:["Turn left","Turn right","Go straight","Turn around"]},
        {t:"PICK",en:"Go straight ahead",de:"Geradeaus gehen",o:["Links abbiegen","Rechts abbiegen","Geradeaus gehen","Umkehren"]},
        {t:"PAIRS",p:[{de:"Hier",en:"Here"},{de:"Dort",en:"There"},{de:"Nah",en:"Near"},{de:"Weit",en:"Far"}]},
        {t:"LISTEN",de:"Wo ist der Bahnhof?",en:"Where is the train station?",o:["Where is the train station?","How far is the airport?","Is there a hotel nearby?","Where can I find a taxi?"]},
        {t:"PICK",en:"I am lost",de:"Ich habe mich verlaufen",o:["Ich bin pünktlich","Ich habe mich verlaufen","Ich kenne den Weg","Ich bin fast da"]},
        {t:"LISTEN",de:"Können Sie mir den Weg erklären?",en:"Can you explain the way to me?",o:["Can you explain the way to me?","Is it far from here?","Should I take the bus?","How long does it take?"]},
      ]},
      { id:"4-2", title:"Transport", icon:"🚆", xp:25, ex:[
        {t:"LISTEN",de:"Ein Ticket nach München",en:"A ticket to Munich",o:["A ticket to Munich","A return ticket","A first class ticket","A monthly pass"]},
        {t:"PICK",en:"The airport",de:"Der Flughafen",o:["Der Bahnhof","Die Bushaltestelle","Der Flughafen","Die U-Bahn"]},
        {t:"PAIRS",p:[{de:"Das Auto",en:"The car"},{de:"Das Fahrrad",en:"The bicycle"},{de:"Die U-Bahn",en:"The subway"},{de:"Das Taxi",en:"The taxi"}]},
        {t:"LISTEN",de:"Wann fährt der nächste Zug?",en:"When does the next train leave?",o:["When does the next train leave?","Which platform is it?","Is this the right train?","Where do I change trains?"]},
        {t:"PICK",en:"Is this seat taken?",de:"Ist dieser Platz besetzt?",o:["Wo ist der Ausgang?","Wann kommen wir an?","Ist dieser Platz besetzt?","Darf ich das Fenster öffnen?"]},
        {t:"LISTEN",de:"Der Zug hat Verspätung",en:"The train is delayed",o:["The train is delayed","The train is on time","The train is cancelled","The next train is in 5 minutes"]},
      ]},
    ]
  },
  { id:5, color:"#CE82FF", dark:"#9A50CC", soft:"#F0D9FF", icon:"💬", title:"Unit 5", sub:"Conversations",
    lessons:[
      { id:"5-1", title:"Daily Life", icon:"📅", xp:30, ex:[
        {t:"LISTEN",de:"Ich stehe um sieben Uhr auf",en:"I get up at seven o'clock",o:["I get up at seven o'clock","I go to bed at ten","I eat breakfast at eight","I start work at nine"]},
        {t:"PICK",en:"What time is it?",de:"Wie viel Uhr ist es?",o:["Welcher Tag ist heute?","Wie viel Uhr ist es?","Wann beginnt der Film?","Wie lange dauert es?"]},
        {t:"PAIRS",p:[{de:"Heute",en:"Today"},{de:"Morgen",en:"Tomorrow"},{de:"Gestern",en:"Yesterday"},{de:"Jetzt",en:"Now"}]},
        {t:"LISTEN",de:"Was machst du in deiner Freizeit?",en:"What do you do in your free time?",o:["What do you do in your free time?","Do you have a hobby?","What is your job?","Do you live alone?"]},
        {t:"PICK",en:"I like reading books",de:"Ich lese gerne Bücher",o:["Ich spiele gerne Tennis","Ich lese gerne Bücher","Ich koche gerne","Ich reise gerne"]},
        {t:"LISTEN",de:"Das Wochenende ist meine Lieblingszeit",en:"The weekend is my favourite time",o:["The weekend is my favourite time","I work on weekends","I sleep all weekend","Weekends are too short"]},
      ]},
      { id:"5-2", title:"Shopping", icon:"🛍️", xp:30, ex:[
        {t:"LISTEN",de:"Was kostet das?",en:"How much does that cost?",o:["How much does that cost?","Do you have this in my size?","Can I pay by card?","Where is the fitting room?"]},
        {t:"PICK",en:"Too expensive",de:"Zu teuer",o:["Sehr günstig","Zu teuer","Ausverkauft","Perfekt"]},
        {t:"PAIRS",p:[{de:"Kaufen",en:"To buy"},{de:"Verkaufen",en:"To sell"},{de:"Bezahlen",en:"To pay"},{de:"Sparen",en:"To save"}]},
        {t:"LISTEN",de:"Haben Sie das in einer anderen Farbe?",en:"Do you have this in another colour?",o:["Do you have this in another colour?","Can I return this?","Is there a discount?","Do you gift wrap?"]},
        {t:"PICK",en:"I'll take it!",de:"Ich nehme es!",o:["Ich brauche es nicht","Ich nehme es!","Zu groß für mich","Haben Sie etwas Günstigeres?"]},
        {t:"LISTEN",de:"Kann ich mit Karte zahlen?",en:"Can I pay by card?",o:["Can I pay by card?","Do you accept cash?","Is there a surcharge?","Where is the checkout?"]},
      ]},
    ]
  },
];

const ALL = UNITS.flatMap(u => u.lessons.map(l => ({...l, unit: u})));
const speak = (t, rate) => SpeechEngine.speak(t, rate);

const SIcon = ({color="#fff", s=20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const SpeakBtn = ({text, rate=0.82, bg, border, ic}) => {
  const [active, setActive] = useState(false);
  const fire = () => { setActive(true); speak(text, rate); setTimeout(()=>setActive(false), 1200); };
  return (
    <button onClick={fire} title={rate<0.7?"Slow":"Normal"}
      style={{width:50,height:50,borderRadius:"50%",background:active?border:bg,border:`2.5px solid ${border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${border}`,transition:"all .12s",transform:active?"scale(.93)":"scale(1)",outline:"none"}}>
      <SIcon color={ic} s={21}/>
    </button>
  );
};

export default function App() {
  const [screen, setScreen] = useState("path");
  const [done, setDone] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak] = useState(7);
  const [lesson, setLesson] = useState(null);
  const [ei, setEi] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [lxp, setLxp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sel, setSel] = useState(null);
  const [shown, setShown] = useState(false);
  const [ok, setOk] = useState(null);
  const [pairsShuf, setPairsShuf] = useState([]);
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongF, setWrongF] = useState(null);
  const [pairsDone, setPairsDone] = useState(false);

  const unlocked = id => {
    const i = ALL.findIndex(l=>l.id===id);
    return i===0 || done.includes(ALL[i-1]?.id);
  };

  const resetEx = useCallback((ex) => {
    setSel(null); setShown(false); setOk(null);
    setLeftSel(null); setWrongF(null); setPairsDone(false);
    if (!ex) return;
    if (ex.t === "PAIRS") {
      setPairsShuf([...Array(ex.p.length).keys()].sort(()=>Math.random()-.5));
      setMatched(new Set());
    }
    if (ex.t === "LISTEN") setTimeout(()=>speak(ex.de, 0.82), 500);
  }, []);

  const startLesson = (ls) => {
    setLesson(ls); setEi(0); setHearts(5); setLxp(0); setCorrect(0);
    resetEx(ls.ex[0]);
    setScreen("lesson");
  };

  const answer = (opt) => {
    if (shown) return;
    const ex = lesson.ex[ei];
    const isOk = opt === ex.en || opt === ex.de;
    setSel(opt); setOk(isOk); setShown(true);
    if (isOk) { setCorrect(p=>p+1); setLxp(p=>p+5); setTimeout(()=>speak(ex.de, 0.75), 100); }
    else setHearts(p=>Math.max(0,p-1));
  };

  const next = () => {
    const n = ei + 1;
    if (n >= lesson.ex.length) {
      setDone(p=>p.includes(lesson.id)?p:[...p,lesson.id]);
      setXp(p=>p+lesson.xp+lxp);
      setScreen("complete");
    } else { setEi(n); resetEx(lesson.ex[n]); }
  };

  const tapLeft = i => { if (matched.has(i)) return; setLeftSel(p=>p===i?null:i); };
  const tapRight = ri => {
    if (leftSel===null) return;
    const ex = lesson.ex[ei];
    const ai = pairsShuf[ri];
    if (matched.has(ai)) return;
    if (leftSel===ai) {
      speak(ex.p[ai].de, 0.75);
      const nm = new Set(matched); nm.add(ai);
      setMatched(nm); setLeftSel(null);
      if (nm.size===ex.p.length) { setPairsDone(true); setCorrect(p=>p+1); setLxp(p=>p+5); }
    } else {
      setWrongF({l:leftSel, r:ri}); setLeftSel(null);
      setHearts(p=>Math.max(0,p-1));
      setTimeout(()=>setWrongF(null), 650);
    }
  };

  const canContinue = shown || pairsDone;
  const panelOk = ok !== false;
  const ex = lesson?.ex[ei];
  const uc = lesson?.unit?.color || C.p;
  const ud = lesson?.unit?.dark || C.pl;

  if (screen === "path") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:30,background:"#fff",borderBottom:`2px solid ${C.lt}`,height:62,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:C.ps,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🇩🇪</div>
          <div>
            <div style={{color:C.p,fontWeight:900,fontSize:16,letterSpacing:"-0.5px"}}>DeutschMeister</div>
            <div style={{color:C.md,fontSize:10,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>German A1 → C2</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{b:C.ams,c:C.am,i:"🔥",v:streak},{b:C.ps,c:C.p,i:"⚡",v:`${xp} XP`},{b:C.rds,c:C.rd,i:"❤️",v:5}].map(s=>(
            <div key={s.i} style={{display:"flex",alignItems:"center",gap:5,background:s.b,borderRadius:24,padding:"5px 11px",border:`1.5px solid ${s.c}30`}}>
              <span style={{fontSize:14}}>{s.i}</span>
              <span style={{color:s.c,fontWeight:800,fontSize:13}}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 18px 80px"}}>
        <div style={{background:`linear-gradient(135deg, ${C.p}, #7C3AED)`,borderRadius:24,padding:"24px 26px",marginBottom:32,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-12,top:-12,fontSize:100,opacity:.09,userSelect:"none"}}>🇩🇪</div>
          <div style={{color:"rgba(255,255,255,.7)",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Your Learning Path</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:24,letterSpacing:"-0.5px",marginBottom:4}}>{ALL.filter(l=>done.includes(l.id)).length} / {ALL.length} Lessons Complete</div>
          <div style={{background:"rgba(255,255,255,.2)",borderRadius:10,height:8,overflow:"hidden",marginBottom:10}}>
            <div style={{width:`${(done.length/ALL.length)*100}%`,height:"100%",background:"#fff",borderRadius:10,transition:"width .6s"}}/>
          </div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:13}}>{done.length===0?"Start your first lesson! 🚀":`${xp} XP earned · Keep going! 🔥`}</div>
        </div>
        {UNITS.map(unit => {
          const ZIG = [0,64,96,64,0,-64,-96,-64];
          return (
            <div key={unit.id} style={{marginBottom:40}}>
              <div style={{background:unit.color,borderRadius:20,padding:"16px 22px",marginBottom:30,boxShadow:`0 6px 0 ${unit.dark}`,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:0,top:-6,fontSize:80,opacity:.12,userSelect:"none"}}>{unit.icon}</div>
                <div style={{color:"rgba(255,255,255,.8)",fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>{unit.title}</div>
                <div style={{color:"#fff",fontSize:18,fontWeight:900,marginTop:2}}>{unit.sub}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:26}}>
                {unit.lessons.map((ls, li) => {
                  const isDone = done.includes(ls.id);
                  const isUnlock = unlocked(ls.id);
                  const isActive = !isDone && isUnlock;
                  const off = ZIG[li % ZIG.length];
                  return (
                    <div key={ls.id} style={{display:"flex",flexDirection:"column",alignItems:"center",transform:`translateX(${off}px)`}}>
                      <div style={{width:78,height:78,borderRadius:"50%",background:isDone?unit.dark:isUnlock?unit.dark:"#A0AEC0",position:"relative"}}>
                        <button onClick={()=>isUnlock&&startLesson({...ls,unit})} disabled={!isUnlock}
                          style={{position:"absolute",top:0,left:0,width:78,height:78,transform:"translateY(-5px)",borderRadius:"50%",background:isDone?unit.color:isUnlock?unit.color:"#CBD5E0",border:"none",cursor:isUnlock?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:isActive?`0 0 0 6px ${unit.color}35`:"none",outline:"none",transition:"transform .12s"}}
                          onMouseEnter={e=>{if(isUnlock)e.currentTarget.style.transform="translateY(-9px)";}}
                          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(-5px)";}}>
                          <span style={{fontSize:isDone?24:isUnlock?30:22}}>{isDone?"⭐":!isUnlock?"🔒":ls.icon}</span>
                        </button>
                      </div>
                      {isActive&&(
                        <button onClick={()=>startLesson({...ls,unit})}
                          style={{marginTop:12,background:unit.color,border:`2.5px solid ${unit.dark}`,borderRadius:14,padding:"9px 28px",color:"#fff",fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:`0 5px 0 ${unit.dark}`,letterSpacing:.8,outline:"none",transition:"transform .12s"}}
                          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
                          onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
                          START
                        </button>
                      )}
                      <div style={{marginTop:isActive?6:10,textAlign:"center"}}>
                        <div style={{fontWeight:700,fontSize:12,color:isDone?unit.color:isUnlock?C.dk:C.md}}>{ls.title}</div>
                        <div style={{fontSize:11,color:C.md,marginTop:2}}>+{ls.xp} XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{textAlign:"center",paddingTop:8}}>
          <div style={{fontSize:48,marginBottom:8}}>🏁</div>
          <div style={{color:C.md,fontSize:14,fontWeight:600}}>More lessons coming soon!</div>
        </div>
      </div>
    </div>
  );

  if (screen==="complete") {
    const acc = lesson ? Math.round(correct/lesson.ex.length*100) : 0;
    return (
      <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
          <div style={{fontSize:90}}>🎊</div>
          <h1 style={{color:C.gr,fontSize:36,fontWeight:900,margin:"8px 0 4px",letterSpacing:"-1px"}}>Wunderbar!</h1>
          <p style={{color:C.md,fontSize:15,margin:"0 0 32px"}}>Lesson complete — you are crushing it!</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:32}}>
            {[
              {i:"⚡",v:`+${lesson?.xp+lxp}`,l:"XP",b:C.ps,c:C.p},
              {i:"🎯",v:`${acc}%`,l:"Accuracy",b:C.grs,c:C.gr},
              {i:"❤️",v:hearts,l:"Hearts",b:C.rds,c:C.rd},
            ].map(s=>(
              <div key={s.l} style={{background:s.b,borderRadius:20,padding:"20px 10px",border:`2px solid ${s.c}20`}}>
                <div style={{fontSize:30,marginBottom:6}}>{s.i}</div>
                <div style={{color:s.c,fontWeight:900,fontSize:28}}>{s.v}</div>
                <div style={{color:s.c,opacity:.6,fontSize:11,fontWeight:700,marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setScreen("path")}
            style={{width:"100%",background:C.gr,border:`3px solid #15803D`,borderRadius:18,padding:"16px",color:"#fff",fontWeight:900,fontSize:18,cursor:"pointer",boxShadow:"0 5px 0 #15803D",outline:"none"}}>
            CONTINUE →
          </button>
        </div>
      </div>
    );
  }

  if (!ex) return null;
  const total = lesson.ex.length;

  return (
    <div style={{minHeight:"100vh",background:"#FFFFFF",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",maxWidth:680,margin:"0 auto"}}>
      <div style={{padding:"14px 20px 12px",display:"flex",alignItems:"center",gap:14,background:"#fff",borderBottom:`1.5px solid ${C.lt}`,flexShrink:0}}>
        <button onClick={()=>{window.speechSynthesis?.cancel();setScreen("path");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:26,color:C.md,lineHeight:1,padding:"0 4px"}}>✕</button>
        <div style={{flex:1,height:16,background:C.lt,borderRadius:20,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(ei/total)*100}%`,background:uc,borderRadius:20,transition:"width .55s ease",boxShadow:`0 0 10px ${uc}70`}}/>
        </div>
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          {Array(5).fill(0).map((_,i)=>(
            <span key={i} style={{fontSize:18,opacity:i<hearts?1:.2,transition:"opacity .3s"}}>{i<hearts?"❤️":"🩶"}</span>
          ))}
        </div>
      </div>

      <div style={{flex:1,padding:"24px 24px 140px",overflowY:"auto"}}>
        {ex.t==="LISTEN"&&(
          <div>
            <div style={{color:C.dk,fontWeight:900,fontSize:22,margin:"0 0 6px"}}>What do you hear?</div>
            <div style={{color:C.md,fontSize:14,margin:"0 0 28px"}}>Select the correct translation</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:32}}>
              <div style={{background:C.bg,borderRadius:28,padding:"30px 48px",textAlign:"center",border:`2px solid ${C.lt}`,boxShadow:C.sh}}>
                <div style={{fontSize:28,fontWeight:900,color:C.dk,marginBottom:20}}>{ex.de}</div>
                <div style={{display:"flex",gap:14,justifyContent:"center",alignItems:"center"}}>
                  <SpeakBtn text={ex.de} rate={0.82} bg={uc} border={ud} ic="#fff"/>
                  <SpeakBtn text={ex.de} rate={0.5} bg={C.ams} border={C.am} ic="#fff"/>
                </div>
                <div style={{color:C.md,fontSize:11,marginTop:12,fontWeight:600}}>🔊 Normal · 🐢 Slow</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {ex.o.map(opt=>{
                const isSel=sel===opt,isOkOpt=shown&&opt===ex.en,isWrong=shown&&isSel&&!ok;
                let bg="#fff",border=C.lt,tc=C.dk;
                if(isOkOpt){bg=C.grs;border=C.gr;tc=C.gr;}
                else if(isWrong){bg=C.rds;border=C.rd;tc=C.rd;}
                else if(isSel){bg=C.ps;border=uc;tc=C.p;}
                return(
                  <button key={opt} onClick={()=>answer(opt)} disabled={shown}
                    style={{background:bg,border:`2px solid ${border}`,borderRadius:16,padding:"15px 12px",color:tc,fontSize:13,fontWeight:700,cursor:shown?"default":"pointer",boxShadow:"0 3px 0 rgba(0,0,0,.07)",transition:"all .12s",textAlign:"center",outline:"none"}}
                    onMouseEnter={e=>{if(!shown&&!isSel){e.currentTarget.style.borderColor=uc;e.currentTarget.style.transform="scale(1.02)";}}}
                    onMouseLeave={e=>{if(!shown&&!isSel){e.currentTarget.style.borderColor=C.lt;e.currentTarget.style.transform="scale(1)";}}}
                  >{opt}{isOkOpt&&shown&&" ✓"}{isWrong&&" ✗"}</button>
                );
              })}
            </div>
          </div>
        )}

        {ex.t==="PICK"&&(
          <div>
            <div style={{color:C.dk,fontWeight:900,fontSize:22,margin:"0 0 6px"}}>Translate to German</div>
            <div style={{color:C.md,fontSize:14,margin:"0 0 22px"}}>Select the correct German translation</div>
            <div style={{background:C.bg,borderRadius:20,padding:"18px 22px",marginBottom:22,border:`2px solid ${C.lt}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <span style={{fontSize:19,fontWeight:800,color:C.dk}}>{ex.en}</span>
              <SpeakBtn text={ex.de} rate={0.82} bg={uc} border={ud} ic="#fff"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {ex.o.map(opt=>{
                const isSel=sel===opt,isOkOpt=shown&&opt===ex.de,isWrong=shown&&isSel&&!ok;
                let bg="#fff",border=C.lt,tc=C.dk;
                if(isOkOpt){bg=C.grs;border=C.gr;tc=C.gr;}
                else if(isWrong){bg=C.rds;border=C.rd;tc=C.rd;}
                else if(isSel){bg=C.ps;border=uc;tc=C.p;}
                return(
                  <button key={opt} onClick={()=>answer(opt)} disabled={shown}
                    style={{background:bg,border:`2px solid ${border}`,borderRadius:16,padding:"15px 20px",color:tc,fontSize:15,fontWeight:700,cursor:shown?"default":"pointer",textAlign:"left",boxShadow:"0 3px 0 rgba(0,0,0,.07)",display:"flex",justifyContent:"space-between",alignItems:"center",outline:"none",transition:"all .12s"}}
                    onMouseEnter={e=>{if(!shown&&!isSel){e.currentTarget.style.background=C.ps;e.currentTarget.style.borderColor=uc;}}}
                    onMouseLeave={e=>{if(!shown&&!isSel){e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=C.lt;}}}>
                    {opt}
                    {isOkOpt&&shown&&<span style={{color:C.gr,fontSize:20}}>✓</span>}
                    {isWrong&&<span style={{color:C.rd,fontSize:20}}>✗</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {ex.t==="PAIRS"&&(
          <div>
            <div style={{color:C.dk,fontWeight:900,fontSize:22,margin:"0 0 6px"}}>Match the pairs</div>
            <div style={{color:C.md,fontSize:14,margin:"0 0 22px"}}>Tap a German word then its English translation</div>
            {pairsDone&&(
              <div style={{background:C.grs,border:`2px solid ${C.gr}`,borderRadius:16,padding:"13px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>🎉</span>
                <span style={{color:C.gr,fontWeight:800,fontSize:16}}>All pairs matched!</span>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {ex.p.map((p,i)=>{
                  const m=matched.has(i),s=leftSel===i,wf=wrongF?.l===i;
                  let bg="#fff",border=C.lt,tc=C.dk;
                  if(m){bg=C.grs;border=C.gr;tc=C.gr;}
                  else if(wf){bg=C.rds;border=C.rd;tc=C.rd;}
                  else if(s){bg=C.ps;border=uc;tc=C.p;}
                  return(
                    <button key={i} onClick={()=>tapLeft(i)} disabled={m}
                      style={{background:bg,border:`2px solid ${border}`,borderRadius:15,padding:"15px 10px",color:tc,fontWeight:700,fontSize:14,cursor:m?"default":"pointer",textAlign:"center",boxShadow:s?`0 0 0 4px ${uc}25`:"0 3px 0 rgba(0,0,0,.07)",transition:"all .14s",outline:"none"}}
                      onMouseEnter={e=>{if(!m&&!s)e.currentTarget.style.borderColor=uc;}}
                      onMouseLeave={e=>{if(!m&&!s)e.currentTarget.style.borderColor=C.lt;}}>
                      {p.de}
                    </button>
                  );
                })}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {pairsShuf.map((ai,ri)=>{
                  const m=matched.has(ai),wf=wrongF?.r===ri;
                  let bg="#fff",border=C.lt,tc=C.dk;
                  if(m){bg=C.grs;border=C.gr;tc=C.gr;}
                  else if(wf){bg=C.rds;border=C.rd;tc=C.rd;}
                  return(
                    <button key={ri} onClick={()=>tapRight(ri)} disabled={m}
                      style={{background:bg,border:`2px solid ${border}`,borderRadius:15,padding:"15px 10px",color:tc,fontWeight:700,fontSize:14,cursor:m?"default":"pointer",textAlign:"center",boxShadow:"0 3px 0 rgba(0,0,0,.07)",transition:"all .14s",outline:"none"}}
                      onMouseEnter={e=>{if(!m)e.currentTarget.style.borderColor=uc;}}
                      onMouseLeave={e=>{if(!m)e.currentTarget.style.borderColor=C.lt;}}>
                      {ex.p[ai].en}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:680,background:canContinue?(panelOk?C.grs:C.rds):"#fff",borderTop:`3px solid ${canContinue?(panelOk?C.gr:C.rd):C.lt}`,padding:"16px 24px 28px",transition:"background .2s,border-color .2s",zIndex:20}}>
        {shown&&(
          <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:ok?C.gr:C.rd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontSize:20}}>{ok?"✓":"✗"}</span>
            </div>
            <div>
              <div style={{color:ok?C.gr:C.rd,fontWeight:900,fontSize:17}}>{ok?"Correct! Great job! 🎉":"Oops! Correct answer:"}</div>
              {!ok&&<div style={{color:C.rd,fontWeight:800,fontSize:15,marginTop:2}}>{ex.t==="LISTEN"?ex.en:ex.de}</div>}
            </div>
          </div>
        )}
        {pairsDone&&!shown&&(
          <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:C.gr,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontSize:20}}>✓</span>
            </div>
            <div style={{color:C.gr,fontWeight:900,fontSize:17}}>All pairs matched! 🎉</div>
          </div>
        )}
        <button onClick={next} disabled={!canContinue}
          style={{width:"100%",background:canContinue?(panelOk?C.gr:C.rd):"#E2E8F0",border:`3px solid ${canContinue?(panelOk?"#15803D":"#B91C1C"):"#CBD5E0"}`,borderRadius:18,padding:"15px",color:canContinue?"#fff":"#94A3B8",fontWeight:900,fontSize:18,cursor:canContinue?"pointer":"default",boxShadow:canContinue?`0 5px 0 ${panelOk?"#15803D":"#B91C1C"}`:"0 3px 0 #CBD5E0",letterSpacing:.5,outline:"none",transition:"transform .12s"}}
          onMouseEnter={e=>{if(canContinue)e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
          {ei===total-1&&canContinue?"FINISH LESSON 🏁":"CONTINUE"}
        </button>
      </div>
    </div>
  );
}