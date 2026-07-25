<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { formatTime, getExamDefinition, gradeExam } from '$lib/exam';
  import type { ExamResult, Selections, Session } from '$lib/types';
  import CandidateFooter from './exam/CandidateFooter.svelte';
  import ConfirmationDialog from './exam/ConfirmationDialog.svelte';
  import QuestionDisplay from './exam/QuestionDisplay.svelte';
  import QuestionNavigator from './exam/QuestionNavigator.svelte';

  interface Props {
    session: Session;
    oncomplete: (result: ExamResult) => void;
    disabled?: boolean;
  }

  let { session, oncomplete, disabled = false }: Props = $props();

  const { tier, questions, criticalQuestionIds } = untrack(() =>
    getExamDefinition(session.licence)
  );
  const totalSeconds = tier.duration * 60;
  let currentIndex = $state(0);
  let selections: Selections = $state(questions.map(() => []));
  let readQuestions = $state(questions.map((_, index) => index === 0));
  let secondsLeft = $state(totalSeconds);
  let timer: ReturnType<typeof setInterval>;
  let confirmOpen = $state(false);
  let submitted = $state(false);

  let currentQuestion = $derived(questions[currentIndex]);
  let progress = $derived(totalSeconds ? (secondsLeft / totalSeconds) * 100 : 100);
  let formattedTime = $derived(formatTime(secondsLeft));

  onMount(() => {
    timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        secondsLeft = 0;
        submitExam();
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  function toggleAnswer(index: number, answerId: number): void {
    const selected = selections[index];
    selections[index] = selected.includes(answerId)
      ? selected.filter((id) => id !== answerId)
      : [...selected, answerId].sort();
    selections = [...selections];
    selectQuestion(index);
  }

  function selectQuestion(index: number): void {
    currentIndex = index;
    if (!readQuestions[index]) {
      readQuestions[index] = true;
      readQuestions = [...readQuestions];
    }
  }

  function moveQuestion(direction: number): void {
    selectQuestion(Math.max(0, Math.min(questions.length - 1, currentIndex + direction)));
  }

  function submitExam() {
    if (submitted) return;
    submitted = true;
    clearInterval(timer);
    confirmOpen = false;
    oncomplete(
      gradeExam({
        questions,
        selections,
        criticalQuestionIds,
        required: tier.required
      })
    );
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (disabled) return;

    if (confirmOpen) {
      if (event.key === 'Escape') {
        confirmOpen = false;
        event.preventDefault();
      }
      if (event.key === 'Enter') {
        submitExam();
        event.preventDefault();
      }
      return;
    }

    if (['1', '2', '3', '4'].includes(event.key)) {
      const answerId = Number(event.key);
      if (currentQuestion?.answers.some((answer) => answer.id === answerId)) {
        toggleAnswer(currentIndex, answerId);
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      moveQuestion(-1);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      moveQuestion(1);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      confirmOpen = true;
      event.preventDefault();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="exam-screen">
  <div class="exam-body">
    <section class="exam-left">
      <QuestionDisplay question={currentQuestion} />

      <div class="progress-track">
        <div class="progress-fill" style:width={`${progress}%`}></div>
        <span>{Math.ceil(progress)}</span>
      </div>

      <CandidateFooter {session} />
    </section>

    <aside class="exam-right">
      <div class="timer"><span>THỜI GIAN CÒN LẠI:</span><b>{formattedTime}</b></div>
      <QuestionNavigator
        {questions}
        {selections}
        {readQuestions}
        {currentIndex}
        onselectquestion={selectQuestion}
        ontoggleanswer={toggleAnswer}
      />
      <button class="finish-button" onclick={() => (confirmOpen = true)}>KẾT THÚC</button>
    </aside>
  </div>

  <footer class="exam-footer">Phần thi kết thúc khi hết thời gian hoặc khi thí sinh nhấn “Kết thúc”.</footer>

  {#if confirmOpen}
    <ConfirmationDialog onconfirm={submitExam} oncancel={() => (confirmOpen = false)} />
  {/if}
</main>

<style>
  .exam-screen { --page-blue: #078fd2; width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--page-blue); color: #121212; }
  .exam-body { min-height: 0; flex: 1 1 0; display: flex; }
  .exam-left { min-width: 0; flex: 17 1 0; display: flex; flex-direction: column; border: 4px ridge #fff; }
  .progress-track { position: relative; height: 27px; flex: 0 0 27px; background: #fff; border: 1px solid #ddd; overflow: hidden; }
  .progress-fill {
    height: 100%;
    background: linear-gradient(
      to bottom,
      #ff929d 0%,
      #f83b4e 14%,
      #cf0922 48%,
      #970014 52%,
      #d8172e 78%,
      #f94a5c 100%
    );
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 65%), inset 0 -1px 0 rgb(104 0 14 / 55%);
    transition: width 1s linear;
  }
  .progress-track span { position: absolute; inset: 0; display: grid; place-items: center; font: bold 15px Arial; }
  .exam-right { flex: 3 1 0; display: flex; flex-direction: column; padding: 4px 9px 8px; border: 4px ridge #fff; }
  .timer { height: 53px; flex: 0 0 53px; display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 7px; padding: 6px 12px; background: #142739; color: #f3e3b1; white-space: nowrap; overflow: hidden; }
  .timer span { font: bold 15px "Times New Roman", serif; }
  .timer b { color: #e9f05b; font: bold 32px Arial; }
  .finish-button {
    height: 62px;
    flex: 0 0 62px;
    margin: 6px -1px 0;
    border: 1px solid #d1d1d1;
    border-radius: 8px;
    background: linear-gradient(#fff, #fafafa);
    box-shadow: 0 1px 2px rgb(0 0 0 / 12%), inset 0 1px 0 rgb(255 255 255 / 90%);
    color: #9c3034;
    font: bold 24px "Times New Roman", serif;
  }
  .finish-button:hover { background: #f9f9f9; border-color: #c5c5c5; }
  .finish-button:active { background: #f2f2f2; box-shadow: inset 0 1px 2px rgb(0 0 0 / 8%); }
  .exam-footer { height: 23px; flex: 0 0 23px; padding: 0 4px; border: 4px ridge #fff; background: #e9e7e1; color: #803c3d; font: bold 13px Arial; }
</style>
