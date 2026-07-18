import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { readingParts } from './data/readingParts'
import './styles.css'

const STORAGE_KEY = 'part5-studio-progress-v1'

function getQuestionPool(part) {
  return part.sets.flatMap((set) => set.questions.map((question, index) => ({ question, set, index, part })))
}

function getRandomQuestion(pool, previous) {
  if (pool.length < 2) return pool[0]
  let next = pool[Math.floor(Math.random() * pool.length)]
  while (next === previous) next = pool[Math.floor(Math.random() * pool.length)]
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
  const [selectedPartId, setSelectedPartId] = useState('part-5')
  const [selectedSetId, setSelectedSetId] = useState('set-1')
  const [mode, setMode] = useState('full')
  const [answers, setAnswers] = useState(() => getSavedState().answers || {})
  const [submitted, setSubmitted] = useState(() => getSavedState().submitted || {})
  const [current, setCurrent] = useState(0)
  const [quickQuestion, setQuickQuestion] = useState(() => getRandomQuestion(getQuestionPool(readingParts[0])))
  const [quickAnswer, setQuickAnswer] = useState(null)
  const [quickChecked, setQuickChecked] = useState(false)
  const [quickAttempts, setQuickAttempts] = useState(0)

  const activePart = readingParts.find((part) => part.id === selectedPartId) || readingParts[0]
  const sets = activePart.sets
  const quickPool = getQuestionPool(activePart)
  const selectedSet = sets.find((set) => set.id === selectedSetId) || sets[0]
  const selectedAnswers = answers[selectedSetId] || {}
  const isSubmitted = Boolean(submitted[selectedSetId])
  const answeredCount = Object.keys(selectedAnswers).length
  const score = selectedSet.questions.reduce((total, question, index) => total + (selectedAnswers[index] === question.answer ? 1 : 0), 0)
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
    const correct = set.questions.reduce((total, item, index) => total + (setAnswers[index] === item.answer ? 1 : 0), 0)
    return { ...set, answered: Object.keys(setAnswers).length, done, correct }
  }), [answers, submitted])

  function chooseSet(id) {
    setSelectedSetId(id)
    setCurrent(0)
  }

  function choosePart(part) {
    if (!part.available) return
    setSelectedPartId(part.id)
    setSelectedSetId(part.sets[0]?.id || '')
    setCurrent(0)
    setQuickQuestion(getRandomQuestion(getQuestionPool(part)))
    setQuickAnswer(null)
    setQuickChecked(false)
  }

  function chooseMode(nextMode) {
    setMode(nextMode)
    if (nextMode === 'quick') {
      setQuickQuestion(getRandomQuestion(quickPool))
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
    setQuickQuestion((previous) => getRandomQuestion(quickPool, previous))
    setQuickAnswer(null)
    setQuickChecked(false)
  }

  const resultTone = percent >= 80 ? 'good' : percent >= 60 ? 'okay' : 'low'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Part 5 Studio home">
          <span className="brand-mark">TR</span>
          <span><strong>TOEIC Reading</strong><small>PRACTICE STUDIO</small></span>
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

        <section className="part-picker" aria-label="Chọn phần Reading">
          <div className="section-heading"><div><p className="eyebrow">READING PRACTICE</p><h2>Chọn phần muốn học</h2></div><span className="count-label">{readingParts.length} phần</span></div>
          <div className="part-grid">
            {readingParts.map((part) => (
              <button className={`part-card ${selectedPartId === part.id ? 'active' : ''} ${part.available ? '' : 'coming-soon'}`} key={part.id} onClick={() => choosePart(part)} disabled={!part.available}>
                <span className="part-card-label">{part.label}</span><span className="part-card-copy"><strong>{part.title}</strong><small>{part.description}</small></span><span className="part-card-status">{part.available ? 'Đang học' : 'Sắp có'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mode-picker" aria-label="Chọn chế độ học">
          <div className="section-heading"><div><p className="eyebrow">BƯỚC 01 · CÁCH HỌC</p><h2>Chọn chế độ trước khi bắt đầu</h2></div><span className="count-label">2 chế độ</span></div>
          <div className="mode-switch" role="tablist" aria-label="Chọn chế độ học">
            <button className={mode === 'full' ? 'active' : ''} onClick={() => chooseMode('full')} role="tab" aria-selected={mode === 'full'}><span>01</span><strong>Làm trọn đề</strong><small>Hoàn thành 30 câu và xem điểm</small></button>
            <button className={mode === 'quick' ? 'active' : ''} onClick={() => chooseMode('quick')} role="tab" aria-selected={mode === 'quick'}><span>02</span><strong>Luyện nhanh</strong><small>Random toàn bộ đề của Part · check ngay</small></button>
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
          <section className="quick-scope" aria-label="Phạm vi luyện nhanh"><span className="quick-scope-mark">◎</span><div><p className="eyebrow">BƯỚC 02 · PHẠM VI LUYỆN</p><h2>{activePart.label} · {sets.length} đề · {quickPool.length} câu hỏi</h2><p>Mỗi lượt sẽ lấy một câu bất kỳ từ tất cả các đề của {activePart.label}.</p></div><span className="quick-scope-arrow">↓</span></section>
        )}

        <section className="workspace" aria-label="Khu vực làm bài">
          <div className="workspace-head">
            <div><p className="eyebrow">CHẾ ĐỘ HỌC</p><h2>{mode === 'full' ? (isSubmitted ? 'Kết quả của bạn' : 'Làm trọn một đề') : 'Luyện nhanh từng câu'}</h2></div>
            <div className="workspace-actions">{mode === 'full' && isSubmitted && <button className="text-button" onClick={resetSet}>Làm lại đề</button>}{mode === 'full' ? <span className="question-counter">{String(current + 1).padStart(2, '0')} <i>/</i> {String(selectedSet.questions.length).padStart(2, '0')}</span> : <span className="question-counter">{quickAttempts} câu đã check</span>}</div>
          </div>

          {mode === 'quick' ? (
            <div className="quick-mode">
              <div className="quick-meta"><span>CÂU NGẪU NHIÊN · TOÀN BỘ {activePart.label.toUpperCase()}</span><span>{quickQuestion.set.title} · Câu {quickQuestion.index + 101}</span></div>
              <div className="question-card quick-card">
                <div className="question-label"><span>LUYỆN NHANH</span><span className="question-type">Từ vựng & ngữ pháp</span></div>
                <p className="question-text">{quickQuestion.question.prompt}</p>
                <div className="options">
                  {quickQuestion.question.options.map((option, index) => (
                    <button className={`option ${quickAnswer === index ? 'active' : ''} ${quickChecked && index === quickQuestion.question.answer ? 'correct-option' : ''} ${quickChecked && quickAnswer === index && index !== quickQuestion.question.answer ? 'wrong-option' : ''}`} key={option} onClick={() => !quickChecked && setQuickAnswer(index)} disabled={quickChecked}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{quickAnswer === index && !quickChecked && <span className="check">✓</span>}</button>
                  ))}
                </div>
                {quickChecked && <div className={`quick-result ${quickAnswer === quickQuestion.question.answer ? 'is-correct' : 'is-wrong'}`}><span className="quick-result-icon">{quickAnswer === quickQuestion.question.answer ? '✓' : '!'}</span><div><strong>{quickAnswer === quickQuestion.question.answer ? 'Chính xác' : 'Chưa đúng'}</strong><small>Đáp án đúng: <b>{String.fromCharCode(65 + quickQuestion.question.answer)}. {quickQuestion.question.options[quickQuestion.question.answer]}</b></small></div></div>}
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
                  <p className="question-text">{question.prompt}</p>
                  <div className="options">
                    {question.options.map((option, index) => (
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

          {isSubmitted && <div className="review-list"><div className="review-heading"><p className="eyebrow">TỔNG QUAN</p><h3>Kiểm tra lại câu trả lời</h3></div>{selectedSet.questions.map((item, index) => { const correct = selectedAnswers[index] === item.answer; return <button className={`review-item ${correct ? 'correct' : 'incorrect'}`} key={index} onClick={() => { setSubmitted((previous) => ({ ...previous, [selectedSetId]: false })); setCurrent(index) }}><span className="review-no">{String(index + 1).padStart(2, '0')}</span><span className="review-copy"><strong>{item.prompt}</strong><small>Bạn chọn: {selectedAnswers[index] !== undefined ? item.options[selectedAnswers[index]] : 'Chưa chọn'} · Đáp án: {item.options[item.answer]}</small></span><span className="review-status">{correct ? 'Đúng' : 'Sai'}</span></button> })}</div>}
        </section>

        <footer><span>TOEIC READING</span><span>OWNER: Khánh Nguyễn</span><span>Học đều mỗi ngày · Tự tin hơn mỗi bài</span></footer>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
