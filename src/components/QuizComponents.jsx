import { Fragment } from 'react'

export function Header({ theme, onThemeChange }) {
  return <header className="topbar">
    <a className="brand" href="#top" aria-label="Part 5 Studio home">
      <span className="brand-mark">TR</span>
      <span><strong>TOEIC Reading</strong><small>PRACTICE STUDIO</small></span>
    </a>
    <div className="header-actions">
      <div className="theme-switcher" aria-label="Chọn giao diện">
        {['cute', 'manly', 'dark'].map((item) => <button className={theme === item ? 'active' : ''} onClick={() => onThemeChange(item)} aria-label={`${item[0].toUpperCase()}${item.slice(1)} mode`} key={item}>{item[0].toUpperCase() + item.slice(1)}</button>)}
      </div>
      <div className="topbar-note"><span className="status-dot" /> Tiến độ được lưu tự động</div>
    </div>
  </header>
}

export function Hero({ activePart, questionCount }) {
  return <section className="hero">
    <div><p className="eyebrow">READING · {activePart.label.toUpperCase()}</p><h1>Luyện tập nhỏ,<br /><em>tiến bộ lớn.</em></h1><p className="hero-copy">Chinh phục những câu hỏi hoàn thành câu TOEIC theo nhịp học của riêng bạn.</p></div>
    <div className="hero-stamp"><span>{questionCount}</span><small>CÂU / ĐỀ</small></div>
  </section>
}

export function PartPicker({ parts, selectedPartId, onChoose }) {
  return <section className="part-picker" aria-label="Chọn phần Reading">
    <div className="section-heading"><div><p className="eyebrow">READING PRACTICE</p><h2>Chọn phần muốn học</h2></div><span className="count-label">{parts.length} phần</span></div>
    <div className="part-grid">{parts.map((part) => <button className={`part-card ${selectedPartId === part.id ? 'active' : ''} ${part.available ? '' : 'coming-soon'}`} key={part.id} onClick={() => onChoose(part)} disabled={!part.available}><span className="part-card-label">{part.label}</span><span className="part-card-copy"><strong>{part.title}</strong><small>{part.description}</small></span><span className="part-card-status">{part.available ? 'Đang học' : 'Sắp có'}</span></button>)}</div>
  </section>
}

export function ModePicker({ mode, questionCount, onChoose }) {
  return <section className="mode-picker" aria-label="Chọn chế độ học">
    <div className="section-heading"><div><p className="eyebrow">BƯỚC 01 · CÁCH HỌC</p><h2>Chọn chế độ trước khi bắt đầu</h2></div><span className="count-label">2 chế độ</span></div>
    <div className="mode-switch" role="tablist" aria-label="Chọn chế độ học">
      <button className={mode === 'full' ? 'active' : ''} onClick={() => onChoose('full')} role="tab" aria-selected={mode === 'full'}><span>01</span><strong>Làm trọn đề</strong><small>Hoàn thành {questionCount} câu và xem điểm</small></button>
      <button className={mode === 'quick' ? 'active' : ''} onClick={() => onChoose('quick')} role="tab" aria-selected={mode === 'quick'}><span>02</span><strong>Luyện nhanh</strong><small>Random toàn bộ đề của Part · check ngay</small></button>
    </div>
  </section>
}

export function SetPicker({ sets, selectedSetId, onChoose }) {
  return <section className="set-picker" aria-label="Chọn đề luyện tập">
    <div className="section-heading"><div><p className="eyebrow">BƯỚC 02 · KHO BÀI TẬP</p><h2>Chọn một đề để bắt đầu</h2></div><span className="count-label">{sets.length} đề có sẵn</span></div>
    <div className="set-grid">{sets.map((set, index) => <button className={`set-card ${set.id === selectedSetId ? 'selected' : ''} ${set.color}`} key={set.id} onClick={() => onChoose(set.id)}><span className="set-number">0{index + 1}</span><span className="set-card-main"><strong>{set.title}</strong><small>{set.label}</small></span><span className="set-card-meta">{set.done ? `${set.correct}/${set.questions.length}` : `${set.questions.length} câu`}<b>→</b></span></button>)}</div>
  </section>
}

