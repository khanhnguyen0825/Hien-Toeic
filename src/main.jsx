import { Fragment, StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { readingParts } from './data/readingParts'
import './styles.css'

const STORAGE_KEY = 'part5-studio-progress-v1'

function getSetKey(partId, setId) {
  return partId === 'part-5' ? setId : `${partId}:${setId}`
}

function getQuestionPool(part) {
  return part.sets.flatMap((set) => set.questions.map((question, index) => ({ question, set, index, part })))
}

function getRandomQuestion(pool, previous) {
  if (pool.length < 2) return pool[0]
  let next = pool[Math.floor(Math.random() * pool.length)]
  while (next === previous) next = pool[Math.floor(Math.random() * pool.length)]
  return next
}

function groupPassages(questions) {
  const groups = []
  questions.forEach((question, index) => {
    const existing = groups.find((group) => group.id === question.passageId)
    if (existing) existing.questions.push({ question, index })
    else groups.push({ id: question.passageId, title: question.passageTitle, text: question.passage, questions: [{ question, index }] })
  })
  return groups
}

function getPassagePool(part) {
  return part.sets.flatMap((set) => groupPassages(set.questions).map((passage) => ({ ...passage, set, part })))
}

function getRandomPassage(pool, previous) {
  if (pool.length < 2) return pool[0]
  let next = pool[Math.floor(Math.random() * pool.length)]
  while (next === previous) next = pool[Math.floor(Math.random() * pool.length)]
  return next
}

function PassageText({ text, startNumber = 1, questions = [] }) {
  const segments = text.split(/_{4,5}/)
  return <p className="passage-text">{segments.map((segment, index) => { const question = questions[index]; const number = startNumber + index; return <Fragment key={`${segment}-${index}`}>{segment}{index < segments.length - 1 && <span className={`passage-blank ${question?.kind === 'sentence' ? 'sentence-blank' : 'word-blank'}`}>{question?.kind === 'sentence' ? `CHÈN CÂU (${number})` : `____ (${number})`}</span>}</Fragment> })}</p>
}

function Part6QuickContent({ passage, answers, checked, onAnswer }) {
  return <>
    <div className="part6-instruction"><strong>Cách làm:</strong> Chọn đáp án cho cả 4 vị trí trong đoạn văn rồi bấm Check đáp án.<span><i className="word-key" /> Điền từ/cụm từ <i className="sentence-key" /> Chèn cả câu</span></div>
    <div className="passage-block"><span className="passage-kicker">{passage.title} · {passage.set.title}</span><PassageText text={passage.text} startNumber={passage.questions[0].index + 1} questions={passage.questions.map((item) => item.question)} /></div>
    <div className="part6-question-list quick-part6-list">{passage.questions.map(({ question, index }) => { const answer = answers[question.id]; const correct = answer === question.answer; return <div className={`part6-question ${question.kind === 'sentence' ? 'is-sentence' : ''}`} key={question.id}><div className="part6-question-meta"><span className="part6-question-number">({index + 1})</span><span className="part6-kind">{question.kind === 'sentence' ? 'Chèn cả câu' : 'Điền từ/cụm từ'}</span></div><div className={`options ${question.kind === 'sentence' ? 'sentence-options' : ''}`}>{question.options.map((option, optionIndex) => <button className={`option ${answer === optionIndex ? 'active' : ''} ${checked && optionIndex === question.answer ? 'correct-option' : ''} ${checked && answer === optionIndex && !correct ? 'wrong-option' : ''}`} key={option} onClick={() => !checked && onAnswer(question.id, optionIndex)} disabled={checked}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{answer === optionIndex && !checked && <span className="check">✓</span>}</button>)}</div>{checked && <div className={`quick-result ${correct ? 'is-correct' : 'is-wrong'}`}><span className="quick-result-icon">{correct ? '✓' : '!'}</span><div><strong>{correct ? 'Chính xác' : 'Chưa đúng'}</strong><small>Đáp án đúng: <b>{String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}</b></small></div></div>}</div> })}</div>
  </>
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
  const [quickPassage, setQuickPassage] = useState(() => getRandomPassage(getPassagePool(readingParts.find((part) => part.id === 'part-6'))))
  const [quickAnswer, setQuickAnswer] = useState(null)
  const [quickAnswers, setQuickAnswers] = useState({})
  const [quickChecked, setQuickChecked] = useState(false)
  const [quickAttempts, setQuickAttempts] = useState(0)

  const activePart = readingParts.find((part) => part.id === selectedPartId) || readingParts[0]
  const sets = activePart.sets
  const quickPool = getQuestionPool(activePart)
  const quickPassagePool = activePart.id === 'part-6' ? getPassagePool(activePart) : []
  const selectedSet = sets.find((set) => set.id === selectedSetId) || sets[0]
  const questionCount = activePart.sets[0]?.questions.length || 30
  const progress = Math.round(((current + 1) / selectedSet.questions.length) * 100)
  const passageGroups = activePart.id === 'part-6' ? groupPassages(selectedSet.questions) : []
  const currentPassageIndex = activePart.id === 'part-6' ? Math.max(0, passageGroups.findIndex((group) => group.questions.some((item) => item.index === current))) : 0
  const currentPassage = passageGroups[currentPassageIndex]
  const sectionProgress = activePart.id === 'part-6' ? Math.round(((currentPassageIndex + 1) / passageGroups.length) * 100) : progress
  const quickReady = activePart.id === 'part-6' ? Boolean(quickPassage && quickPassage.questions.every((item) => quickAnswers[item.question.id] !== undefined)) : quickAnswer !== null
  const setKey = getSetKey(selectedPartId, selectedSetId)
  const selectedAnswers = answers[setKey] || {}
  const isSubmitted = Boolean(submitted[setKey])
  const answeredCount = Object.keys(selectedAnswers).length
  const score = selectedSet.questions.reduce((total, question, index) => total + (selectedAnswers[index] === question.answer ? 1 : 0), 0)
  const percent = Math.round((score / selectedSet.questions.length) * 100)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, submitted }))
  }, [answers, submitted])

  const question = selectedSet.questions[current]
  const currentAnswer = selectedAnswers[current]

  const stats = useMemo(() => sets.map((set) => {
    const key = getSetKey(selectedPartId, set.id)
    const setAnswers = answers[key] || {}
    const done = submitted[key]
    const correct = set.questions.reduce((total, item, index) => total + (setAnswers[index] === item.answer ? 1 : 0), 0)
    return { ...set, answered: Object.keys(setAnswers).length, done, correct }
  }), [answers, selectedPartId, submitted, sets])

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
    setQuickPassage(part.id === 'part-6' ? getRandomPassage(getPassagePool(part)) : null)
    setQuickAnswer(null)
    setQuickAnswers({})
    setQuickChecked(false)
  }

  function chooseMode(nextMode) {
    setMode(nextMode)
    if (nextMode === 'quick') {
      setQuickQuestion(getRandomQuestion(quickPool))
      setQuickPassage(activePart.id === 'part-6' ? getRandomPassage(quickPassagePool) : null)
      setQuickAnswer(null)
      setQuickAnswers({})
      setQuickChecked(false)
    }
  }

  function chooseAnswer(optionIndex) {
    if (isSubmitted) return
    setAnswers((previous) => ({
      ...previous,
      [setKey]: { ...(previous[setKey] || {}), [current]: optionIndex },
    }))
  }

  function chooseAnswerAt(questionIndex, optionIndex) {
    if (isSubmitted) return
    setAnswers((previous) => ({
      ...previous,
      [setKey]: { ...(previous[setKey] || {}), [questionIndex]: optionIndex },
    }))
  }

  function submitSet() {
    setSubmitted((previous) => ({ ...previous, [setKey]: true }))
    setCurrent(0)
  }

  function resetSet() {
    setAnswers((previous) => ({ ...previous, [setKey]: {} }))
    setSubmitted((previous) => ({ ...previous, [setKey]: false }))
    setCurrent(0)
  }

  function chooseQuickAnswer(questionId, optionIndex) {
    if (quickChecked) return
    setQuickAnswers((previous) => ({ ...previous, [questionId]: optionIndex }))
  }

  function checkQuickAnswer() {
    if (!quickReady) return
    setQuickChecked(true)
    setQuickAttempts((value) => value + 1)
  }

  function nextQuickQuestion() {
    if (activePart.id === 'part-6') {
      setQuickPassage((previous) => getRandomPassage(quickPassagePool, previous))
      setQuickAnswers({})
      setQuickChecked(false)
      return
    }
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
            <p className="eyebrow">READING · {activePart.label.toUpperCase()}</p>
            <h1>Luyện tập nhỏ,<br /><em>tiến bộ lớn.</em></h1>
            <p className="hero-copy">Chinh phục những câu hỏi hoàn thành câu TOEIC theo nhịp học của riêng bạn.</p>
          </div>
          <div className="hero-stamp"><span>{questionCount}</span><small>CÂU / ĐỀ</small></div>
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
            <button className={mode === 'full' ? 'active' : ''} onClick={() => chooseMode('full')} role="tab" aria-selected={mode === 'full'}><span>01</span><strong>Làm trọn đề</strong><small>Hoàn thành {questionCount} câu và xem điểm</small></button>
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
            <div className="workspace-actions">{mode === 'full' && isSubmitted && <button className="text-button" onClick={resetSet}>Làm lại đề</button>}{mode === 'full' ? <span className="question-counter">{activePart.id === 'part-6' ? `${String(currentPassageIndex + 1).padStart(2, '0')} / ${String(passageGroups.length).padStart(2, '0')} đoạn` : `${String(current + 1).padStart(2, '0')} / ${String(selectedSet.questions.length).padStart(2, '0')}`}</span> : <span className="question-counter">{quickAttempts} câu đã check</span>}</div>
          </div>

          {mode === 'quick' ? (
            <div className="quick-mode">
              <div className="quick-meta"><span>CÂU NGẪU NHIÊN · TOÀN BỘ {activePart.label.toUpperCase()}</span><span>{activePart.id === 'part-6' ? `${quickPassage?.set.title} · 4 câu` : `${quickQuestion.set.title} · Câu ${quickQuestion.question.number || quickQuestion.index + 101}`}</span></div>
              <div className="question-card quick-card">
                {activePart.id === 'part-6' && quickPassage ? <Part6QuickContent passage={quickPassage} answers={quickAnswers} checked={quickChecked} onAnswer={chooseQuickAnswer} /> : <>
                  <div className="question-label"><span>LUYỆN NHANH</span><span className="question-type">Từ vựng & ngữ pháp</span></div>
                  <p className="question-text">{quickQuestion.question.prompt}</p>
                  <div className="options">{quickQuestion.question.options.map((option, index) => <button className={`option ${quickAnswer === index ? 'active' : ''} ${quickChecked && index === quickQuestion.question.answer ? 'correct-option' : ''} ${quickChecked && quickAnswer === index && index !== quickQuestion.question.answer ? 'wrong-option' : ''}`} key={option} onClick={() => !quickChecked && setQuickAnswer(index)} disabled={quickChecked}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{quickAnswer === index && !quickChecked && <span className="check">✓</span>}</button>)}</div>
                  {quickChecked && <div className={`quick-result ${quickAnswer === quickQuestion.question.answer ? 'is-correct' : 'is-wrong'}`}><span className="quick-result-icon">{quickAnswer === quickQuestion.question.answer ? '✓' : '!'}</span><div><strong>{quickAnswer === quickQuestion.question.answer ? 'Chính xác' : 'Chưa đúng'}</strong><small>Đáp án đúng: <b>{String.fromCharCode(65 + quickQuestion.question.answer)}. {quickQuestion.question.options[quickQuestion.question.answer]}</b></small></div></div>}
                </>}
                <div className="quick-actions"><button className="nav-button secondary" onClick={nextQuickQuestion}>{quickChecked ? 'Bỏ qua câu này' : 'Đổi câu khác'}</button>{!quickChecked ? <button className="submit-button" disabled={!quickReady} onClick={checkQuickAnswer}>Check đáp án <span>↗</span></button> : <button className="submit-button" onClick={nextQuickQuestion}>Câu tiếp theo <span>→</span></button>}</div>
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
              <div className="progress-track"><span style={{ width: `${sectionProgress}%` }} /></div>
              <div className="quiz-layout">
                <div className="question-card">
                  <div className="question-label"><span>{activePart.id === 'part-6' ? `ĐOẠN ${String(currentPassageIndex + 1).padStart(2, '0')}` : `CÂU ${String(current + 1).padStart(2, '0')}`}</span><span className="question-type">{question.type === 'text-completion' ? 'Hoàn thành đoạn văn' : 'Từ vựng & ngữ pháp'}</span></div>
                  {activePart.id === 'part-6' ? <>
                    <div className="part6-instruction"><strong>Cách làm:</strong> Chọn đáp án bên dưới để điền vào vị trí có cùng số trong đoạn văn.<span><i className="word-key" /> Điền từ/cụm từ <i className="sentence-key" /> Chèn cả câu</span></div>
                    <div className="passage-block"><span className="passage-kicker">{currentPassage.title}</span><PassageText text={currentPassage.text} startNumber={currentPassage.questions[0].index + 1} questions={currentPassage.questions.map((item) => item.question)} /></div>
                    <div className="part6-question-list">{currentPassage.questions.map(({ question: passageQuestion, index }) => <div className={`part6-question ${passageQuestion.kind === 'sentence' ? 'is-sentence' : ''}`} key={passageQuestion.id}><div className="part6-question-meta"><span className="part6-question-number">({index + 1})</span><span className="part6-kind">{passageQuestion.kind === 'sentence' ? 'Chèn cả câu' : 'Điền từ/cụm từ'}</span></div><div className={`options ${passageQuestion.kind === 'sentence' ? 'sentence-options' : ''}`}>{passageQuestion.options.map((option, optionIndex) => <button className={`option ${selectedAnswers[index] === optionIndex ? 'active' : ''}`} key={option} onClick={() => chooseAnswerAt(index, optionIndex)}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{selectedAnswers[index] === optionIndex && <span className="check">✓</span>}</button>)}</div></div>)}</div>
                  </> : <><p className="question-text">{question.prompt}</p><div className="options">{question.options.map((option, index) => <button className={`option ${currentAnswer === index ? 'active' : ''}`} key={option} onClick={() => chooseAnswer(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{currentAnswer === index && <span className="check">✓</span>}</button>)}</div></>}
                  <div className="quiz-nav"><button className="nav-button secondary" disabled={activePart.id === 'part-6' ? currentPassageIndex === 0 : current === 0} onClick={() => activePart.id === 'part-6' ? setCurrent(passageGroups[currentPassageIndex - 1].questions[0].index) : setCurrent((value) => value - 1)}>← Trước</button><button className="nav-button primary" onClick={() => activePart.id === 'part-6' ? (currentPassageIndex === passageGroups.length - 1 ? setCurrent(passageGroups[currentPassageIndex].questions[0].index) : setCurrent(passageGroups[currentPassageIndex + 1].questions[0].index)) : setCurrent((value) => Math.min(value + 1, selectedSet.questions.length - 1))}>{activePart.id === 'part-6' ? (currentPassageIndex === passageGroups.length - 1 ? 'Xem lại' : 'Đoạn tiếp theo') : (current === selectedSet.questions.length - 1 ? 'Xem lại' : 'Tiếp theo')} <span>→</span></button></div>
                </div>
                <aside className="question-map"><div className="map-heading"><strong>Danh sách câu</strong><span>{answeredCount}/{selectedSet.questions.length}</span></div><div className="map-grid">{selectedSet.questions.map((_, index) => <button className={`${index === current ? 'current' : ''} ${selectedAnswers[index] !== undefined ? 'answered' : ''}`} key={index} onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><div className="map-legend"><span><i className="legend-dot answered-dot" /> Đã chọn</span><span><i className="legend-dot" /> Chưa chọn</span></div></aside>
              </div>
              <div className="submit-row"><p>Đã chọn <strong>{answeredCount}</strong>/{selectedSet.questions.length} câu</p><button className="submit-button" disabled={answeredCount === 0} onClick={submitSet}>Nộp bài <span>↗</span></button></div>
            </>
          )}

          {isSubmitted && <div className="review-list"><div className="review-heading"><p className="eyebrow">TỔNG QUAN</p><h3>Kiểm tra lại câu trả lời</h3></div>{selectedSet.questions.map((item, index) => { const correct = selectedAnswers[index] === item.answer; return <button className={`review-item ${correct ? 'correct' : 'incorrect'}`} key={index} onClick={() => { setSubmitted((previous) => ({ ...previous, [setKey]: false })); setCurrent(index) }}><span className="review-no">{String(index + 1).padStart(2, '0')}</span><span className="review-copy"><strong>{item.prompt}</strong><small>Bạn chọn: {selectedAnswers[index] !== undefined ? item.options[selectedAnswers[index]] : 'Chưa chọn'} · Đáp án: {item.options[item.answer]}</small></span><span className="review-status">{correct ? 'Đúng' : 'Sai'}</span></button> })}</div>}
        </section>

        <footer><span>TOEIC READING</span><span>OWNER: Khánh Nguyễn</span><span>Học đều mỗi ngày · Tự tin hơn mỗi bài</span></footer>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
