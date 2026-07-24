<script lang="ts">
  import type { Question, Selections } from '$lib/types';

  interface Props {
    questions: Question[];
    selections: Selections;
    readQuestions: boolean[];
    currentIndex: number;
    onselectquestion: (index: number) => void;
    ontoggleanswer: (index: number, answerId: number) => void;
  }

  let {
    questions,
    selections,
    readQuestions,
    currentIndex,
    onselectquestion,
    ontoggleanswer
  }: Props = $props();

  const rowHeight = 38;
  const rowGap = 3;
  const verticalPadding = 8;

  let availableHeight = $state(0);

  interface QuestionItem {
    question: Question;
    index: number;
  }

  function distributeQuestions(
    questions: Question[],
    maximumRows: number
  ): QuestionItem[][] {
    if (!questions.length) return [];

    const columnCount = Math.ceil(questions.length / maximumRows);
    const questionsPerColumn = Math.floor(questions.length / columnCount);
    const longerColumnCount = questions.length % columnCount;
    let startIndex = 0;

    return Array.from({ length: columnCount }, (_, columnIndex) => {
      const columnLength = questionsPerColumn + (columnIndex < longerColumnCount ? 1 : 0);
      const column = questions
        .slice(startIndex, startIndex + columnLength)
        .map((question, offset) => ({ question, index: startIndex + offset }));

      startIndex += columnLength;
      return column;
    });
  }

  let rowsPerColumn = $derived(
    availableHeight
      ? Math.max(1, Math.floor((availableHeight - verticalPadding + rowGap) / (rowHeight + rowGap)))
      : Math.ceil(questions.length / 2)
  );
  let columns = $derived(distributeQuestions(questions, rowsPerColumn));
</script>

<div
  class="question-grid"
  bind:clientHeight={availableHeight}
  style:--column-count={columns.length}
>
  {#each columns as column, columnIndex (columnIndex)}
    <div class="question-column">
      {#each column as item (item.question.index)}
        {@const { question, index } = item}
        <button
          class:active={index === currentIndex}
          class:read={readQuestions[index]}
          class:answered={selections[index]?.length}
          onclick={() => onselectquestion(index)}
          aria-label={`Câu ${index + 1}`}
        >
          <span class="question-number">{index + 1}</span>
          <span class="answer-checks">
            {#each question.answers as answer (answer.id)}
              <span class="check-wrap">
                <small>{answer.id}</small>
                <input
                  type="checkbox"
                  checked={selections[index]?.includes(answer.id)}
                  aria-label={`Câu ${index + 1}, đáp án ${answer.id}`}
                  onclick={(event) => {
                    event.stopPropagation();
                    ontoggleanswer(index, answer.id);
                  }}
                />
              </span>
            {/each}
          </span>
        </button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .question-grid { width: max(100%, calc(var(--column-count) * 120px + (var(--column-count) - 1) * 3px)); min-height: 0; flex: 1 1 0; display: flex; align-items: flex-start; gap: 3px; padding: 4px 0; overflow: hidden; }
  .question-column { width: 120px; flex: 1 0 120px; display: flex; flex-direction: column; gap: 3px; }
  .question-column > button { width: 100%; height: 38px; flex: 0 0 38px; padding: 1px 4px; border: 1px solid #19649c; background: transparent; color: #052c67; font-family: Arial, sans-serif; display: flex; align-items: center; }
  .question-column > button.active { background: #f24a50; border-color: #a42022; color: white; }
  .question-column > button.read:not(.active):not(.answered) { background: #d8dde0; }
  .question-column > button.answered:not(.active) { background: #51d254; }
  .question-number { width: 30px; flex: 0 0 auto; font-size: 22px; text-align: left; }
  .answer-checks { flex: 1; min-width: 0; display: flex; align-items: end; justify-content: flex-start; }
  .check-wrap { display: flex; flex-direction: column; align-items: center; }
  .check-wrap small { height: 11px; font-size: 9px; color: #246a94; line-height: 10px; }
  .question-column > button.active .check-wrap small { color: #a9d5e2; }
  .check-wrap input { width: 14px; height: 14px; }
</style>