export function QuickScope({ activePart, sets, questionCount }) {
  return <section className="quick-scope" aria-label="Phạm vi luyện nhanh"><span className="quick-scope-mark">◎</span><div><p className="eyebrow">BƯỚC 02 · PHẠM VI LUYỆN</p><h2>{activePart.label} · {sets.length} đề · {questionCount} câu hỏi</h2><p>Mỗi lượt sẽ lấy một câu bất kỳ từ tất cả các đề của {activePart.label}.</p></div><span className="quick-scope-arrow">↓</span></section>
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

export function QuickQuizView({ activePart, quickQuestion, quickPassage, quickAnswers, quickAnswer, quickChecked, quickReady, onAnswer, onSingleAnswer, onCheck, onNext }) {
  return <div className="quick-mode">
    <div className="quick-meta"><span>CÂU NGẪU NHIÊN · TOÀN BỘ {activePart.label.toUpperCase()}</span><span>{activePart.id === 'part-6' ? `${quickPassage?.set.title} · 4 câu` : `${quickQuestion.set.title} · Câu ${quickQuestion.question.number || quickQuestion.index + 101}`}</span></div>
    <div className="question-card quick-card">
      {activePart.id === 'part-6' && quickPassage ? <Part6QuickContent passage={quickPassage} answers={quickAnswers} checked={quickChecked} onAnswer={onAnswer} /> : <><div className="question-label"><span>LUYỆN NHANH</span><span className="question-type">Từ vựng & ngữ pháp</span></div><p className="question-text">{quickQuestion.question.prompt}</p><div className="options">{quickQuestion.question.options.map((option, index) => <button className={`option ${quickAnswer === index ? 'active' : ''} ${quickChecked && index === quickQuestion.question.answer ? 'correct-option' : ''} ${quickChecked && quickAnswer === index && index !== quickQuestion.question.answer ? 'wrong-option' : ''}`} key={option} onClick={() => !quickChecked && onSingleAnswer(index)} disabled={quickChecked}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{quickAnswer === index && !quickChecked && <span className="check">✓</span>}</button>)}</div>{quickChecked && <div className={`quick-result ${quickAnswer === quickQuestion.question.answer ? 'is-correct' : 'is-wrong'}`}><span className="quick-result-icon">{quickAnswer === quickQuestion.question.answer ? '✓' : '!'}</span><div><strong>{quickAnswer === quickQuestion.question.answer ? 'Chính xác' : 'Chưa đúng'}</strong><small>Đáp án đúng: <b>{String.fromCharCode(65 + quickQuestion.question.answer)}. {quickQuestion.question.options[quickQuestion.question.answer]}</b></small></div></div>}</>}
      <div className="quick-actions"><button className="nav-button secondary" onClick={onNext}>{quickChecked ? 'Bỏ qua câu này' : 'Đổi câu khác'}</button>{!quickChecked ? <button className="submit-button" disabled={!quickReady} onClick={onCheck}>Check đáp án <span>↗</span></button> : <button className="submit-button" onClick={onNext}>Câu tiếp theo <span>→</span></button>}</div>
    </div>
  </div>
}

export function ResultPanel({ score, questionCount, percent, resultTone }) {
  return <div className={`result-panel ${resultTone}`}><div className="result-score"><span>{score}</span><small>/ {questionCount} câu đúng</small></div><div className="result-message"><p className="eyebrow">HOÀN THÀNH ĐỀ</p><h3>{percent >= 80 ? 'Rất tốt, giữ vững phong độ.' : percent >= 65 ? 'Khá tốt, hãy luyện thêm một chút.' : percent >= 50 ? 'Đang tiến bộ, tiếp tục luyện nhé.' : percent >= 30 ? 'Cần luyện thêm, đừng bỏ cuộc.' : 'Hãy xây lại nền tảng từ những câu cơ bản.'}</h3><p>Đáp án đã được chấm. Bạn có thể xem lại từng câu bên dưới.</p></div><div className="result-percent">{percent}%</div></div>
}

export function FullQuizView({ activePart, question, current, currentPassage, currentPassageIndex, passageGroups, selectedSet, selectedAnswers, currentAnswer, answeredCount, isSubmitted, score, percent, resultTone, onAnswer, onAnswerAt, onCurrentChange, onSubmit }) {
  if (isSubmitted) return <ResultPanel score={score} questionCount={selectedSet.questions.length} percent={percent} resultTone={resultTone} />
  return <><div className="progress-track"><span style={{ width: `${activePart.id === 'part-6' ? Math.round(((currentPassageIndex + 1) / passageGroups.length) * 100) : Math.round(((current + 1) / selectedSet.questions.length) * 100)}%` }} /></div><div className="quiz-layout"><div className="question-card"><div className="question-label"><span>{activePart.id === 'part-6' ? `ĐOẠN ${String(currentPassageIndex + 1).padStart(2, '0')}` : `CÂU ${String(current + 1).padStart(2, '0')}`}</span><span className="question-type">{question.type === 'text-completion' ? 'Hoàn thành đoạn văn' : 'Từ vựng & ngữ pháp'}</span></div>{activePart.id === 'part-6' ? <><div className="part6-instruction"><strong>Cách làm:</strong> Chọn đáp án bên dưới để điền vào vị trí có cùng số trong đoạn văn.<span><i className="word-key" /> Điền từ/cụm từ <i className="sentence-key" /> Chèn cả câu</span></div><div className="passage-block"><span className="passage-kicker">{currentPassage.title}</span><PassageText text={currentPassage.text} startNumber={currentPassage.questions[0].index + 1} questions={currentPassage.questions.map((item) => item.question)} /></div><div className="part6-question-list">{currentPassage.questions.map(({ question: passageQuestion, index }) => <div className={`part6-question ${passageQuestion.kind === 'sentence' ? 'is-sentence' : ''}`} key={passageQuestion.id}><div className="part6-question-meta"><span className="part6-question-number">({index + 1})</span><span className="part6-kind">{passageQuestion.kind === 'sentence' ? 'Chèn cả câu' : 'Điền từ/cụm từ'}</span></div><div className={`options ${passageQuestion.kind === 'sentence' ? 'sentence-options' : ''}`}>{passageQuestion.options.map((option, optionIndex) => <button className={`option ${selectedAnswers[index] === optionIndex ? 'active' : ''}`} key={option} onClick={() => onAnswerAt(index, optionIndex)}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{selectedAnswers[index] === optionIndex && <span className="check">✓</span>}</button>)}</div></div>)}</div></> : <><p className="question-text">{question.prompt}</p><div className="options">{question.options.map((option, index) => <button className={`option ${currentAnswer === index ? 'active' : ''}`} key={option} onClick={() => onAnswer(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{currentAnswer === index && <span className="check">✓</span>}</button>)}</div></>}<div className="quiz-nav"><button className="nav-button secondary" disabled={activePart.id === 'part-6' ? currentPassageIndex === 0 : current === 0} onClick={() => onCurrentChange('previous')}>← Trước</button><button className="nav-button primary" onClick={() => onCurrentChange('next')}>{activePart.id === 'part-6' ? (currentPassageIndex === passageGroups.length - 1 ? 'Xem lại' : 'Đoạn tiếp theo') : (current === selectedSet.questions.length - 1 ? 'Xem lại' : 'Tiếp theo')} <span>→</span></button></div></div><aside className="question-map"><div className="map-heading"><strong>Danh sách câu</strong><span>{answeredCount}/{selectedSet.questions.length}</span></div><div className="map-grid">{selectedSet.questions.map((_, index) => <button className={`${index === current ? 'current' : ''} ${selectedAnswers[index] !== undefined ? 'answered' : ''}`} key={index} onClick={() => onCurrentChange(index)}>{index + 1}</button>)}</div><div className="map-legend"><span><i className="legend-dot answered-dot" /> Đã chọn</span><span><i className="legend-dot" /> Chưa chọn</span></div></aside></div><div className="submit-row"><p>Đã chọn <strong>{answeredCount}</strong>/{selectedSet.questions.length} câu</p><button className="submit-button" disabled={answeredCount === 0} onClick={onSubmit}>Nộp bài <span>↗</span></button></div></>
}

export function ReviewList({ questions, selectedAnswers, onReview }) {
  return <div className="review-list"><div className="review-heading"><p className="eyebrow">TỔNG QUAN</p><h3>Kiểm tra lại câu trả lời</h3></div>{questions.map((item, index) => { const correct = selectedAnswers[index] === item.answer; return <button className={`review-item ${correct ? 'correct' : 'incorrect'}`} key={index} onClick={() => onReview(index)}><span className="review-no">{String(index + 1).padStart(2, '0')}</span><span className="review-copy"><strong>{item.prompt}</strong><small>Bạn chọn: {selectedAnswers[index] !== undefined ? item.options[selectedAnswers[index]] : 'Chưa chọn'} · Đáp án: {item.options[item.answer]}</small></span><span className="review-status">{correct ? 'Đúng' : 'Sai'}</span></button> })}</div>
}
