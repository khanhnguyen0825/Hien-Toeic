import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const sets = [
  {
    id: 'set-1',
    title: 'Đề 01',
    label: 'Nền tảng từ vựng & ngữ pháp',
    color: 'coral',
    questions: [
      ['Please direct all questions about _____ recent order to the customer care center.', ['yours', 'your', 'yourself', 'you'], 1],
      ['Ms. Wu was the _____ of the contest, and she may collect her prize next week.', ['partner', 'member', 'player', 'winner'], 3],
      ['For a _____ time, Marco Bank is offering first-time customers a $100 bonus when they open an account.', ['limits', 'limiting', 'limit', 'limited'], 3],
      ['A _____ greenhouse donated several potted plants to beautify the lobby of the city hall.', ['potential', 'local', 'main', 'future'], 1],
      ['Apply to Joneston Stores today so as not to miss _____ chance to join a great sales team.', ['you', 'your', 'yours', 'yourself'], 1],
      ['Employees are eligible to receive a _____ salary if they complete a special marketing course.', ['possible', 'frequent', 'closed', 'higher'], 3],
      ['The management at Carette Industries _____ values the work of the research team.', ['high', 'highly', 'highest', 'higher'], 1],
      ['Pentrexa Pharmacy is able to _____ most prescriptions within one business day.', ['care', 'earn', 'fill', 'lift'], 2],
      ['The _____ of a parking structure for Huron General Hospital will begin on June 1.', ['construct', 'constructed', 'construction', 'constructs'], 2],
      ['There is a mandatory meeting today for everyone involved in managing or recruiting _____.', ['staplers', 'volunteers', 'devices', 'headquarters'], 1],
      ["Several water stations _____ along the route of next week's marathon.", ['being installed', 'will be installed', 'to install', 'installed'], 1],
      ['Many businesses promote carpooling _____ view of the city.', ['valid', 'recent', 'modern', 'scenic'], 3],
      ['Overall, charitable donations rose last year _____ specific dollar amounts are not yet available.', ['although', 'neither', 'whenever', 'so'], 0],
      ['We strongly advise you to back up the data stored on your electronic device _____ turning it in for repairs.', ['once', 'both', 'then', 'before'], 3],
      ['Because Ms. Lee frequently works with charts and graphs, her supervisor _____ asks her to make materials for presentations.', ['frequent', 'frequents', 'frequenting', 'frequently'], 3],
      ['Employees may bring their lunch to the meeting and enjoy it _____ the presentation.', ['in case', 'during', 'into', 'although'], 1],
      ["The merchandise at Logan's Clothing requires _____ at the beginning of each season.", ['reorganize', 'reorganization', 'reorganizes', 'reorganized'], 1],
      ['Interns must complete and return the new hire _____ by their first day of work.', ['background', 'management', 'publication', 'paperwork'], 3],
      ['The director of Wingstom Foods commended Ms. Weiss for increasing _____ in the bakery division.', ['produced', 'producing', 'production', 'productive'], 2],
      ['Greg Owens, founder of multi-national Hermes Taxi Service, used to drive a taxi _____.', ['he', 'his', 'himself', 'his own'], 2],
      ['Pennypack Markets soon plans to break ground on its largest _____ center in the area.', ['distributive', 'distribute', 'distributable', 'distribution'], 3],
      ['Ms. Miller _____ welcomed the speakers who will be leading the workshops.', ['accessibly', 'abundantly', 'briefly', 'momentarily'], 2],
      ['Mr. Nayar _____ the need for enhanced safety protocols long before the government issued a report on the topic.', ['stresses', 'stressing', 'will stress', 'had stressed'], 3],
      ['A locked suggestion box will allow employees to submit feedback to management _____.', ['anonymously', 'approximately', 'expressly', 'patiently'], 0],
      ['A new strategy is under development to _____ our products more aggressively overseas.', ['invest', 'compete', 'participate', 'market'], 3],
      ['_____ on the city\'s ongoing revitalization project, Mayor Owen promised that residents would be pleased with the results.', ['Comment', 'Comments', 'Commented', 'Commenting'], 3],
      ['Profits at Talhee Beverage Co. rose about 4 percent last year, according to new figures _____ by the company.', ['to release', 'releasing', 'released', 'have released'], 2],
      ['_____ the CEO and the CFO are authorized to sign checks over $10,000.', ['Each', 'Either', 'Both', 'Whoever'], 2],
      ["Annika Dulin _____ the marketing department at Tollason Industries' planning meeting tomorrow.", ['will represent', 'had represented', 'to represent', 'be representing'], 0],
      ['Do not post any statements about the company on social media without _____.', ['authorization', 'supplement', 'consequence', 'responsibility'], 0],
    ],
  },
  {
    id: 'set-2',
    title: 'Đề 02',
    label: 'Củng cố cấu trúc câu',
    color: 'mint',
    questions: [
      ['There is coffee in the break room for anyone who _____ a cup before the meeting.', ['want', 'wants', 'wanting', 'to want'], 1],
      ['Each Ready Wear suitcase comes _____ a ten-year warranty.', ['if', 'with', 'so', 'upon'], 1],
      ['Mr. O\'Sullivan oversaw the electrical work in the new apartment building _____ the river.', ['into', 'as', 'to', 'by'], 3],
      ['For questions about your hotel reservation, please telephone _____ booking department at 555-0109.', ['we', 'us', 'our', 'ourselves'], 2],
      ["Local shop owners are invited to the _____ of Clyde Bank's downtown branch.", ['open', 'opened', 'opening', 'openly'], 2],
      ['All e-mail messages regarding legal issues should be _____ in a separate folder.', ['stored', 'escaped', 'served', 'determined'], 0],
      ['Members of the Bold Stone Farm Store receive _____ discounts on all purchases.', ['depth', 'deepen', 'deep', 'deeply'], 2],
      ['If your plans change, please contact us at least 24 hours before the time of your _____.', ['reserved', 'reservation', 'reservable', 'reserve'], 1],
      ['Hold the tomato seedling gently by the stem in order to avoid harming _____ roots.', ['its', 'at', 'that', 'in'], 0],
      ['The Rinzlite dishwasher was ranked higher _____ all other dishwashers in its class.', ['to', 'past', 'than', 'by'], 2],
      ['Maihama vehicles include an extended _____ to cover engine repairs.', ['record', 'operation', 'budget', 'warranty'], 3],
      ["The hotel's new Web site features an _____ collection of high-quality images.", ['absolute', 'efficient', 'impressive', 'undefeated'], 2],
      ['On behalf of everyone at Uniontown Bank, we _____ thank you for your continued patronage.', ['deservedly', 'commonly', 'sincerely', 'perfectly'], 2],
      ['Fragile equipment must be stored in a secure location so that nothing is _____ damaged.', ['accident', 'accidents', 'accidental', 'accidentally'], 3],
      ["Ms. Sampson will not arrive at the convention _____ after our team's presentation.", ['until', 'later', 'from', 'when'], 0],
      ['The Lanaiya 7 laptop _____ its debut at the annual Delbar Tech Summit.', ['made', 'knew', 'heard', 'drew'], 0],
      ["Enjoy one month free when you start your company on Rooster's e-mail _____ Web hosting service.", ['then', 'yet', 'but', 'and'], 3],
      ['The bridge project bids turned out to be _____ higher than expected.', ['considering', 'consider', 'consideration', 'considerably'], 3],
      ['Deckermark Enterprises offers employees flexible scheduling and telecommuting _____.', ['statements', 'exchanges', 'precautions', 'options'], 3],
      ['Which option completes the sentence? The company announced a new benefit for all staff members.', ['announce', 'announcement', 'announcing', 'announcer'], 1],
      ['All associates are _____ to follow the standard operating procedures outlined in the handbook.', ['concerned', 'tended', 'maintained', 'expected'], 3],
      ['This month Framley Publishing House is embarking on its _____ expansion so far.', ['ambitiously', 'most ambitiously', 'ambition', 'most ambitious'], 3],
      ["After months of collaboration, Matrickx Technology's software developers released a top-quality product _____.", ['profoundly', 'overly', 'finally', 'intensely'], 2],
      ['Neither of the _____ in the debate was willing to take a stand on the riverfront development controversy.', ['politicians', 'politicize', 'political', 'politically'], 0],
      ['_____ the additional funding, Central City Medical School expects to double the size of its research team.', ['Over', 'On', 'At', 'With'], 3],
      ['The clients have indicated that a reception area of 60 square meters will be _____ in the new building.', ['sufficient', 'flexible', 'capable', 'calculating'], 0],
      ['The Liu Supermarket _____ that Jennifer Chan will take over as CEO next month came as a surprise.', ['announced', 'announcement', 'announcing', 'announcer'], 1],
      ['_____ extensive renovations, Main Vault Bank will temporarily relocate to 1450 Barrister Avenue.', ['If only', 'Since', 'Due to', 'Though'], 2],
      ["PKTM's regional managers serve _____ the direction of the vice president.", ['among', 'under', 'behind', 'opposite'], 1],
      ['_____ a recent surge in demand, Vanita\'s Catering is hiring four additional servers.', ['Everywhere', 'Possibly', 'In total', 'Owing to'], 3],
    ],
  },
  {
    id: 'set-3',
    title: 'Đề 03',
    label: 'Luyện đề tổng hợp',
    color: 'blue',
    questions: [
      ['Passengers must keep _____ boarding passes and luggage with them at all times.', ['their', 'his', 'my', 'our'], 0],
      ['The company\'s policy allows business travel by _____ train and airplane.', ['both', 'either', 'further', 'hardly'], 0],
      ['The production technicians are _____ for maintaining our factory equipment.', ['responsibly', 'responsible', 'responsibility', 'responsibilities'], 1],
      ["The team found Ms. Dietrich's advice on managing office staff to be especially _____.", ['helpful', 'thankful', 'regular', 'extra'], 0],
      ['Mr. Kim would like _____ a meeting about the Jasper account as soon as possible.', ['to arrange', 'arranging', 'having arranged', 'arrangement'], 0],
      ['The factory is _____ located near the train station.', ['regularly', 'conveniently', 'brightly', 'collectively'], 1],
      ['Hikers are invited _____ the information center for trail maps of Far Valley Park.', ['visiting', 'to visit', 'visits', 'having visited'], 1],
      ['Danton Estate Brokerage offers an online educational program to help _____ home buyers choose a property.', ['unmistakable', 'incomplete', 'unused', 'inexperienced'], 3],
      ['Iolana Dance Troupe stands out because the group knows _____ to integrate a variety of dance styles.', ['how', 'that', 'since', 'about'], 0],
      ['The Copley Corporation is frequently _____ as a company that employs workers from all over the world.', ['recognized', 'permitted', 'prepared', 'controlled'], 0],
      ['Major airlines have _____ been using self-serve ticketing systems to reduce wait times.', ['increases', 'increasing', 'increased', 'increasingly'], 3],
      ['A book of songs written by Pakistani singer Ayesha Saad was sold at auction yesterday _____ an undisclosed amount.', ['from', 'to', 'off', 'for'], 3],
      ['There is _____ more important to maintaining dental health than brushing your teeth twice a day.', ['other', 'neither', 'nothing', 'whatever'], 2],
      ["Taste tests suggest that most people _____ Dairy Smooth's red-bean-flavored ice cream very appetizing.", ['find', 'feel', 'take', 'like'], 0],
      ['Regardless of _____ a candidate is offered a job, all applications are kept on file for six months.', ['even', 'whether', 'although', 'including'], 1],
      ['Customers are _____ anticipating the latest model pickup truck from Askio Automobiles.', ['eagerly', 'sharply', 'voluntarily', 'rapidly'], 0],
      ["Once you have Mr. Garcia's _____, please post the job listing to the usual Web sites.", ['approve', 'approves', 'approval', 'approving'], 2],
      ["Dabby's Restaurant broadened its customer base by making _____ changes to its menu.", ['extensive', 'precious', 'commercial', 'accurate'], 0],
      ["When _____ applied, Tilda's Restorative Cream reduces the appearance of fine lines and wrinkles.", ['consistent', 'consist', 'consistently', 'consisting'], 2],
      ['The marketing director confirmed that the new software program would be ready to _____ by November 1.', ['launch', 'facilitate', 'arise', 'exert'], 0],
      ['The digital advertising campaign has generated _____ interest in the clothing line.', ['substance', 'substances', 'substantial', 'substantially'], 2],
      ['The seminar leader stated that addressing customer concerns _____ was one crucial element for financial success.', ['consistently', 'largely', 'hugely', 'identically'], 0],
      ['Although the desk was slightly damaged during assembly, it is still _____.', ['function', 'functional', 'functionally', 'functioned'], 1],
      ['An upgrade in software would _____ increase the productivity of our administrative staff.', ['significantly', 'persuasively', 'proficiently', 'gladly'], 0],
      ["The Rustic Diner's chef does allow patrons to make menu _____.", ['substituted', 'substituting', 'substitutions', 'substitute'], 2],
      ['Ms. Rodriguez noted that it is important to _____ explicit policies regarding the use of company computers.', ['inform', 'succeed', 'estimate', 'establish'], 3],
      ['Regular applications of fertilizer improve seedling health and _____ enhance the growth of leafy vegetables.', ['drama', 'dramatic', 'dramatically', 'dramatize'], 2],
      ["Wantner Manufacturing received this year's Top Employer Award in _____ of its people-centered workplace environment.", ['service', 'accordance', 'recognition', 'dedication'], 2],
      ['The Oakwood Restaurant _____ a special dinner menu on Saturdays for the past decade.', ['is offering', 'has been offering', 'will be offering', 'would have been offering'], 1],
      ['Mr. de Tonnancour has a speaking _____ on Tuesday, November 15.', ['engagement', 'term', 'subject', 'employment'], 0],
    ],
  },
]

