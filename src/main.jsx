import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { readingParts } from './data/readingParts'
import { FullQuizView, Header, Hero, ModePicker, PartPicker, QuickQuizView, QuickScope, ReviewList, SetPicker } from './components/QuizComponents'
import './styles.css'

const STORAGE_KEY = 'part5-studio-progress-v1'
const THEME_KEY = 'toeic-reading-theme'

function getSetKey(partId, setId) { return partId === 'part-5' ? setId : `${partId}:${setId}` }
function getQuestionPool(part) { return part.sets.flatMap((set) => set.questions.map((question, index) => ({ question, set, index, part }))) }
function getRandomQuestion(pool, previous) { if (pool.length < 2) return pool[0]; let next = pool[Math.floor(Math.random() * pool.length)]; while (next === previous) next = pool[Math.floor(Math.random() * pool.length)]; return next }
function groupPassages(questions) { const groups = []; questions.forEach((question, index) => { const existing = groups.find((group) => group.id === question.passageId); if (existing) existing.questions.push({ question, index }); else groups.push({ id: question.passageId, title: question.passageTitle, text: question.passage, questions: [{ question, index }] }) }); return groups }
function getPassagePool(part) { return part.sets.flatMap((set) => groupPassages(set.questions).map((passage) => ({ ...passage, set, part }))) }
function getRandomPassage(pool, previous) { if (pool.length < 2) return pool[0]; let next = pool[Math.floor(Math.random() * pool.length)]; while (next === previous) next = pool[Math.floor(Math.random() * pool.length)]; return next }
function getSavedState() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} } }

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'cute')
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
  const passageGroups = activePart.id === 'part-6' ? groupPassages(selectedSet.questions) : []
  const currentPassageIndex = activePart.id === 'part-6' ? Math.max(0, passageGroups.findIndex((group) => group.questions.some((item) => item.index === current))) : 0
  const currentPassage = passageGroups[currentPassageIndex]
  const setKey = getSetKey(selectedPartId, selectedSetId)
  const selectedAnswers = answers[setKey] || {}
  const isSubmitted = Boolean(submitted[setKey])
  const answeredCount = Object.keys(selectedAnswers).length
  const score = selectedSet.questions.reduce((total, question, index) => total + (selectedAnswers[index] === question.answer ? 1 : 0), 0)
  const percent = Math.round((score / selectedSet.questions.length) * 100)
  const quickReady = activePart.id === 'part-6' ? Boolean(quickPassage && quickPassage.questions.every((item) => quickAnswers[item.question.id] !== undefined)) : quickAnswer !== null

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, submitted })) }, [answers, submitted])
  useEffect(() => { localStorage.setItem(THEME_KEY, theme) }, [theme])

  const stats = useMemo(() => sets.map((set) => { const key = getSetKey(selectedPartId, set.id); const setAnswers = answers[key] || {}; const done = submitted[key]; const correct = set.questions.reduce((total, item, index) => total + (setAnswers[index] === item.answer ? 1 : 0), 0); return { ...set, answered: Object.keys(setAnswers).length, done, correct } }), [answers, selectedPartId, submitted, sets])

  function chooseSet(id) { setSelectedSetId(id); setCurrent(0) }
  function choosePart(part) { if (!part.available) return; setSelectedPartId(part.id); setSelectedSetId(part.sets[0]?.id || ''); setCurrent(0); setQuickQuestion(getRandomQuestion(getQuestionPool(part))); setQuickPassage(part.id === 'part-6' ? getRandomPassage(getPassagePool(part)) : null); setQuickAnswer(null); setQuickAnswers({}); setQuickChecked(false) }
  function chooseMode(nextMode) { setMode(nextMode); if (nextMode === 'quick') { setQuickQuestion(getRandomQuestion(quickPool)); setQuickPassage(activePart.id === 'part-6' ? getRandomPassage(quickPassagePool) : null); setQuickAnswer(null); setQuickAnswers({}); setQuickChecked(false) } }
  function chooseAnswer(optionIndex) { if (isSubmitted) return; setAnswers((previous) => ({ ...previous, [setKey]: { ...(previous[setKey] || {}), [current]: optionIndex } })) }
  function chooseAnswerAt(questionIndex, optionIndex) { if (isSubmitted) return; setAnswers((previous) => ({ ...previous, [setKey]: { ...(previous[setKey] || {}), [questionIndex]: optionIndex } })) }
  function submitSet() { setSubmitted((previous) => ({ ...previous, [setKey]: true })); setCurrent(0) }
  function resetSet() { setAnswers((previous) => ({ ...previous, [setKey]: {} })); setSubmitted((previous) => ({ ...previous, [setKey]: false })); setCurrent(0) }
  function chooseQuickAnswer(questionId, optionIndex) { if (!quickChecked) setQuickAnswers((previous) => ({ ...previous, [questionId]: optionIndex })) }
  function checkQuickAnswer() { if (!quickReady) return; setQuickChecked(true); setQuickAttempts((value) => value + 1) }
  function nextQuickQuestion() { if (activePart.id === 'part-6') { setQuickPassage((previous) => getRandomPassage(quickPassagePool, previous)); setQuickAnswers({}); setQuickChecked(false); return } setQuickQuestion((previous) => getRandomQuestion(quickPool, previous)); setQuickAnswer(null); setQuickChecked(false) }
  function changeCurrent(action) {
    if (typeof action === 'number') return setCurrent(action)
    if (activePart.id === 'part-6') return setCurrent(action === 'previous' ? passageGroups[currentPassageIndex - 1].questions[0].index : currentPassageIndex === passageGroups.length - 1 ? passageGroups[currentPassageIndex].questions[0].index : passageGroups[currentPassageIndex + 1].questions[0].index)
    setCurrent((value) => action === 'previous' ? value - 1 : Math.min(value + 1, selectedSet.questions.length - 1))
  }

  const resultTone = percent >= 80 ? 'good' : percent >= 65 ? 'okay' : percent >= 50 ? 'improving' : percent >= 30 ? 'low' : 'starting'
  const question = selectedSet.questions[current]

  return <div className={`app-shell theme-${theme}`}>
    <Header theme={theme} onThemeChange={setTheme} />
    <main id="top" className="content-wrap">
      <Hero activePart={activePart} questionCount={questionCount} />
      <PartPicker parts={readingParts} selectedPartId={selectedPartId} onChoose={choosePart} />
      <ModePicker mode={mode} questionCount={questionCount} onChoose={chooseMode} />
      {mode === 'full' ? <SetPicker sets={stats} selectedSetId={selectedSetId} onChoose={chooseSet} /> : <QuickScope activePart={activePart} sets={sets} questionCount={quickPool.length} />}
      <section className="workspace" aria-label="Khu vực làm bài">
        <div className="workspace-head"><div><p className="eyebrow">CHẾ ĐỘ HỌC</p><h2>{mode === 'full' ? (isSubmitted ? 'Kết quả của bạn' : 'Làm trọn một đề') : 'Luyện nhanh từng câu'}</h2></div><div className="workspace-actions">{mode === 'full' && isSubmitted && <button className="text-button" onClick={resetSet}>Làm lại đề</button>}{mode === 'full' ? <span className="question-counter">{activePart.id === 'part-6' ? `${String(currentPassageIndex + 1).padStart(2, '0')} / ${String(passageGroups.length).padStart(2, '0')} đoạn` : `${String(current + 1).padStart(2, '0')} / ${String(selectedSet.questions.length).padStart(2, '0')}`}</span> : <span className="question-counter">{quickAttempts} câu đã check</span>}</div></div>
        {mode === 'quick' ? <QuickQuizView activePart={activePart} quickQuestion={quickQuestion} quickPassage={quickPassage} quickAnswers={quickAnswers} quickAnswer={quickAnswer} quickChecked={quickChecked} quickReady={quickReady} onAnswer={chooseQuickAnswer} onSingleAnswer={setQuickAnswer} onCheck={checkQuickAnswer} onNext={nextQuickQuestion} /> : <FullQuizView activePart={activePart} question={question} current={current} currentPassage={currentPassage} currentPassageIndex={currentPassageIndex} passageGroups={passageGroups} selectedSet={selectedSet} selectedAnswers={selectedAnswers} currentAnswer={selectedAnswers[current]} answeredCount={answeredCount} isSubmitted={isSubmitted} score={score} percent={percent} resultTone={resultTone} onAnswer={chooseAnswer} onAnswerAt={chooseAnswerAt} onCurrentChange={changeCurrent} onSubmit={submitSet} />}
        {mode === 'full' && isSubmitted && <ReviewList questions={selectedSet.questions} selectedAnswers={selectedAnswers} />}
      </section>
      <footer><span>TOEIC READING</span><span>OWNER: Khánh Nguyễn</span><span>Học đều mỗi ngày · Tự tin hơn mỗi bài</span></footer>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