const STORAGE_KEY = 'part5-studio-progress-v1'
const quickQuestions = sets.flatMap((set) => set.questions.map((question, index) => ({ question, set, index })))

function getRandomQuestion(previous) {
  if (quickQuestions.length < 2) return quickQuestions[0]
  let next = quickQuestions[Math.floor(Math.random() * quickQuestions.length)]
  while (next === previous) next = quickQuestions[Math.floor(Math.random() * quickQuestions.length)]
  return next
}

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function App() {
  const [selectedSetId, setSelectedSetId] = useState('set-1')
  const [mode, setMode] = useState('full')
  const [answers, setAnswers] = useState(() => getSavedState().answers || {})
  const [submitted, setSubmitted] = useState(() => getSavedState().submitted || {})
  const [current, setCurrent] = useState(0)
  const [quickQuestion, setQuickQuestion] = useState(() => getRandomQuestion())
  const [quickAnswer, setQuickAnswer] = useState(null)
  const [quickChecked, setQuickChecked] = useState(false)
  const [quickAttempts, setQuickAttempts] = useState(0)

  const selectedSet = sets.find((set) => set.id === selectedSetId) || sets[0]
  const selectedAnswers = answers[selectedSetId] || {}
  const isSubmitted = Boolean(submitted[selectedSetId])
  const answeredCount = Object.keys(selectedAnswers).length
  const score = selectedSet.questions.reduce((total, question, index) => total + (selectedAnswers[index] === question[2] ? 1 : 0), 0)
  const percent = Math.round((score / selectedSet.questions.length) * 100)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, submitted }))
  }, [answers, submitted])

  const question = selectedSet.questions[current]
  const currentAnswer = selectedAnswers[current]
  const progress = Math.round(((current + 1) / selectedSet.questions.length) * 100)

  const stats = useMemo(() => sets.map((set) => {
    const setAnswers = answers[set.id] || {}
    const done = submitted[set.id]
    const correct = set.questions.reduce((total, item, index) => total + (setAnswers[index] === item[2] ? 1 : 0), 0)
    return { ...set, answered: Object.keys(setAnswers).length, done, correct }
  }), [answers, submitted])

  function chooseSet(id) {
    setSelectedSetId(id)
    setCurrent(0)
  }

  function chooseMode(nextMode) {
    setMode(nextMode)
    if (nextMode === 'quick') {
      setQuickQuestion(getRandomQuestion())
      setQuickAnswer(null)
      setQuickChecked(false)
    }
  }

  function chooseAnswer(optionIndex) {
    if (isSubmitted) return
    setAnswers((previous) => ({
      ...previous,
      [selectedSetId]: { ...(previous[selectedSetId] || {}), [current]: optionIndex },
    }))
  }

  function submitSet() {
    setSubmitted((previous) => ({ ...previous, [selectedSetId]: true }))
    setCurrent(0)
  }

  function resetSet() {
    setAnswers((previous) => ({ ...previous, [selectedSetId]: {} }))
    setSubmitted((previous) => ({ ...previous, [selectedSetId]: false }))
    setCurrent(0)
  }

  function checkQuickAnswer() {
    if (quickAnswer === null) return
    setQuickChecked(true)
    setQuickAttempts((value) => value + 1)
  }

  function nextQuickQuestion() {
    setQuickQuestion((previous) => getRandomQuestion(previous))
    setQuickAnswer(null)
    setQuickChecked(false)
  }

  const resultTone = percent >= 80 ? 'good' : percent >= 60 ? 'okay' : 'low'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Part 5 Studio home">
          <span className="brand-mark">P5</span>
          <span><strong>Part 5</strong><small>TOEIC STUDIO</small></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Tiến độ được lưu tự động</div>
      </header>

      <main id="top" className="content-wrap">
        <section className="hero">
          <div>
            <p className="eyebrow">READING · PART 5</p>
            <h1>Luyện tập nhỏ,<br /><em>tiến bộ lớn.</em></h1>
            <p className="hero-copy">Chinh phục những câu hỏi hoàn thành câu TOEIC theo nhịp học của riêng bạn.</p>
          </div>
          <div className="hero-stamp"><span>30</span><small>CÂU / ĐỀ</small></div>
        </section>

        <section className="mode-picker" aria-label="Chọn chế độ học">
          <div className="section-heading"><div><p className="eyebrow">BƯỚC 01 · CÁCH HỌC</p><h2>Chọn chế độ trước khi bắt đầu</h2></div><span className="count-label">2 chế độ</span></div>
          <div className="mode-switch" role="tablist" aria-label="Chọn chế độ học">
            <button className={mode === 'full' ? 'active' : ''} onClick={() => chooseMode('full')} role="tab" aria-selected={mode === 'full'}><span>01</span><strong>Làm trọn đề</strong><small>Hoàn thành 30 câu và xem điểm</small></button>
            <button className={mode === 'quick' ? 'active' : ''} onClick={() => chooseMode('quick')} role="tab" aria-selected={mode === 'quick'}><span>02</span><strong>Luyện nhanh</strong><small>Random toàn bộ 3 đề · check ngay</small></button>
          </div>
        </section>

        {mode === 'full' ? (
          <section className="set-picker" aria-label="Chọn đề luyện tập">
            <div className="section-heading"><div><p className="eyebrow">BƯỚC 02 · KHO BÀI TẬP</p><h2>Chọn một đề để bắt đầu</h2></div><span className="count-label">{sets.length} đề có sẵn</span></div>
            <div className="set-grid">
              {stats.map((set, index) => (
                <button className={`set-card ${set.id === selectedSetId ? 'selected' : ''} ${set.color}`} key={set.id} onClick={() => chooseSet(set.id)}>
                  <span className="set-number">0{index + 1}</span>
                  <span className="set-card-main"><strong>{set.title}</strong><small>{set.label}</small></span>
                  <span className="set-card-meta">{set.done ? `${set.correct}/${set.questions.length}` : `${set.questions.length} câu`}<b>→</b></span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="quick-scope" aria-label="Phạm vi luyện nhanh"><span className="quick-scope-mark">◎</span><div><p className="eyebrow">BƯỚC 02 · PHẠM VI LUYỆN</p><h2>Toàn bộ {sets.length} đề · {quickQuestions.length} câu hỏi</h2><p>Mỗi lượt sẽ lấy một câu bất kỳ từ tất cả các đề để bạn luyện thật nhanh.</p></div><span className="quick-scope-arrow">↓</span></section>
        )}

        <section className="workspace" aria-label="Khu vực làm bài">
          <div className="workspace-head">
            <div><p className="eyebrow">CHẾ ĐỘ HỌC</p><h2>{mode === 'full' ? (isSubmitted ? 'Kết quả của bạn' : 'Làm trọn một đề') : 'Luyện nhanh từng câu'}</h2></div>
            <div className="workspace-actions">{mode === 'full' && isSubmitted && <button className="text-button" onClick={resetSet}>Làm lại đề</button>}{mode === 'full' ? <span className="question-counter">{String(current + 1).padStart(2, '0')} <i>/</i> {String(selectedSet.questions.length).padStart(2, '0')}</span> : <span className="question-counter">{quickAttempts} câu đã check</span>}</div>
          </div>

          {mode === 'quick' ? (
            <div className="quick-mode">
              <div className="quick-meta"><span>CÂU NGẪU NHIÊN · TOÀN BỘ 3 ĐỀ</span><span>{quickQuestion.set.title} · Câu {quickQuestion.index + 101}</span></div>
              <div className="question-card quick-card">
                <div className="question-label"><span>LUYỆN NHANH</span><span className="question-type">Từ vựng & ngữ pháp</span></div>
                <p className="question-text">{quickQuestion.question[0]}</p>
                <div className="options">
                  {quickQuestion.question[1].map((option, index) => (
                    <button className={`option ${quickAnswer === index ? 'active' : ''} ${quickChecked && index === quickQuestion.question[2] ? 'correct-option' : ''} ${quickChecked && quickAnswer === index && index !== quickQuestion.question[2] ? 'wrong-option' : ''}`} key={option} onClick={() => !quickChecked && setQuickAnswer(index)} disabled={quickChecked}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{quickAnswer === index && !quickChecked && <span className="check">✓</span>}</button>
                  ))}
                </div>
                {quickChecked && <div className={`quick-result ${quickAnswer === quickQuestion.question[2] ? 'is-correct' : 'is-wrong'}`}><span className="quick-result-icon">{quickAnswer === quickQuestion.question[2] ? '✓' : '!'}</span><div><strong>{quickAnswer === quickQuestion.question[2] ? 'Chính xác' : 'Chưa đúng'}</strong><small>Đáp án đúng: <b>{String.fromCharCode(65 + quickQuestion.question[2])}. {quickQuestion.question[1][quickQuestion.question[2]]}</b></small></div></div>}
                <div className="quick-actions"><button className="nav-button secondary" onClick={nextQuickQuestion}>{quickChecked ? 'Bỏ qua câu này' : 'Đổi câu khác'}</button>{!quickChecked ? <button className="submit-button" disabled={quickAnswer === null} onClick={checkQuickAnswer}>Check đáp án <span>↗</span></button> : <button className="submit-button" onClick={nextQuickQuestion}>Câu tiếp theo <span>→</span></button>}</div>
              </div>
            </div>
          ) : isSubmitted ? (
            <div className={`result-panel ${resultTone}`}>
              <div className="result-score"><span>{score}</span><small>/ {selectedSet.questions.length} câu đúng</small></div>
              <div className="result-message"><p className="eyebrow">HOÀN THÀNH ĐỀ</p><h3>{percent >= 80 ? 'Rất tốt, giữ vững phong độ.' : percent >= 60 ? 'Khá tốt, hãy luyện thêm một chút.' : 'Đừng vội nản, mình làm lại nhé.'}</h3><p>Đáp án đã được chấm. Bạn có thể xem lại từng câu bên dưới.</p></div>
              <div className="result-percent">{percent}%</div>
            </div>
          ) : (
            <>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="quiz-layout">
                <div className="question-card">
                  <div className="question-label"><span>CÂU {String(current + 1).padStart(2, '0')}</span><span className="question-type">Từ vựng & ngữ pháp</span></div>
                  <p className="question-text">{question[0]}</p>
                  <div className="options">
                    {question[1].map((option, index) => (
                      <button className={`option ${currentAnswer === index ? 'active' : ''}`} key={option} onClick={() => chooseAnswer(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{currentAnswer === index && <span className="check">✓</span>}</button>
                    ))}
                  </div>
                  <div className="quiz-nav"><button className="nav-button secondary" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>← Trước</button><button className="nav-button primary" onClick={() => setCurrent((value) => Math.min(value + 1, selectedSet.questions.length - 1))}>{current === selectedSet.questions.length - 1 ? 'Xem lại' : 'Tiếp theo'} <span>→</span></button></div>
                </div>
                <aside className="question-map"><div className="map-heading"><strong>Danh sách câu</strong><span>{answeredCount}/{selectedSet.questions.length}</span></div><div className="map-grid">{selectedSet.questions.map((_, index) => <button className={`${index === current ? 'current' : ''} ${selectedAnswers[index] !== undefined ? 'answered' : ''}`} key={index} onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><div className="map-legend"><span><i className="legend-dot answered-dot" /> Đã chọn</span><span><i className="legend-dot" /> Chưa chọn</span></div></aside>
              </div>
              <div className="submit-row"><p>Đã chọn <strong>{answeredCount}</strong>/{selectedSet.questions.length} câu</p><button className="submit-button" disabled={answeredCount === 0} onClick={submitSet}>Nộp bài <span>↗</span></button></div>
            </>
          )}

          {isSubmitted && <div className="review-list"><div className="review-heading"><p className="eyebrow">TỔNG QUAN</p><h3>Kiểm tra lại câu trả lời</h3></div>{selectedSet.questions.map((item, index) => { const correct = selectedAnswers[index] === item[2]; return <button className={`review-item ${correct ? 'correct' : 'incorrect'}`} key={index} onClick={() => { setSubmitted((previous) => ({ ...previous, [selectedSetId]: false })); setCurrent(index) }}><span className="review-no">{String(index + 1).padStart(2, '0')}</span><span className="review-copy"><strong>{item[0]}</strong><small>Bạn chọn: {selectedAnswers[index] !== undefined ? item[1][selectedAnswers[index]] : 'Chưa chọn'} · Đáp án: {item[1][item[2]]}</small></span><span className="review-status">{correct ? 'Đúng' : 'Sai'}</span></button> })}</div>}
        </section>

        <footer><span>PART 5 STUDIO</span><span>Học đều mỗi ngày · Tự tin hơn mỗi bài</span></footer>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
